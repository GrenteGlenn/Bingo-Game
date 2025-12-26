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

let drawnNumbers = [];
let cagnotteState = null;

io.on("connection", (socket) => {
  console.log("🟢 connecté", socket.id);
   if (drawnNumbers.length > 0) {
    drawnNumbers.forEach((n) => {
      socket.emit("show-action", {
        type: "number",
        value: n,
        ts: Date.now(),
      });
    });
  }

  // 🔁 resync cagnotte
  if (cagnotteState) {
    socket.emit("show-action", {
      ...cagnotteState,
      ts: Date.now(),
    });
  }

  socket.on("show-action", (msg) => {
    console.log("📥 EVENT REÇU:", msg);

    if (msg.type === "number") {
      if (!drawnNumbers.includes(msg.value)) {
        drawnNumbers.push(msg.value);
      }
    }

    if (msg.type === "reset-bingo") {
      drawnNumbers = [];
      cagnotteState = null;
    }

    if (msg.type === "palier" || msg.type === "felicitation") {
      cagnotteState = msg;
    }

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
