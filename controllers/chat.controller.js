import { 
    sendChatService, 
    getChatByThreadService 
} from "../services/chat.service.js";

/**
 * Controller to send a new message
 * Logic handles finding/creating a thread and saving the message
 */
export const sendChat = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        console.log("receiverId", receiverId)
        console.log("message", message)
        const senderId = req.user.id; // Populated by your authMiddleware
console.log("senderId", senderId)
        if (!receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID or message content are required"
            });
        }

        const chat = await sendChatService({
            senderId,
            receiverId,
            message
        });
        
        return res.status(201).json({
            success: true,
            data: chat
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Controller to fetch all messages in a specific thread
 * Useful for opening a chat window
 */
export const getChatByThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        console.log("threadId", threadId)

        if (!threadId) {
            return res.status(400).json({
                success: false,
                message: "Thread ID is required"
            });
        }

        const messages = await getChatByThreadService(threadId);

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};