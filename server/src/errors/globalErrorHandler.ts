import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errorDetails: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const statusCode = (err as any)?.statusCode || 500;

  const message = err?.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: null,
  });
};

export default globalErrorHandler;
