"use client";

import { useEffect, useState } from "react";
import { subscribe, ShowMessage } from "@/lib/show-channel";

export default function DisplayScreen() {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    return subscribe((m: ShowMessage) => {
      if (m.type === "number") setValue(m.value);
      // reset-bingo: ici tu peux afficher un toast/anim si tu veux, ou ignorer
    });
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-white/70 text-sm md:text-base mb-3">
          Numéro tiré
        </div>

        <div
          className="
            font-black tracking-tight
            text-[12vw] md:text-[10vw] lg:text-[8vw]
            leading-none
            text-white
            drop-shadow-[0_18px_60px_rgba(0,166,217,0.35)]
          "
        >
          {value ?? "—"}
        </div>
      </div>
    </div>
  );
}
