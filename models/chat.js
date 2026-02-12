import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread", // References the Thread container
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The person who sent the message
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false // Tracks if the receiver has seen it
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);