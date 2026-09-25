import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import verifyToken from "../utils/verifyToken.js";

import AppError from "../errors/AppError";

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(401, "You are not authorized");
  }

  const bearerToken = token.split(" ")[1];

  if (!bearerToken) {
    throw new AppError(401, "You are not authorized");
  }

  // const decoded = jwt.verify(
  //   bearerToken,
  //   process.env.JWT_ACCESS_SECRET as string,
  // );

  const decoded = verifyToken(
    bearerToken,
    process.env.JWT_ACCESS_SECRET as string,
  );

  (req as Request & { user: string | jwt.JwtPayload }).user = decoded;

  next();
};

export default authMiddleware;
