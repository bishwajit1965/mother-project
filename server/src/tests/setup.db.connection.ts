import { beforeAll } from "vitest";
import connectDB from "../database/db.js";

beforeAll(async () => {
  await connectDB();
});
