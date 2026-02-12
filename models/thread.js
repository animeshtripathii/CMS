import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    lastMessage: {
      type: String,
      default: "" // Prevents null errors in the UI
    },
    lastMessageAt: {
      type: Date,
      default: Date.now // Helps sort threads by recent activity
    },
  },
  { timestamps: true }
);

export default mongoose.model("Thread", threadSchema);