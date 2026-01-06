"use client";

import { useState } from "react";
import { useShowChannel } from "@/lib/show-channel";

export default function DisplayScreen() {
  const [values, setValues] = useState<number[]>([]);

  useShowChannel((m) => {
    if (m.type === "number") {
      setValues((prev) => (prev.includes(m.value) ? prev : [...prev, m.value]));
    }

    if (m.type === "reset-bingo") {
      setValues([]);
    }
  });

  return (
    <div className="w-full  flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        <div>
          <img
            className="h-50 mx-auto"
            src="/images/bingoOr.png"
            alt="Bingo en Or"
          />
        </div>

        <div className="text-white text-lg md:text-3xl font-semibold text-center mb-6 mt-10">
          Numéros tirés
        </div>

        <div className="rounded-2xl  p-3 md:p-4">
          <div className="grid gap-2 grid-cols-5 sm:grid-cols-8 md:grid-cols-10">
            {[...values]
              .sort((a, b) => a - b)
              .map((num) => (
                <div
                  key={num}
                  className="
        flex items-center justify-center
        rounded-xl
        font-bold
        text-4xl sm:text-4xl md:text-5xl lg:text-6xl
        text-white
      "
                >
                  {num}
                </div>
              ))}
          </div>
        </div>
      </div>
   
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/RTE_logo.png"
          alt="RTE"
          className="
          h-20 md:h-24 lg:h-28
          opacity-90
          drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]
          "
        />
      </div>
    </div>
  );
}
