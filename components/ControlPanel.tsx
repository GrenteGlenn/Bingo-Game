"use client";

import { useMemo, useState } from "react";
import { postMessage } from "@/lib/show-channel";

export default function ControlPanel() {
  const nums = useMemo(() => Array.from({ length: 50 }, (_, i) => i + 1), []);
  const [active, setActive] = useState<number | null>(null);

  const sendNumber = (n: number) => {
    setActive(n);
    postMessage({ type: "number", value: n });
  };

  const resetBingo = () => {
    postMessage({ type: "reset-bingo" });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl md:text-2xl font-semibold">
            Panel – Nombres (1–50)
          </h2>

          <button
            type="button"
            onClick={resetBingo}
            className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
                       bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
                       shadow"
          >
            Reset grilles Bingo
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
          <div
            className="
              grid gap-2
              grid-cols-5
              sm:grid-cols-8
              md:grid-cols-10
            "
          >
            {nums.map((n) => {
              const isActive = n === active;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => sendNumber(n)}
                  className={`
                    aspect-square rounded-xl font-bold
                    text-sm sm:text-base md:text-lg
                    transition
                    ${isActive
                      ? "bg-[#00A6D9] text-white shadow-[0_0_30px_rgba(0,166,217,0.45)]"
                      : "bg-white/90 hover:bg-white text-slate-900"}
                  `}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-white/70">
            Dernier numéro envoyé :{" "}
            <span className="font-semibold text-white">{active ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
