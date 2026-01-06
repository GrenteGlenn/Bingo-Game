const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const STATE_FILE = "./state.json";


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

const app = express();
app.use(cors());
app.get("/", (_, res) => res.send("OK"));

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: { origin: "*", methods: ["GET", "POST"] },
});


let cagnottePoints = 0;
let drawnNumbers = [];
const players = new Map();


if (fs.existsSync(STATE_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    cagnottePoints = data.cagnottePoints ?? 0;
    drawnNumbers = data.drawnNumbers ?? [];

    data.players?.forEach((p) => {
      players.set(p.token, {
        numbers: Array.isArray(p.numbers)
          ? p.numbers
          : drawUniqueNumbers(1, 50, 25),
        selected: new Set(Array.isArray(p.selected) ? p.selected : []),
        completedLines: p.completedLines ?? 0,
        isFull: !!p.isFull,
        lastActivity: p.lastActivity ?? Date.now(),
      });
    });
  } catch (e) {
    console.error("❌ Failed to load state", e);
  }
}


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
        lastActivity: p.lastActivity,
      })),
    };

    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
    saveTimeout = null;
  }, 500);
}


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
  const player = players.get(token);
  player.lastActivity = Date.now();
  return player;
}

function countCompletedLines(selected) {
  const rows = 5;
  const cols = 5;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    if ([...Array(cols)].every((_, c) => selected.has(`${r}-${c}`))) count++;
  }
  for (let c = 0; c < cols; c++) {
    if ([...Array(rows)].every((_, r) => selected.has(`${r}-${c}`))) count++;
  }
  return count;
}

function emitPlayerState(socket, token) {
  const player = getPlayer(token);
  socket.emit("show-action", {
    type: "player-state",
    numbers: player.numbers,
    selected: [...player.selected],
    ts: Date.now(),
  });
}


io.on("connection", (socket) => {
  socket.emit("show-action", {
    type: "cagnotte-update",
    points: cagnottePoints,
    ts: Date.now(),
  });

  drawnNumbers.forEach((n) => {
    socket.emit("show-action", {
      type: "number",
      value: n,
      ts: Date.now(),
    });
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
      ts: Date.now(),
    });
  });

  socket.on("request-player-state", ({ token }) => {
    if (!token) return;
    emitPlayerState(socket, token);
    scheduleSave();
  });

  socket.on("show-action", (msg) => {
    if (msg.type === "toggle-cell") {
      const { token, row, col } = msg;
      if (!token) return;

      const key = `${row}-${col}`;
      const player = getPlayer(token);

      if (player.selected.has(key)) {
        player.selected.delete(key);
        cagnottePoints -= 12;
      } else {
        player.selected.add(key);
        cagnottePoints += 12;
      }

      const lines = countCompletedLines(player.selected);
      const diff = lines - player.completedLines;
      if (diff !== 0) {
        cagnottePoints += diff * 30;
        player.completedLines = lines;
      }

      const isFull = player.selected.size === 25;
      if (isFull && !player.isFull) {
        cagnottePoints += 100;
        player.isFull = true;
      }
      if (!isFull && player.isFull) {
        cagnottePoints -= 100;
        player.isFull = false;
      }

      io.emit("show-action", {
        type: "cagnotte-update",
        points: cagnottePoints,
        ts: Date.now(),
      });

      emitPlayerState(socket, token);
      scheduleSave();
      return;
    }

    if (msg.type === "reset-bingo") {
      players.clear();
      drawnNumbers = [];
      cagnottePoints = 0;

      scheduleSave();

      io.emit("show-action", { type: "reset-bingo", ts: Date.now() });
      io.emit("show-action", {
        type: "cagnotte-update",
        points: 0,
        ts: Date.now(),
      });
      return;
    }

    if (msg.type === "number") {
      if (!drawnNumbers.includes(msg.value)) {
        drawnNumbers.push(msg.value);
      }
    }

    if (msg.type === "palier" || msg.type === "felicitation") {
      io.emit("show-action", { ...msg, ts: Date.now() });
      return;
    }

    io.emit("show-action", { ...msg, ts: Date.now() });
    scheduleSave();
  });
});


setInterval(() => {
  const now = Date.now();
  for (const [token, p] of players) {
    if (now - p.lastActivity > 2 * 60 * 60 * 1000) {
      players.delete(token);
    }
  }
  scheduleSave();
}, 60_000);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO running on ${PORT}`);
});
