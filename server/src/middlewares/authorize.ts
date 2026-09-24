import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";

const authorize =
  (...requiredRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as {
      role: string;
    };

    if (!requiredRoles.includes(user.role)) {
      throw new AppError(403, "Forbidden Access");
    }

    next();
  };

export default authorize;
