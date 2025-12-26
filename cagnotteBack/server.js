const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 connecté", socket.id);

  socket.on("show-action", (msg) => {
      console.log("📥 EVENT REÇU:", msg);

    io.emit("show-action", { ...msg, ts: Date.now() });
  });

  socket.on("disconnect", () => {
    console.log("🔴 déconnecté", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO listening on port ${PORT}`);
});
