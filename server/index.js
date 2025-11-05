import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';

dotenv.config();

// Initialize Express app first
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// --- In-memory storage ---
const users = new Map();
const userSockets = new Map();
const rooms = new Map([
  ["general", []],
  ["random", []],
  ["tech", []],
]);
const privateMessages = new Map();

// --- Routes ---
app.get("/", (req, res) => {
  res.send("🚀 Chat server is running!");
});

// --- Socket.IO handlers ---
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join", ({ username, room }) => {
    users.set(socket.id, { username, room });
    userSockets.set(username, socket.id);
    socket.join(room);

    socket.emit("room_history", { room, messages: rooms.get(room) || [] });

    io.to(room).emit("message", {
      user: "System",
      text: `${username} joined ${room}`,
    });
  });

  socket.on("sendMessage", ({ message, room }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const msgObj = {
      id: `msg_${Date.now()}_${Math.random()}`,
      user: user.username,
      text: message,
      timestamp: new Date().toISOString(),
    };

    const roomMessages = rooms.get(room) || [];
    roomMessages.push(msgObj);
    rooms.set(room, roomMessages);

    io.to(room).emit("message", msgObj);
  });

  socket.on("privateMessage", ({ to, message }) => {
    const user = users.get(socket.id);
    const recipientSocketId = userSockets.get(to);
    if (!user || !recipientSocketId) return;

    const msgObj = {
      id: `pm_${Date.now()}_${Math.random()}`,
      from: user.username,
      to,
      text: message,
      timestamp: new Date().toISOString(),
    };

    const conversationKey = [user.username, to].sort().join("_");
    if (!privateMessages.has(conversationKey)) privateMessages.set(conversationKey, []);
    privateMessages.get(conversationKey).push(msgObj);

    io.to(recipientSocketId).emit("privateMessage", msgObj);
    socket.emit("privateMessageSent", msgObj);
  });

  socket.on("typing", ({ room, typing }) => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.to(room).emit("userTyping", {
      user: user.username,
      typing,
    });
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, room } = user;

      io.to(room).emit("message", {
        user: "System",
        text: `${username} has left the chat.`,
      });

      users.delete(socket.id);
      userSockets.delete(username);
    }

    console.log("🔴 Client disconnected:", socket.id);
  });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
