import { Model } from "mongoose";

import { USER_ROLE, USER_STATUS } from "./auth.constant.js";

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface TLoginUser {
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: TUserRole;
  bio: string;
  status: TUserStatus;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
}
