"use client";

import { socket } from "@/lib/socket";
// import { ShowMessage } from "@/types/show";

export default function ControlPanel() {
  const sendNumber = (value: number) => {
    socket.emit("show-action", {
      type: "number",
      value,
    });
  };

  const resetBingo = () => {
    socket.emit("show-action", {
      type: "reset-bingo",
    });
  };

  const sendPalier = (level: 1 | 2 | 3) => {
    socket.emit("show-action", {
      type: "palier",
      level,
    });
  };

  const feliciter = () => {
    socket.emit("show-action", {
      type: "felicitation",
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            onClick={() => sendNumber(i + 1)}
            className="bg-blue-600 hover:bg-blue-700 rounded p-2"
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button onClick={resetBingo} className="bg-red-600 p-2 rounded">
        Reset Bingo
      </button>

      <div className="flex gap-2">
        <button onClick={() => sendPalier(1)} className="bg-yellow-500 p-2 rounded">
          Palier 1
        </button>
        <button onClick={() => sendPalier(2)} className="bg-orange-500 p-2 rounded">
          Palier 2
        </button>
        <button onClick={() => sendPalier(3)} className="bg-red-500 p-2 rounded">
          Palier 3
        </button>
      </div>

      <button onClick={feliciter} className="bg-green-600 p-2 rounded">
        Félicitations 🎉
      </button>
    </div>
  );
}
