import AppError from "../../errors/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

import sendResponse from "../../utils/sendResponse.js";

import { AuthService } from "./auth.service.js";

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
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
    message: "Access token refreshed successfully",
    data: result,
  });
});

const logout = catchAsync(async (_req, res) => {
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
  loginUser,
  getMe,
  refreshToken,
  logout,
};
