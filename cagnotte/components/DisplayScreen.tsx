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
    <div className="relative w-full flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex justify-center">
          <img
            className="h-64 md:h-64 lg:h-80"
            src="/images/BINGOENOR.png"
            alt="Bingo en Or"
          />
        </div>

        <div
          className="
            absolute
            top-[5%]
            left-2
            z-20
            w-[160px]
            sm:w-[200px]
            md:w-[240px]
            lg:w-[250px]
          "
        >
          <img src="/images/qrcode2.png" alt="QR Code" />
        </div>

        <div
          className="
            rounded-2xl
            p-3 md:p-2
            pl-[100px]
            sm:pl-[200px]
            md:pl-[200px]
            lg:pl-[50px]
          "
        >
          <div className="grid gap-6 grid-cols-5 sm:grid-cols-8 md:grid-cols-10 ">
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
    </div>
  );
}
