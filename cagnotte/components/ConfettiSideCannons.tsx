// components/ConfettiSideCannons.tsx
"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function FireSideConfetti({ duration = 3000 }: { duration?: number }) {
  useEffect(() => {
    const end = Date.now() + duration;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [duration]);

  return null;
}
