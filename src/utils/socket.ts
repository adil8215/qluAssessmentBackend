import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

interface CustomSocket extends Socket {
  userId?: string; // Make it optional if it's not always set
}
export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const userSocketMap = new Map<string, string>();
  const userSocketMap1 = new Map<string, string>();
  const onlineUsers = new Set();

  io.on("connection", (socket: CustomSocket) => {
    socket.on("userOnline", (userId: string) => {
      console.log("user Online catched", userId);
      userSocketMap.set(userId, socket.id);
      onlineUsers.add(userId);
      io.emit("updateUserStatus", { userId, status: "online" });
    });

    console.log("New client connected:", socket.id);
    socket.on("register", (userId: string) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // In socket initialization
    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);

      // Add proper transformation
      io.to(data.room).emit("message", {
        ...data,
        message_id: Date.now().toString(), // Temporary ID until DB insert
        created_at: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          onlineUsers.delete(userId);
          io.emit("updateUserStatus", { userId, status: "offline" });
          break;
        }
      }
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) throw new Error("Socket.IO has not been initialized");
  return io;
};
