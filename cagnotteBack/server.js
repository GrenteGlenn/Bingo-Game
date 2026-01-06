const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const STATE_FILE = "./state.json";

/* ---------- UTILS ---------- */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawUniqueNumbers(min, max, count) {
  const pool = [];
  for (let n = min; n <= max; n++) pool.push(n);
  shuffle(pool);
  return pool.slice(0, count);
}

/* ---------- APP ---------- */
const app = express();
app.use(cors());
app.get("/", (_, res) => res.send("OK"));

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* ---------- STATE ---------- */
let cagnottePoints = 0;
let drawnNumbers = [];
const players = new Map();

/* ---------- LOAD ---------- */
if (fs.existsSync(STATE_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    cagnottePoints = data.cagnottePoints ?? 0;
    drawnNumbers = data.drawnNumbers ?? [];

    data.players?.forEach((p) => {
      players.set(p.token, {
        numbers: p.numbers ?? drawUniqueNumbers(1, 50, 25),
        selected: new Set(p.selected ?? []),
        completedLines: p.completedLines ?? 0,
        isFull: !!p.isFull,
        lastActivity: Date.now(),
      });
    });
  } catch (e) {
    console.error("❌ load error", e);
  }
}

/* ---------- SAVE ---------- */
let saveTimeout = null;

function scheduleSave() {
  if (saveTimeout) return;

  saveTimeout = setTimeout(() => {
    const data = {
      cagnottePoints,
      drawnNumbers,
      players: [...players.entries()].map(([token, p]) => ({
        token,
        numbers: p.numbers,
        selected: [...p.selected],
        completedLines: p.completedLines,
        isFull: p.isFull,
      })),
    };

    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));

    saveTimeout = null;
  }, 500);
}

/* ---------- HELPERS ---------- */
function getPlayer(token) {
  if (!players.has(token)) {
    players.set(token, {
      numbers: drawUniqueNumbers(1, 50, 25),
      selected: new Set(),
      completedLines: 0,
      isFull: false,
      lastActivity: Date.now(),
    });
  }
  const p = players.get(token);
  p.lastActivity = Date.now();
  return p;
}

function emitPlayerState(socket, token) {
  const p = getPlayer(token);
  socket.emit("show-action", {
    type: "player-state",
    numbers: p.numbers,
    selected: [...p.selected],
    ts: Date.now(),
  });
}

/* ---------- SOCKET ---------- */
io.on("connection", (socket) => {
  // const token = socket.handshake.auth?.token;

  // // ✅ GRILLE ENVOYÉE IMMÉDIATEMENT AU LOGIN
  // if (token) {
  //   emitPlayerState(socket, token);
  //   scheduleSave();
  // }

  socket.emit("show-action", {
    type: "cagnotte-update",
    points: cagnottePoints,
  });

  socket.on("request-player-state", ({ token }) => {
    if (!token) return;
    emitPlayerState(socket, token);
  });
  socket.on("request-full-state", () => {
    drawnNumbers.forEach((n) => {
      socket.emit("show-action", {
        type: "number",
        value: n,
        ts: Date.now(),
      });
    });

    socket.emit("show-action", {
      type: "cagnotte-update",
      points: cagnottePoints,
    });
  });

  socket.on("show-action", (msg) => {
    if (msg.type === "toggle-cell") {
      const { token, row, col } = msg;
      const key = `${row}-${col}`;
      const p = getPlayer(token);

      p.selected.has(key) ? p.selected.delete(key) : p.selected.add(key);

      emitPlayerState(socket, token);
      scheduleSave();
      return;
    }

    if (msg.type === "palier" || msg.type === "felicitation") {
      io.emit("show-action", {
        ...msg,
        ts: Date.now(),
      });

      return;
    }

    if (msg.type === "number") {
      if (!drawnNumbers.includes(msg.value)) {
        drawnNumbers.push(msg.value);
      }

      io.emit("show-action", {
        type: "number",
        value: msg.value,
        ts: Date.now(),
      });

      scheduleSave();
      return;
    }

    if (msg.type === "reset-bingo") {
      players.clear();
      drawnNumbers = [];
      cagnottePoints = 0;

      io.emit("show-action", { type: "reset-bingo" });

      scheduleSave();
    }
  });
});

server.listen(process.env.PORT || 4000, () =>
  console.log("🚀 Socket.IO running")
);
