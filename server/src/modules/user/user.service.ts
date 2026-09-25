import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { User } from "../auth/auth.model.js";
import { USER_STATUS } from "../auth/auth.constant.js";

const getAllUsersService = async () => {
  const users = await User.find({ isDeleted: false });

  return users;
};

const getUserByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false }).select(
    "_id name email role status createdAt updatedAt",
  );

  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};

const updateUserService = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    avatar: string;
    bio: string;
    role: string;
    status: string;
  }>,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("_id name email avatar bio role status createdAt updatedAt");

  return updatedUser;
};

const blockUserService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }

  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const blockedUser = await User.findByIdAndUpdate(
    id,
    { status: USER_STATUS.BLOCKED },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select(
    "_id name email avatar bio role status isDeleted createdAt updatedAt",
  );

  return blockedUser;
};

const softDeleteUserService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid user id");
  }
  const user = await User.findOne({ _id: id, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const softDeletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select(
    "_id name email avatar bio role status isDeleted createdAt updatedAt",
  );

  return softDeletedUser;
};

export const UserService = {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  blockUserService,
  softDeleteUserService,
};
