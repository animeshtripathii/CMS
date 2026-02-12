import Chat from "../models/chat.js"
import Thread from "../models/thread.js"

export const getChatByThreadService = async (threadId) => {
    // Correctly populates sender and sorts messages from oldest to newest
    return await Chat.find({ thread: threadId })
        .populate("sender", "username email") 
        .sort({ createdAt: 1 });
};

export const findOrCreateThreadService = async (userId1, userId2) => {
    // Finding a thread where BOTH users are participants
    let thread = await Thread.findOne({
        participants: { $all: [userId1, userId2], $size: 2 }
    });

    if (!thread) {
        // Create new thread if one doesn't exist
        console.log("thread is creating")
        thread = await Thread.create({
            participants: [userId1, userId2]
        });
    }
    return thread;
};

export const sendChatService = async ({ senderId, receiverId, message }) => {
    // 1. Ensure thread exists
    const thread = await findOrCreateThreadService(senderId, receiverId);

    // 2. Create the Chat message
    const newChat = await Chat.create({
        thread: thread._id,
        sender: senderId,
        message: message
    });

    // 3. Update the Thread with the latest message info for the preview
    await Thread.findByIdAndUpdate(thread._id, {
        lastMessage: message,
        lastMessageAt: new Date()
    });

    return newChat;
};