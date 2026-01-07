// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import FireSideConfetti from "./ConfettiSideCannons";
// import { useSocket } from "@/app/providers/socket-providers";
// import { getPlayerToken } from "@/lib/playerToken";

// type CellKey = `${number}-${number}`;

// type PlayerStateAction = {
//   type: "player-state";
//   numbers: number[];
//   selected: string[];
//   ts?: number;
// };

// type ResetBingoAction = {
//   type: "reset-bingo";
//   ts?: number;
// };

// type ShowAction =
//   | PlayerStateAction
//   | ResetBingoAction
//   | { type: string; [k: string]: any };

// function countCompletedLines(
//   selected: Set<CellKey>,
//   rows: number,
//   cols: number
// ) {
//   let count = 0;

//   for (let r = 0; r < rows; r++) {
//     const ok = Array.from({ length: cols }).every((_, c) =>
//       selected.has(`${r}-${c}` as CellKey)
//     );
//     if (ok) count++;
//   }

//   for (let c = 0; c < cols; c++) {
//     const ok = Array.from({ length: rows }).every((_, r) =>
//       selected.has(`${r}-${c}` as CellKey)
//     );
//     if (ok) count++;
//   }

//   return count;
// }

// export default function BingoBoard() {
//   const socket = useSocket();
//   const token = useMemo(() => getPlayerToken(), []);

//   const rows = 5;
//   const cols = 5;

//   const [numbers, setNumbers] = useState<number[]>([]);
//   const [selected, setSelected] = useState<Set<CellKey>>(new Set());

//   const [showBingo, setShowBingo] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [confettiRunId, setConfettiRunId] = useState(0);

//   const prevLineCountRef = useRef(0);
//   const timersRef = useRef<number[]>([]);
//   const retryTimerRef = useRef<number | null>(null);

//   const clearTimers = () => {
//     timersRef.current.forEach(clearTimeout);
//     timersRef.current = [];
//   };

//   const triggerBingoFx = () => {
//     setConfettiRunId((v) => v + 1);
//     setShowConfetti(true);
//     setShowBingo(true);

//     clearTimers();
//     timersRef.current.push(
//       window.setTimeout(() => {
//         setShowConfetti(false);
//         setShowBingo(false);
//       }, 5500)
//     );
//   };

//   useEffect(() => {
//     if (!socket || !token) return;

//     const requestState = () => {
//       socket.emit("request-player-state", { token });
//     };

//     const startRetryLoop = () => {
//       // si déjà une boucle, ne pas empiler
//       if (retryTimerRef.current) return;

//       retryTimerRef.current = window.setInterval(() => {
//         if (!socket.connected) return;
//         requestState();
//         if (retryTimerRef.current) {
//           clearInterval(retryTimerRef.current);
//           retryTimerRef.current = null;
//         }
//       }, 300);
//     };

//     const onConnect = () => {
//       requestState();
//     };

//     if (socket.connected) {
//       requestState();
//     } else {
//       socket.on("connect", onConnect);
//       startRetryLoop();
//     }

//     return () => {
//       socket.off("connect", onConnect);
//       if (retryTimerRef.current) {
//         clearInterval(retryTimerRef.current);
//         retryTimerRef.current = null;
//       }
//     };
//   }, [socket, token]);

//   useEffect(() => {
//     if (!socket) return;

//     const handler = (msg: ShowAction) => {
//       if (msg.type === "player-state") {
//         setNumbers(Array.isArray(msg.numbers) ? msg.numbers : []);
//         const arr = Array.isArray(msg.selected) ? msg.selected : [];
//         setSelected(new Set<CellKey>(arr as CellKey[]));
//         return;
//       }

//       if (msg.type === "reset-bingo") {
//         clearTimers();
//         prevLineCountRef.current = 0;

//         setShowBingo(false);
//         setShowConfetti(false);
//         setSelected(new Set<CellKey>());
//         setNumbers([]);

//         // redemande une nouvelle grille serveur
//         socket.emit("request-player-state", { token });
//         return;
//       }

//       // sinon on ignore (cagnotte-update, number, etc.)
//     };

//     socket.on("show-action", handler);
//     return () => {
//       socket.off("show-action", handler);
//     };
//   }, [socket, token]);

//   const completedLines = countCompletedLines(selected, rows, cols);

//   useEffect(() => {
//     if (completedLines > prevLineCountRef.current) {
//       triggerBingoFx();
//     }
//     prevLineCountRef.current = completedLines;
//   }, [completedLines]);

//   const toggleCell = (row: number, col: number) => {
//     if (!socket || !socket.connected) return;

//     const key: CellKey = `${row}-${col}`;

//     // UI optimiste
//     setSelected((prev) => {
//       const next = new Set(prev);
//       next.has(key) ? next.delete(key) : next.add(key);
//       return next;
//     });

//     socket.emit("show-action", {
//       type: "toggle-cell",
//       row,
//       col,
//       token,
//     });
//   };

//   if (numbers.length !== rows * cols) {
//     return <div className="text-white/70">Chargement…</div>;
//   }

//   return (
//     <div className="flex flex-col items-center p-4 gap-3">
//       {showConfetti && <FireSideConfetti key={confettiRunId} duration={3000} />}

//       {showBingo && (
//         <div className="rounded-lg bg-green-600 px-4 py-2 text-white font-semibold">
//           ✅ BINGO !
//         </div>
//       )}

//       <div
//         className="grid border-4 border-white/40 rounded-xl shadow-lg w-[min(600px,90vw)]"
//         style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
//       >
//         {numbers.map((num, index) => {
//           const row = Math.floor(index / cols);
//           const col = index % cols;
//           const key: CellKey = `${row}-${col}`;
//           const active = selected.has(key);
//           const isAlt = (row + col) % 2 === 0;

//           return (
//             <button
//               key={key}
//               onClick={() => toggleCell(row, col)}
//               className={`
//                 aspect-square flex items-center justify-center
//                 border border-white/30 text-lg font-semibold
//                 transition-all
//                 ${
//                   active
//                     ? "bg-green-500 scale-105"
//                     : isAlt
//                       ? "bg-[#00A6D9]"
//                       : "bg-[rgba(0,166,217,0.5)]"
//                 }
//               `}
//             >
//               {num}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

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
      }
    };

    socket.on("show-action", handler);

    // ✅ IMPORTANT : cleanup qui retourne VOID
    return () => {
      socket.off("show-action", handler);
    };
  }, [socket]);

  // 🎯 DÉTECTION BINGO
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

    // 🔥 UI OPTIMISTE (réactivité immédiate)
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
