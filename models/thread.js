import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      type: String,
      default: "" // UI mein null errors rokta hai
    },
    lastMessageAt: {
      type: Date,
      default: Date.now // Threads ko recent activity ke hisaab se sort karne mein madad karta hai
    },
  },
  { timestamps: true }
);

export default mongoose.model("Thread", threadSchema);