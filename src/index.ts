import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./utils/socket"; // Import socket setup

dotenv.config();
import userRouter from "./routes/userRoutes";
import otpRouter from "./routes/otpRoutes";
import messageRouter from "./routes/messageRoutes";
import conversationRouter from "./routes/conversationRoute";
import attachmentRouter from "./routes/attachmentRoute";
import path from "path";
import groupRouter from "./routes/groupRoutes";
import userGroupRouter from "./routes/userGroupRouter";

const app = express();
const port = process.env.PORT || 3006;
const HOST = "0.0.0.0"; // Binds to all interfaces
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Allow credentials (cookies)
};

app.use("/uploads", express.static("uploads"));
app.use(cors(corsOptions));
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/attachment", attachmentRouter);
app.use("/api/groups", groupRouter);
app.use("/api/userGroups", userGroupRouter);

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen({ port: port, host: HOST }, () => {
  console.log(`Server running on http://${HOST}:${port}`);
});
