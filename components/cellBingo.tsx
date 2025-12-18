"use client";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { subscribe } from "@/lib/show-channel";

type CellKey = `${number}-${number}`;

function checkBingo(selected: Set<CellKey>, rows: number, cols: number) {
  for (let row = 0; row < rows; row++) {
    let ok = true;
    for (let col = 0; col < cols; col++) {
      const key = `${row}-${col}` as CellKey;
      if (!selected.has(key)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }

  for (let col = 0; col < cols; col++) {
    let ok = true;
    for (let row = 0; row < rows; row++) {
      const key = `${row}-${col}` as CellKey;
      if (!selected.has(key)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }

  if (rows === cols) {
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < rows; i++) {
      if (!selected.has(`${i}-${i}` as CellKey)) diag1 = false;
      if (!selected.has(`${i}-${rows - 1 - i}` as CellKey)) diag2 = false;
    }
    if (diag1 || diag2) return true;
  }

  return false;
}

function fireSideCannons(durationMs = 3000) {
  const end = Date.now() + durationMs;
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.55 },
      colors,
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.55 },
      colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
}

function shuffle1toN(n: number) {
  const array = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function BingoBoard() {
  const rows = 5;
  const cols = 5;

  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<CellKey>>(new Set());

  const hasFiredRef = useRef(false);

  // init numbers côté client
  useEffect(() => {
    setNumbers(shuffle1toN(rows * cols));
  }, [rows, cols]);

  const bingo = checkBingo(selected, rows, cols);

  // confetti 1 seule fois
  useEffect(() => {
    if (bingo && !hasFiredRef.current) {
      hasFiredRef.current = true;
      fireSideCannons(3000);
    }
  }, [bingo]);

  // ✅ écoute le reset venant du panel
  useEffect(() => {
    return subscribe((m) => {
      if (m.type === "reset-bingo") {
        hasFiredRef.current = false;
        setSelected(new Set());
        setNumbers(shuffle1toN(rows * cols));
      }
    });
  }, [rows, cols]);

  const toggleCell = (row: number, col: number) => {
    const key: CellKey = `${row}-${col}`;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (numbers.length === 0) {
    return (
      <div className="flex flex-col items-center p-4 gap-3">
        <h1 className="text-2xl font-bold">🎯 Bingo</h1>
        <div className="text-white/70">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 gap-3">
      <h1 className="text-2xl font-bold">🎯 Bingo</h1>

      {bingo && (
        <div className="rounded-lg bg-green-600 px-4 py-2 text-white font-semibold">
          ✅ BINGO !
        </div>
      )}

      <div
        className="grid border-4 border-gray-700 rounded-xl shadow-lg w-[min(600px,90vw)]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {numbers.map((num, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const key: CellKey = `${row}-${col}`;
          const active = selected.has(key);

          return (
            <button
              type="button"
              key={key}
              onClick={() => toggleCell(row, col)}
              className={`aspect-square flex items-center justify-center border border-gray-400 text-lg font-semibold transition-all duration-150 ${
                active
                  ? "bg-green-500 text-white scale-[1.03]"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
