"use client";
import { useEffect, useState } from "react";
import CellBingo from "../../components/cellBingo";
import { useRouter } from "next/navigation";

export default function bingo() {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedName = sessionStorage.getItem("playerName");

    if (!storedName) {
      router.push("/");
      return;
    }

    setPlayerName(storedName);
  }, [router]);

  if (!playerName) return null;
  return (
    <div
      className="
    flex flex-col items-center p-4 gap-3 min-h-screen
    bg-gradient-to-b
    from-[#00A6D9]
    via-[rgba(0,166,217,0.5)]
    to-[rgba(0,166,217,0.3)]
  "
    >
      <div>
        <img className="h-50" src="/images/bingoOr.png" alt="Bingo en Or" />
      </div>
      <div className="flex self-start flex-row">
        <span className="font-semibold mt-0.5 text-white">{playerName}</span>
      </div>
      <CellBingo />
      <div className="">
        <img
          src="/images/RTE_logo.png"
          alt="RTE"
          className="h-50 md:h-50 lg:h-50 opacity-90"
        />
      </div>
    </div>
  );
}
