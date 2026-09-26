import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import createToken from "../../utils/createToken.js";
import AppError from "../../errors/AppError.js";
import { OTP_EXPIRES_IN, USER_STATUS } from "./auth.constant.js";
import { redisClient } from "../../database/redis.js";
import verifyToken from "../../utils/verifyToken.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sendOTPEmail } from "../../utils/sendOTPEmail.js";

const registerUserService = async (payload: {
  name: string;
  email: string;
  password: string;
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

  await sendOTPEmail(user.email, otp);

  return result;
};

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

  const passwordMatched = await bcrypt.compare(payload.password, user.password);

  if (!passwordMatched) {
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
    // EX: 60 * 60 * 24 * 30,
  });

  const storedToken = await redisClient.get(`refresh:${user._id}`);
  console.log("Stored Refresh Token:", storedToken);

  return {
    accessToken,
    refreshToken,
  };
};

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

  // Step 6: Return token
  return accessToken;
};

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

  await redisClient.del(`otp:${user.email}`);

  return null;
};

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

const resetPasswordService = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return null;
};

export const AuthService = {
  registerUserService,
  verifyEmailService,
  loginUserService,
  refreshTokenService,
  sendOTPService,
  verifyOTPService,
  forgotPasswordService,
  resetPasswordService,
};
