import dotenv from "dotenv";

dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 3000,
};
