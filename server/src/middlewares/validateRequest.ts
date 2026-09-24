import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: ZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }

      next(error);
    }
  };

export default validateRequest;
