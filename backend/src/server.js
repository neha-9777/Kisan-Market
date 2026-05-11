import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import config from "./config/env.js";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // API Routes
    app.use("/api/products", productRoutes);

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Socket Connection
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join room
      socket.on("join", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      // Typing Event
      socket.on("typing", (data) => {
        socket.to(data.room).emit("typing", data);
      });

      // Chat Message Event
      socket.on("chat_message", (data) => {
        if (data.room) {
          socket.to(data.room).emit("chat_message", data);
        }
      });

      // Disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Start Server
    const PORT = config.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
