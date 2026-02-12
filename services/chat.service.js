import Chat from "../models/chat.js"
import Thread from "../models/thread.js"
import mongoose from "mongoose";

export const getChatByThreadService = async (threadId) => {
    return await Chat.find({ thread: threadId })
        .populate("sender", "username email") 
        .sort({ createdAt: 1 });
};

export const findOrCreateThreadService = async (userId1, userId2) => {
    const id1 = new mongoose.Types.ObjectId(userId1);
    const id2 = new mongoose.Types.ObjectId(userId2);
    console.log("Finding thread for users:", id1, id2)

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

export const sendChatService = async ({ senderId, receiverId, message }) => {
    const sId = new mongoose.Types.ObjectId(senderId);
    const rId = new mongoose.Types.ObjectId(receiverId);

    const thread = await findOrCreateThreadService(sId, rId);
    console.log("Using thread:", thread)

    const newChat = await Chat.create({
        thread: thread._id,
        sender: sId,
        message: message
    });

    await Thread.findByIdAndUpdate(thread._id, {
        lastMessage: message,
        lastMessageAt: new Date()
    });

    return newChat;
};