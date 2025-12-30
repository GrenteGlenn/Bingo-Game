const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const STATE_FILE = "./state.json";

let cagnottePoints = 0;

if (fs.existsSync(STATE_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    cagnottePoints = data.cagnottePoints ?? 0;
  } catch {
  }
}


let saveTimeout = null;
function scheduleSave() {
  if (saveTimeout) return;

  saveTimeout = setTimeout(() => {
    fs.writeFile(
      STATE_FILE,
      JSON.stringify({ cagnottePoints }, null, 2),
      () => {}
    );
    saveTimeout = null;
  }, 1000); 
}

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
  socket.emit("show-action", {
    type: "cagnotte-update",
    points: cagnottePoints,
    ts: Date.now(),
  });

  if (drawnNumbers.length > 0) {
    drawnNumbers.forEach((n) => {
      socket.emit("show-action", {
        type: "number",
        value: n,
        ts: Date.now(),
      });
    });
  }

  if (cagnotteState) {
    socket.emit("show-action", {
      ...cagnotteState,
      ts: Date.now(),
    });
  }

  socket.on("show-action", (msg) => {
    if (msg.type === "add-points") {
      cagnottePoints += msg.points;

      io.emit("show-action", {
        type: "cagnotte-update",
        points: cagnottePoints,
        ts: Date.now(),
      });

      scheduleSave();
      return;
    }

    if (msg.type === "reset-score") {
      cagnottePoints = 0;

      io.emit("show-action", {
        type: "cagnotte-update",
        points: cagnottePoints,
        ts: Date.now(),
      });

      scheduleSave();
      return;
    }

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

  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
});
