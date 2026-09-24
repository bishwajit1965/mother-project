import app from "./app.js";
import env from "./configs/env.js";
import connectDB from "./database/db.js";
// import { connectRedis } from "./database/redis.js";

const startServer = async () => {
  try {
    await connectDB();
    // await connectRedis();

    const port = env.port;

    if (!port) {
      console.log("Error in port detected");
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error in MongoDB connection", error);
  }
};

startServer();
