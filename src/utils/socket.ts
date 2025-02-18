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

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

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
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) throw new Error("Socket.IO has not been initialized");
  return io;
};
