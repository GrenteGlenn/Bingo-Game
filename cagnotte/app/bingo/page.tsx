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
      <div >
        <img
          className="h-20 mx-auto"
          src="/images/bingoOr3.png"
          alt="Bingo en Or"
        />
      </div>
      <div>
        <img
          className="h-20 mx-auto mb-10"
          src="/images/bingoOr4.png"
          alt="Bingo en Or"
        />
      </div>
      <div className="flex self-start flex-row">
        <span className="font-semibold mt-0.5 text-white">{playerName}</span>
      </div>
      <CellBingo />
      <div className="h-1/2">
        <img
          src="/images/RTE.png"
          alt="RTE"
          className="h-full md:h-80 lg:h-80 opacity-90"
        />
      </div>
    </div>
  );
}
