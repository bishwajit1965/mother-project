import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import createToken from "../../utils/createToken.js";
import AppError from "../../errors/AppError.js";
import { USER_STATUS } from "./auth.constant.js";

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

  return result;
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

  return {
    accessToken,
    refreshToken,
  };
};

const refreshTokenService = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as JwtPayload;

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

  return accessToken;
};

export const AuthService = {
  registerUserService,
  loginUserService,
  refreshTokenService,
};
