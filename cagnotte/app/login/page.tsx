"use client";
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

    if (!trimmed) {
      setError("Le nom est obligatoire");
      return;
    }

    if (!isValidName(trimmed)) {
      setError("Caractères autorisés : lettres, espaces et tirets");
      return;
    }
    sessionStorage.setItem("playerName", trimmed);

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
          src="/images/bingoOr.png"
          alt="Bingo en Or"
          className="h-40 md:h-48"
        />
      </div>

      {/* FORM */}
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

      <img
        src="/images/voeux.png"
        alt="Voeux RTE 2026"
        className="mt-10 w-[200px] h-auto"
      />
      <div className=" pb-4 pointer-events-none">
        <img src="/images/RTE_logo.png" alt="RTE" className="h-28 opacity-90" />
      </div>
    </div>
  );
}
