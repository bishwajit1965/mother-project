import { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../../database/redis.js";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

import sendResponse from "../../utils/sendResponse.js";
import verifyToken from "../../utils/verifyToken.js";

import { AuthService } from "./auth.service.js";

/**================================================
 * REGISTERS / SIGNS UP A USER - 001
 * ================================================
 */
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created. Verify your email address.",
    data: result,
  });
});

/**===============================================
 * VERIFIES REGISTERED/SIGNED UP USER EMAIL - 002
 * ===============================================
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  await AuthService.verifyEmailService(email, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email verified successfully.",
    data: null,
  });
});

/**=============================================
 * RESEND EMAIL VERIFICATION OTP - 003
 * =============================================
 */
const resendEmailVerificationOTP = catchAsync(async (req, res) => {
  await AuthService.resendEmailVerificationOTPService(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email verification OTP is sent. Check mail.",
    data: null,
  });
});

/**=============================================
 * LOG IN USER - 004
 * =============================================
 */
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserService(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: accessToken,
  });
});

/**===========================================
 * REFRESH ACCESS TOKEN - 005
 =============================================
 */
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError(401, "Refresh token is missing.");
  }
  const result = await AuthService.refreshTokenService(token);

  // Rotates refresh token
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully.",
    data: result.accessToken,
  });
});

/**============================================
 * SEND OTP - 006
 * ============================================
 */
const sendOTP = catchAsync(async (req, res) => {
  const result = await AuthService.sendOTPService(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully.",
    data: result,
  });
});

/**=============================================
 * VERIFY OTP - 007
 * =============================================
 */
const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await AuthService.verifyOTPService(email, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully.",
    data: result,
  });
});

/**============================================
 * FORGOT PASSWORD - 008
 * ============================================
 */
const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPasswordService(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully.",
    data: null,
  });
});

/**============================================
 * RESET PASSWORD - 009
 * ============================================
 */
const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  await AuthService.resetPasswordService(email, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully.",
    data: null,
  });
});

/**============================================
 * CHANGE PASSWORD - 010
 * ============================================
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await AuthService.changePasswordService(
    (req.user as JwtPayload).userId,
    currentPassword,
    newPassword,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully.",
    data: null,
  });
});

/**============================================
 * RESEND FORGOT PASSWORD OTP - 011
 * ============================================
 */
const resendForgotPasswordOTP = catchAsync(async (req, res) => {
  await AuthService.resendForgotPasswordOTPService(req.body.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset email resent, Check mail",
    data: null,
  });
});

/**===========================================
 * GET CURRENT LOGGED-IN USER **
 *============================================
 */
const getMe = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: req.user!,
  });
});

/**===========================================
 *  LOGOUT USER **
 * ===========================================
 */
const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(401, "Refresh token not found");
  }
  const decoded = verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!,
  ) as JwtPayload;

  await redisClient.del(`refresh:${decoded.userId}`);

  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged Out successfully.",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  verifyEmail,
  resendEmailVerificationOTP,
  loginUser,
  refreshToken,
  sendOTP,
  verifyOTP,
  forgotPassword,
  changePassword,
  resetPassword,
  resendForgotPasswordOTP,
  getMe,
  logout,
};
