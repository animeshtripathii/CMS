import { sendChatService } from "../services/chat.service.js"

export const registerSocketHandler = (io) => {
    const onlineUsers = new Map(); // Online users ko track karne ke liye memory map

    io.on("connection", (socket) => {
        console.log("Naya banda connect hua: ", socket.id);

        // Jab user login kare toh uska ID aur Socket ID map mein save karo
        socket.on('user-online', (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("Abhi ye users online hain:", Array.from(onlineUsers.keys()));
        });

        // Message bhejne ka main logic
        socket.on("send-message", async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                if (!senderId || !receiverId || !message) return;

                // Service ko call karke message DB mein save karo
                // Humne service mein hi .populate("sender") laga diya hai
                const chat = await sendChatService({ senderId, receiverId, message });
                console.log("Naya message save hua:", chat);

                // Receiver ka socket ID dhundo
                const receiverSocketId = onlineUsers.get(receiverId);
                
                if (receiverSocketId) {
                    // Agar receiver online hai, toh use pura 'chat' object bhejo (naam ke saath)
                    io.to(receiverSocketId).emit("receive-message", chat);
                }
                
                // Jisne message bheja hai (aapko), use confirmation bhejo
                socket.emit("message-sent", chat);

            } catch (error) {
                console.log("Message bhejne mein error aaya:", error);
            }
        });

        // Jab user tab close kare ya disconnect ho jaye
        socket.on("disconnect", () => {
            for (let [user, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(user);
                    console.log("User offline gaya: ", user);
                    break;
                }
            }
        });
    });
}