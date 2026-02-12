import { sendChatService, findOrCreateThreadService, getChatByThreadService } from "../services/chat.service.js";

export const registerSocketHandler = (io) => {
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        // 1. User Online Logic
        socket.on('user-online', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.userId = userId; 
        });

        // 2. FEATURE: JOIN ROOM (Thread Logic)
        socket.on("join-chat", async ({ senderId, receiverId }) => {
            try {
                // Thread dhundo
                const thread = await findOrCreateThreadService(senderId, receiverId);
                const threadId = thread._id.toString();

                // Socket ko Room mein join karao
                socket.join(threadId);
                
                // Frontend ko batao ki room join ho gaya
                socket.emit("room-joined", { threadId: threadId });

                // Purani History bhejo
                const messages = await getChatByThreadService(threadId);
                socket.emit("history-response", messages);

            } catch (error) {
                console.error("Join Error:", error);
            }
        });

        // 3. FEATURE: SEND MESSAGE (Room Based)
        socket.on("send-message", async (data) => {
            try {
                let { senderId, receiverId, message, threadId } = data;

                // Agar threadId nahi aayi, to DB se nikalo
                if (!threadId) {
                    const thread = await findOrCreateThreadService(senderId, receiverId);
                    threadId = thread._id.toString();
                }

                // Message Save karo
                const chat = await sendChatService({ senderId, receiverId, message });

                // Sirf us Room (Thread) walon ko message bhejo
                io.to(threadId).emit("receive-message", chat);

            } catch (error) {
                console.log("Message Error:", error);
            }
        });

        // 4. FEATURE: TYPING INDICATOR
        socket.on("typing", ({ threadId }) => {
            if(threadId) socket.to(threadId).emit("display-typing");
        });

        socket.on("stop-typing", ({ threadId }) => {
            if(threadId) socket.to(threadId).emit("hide-typing");
        });

        socket.on("disconnect", () => {
            if (socket.userId) onlineUsers.delete(socket.userId);
        });
    });
}