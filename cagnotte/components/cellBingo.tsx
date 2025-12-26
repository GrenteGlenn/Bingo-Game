"use client";

import { useEffect, useRef, useState } from "react";

import FireSideConfetti from "./ConfettiSideCannons";
import { getSocket } from "@/lib/socket";

const socket = getSocket();

type CellKey = `${number}-${number}`;

function shuffle1toN(n: number) {
  const array = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function countCompletedLines(
  selected: Set<CellKey>,
  rows: number,
  cols: number
) {
  let count = 0;

  for (let row = 0; row < rows; row++) {
    if (
      Array.from({ length: cols }).every((_, col) =>
        selected.has(`${row}-${col}` as CellKey)
      )
    )
      count++;
  }

  for (let col = 0; col < cols; col++) {
    if (
      Array.from({ length: rows }).every((_, row) =>
        selected.has(`${row}-${col}` as CellKey)
      )
    )
      count++;
  }

  return count;
}

export default function BingoBoard() {
  const rows = 5;
  const cols = 5;

  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<CellKey>>(new Set());

  const [showBingo, setShowBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRunId, setConfettiRunId] = useState(0);

  const prevLineCountRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const triggerBingoFx = () => {
    setConfettiRunId((v) => v + 1);
    setShowConfetti(true);
    setShowBingo(true);

    clearTimers();
    timersRef.current.push(
      window.setTimeout(() => {
        setShowConfetti(false);
        setShowBingo(false);
      }, 5500)
    );
  };

  // 🎲 init grille
  useEffect(() => {
    setNumbers(shuffle1toN(rows * cols));
    return () => clearTimers();
  }, []);

  const completedLines = countCompletedLines(selected, rows, cols);

  useEffect(() => {
    if (completedLines > prevLineCountRef.current) {
      triggerBingoFx();
    }
    prevLineCountRef.current = completedLines;
  }, [completedLines]);

  // 🔌 RÉCEPTION DES ACTIONS SOCKET
  useEffect(() => {
    const handler = (msg: any) => {
      if (msg.type === "select-cell") {
        const key: CellKey = `${msg.row}-${msg.col}`;
        setSelected((prev) => {
          const next = new Set(prev);
          next.has(key) ? next.delete(key) : next.add(key);
          return next;
        });
      }

      if (msg.type === "reset-bingo") {
        clearTimers();
        prevLineCountRef.current = 0;

        setShowBingo(false);
        setShowConfetti(false);
        setSelected(new Set());
        setNumbers(shuffle1toN(rows * cols));
      }
    };

    socket.on("show-action", handler);

    return () => {
      socket.off("show-action", handler);
    };
  }, [rows, cols]);

  // 📤 ÉMISSION (clic utilisateur)
  const toggleCell = (row: number, col: number) => {
    socket.emit("show-action", {
      type: "select-cell",
      row,
      col,
    });
  };

  if (numbers.length === 0) {
    return <div className="text-white/70">Chargement…</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 gap-3">
      {showConfetti && <FireSideConfetti key={confettiRunId} duration={3000} />}

      {showBingo && (
        <div className="rounded-lg bg-green-600 px-4 py-2 text-white font-semibold">
          ✅ BINGO !
        </div>
      )}

      <div
        className="grid border-4 border-white/40 rounded-xl shadow-lg w-[min(600px,90vw)]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {numbers.map((num, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const key: CellKey = `${row}-${col}`;
          const active = selected.has(key);
          const isAlt = (row + col) % 2 === 0;

          return (
            <button
              key={key}
              onClick={() => toggleCell(row, col)}
              className={`
                aspect-square flex items-center justify-center
                border border-white/30 text-lg font-semibold
                transition-all
                ${
                  active
                    ? "bg-green-500 scale-105"
                    : isAlt
                      ? "bg-[#00A6D9]"
                      : "bg-[rgba(0,166,217,0.5)]"
                }
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
