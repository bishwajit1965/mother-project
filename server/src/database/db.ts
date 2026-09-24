import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB is connected successfully.");
  } catch (error) {
    console.error("Mongoose connection error", error);
  }
};

export default connectDB;
