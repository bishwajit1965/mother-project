import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import { UserController } from "./user.controller.js";

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  UserController.getUserById,
);

router.patch(
  "/:id",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  UserController.updateUser,
);

router.patch(
  "/:id/block",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  UserController.blockUser,
);

router.patch(
  "/:id/soft-delete",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  UserController.softDeleteUser,
);

router.get(
  "/",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  UserController.getAllUsers,
);

export default router;
