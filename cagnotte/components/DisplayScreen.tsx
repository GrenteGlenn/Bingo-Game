"use client";

import { useState } from "react";
import { useShowChannel } from "@/lib/show-channel";

export default function DisplayScreen() {
  const [values, setValues] = useState<number[]>([]);

  useShowChannel((m) => {
    console.log("📺 DisplayScreen reçoit :", m);

    if (m.type === "number") {
      setValues((prev) =>
        prev.includes(m.value) ? prev : [...prev, m.value]
      );
    }

    if (m.type === "reset-bingo") {
      setValues([]);
    }
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="text-center w-full max-w-7xl">
        <div className="text-white text-lg md:text-3xl mt-2 mb-2">
          Numéros tirés
        </div>

        <div className="grid gap-[2px] grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {values.map((num) => (
            <div
              key={num}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00A6D9] text-white font-black"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
