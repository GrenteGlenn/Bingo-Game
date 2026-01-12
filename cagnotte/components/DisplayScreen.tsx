"use client";

import { useState } from "react";
import { useShowChannel } from "@/lib/show-channel";

const ALL_NUMBERS = Array.from({ length: 50 }, (_, i) => i + 1);

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
    <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-12 px-6 py-5 ">
      <div className="flex flex-col items-center lg:items-center w-full lg:w-2/3">
        {/* Logo */}
        <img
          src="/images/BINGOENOR.png"
          alt="Bingo en Or"
          className="w-full max-w-md md:max-w-xl lg:max-w-4xl object-contain -mt-6 md:-mt-2 lg:-mt-65"
        />

        {/* QR Code */}
        <img
          src="/images/qrcode.png"
          alt="QR Code"
          className=" w-40 md:w-48 lg:w-64 object-contain -mt-12 lg:-mt-30 "
        />
      </div>

      {/* NUMÉROS */}
      <div className="flex flex-col border border-white rounded-lg px-6 md:px-12 py-3 lg:mt-3 w-full max-w-3xl ">
        <h1 className="text-2xl md:text-5xl text-white font-bold text-center mb-5"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          Numéros Tirés
        </h1>

        <div
          className="
          grid
          grid-cols-5
          sm:grid-cols-6
          md:grid-cols-8
          lg:grid-cols-7
          gap-4 md:gap-3
          justify-items-center
        
        "
        >
          {ALL_NUMBERS.map((num) => {
            const isActive = values.includes(num);

            return (
              <div
                key={num}
                className={`
                  flex items-center justify-center
                  rounded-full font-bold
                  transition-colors duration-300
                  w-12 h-12
                  sm:w-14 sm:h-14
                  md:w-16 md:h-16
                  lg:w-18 lg:h-18
                  ${isActive ? "bg-blue-600 text-white" : "bg-white text-black"}
                `}
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
