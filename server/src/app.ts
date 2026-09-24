import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import moduleRoutes from "./modules";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./configs/swagger.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/v1", moduleRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Mother Project Server Running",
  });
});

app.get("/error", () => {
  throw new Error("Test Error");
});

// MUST BE HERE AT THE END OR WILL NOT WORK PROPERLY
app.use(globalErrorHandler);

export default app;
