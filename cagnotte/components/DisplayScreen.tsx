"use client";

import { useEffect, useState } from "react";
import { subscribe,  } from "@/lib/show-channel";
import { ShowMessage } from "@/lib/show";

export default function DisplayScreen() {
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    return subscribe((m: ShowMessage) => {
      if (m.type === "number") {
        setValues((prev) => {
          if (prev.includes(m.value)) return prev;
          return [...prev, m.value];
        });
      }

      if (m.type === "reset-bingo") {
        setValues([]);
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/bingoOr.png"
          alt=""
          className="h-auto w-[80%] max-w-md"
        />
      </div>

      <div className="text-center w-full max-w-7xl">
        <div className="text-white text-lg md:text-3xl mt-2 mb-2">
          Numéros tirés
        </div>

        <div className="grid gap-[2px] grid-cols-6 md:grid-cols-8 lg:grid-cols-10 justify-items-center">
          {values.map((num) => (
            <div
              key={num}
              className="
          w-10 h-10 md:w-14 md:h-14
          flex items-center justify-center
          rounded-full
          bg-[#00A6D9]
          text-white
          font-black
          text-base md:text-lg
          shadow-md
        "
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
