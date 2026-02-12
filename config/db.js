import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set("runValidators", true); // Enforce schema validation on updates

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
