import Chat from "../models/chat.js"
import Thread from "../models/thread.js"
import mongoose from "mongoose";

// Purani chat history lane ke liye
export const getChatByThreadService = async (threadId) => {
    return await Chat.find({ thread: threadId })
        .populate("sender", "name email") // Name aur Email dono mangwaya
        .sort({ createdAt: 1 });
};

// Thread dhundne ya banane ke liye
export const findOrCreateThreadService = async (userId1, userId2) => {
    const id1 = new mongoose.Types.ObjectId(userId1);
    const id2 = new mongoose.Types.ObjectId(userId2);

    let thread = await Thread.findOne({
        participants: { $all: [id1, id2], $size: 2 }
    });

    if (!thread) {
        thread = await Thread.create({
            participants: [id1, id2]
        });
    }
    return thread;
};

// Message save karne ke liye
export const sendChatService = async ({ senderId, receiverId, message }) => {
    const sId = new mongoose.Types.ObjectId(senderId); 
    const rId = new mongoose.Types.ObjectId(receiverId);

    const thread = await findOrCreateThreadService(sId, rId);
    
    const newChat = await Chat.create({
        thread: thread._id,
        sender: sId,
        message: message
    });

    // Populate taaki socket ko turant naam mil jaye
    const populatedChat = await Chat.findById(newChat._id)
        .populate("sender", "name email");

    // Thread ko update karo taaki pata chale last message kya tha
    await Thread.findByIdAndUpdate(thread._id, {
        lastMessage: message,
        lastMessageAt: new Date()
    });

    return populatedChat; 
};