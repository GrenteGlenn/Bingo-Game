"use client";

import { useEffect, useState } from "react";
import { ShowMessage } from "@/lib/show";
import { useShowChannel } from "@/lib/show-channel";

import Cagnotte3D from "@/components/cagnotte3D";
import FireSideConfetti from "@/components/ConfettiSideCannons";

export default function Page() {
  const [lastMsg, setLastMsg] = useState<ShowMessage | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState<number>(0);

  useShowChannel((m: ShowMessage) => {
    if (m.type === "cagnotte-update") {
      setScore(m.points);
      return; 
    }

    setLastMsg(m);

    if (m.type === "palier" || m.type === "felicitation") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  });

  useEffect(() => {
    if (!lastMsg) return;
    const t = setTimeout(() => setLastMsg(null), 5000);
    return () => clearTimeout(t);
  }, [lastMsg]);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {showConfetti && <FireSideConfetti duration={3000} />}

      <div
        className="
        absolute top-4 right-4 z-30
        rounded-2xl bg-black/60 backdrop-blur-md
        px-4 py-2 text-white font-black
        text-lg md:text-2xl shadow-lg
      "
      >
        {score.toLocaleString()} pts
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/podium6.webp')" }}
      />

      <div className="absolute bottom-50 left-1/2 transform -translate-x-2/4 z-10">
        <img src="/images/voeux.png" alt="" />
      </div>

      <span className="absolute bottom-50 left-1/2 transform -translate-x-2/4 z-10 text-white">
        15/01/2026
      </span>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/RTE_logo.png"
          alt="RTE"
          className="h-20 md:h-24 lg:h-28 opacity-90 drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        />
      </div>

      {lastMsg && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div
              key={lastMsg.ts}
              className="
                animate-zoom-in font-black tracking-tight
                text-[10vw] md:text-[8vw] lg:text-[6vw]
                leading-none text-white
                drop-shadow-[0_18px_60px_rgba(255,255,255,0.35)]
              "
            >
              {lastMsg.type === "number" && lastMsg.value}
              {lastMsg.type === "palier" && `PALIER ${lastMsg.level}`}
              {lastMsg.type === "felicitation" && "FÉLICITATIONS"}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-[20%] left-3 z-10 w-full h-11/12">
        <Cagnotte3D />
      </div>
    </main>
  );
}
