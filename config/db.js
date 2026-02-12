import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set("runValidators", true); // Updates par schema validation enforce karein

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
