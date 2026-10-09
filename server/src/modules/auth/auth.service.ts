import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import createToken from "../../utils/createToken.js";
import AppError from "../../errors/AppError.js";
import {
  MAX_LOGIN_ATTEMPTS,
  OTP_EXPIRES_IN,
  USER_STATUS,
} from "./auth.constant.js";
import { redisClient } from "../../database/redis.js";
import verifyToken from "../../utils/verifyToken.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendOTPEmail } from "../../utils/sendOTPEmail.js";

/**================================
 * USER REGISTRATION SERVICE - 001
 * ================================
 * Flow:
 * 1. Check if user already exists
 * 2. Hash password
 * 3. Create user
 * 4. Generate verification OTP
 * 5. Store OTP in Redis
 * 6. Send verification email
 *
 * @param payload User registration information
 * @returns Newly created user
 */
const registerUserService = async (payload: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}) => {
  const existingUser = await User.isUserExistsByEmail(payload.email);

  if (existingUser) {
    throw new AppError(409, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  const result = await User.findById(user._id);

  const otp = generateOTP();

  await redisClient.set(`verify:${user.email}`, otp, {
    EX: Number(OTP_EXPIRES_IN),
  });

  try {
    await sendOTPEmail(user.email, otp);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }

  return result;
};

/**================================
 * EMAIL VERIFICATION SERVICE -002
 * ================================
 * Flow:
 * 1. Find user
 * 2. Verify OTP
 * 3. Mark account as verified
 * 4. Remove OTP from Redis
 *
 * @param email User email
 * @param otp Verification OTP
 */
const verifyEmailService = async (email: string, otp: string) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const storedOTP = await redisClient.get(`verify:${email}`);

  if (!storedOTP) {
    throw new AppError(400, "OTP expired");
  }

  if (storedOTP !== otp) {
    throw new AppError(400, "Invalid OTP");
  }

  user.isVerified = true;

  await user.save();

  await redisClient.del(`verify:${email}`);

  return null;
};

/**===============================================
 * RESEND EMAIL WITH OTP ON REQUEST BY USER - 003
 * ===============================================
 * Flow:
 * 1. User signs up & OTP is sent for email verification
 * 2. For some reason user does not verify email & can not log in
 * 3. User then can send email verification request
 * 4. Checks if email is verified
 * 5. If verification is confirmed no email is sent
 * 6. Otherwise generates OTP
 * 7. OTP is saved in Redis
 * 8. Then email is sent with OTP
 *
 * @param email
 * @returns null -> no data
 */
const resendEmailVerificationOTPService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(400, "Email is verified already");
  }
  const otp = generateOTP();

  await redisClient.set(`verify:${user.email}`, otp, { EX: OTP_EXPIRES_IN });

  await sendOTPEmail(user.email, otp);

  return null;
};

/**=========================
 * LOGIN SERVICE - 004
 * =========================
 * Flow:
 * 1. Check user existence
 * 2. Check account status
 * 3. Check email verification
 * 4. Redis-based login rate limiting.
 * 5. After 5 failed attempts, login is blocked
 * 5. Verify password
 * 6. for 15 minutes to prevent brute-force attacks.
 * 7. Generate tokens
 * 8. Store refresh token in Redis
 *
 * @payload login credentials
 * @returns access and refresh tokens
 */
const loginUserService = async (payload: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(403, "User is blocked");
  }

  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email address.");
  }

  // Redis-based login rate limiting.
  const attempts = await redisClient.get(`login-fails:${payload.email}`);

  // After 5 failed attempts, login is blocked
  if (Number(attempts) >= MAX_LOGIN_ATTEMPTS) {
    throw new AppError(
      429,
      "Too many failed login attempts. Please try again after 15 minutes.",
    );
  }

  const passwordMatched = await bcrypt.compare(payload.password, user.password);

  if (!passwordMatched) {
    const failCount = await redisClient.incr(`login-fails:${payload.email}`);
    // for 15 minutes to prevent brute-force attacks.
    if (failCount === 1) {
      await redisClient.expire(`login-fails:${payload.email}`, 900);
    }
    throw new AppError(401, "Password does not match");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  await redisClient.set(`refresh:${user._id}`, refreshToken, {
    EX: Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN),
  });

  const storedToken = await redisClient.get(`refresh:${user._id}`);
  console.log("Stored Refresh Token:", storedToken);

  await redisClient.del(`login-fails:${payload.email}`);

  return {
    accessToken,
    refreshToken,
  };
};

/**=======================================
 * REFRESH TOKEN (ROTATION) SERVICE - 005
 * =======================================
 * NOTE:
 * Refresh Token Rotation improves security by generating
 * a new refresh token whenever a refresh request is made.
 *
 * The previous refresh token becomes invalid immediately.
 * Therefore, an attacker cannot generate new access tokens
 * using an old or stolen refresh token.
 *
 * Flow:
 * 1. Verify incoming refresh token
 * 2. Match refresh token with Redis
 * 3. Generate new access token
 * 4. Generate new refresh token
 * 5. Replace old refresh token in Redis
 * 6. Return both tokens
 *
 * Security:
 * - Old refresh token becomes invalid immediately.
 * - Refresh token reuse is prevented.
 *
 * @param token
 * @returns new JWT token verifying with refresh token stored
 */
