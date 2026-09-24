import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = (err as any)?.statusCode || 500;

  const message = err?.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: null,
  });
};

export default globalErrorHandler;
