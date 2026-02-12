import dotenv from "dotenv";
dotenv.config();
import { registerSocketHandler } from "./sockets/socket.js";
import {Server} from "socket.io"
import app from "./app.js";
import connectDB from "./config/db.js";
import http from "http";
import cloudinary from "./config/cloudinary.js";

const PORT = process.env.PORT || 5000;

await connectDB();

const server=http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Testing ke liye sabhi origins allow hai, production mein adjust karein
        credentials: true // credential true ka matlab hai ki requests ke saath cookies bhejna allowed hai
    }
});
// Registration ke liye socket logic
registerSocketHandler(io);  
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
