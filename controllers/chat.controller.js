import { 
    sendChatService, 
    getChatByThreadService 
} from "../services/chat.service.js";

/**
 * Naya message bhejne ke liye Controller
 * Logic thread dhundne/banane aur message save karne ko handle karta hai
 */
export const sendChat = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        console.log("receiverId", receiverId)
        console.log("message", message)
        const senderId = req.user.id; // AuthMiddleware dwara populate kiya gaya
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
 * Ek specific thread ke sabhi messages laane ke liye Controller
 * Chat window open karne ke liye upyogi
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