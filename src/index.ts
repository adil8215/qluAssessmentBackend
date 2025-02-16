import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { initializeSocket } from "./utils/socket"; // Import socket setup

dotenv.config();
import userRouter from "./routes/userRoutes";
import otpRouter from "./routes/otpRoutes";
import messageRouter from "./routes/messageRoutes";
import conversationRouter from "./routes/conversationRoute";

const app = express();
const port = process.env.PORT || 3006;
const HOST = "0.0.0.0"; // Binds to all interfaces

app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen({ port: port, host: HOST }, () => {
  console.log(`Server running on http://${HOST}:${port}`);
});
