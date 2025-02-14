import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
// Load environment variables
dotenv.config();
import userRouter from "./routes/userRoutes";
import otpRouter from "./routes/otpRoutes";
const app = express();

const port = process.env.PORT || 3006;
app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);

const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Adjust for your production origin(s)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Example: join a room (e.g., conversation or group room)
  socket.on("joinRoom", (room: string) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Example: listen for chat messages
  socket.on(
    "sendMessage",
    (data: { room: string; senderId: number; message: string }) => {
      console.log("Message received:", data);
      // Broadcast the message to all clients in the room (except the sender)
      socket.to(data.room).emit("message", data);
    }
  );

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
