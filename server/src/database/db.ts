import mongoose from "mongoose";
import env from "../configs/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri as string);
    console.log("MongoDB is connected successfully.");
  } catch (error) {
    console.error("Mongoose connection error", error);
  }
};

export default connectDB;
