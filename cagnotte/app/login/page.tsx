"use client";
import { getPlayerToken } from "@/lib/playerToken";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isValidName = (value: string) => /^[a-zA-ZÀ-ÿ\s-]+$/.test(value.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed || !isValidName(trimmed)) return;

    sessionStorage.setItem("playerName", trimmed);

    getPlayerToken();

    router.push("/bingo");
  };
  return (
    <div
      className="
    min-h-screen w-full
    flex flex-col items-center
    px-4 py-8
    bg-gradient-to-b
    from-[#00A6D9]
    via-[rgba(0,166,217,0.5)]
    to-[rgba(0,166,217,0.3)]
  "
    >
      <div className="mt-6 mb-6">
        <img
          className="h-64 md:h-64 lg:h-84"
          src="/images/BINGOENOR.png"
          alt="Bingo en Or"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs sm:max-w-sm flex flex-col gap-4"
      >
        <label className="text-white font-medium font-sans">
          Nom <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Votre nom"
          required
          className="
      w-full p-3 rounded-lg
      border border-white/30
      bg-white/90 text-slate-900
      focus:outline-none focus:ring-2 focus:ring-[#00A6D9]
      font-sans
    "
        />

        {error && <div className="text-red-200 text-sm">{error}</div>}

        <button
          type="submit"
          className="
      mt-2 bg-white/90 hover:bg-white
      text-slate-900 rounded-xl
      px-4 py-3 text-base
      font-semibold shadow transition
      font-sans
    "
        >
          Commencer
        </button>
      </form>

      <div className="relative mt-36 pb-4 pointer-events-none flex flex-col items-center">
        <div
          className="
      absolute
      -top-10
      left-1/2
      -translate-x-1/2
      text-black
      text-4xl
      md:text-3xl
      font-semibold
      z-10
      text-center
      whitespace-nowrap
    "
        >
          VOEUX WINDOW 2026
        </div>

      
        <img
          src="/images/RTE.png"
          alt="RTE"
          className="h-50 md:h-72 lg:h-70 opacity-90"
        />
      </div>
    </div>
  );
}
