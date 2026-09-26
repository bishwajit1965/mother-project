import { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../../database/redis.js";
import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

import sendResponse from "../../utils/sendResponse.js";
import verifyToken from "../../utils/verifyToken.js";

import { AuthService } from "./auth.service.js";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created. Verify your email address.",
    data: result,
  });
});

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

const getMe = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: req.user!,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError(401, "Refresh token is missing.");
  }
  const result = await AuthService.refreshTokenService(token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully.",
    data: result,
  });
});

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

const sendOTP = catchAsync(async (req, res) => {
  const result = await AuthService.sendOTPService(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully.",
    data: result,
  });
});

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

const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.forgotPasswordService(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully.",
    data: null,
  });
});

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

export const AuthController = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  refreshToken,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
