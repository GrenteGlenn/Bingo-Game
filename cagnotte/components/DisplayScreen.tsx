"use client";

import { useState } from "react";
import { useShowChannel } from "@/lib/show-channel";

const ALL_NUMBERS = Array.from({ length: 50 }, (_, i) => i + 1);

export default function DisplayScreen() {
  const [values, setValues] = useState<number[]>([]);

  useShowChannel((m) => {
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
    <div className="relative w-full min-h-screen px-6">
      {/* LOGO */}
       <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full flex justify-center">
       <img
          src="/images/BINGOENOR.png"
          alt="Bingo en Or"
          className="
             w-24
            sm:w-28
            md:w-36
            lg:w-84
            object-contain
          "
        />
      </div>

      {/* NUMÉROS */}
      <div className="absolute inset-0 flex left-80 items-center justify-center px-24">
        <div className="flex flex-col border border-white rounded-lg px-6 md:px-0 py-2 w-full max-w-8xl bg-transparent">
          <div
            className="
              grid
              grid-cols-
              sm:grid-cols-6
              md:grid-cols-8
              lg:grid-cols-9
              gap-4 md:gap-5
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
                    rounded-full p-12 font-bold
                    transition-colors duration-300
                    w-12 h-12
                    sm:w-14 sm:h-14
                    md:w-16 md:h-16
                    lg:w-18 lg:h-18
                    text-xl md:text-6xl
                    ${
                      isActive
                        ? "bg-[#00A6D9] text-white"
                        : "bg-white text-black"
                    }
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

      {/* QR CODE */}
      <div className="absolute top-20 left-4">
        <img
          src="/images/qrcode.png"
          alt="QR Code"
          className="
            w-24
            sm:w-28
            md:w-36
            lg:w-84
            object-contain
          "
        />
         
      </div>
     
    </div>
  );
}
