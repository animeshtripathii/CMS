import { sendChatService } from "../services/chat.service.js"


export const registerSocketHandler = (io) => {
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User created: ", socket.id)

        socket.on('user-online', (userId) => {
            onlineUsers.set(userId, socket.id);

            console.log("Online Users", onlineUsers)
        })

        socket.on("send-message", async (data) => {
            try {
                const { senderId, receiverId, message } = data;

                if (!senderId || !receiverId || !message) {
                    console.log("Invalid data")
                    return;
                }
                const chat = await sendChatService({ senderId, receiverId, message })
                console.log("Chat created: ", chat) 

                if (!chat) {
                    console.log("Chat not found")
                    return;
                }
                const receiverSocketId = onlineUsers.get(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive-message", chat);
                }

            } catch (error) {
                console.log("Error sending message", error)
            }
        })

        socket.on("disconnect", () => {
            for (let [user, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(user);
                    console.log("User disconnected: ", user)
                    break;
                }
            }
        })
    })
}

// export  const  registerSocketHandlers = (io) => {
//     io.on("connection",(socket) => {
//         socket.on("send-message")
//     })
// }