const refreshTokenService = async (token: string) => {
  // Step 1: Check if token exists
  if (!token) {
    throw new AppError(401, "Refresh token is required.");
  }

  // Step 2: Verify refresh token
  const decoded = verifyToken(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as jwt.JwtPayload & {
    userId: string;
    email: string;
    role: string;
  };

  // Step 3 : Read token from Redis
  const storedRefreshToken = await redisClient.get(`refresh:${decoded.userId}`);

  // Step 4: Validate token against Redis
  if (!storedRefreshToken || storedRefreshToken !== token) {
    throw new AppError(401, "Invalid refresh token");
  }

  // Step 5: Create new access token
  const jwtPayload = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  // Replace old refresh token with newly generated one
  await redisClient.set(`refresh:${decoded.userId}`, refreshToken, {
    EX: Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN),
  });

  // Step 6: Return token
  return { accessToken, refreshToken };
};

/**==========================
 * SENDING OTP SERVICE - 006
 * ==========================
 * Flow:
 * 1. Fetches user by email
 * 2. Generates OTP
 * 3. Sets OTP to Redis with expiry limit
 * 4. Sends OTP email
 *
 * @param email
 * @returns the expected email with OTP
 */
const sendOTPService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const otp = generateOTP();

  await redisClient.set(`otp:${user.email}`, otp, {
    EX: Number(OTP_EXPIRES_IN),
  });

  const result = await sendOTPEmail(user.email, otp);

  return result;
};

/**============================
 * VERIFYING OTP SERVICE - 007
 * ============================
 * Flow:
 * 1. Fetches user
 * 2. Fetches OTP from Redis
 * 3. Verifies if stored OTP === OTP received from user
 * 4. Creates a temporary password-reset verification ticket in Redis
 * 5. Deletes old otp
 *
 * @param email
 * @param otp
 * @returns (null === no data ) -> expected result
 */
const verifyOTPService = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const storedOTP = await redisClient.get(`otp:${user.email}`);

  if (!storedOTP) {
    throw new AppError(400, "OTP expired.");
  }

  if (storedOTP !== otp) {
    throw new AppError(400, "Invalid OTP");
  }

  await redisClient.set(`reset:${user.email}`, "verified", {
    EX: OTP_EXPIRES_IN,
  });

  await redisClient.del(`otp:${user.email}`);

  return null;
};

/**==============================
 * FORGOT PASSWORD SERVICE - 008
 * ==============================
 * Flow:
 * 1. Password forgotten
 * 2. Fetched user by email
 * 3. Checked if isVerified true / false
 * 4. If not verified OTO is sent
 *
 * @param email user email
 * @returns (null === no data ) -> expected result
 */
const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email first");
  }

  await sendOTPService(email);

  return null;
};

/**=============================
 * RESET PASSWORD SERVICE - 009
 * =============================
 * Flow:
 * 1. Find user by email
 * 2. Verify OTP verification ticket from Redis
 * 3. Hash the new password
 * 4. Update user's password
 * 5. Remove the Redis verification ticket
 *
 * Security:
 * - Password reset is only allowed after successful OTP verification.
 * - The Redis verification ticket acts as temporary authorization.
 * - The verification ticket is deleted after a successful reset to prevent reuse.
 *
 * @param email User email address
 * @param newPassword New password provided by the user
 * @returns null
 */
const resetPasswordService = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const verified = await redisClient.get(`reset:${email}`);

  if (!verified) {
    throw new AppError(403, "OTP verification needed");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  await redisClient.del(`reset:${email}`);

  return null;
};

/**==============================
 * CHANGE PASSWORD SERVICE - 010
 * ==============================
 * Flow:
 * 1. Logged in user can change password
 * 2. User is fetched by logged in userId and selects the password
 * 3. Current password and new password are compared
 * 4. Current password verified
 * 5. New password is hashed
 * 6. If not same new password is saved in MongoDB
 * 7. New password is saved
 *
 * @param userId logged in user userId
 * @param currentPassword existing password
 * @param newPassword password to be set
 * @returns null
 */
const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const matched = await bcrypt.compare(currentPassword, user.password);

  if (!matched) {
    throw new AppError(401, "Current password is incorrect");
  }

  if (currentPassword === newPassword) {
    throw new AppError(
      400,
      "New password must be different from the current password.",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return null;
};

/**=========================================
 * RESEND FORGOT PASSWORD OTP SERVICE - 011
 * =========================================
 * Flow:
 * 1. Verify that the user exists
 * 2. Generate a new OTP
 * 3. Store the OTP in Redis
 * 4. Send the OTP via email
 *
 * Note:
 * - Reuses sendOTPService() to avoid duplicate OTP generation logic.
 * - The newly generated OTP replaces the previous OTP.
 *
 * @param email User email address
 * @returns null
 */
const resendForgotPasswordOTPService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "User not found");
  }

  await sendOTPService(email);
  return null;
};

export const AuthService = {
  registerUserService,
  verifyEmailService,
  resendEmailVerificationOTPService,
  loginUserService,
  refreshTokenService,
  sendOTPService,
  verifyOTPService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  resendForgotPasswordOTPService,
};
