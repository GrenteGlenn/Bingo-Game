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
    console.log("📥 EVENT REÇU depuis", socket.id, ":", msg);

    // Validation basique du message
    if (!msg || !msg.type) {
      console.error("❌ Message invalide reçu:", msg);
      return;
    }

    // Ajouter le timestamp et broadcast à TOUS les clients (y compris l'émetteur)
    const enrichedMsg = { ...msg, ts: Date.now() };

    // Option 1: Envoyer à TOUS (y compris l'émetteur) - utile pour synchronisation
    io.emit("show-action", enrichedMsg);

    // Option 2: Envoyer seulement aux AUTRES clients (décommenter si besoin)
    // socket.broadcast.emit("show-action", enrichedMsg);

    console.log("📤 EVENT DIFFUSÉ à tous:", enrichedMsg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 déconnecté", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO listening on port ${PORT}`);
});
