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
        <div className="flex ">
          <img
            className="h-30 mx-auto"
            src="/images/bingoOr3.png"
            alt="Bingo en Or"
          />
          <img
            className="h-30 mx-auto"
            src="/images/bingoOr4.png"
            alt="Bingo en Or"
          />
        </div>

        <div
          className="text-white text-lg md:text-3xl font-semibold text-center  mt-10 mb-10"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Numéros tirés
        </div>

        <div className="rounded-2xl p-3 md:p-4 ">
          <div className="grid gap-6 grid-cols-5 sm:grid-cols-8 md:grid-cols-10">
            {values.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className="flex items-center justify-center font-bold text-white"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "clamp(1.6rem, 4.5vw, 5.5rem)",
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/RTE.png"
          alt="RTE"
          className="
          h-80 md:h-80 lg:h-60
          opacity-90
          "
        />
      </div>
    </div>
  );
}
