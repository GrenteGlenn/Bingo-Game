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
    <div className="relative w-full flex justify-center p-6">
      {/* CONTENEUR CENTRAL */}
      <div className="w-full max-w-7xl">
        {/* LOGOS HAUT */}
        <div className="flex justify-center gap-6 mb-4">
          <img
            className="h-28 md:h-32 lg:h-36"
            src="/images/bingoOr3.png"
            alt="Bingo en Or"
          />
          <img
            className="h-28 md:h-32 lg:h-36"
            src="/images/bingoOr4.png"
            alt="Bingo en Or"
          />
        </div>

        {/* QR CODE (zone réservée à gauche) */}
        <div
          className="
            absolute
            top-[22%]
            left-4
            z-20
            w-[160px]
            sm:w-[200px]
            md:w-[240px]
            lg:w-[280px]
          "
        >
          <img src="/images/qrcode2.png" alt="QR Code" />
        </div>

        {/* TITRE */}
        <div
          className="text-white text-lg md:text-3xl font-semibold text-center mt-6 mb-8"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Numéros tirés
        </div>

        {/* ZONE NUMÉROS (padding à gauche = place du QR) */}
        <div
          className="
            rounded-2xl
            p-3 md:p-4
            pl-[180px]
            sm:pl-[220px]
            md:pl-[260px]
            lg:pl-[300px]
          "
        >
          <div className="grid gap-3 grid-cols-5 sm:grid-cols-8 md:grid-cols-10 mx-auto">
            {values.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className="flex items-center justify-center font-bold text-white"
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "clamp(1.6rem, 3.5vw, 5.5rem)",
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="
    fixed
    bottom-6
    left-1/2
    -translate-x-1/2
    z-10
    pointer-events-none
  "
      >
        <img
          src="/images/RTE.png"
          alt="RTE"
          className="h-48 md:h-64 lg:h-72 opacity-90"
        />
      </div>
    </div>
  );
}
