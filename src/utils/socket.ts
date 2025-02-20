import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const userSocketMap = new Map<string, string>();
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    socket.on("authenticate", (userId) => {
      // Add the socket to the user's connection set
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      console.log(`User ${userId} is now online.`);

      // Broadcast to other clients (if needed)
      io.emit("userStatus", { userId, online: true });
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
    socket.on("sendMessage", (data: any) => {
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

      setTimeout(() => {
        for (const [userId, socketSet] of onlineUsers.entries()) {
          if (socketSet.has(socket.id)) {
            socketSet.delete(socket.id);
            if (socketSet.size === 0) {
              onlineUsers.delete(userId);
              console.log(`User ${userId} is now offline.`);
              io.emit("userStatus", { userId, online: false });
            }
            break;
          }
        }
      }, 3000); // Wait 3 s
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) throw new Error("Socket.IO has not been initialized");
  return io;
};
