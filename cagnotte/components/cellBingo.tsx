"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FireSideConfetti from "./ConfettiSideCannons";
import { useSocket } from "@/app/providers/socket-providers";
import { getPlayerToken } from "@/lib/playerToken";

type CellKey = `${number}-${number}`;

function countCompletedLines(
  selected: Set<CellKey>,
  rows: number,
  cols: number
) {
  let count = 0;

  for (let r = 0; r < rows; r++) {
    if ([...Array(cols)].every((_, c) => selected.has(`${r}-${c}`))) count++;
  }

  for (let c = 0; c < cols; c++) {
    if ([...Array(rows)].every((_, r) => selected.has(`${r}-${c}`))) count++;
  }

  return count;
}

export default function BingoBoard() {
  const socket = useSocket();
  const token = useMemo(() => getPlayerToken(), []);

  const rows = 5;
  const cols = 5;

  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<CellKey>>(new Set());
  const [ready, setReady] = useState(false);
  const hasHydratedRef = useRef(false);

  const [showBingo, setShowBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRunId, setConfettiRunId] = useState(0);

  const prevLineCountRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
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

  useEffect(() => {
    if (!socket || !token) return;

    const request = () => {
      socket.emit("request-player-state", { token });
    };

    if (socket.connected) {
      request();
    } else {
      socket.once("connect", request);
    }
  }, [socket, token]);

  // listener socket
  useEffect(() => {
    if (!socket) return;

    const handler = (msg: any) => {
      if (msg.type === "player-state") {
        const selectedSet = new Set<CellKey>(msg.selected);

        setNumbers(msg.numbers);
        setSelected(selectedSet);
        setReady(true);

        if (!hasHydratedRef.current) {
          prevLineCountRef.current = countCompletedLines(
            selectedSet,
            rows,
            cols
          );
          hasHydratedRef.current = true;
        }
      }

      if (msg.type === "reset-bingo") {
        hasHydratedRef.current = false;
        prevLineCountRef.current = 0;

        clearTimers();
        setReady(false);
        setNumbers([]);
        setSelected(new Set());

        // DEMANDE EXPLICITE D’UNE NOUVELLE GRILLE
        socket.emit("request-player-state", { token });
      }
    };

    socket.on("show-action", handler);

    // cleanup qui retourne VOID
    return () => {
      socket.off("show-action", handler);
    };
  }, [socket]);

  // DÉTECTION BINGO
  const completedLines = countCompletedLines(selected, rows, cols);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    if (completedLines > prevLineCountRef.current) {
      triggerBingoFx();
    }
    prevLineCountRef.current = completedLines;
  }, [completedLines]);

  const toggleCell = (row: number, col: number) => {
    const key: CellKey = `${row}-${col}`;

    // UI OPTIMISTE (réactivité immédiate)
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

    socket.emit("show-action", {
      type: "toggle-cell",
      row,
      col,
      token,
    });
  };

  if (!ready) return <div className="text-white/70">Chargement…</div>;

  return (
    <div className="flex flex-col items-center gap-3 p-4">
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

          return (
            <button
              key={key}
              onClick={() => toggleCell(row, col)}
              className={`aspect-square border text-lg font-semibold ${
                active ? "bg-green-500 scale-105" : "bg-[#00A6D9]"
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
