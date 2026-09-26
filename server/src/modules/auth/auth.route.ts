import { Router } from "express";
import { User } from "./auth.model.js";
import { AuthController } from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "./auth.constant.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "./auth.validation.js";
import { redisClient } from "../../database/redis.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  AuthController.registerUser,
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.loginUser,
);

router.post("/refresh-token", AuthController.refreshToken);

router.get("/users", async (_req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/me", authMiddleware, AuthController.getMe);

router.get(
  "/admin-only",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  },
);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/send-otp", AuthController.sendOTP);

router.post("/verify-otp", AuthController.verifyOTP);

router.post("/forgot-password", AuthController.forgotPassword);

router.patch("/reset-password", AuthController.resetPassword);

router.post("/logout", AuthController.logout);

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth module healthy",
  });
});

router.get("/redis-test", async (_req, res) => {
  await redisClient.set("boss", "Bishwajit");
  const value = await redisClient.get("boss");
  res.json({ success: true, value });
});

export default router;
