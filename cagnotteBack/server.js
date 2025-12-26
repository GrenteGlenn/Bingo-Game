const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 connecté", socket.id);

  socket.on("show-action", (msg) => {
    // diffusion à TOUS (y compris l’émetteur si tu veux)
    io.emit("show-action", {
      ...msg,
      ts: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 déconnecté", socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO listening on port ${PORT}`);
});