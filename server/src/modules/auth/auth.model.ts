import { Schema, model } from "mongoose";

import { IUser, UserModel } from "./auth.interface.js";
import { USER_ROLE, USER_STATUS } from "./auth.constant.js";

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: null,
    },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};

export const User = model<IUser, UserModel>("User", userSchema);
