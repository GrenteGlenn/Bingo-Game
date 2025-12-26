// "use client";

// import { useMemo, useState } from "react";
// import { postMessage } from "@/lib/show-channel";

// export default function ControlPanel() {
//   const nums = useMemo(() => Array.from({ length: 50 }, (_, i) => i + 1), []);
//   const [active, setActive] = useState<number | null>(null);

//   const sendNumber = (n: number) => {
//     setActive(n);
//     postMessage({ type: "number", value: n });
//   };

//   const resetBingo = () => {
//     postMessage({ type: "reset-bingo" });
//   };

//   const palier1 = () => {
//     postMessage({ type: "palier", level: 1 });
//   };

//   const palier2 = () => {
//     postMessage({ type: "palier", level: 2 });
//   };

//   const palier3 = () => {
//     postMessage({ type: "palier", level: 3 });
//   };

//   const felicitation = () => {
//     postMessage({ type: "felicitation" });
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
//       <h2 className="text-xl md:text-2xl font-semibold">Panel Cagnotte</h2>
//       <div className="grid gap-4 grid-cols-2 md:grid-cols-4 p-6">
//         <button
//           type="button"
//           onClick={palier1}
//           className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
//                        bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
//                        shadow"
//         >
//           Palier 1
//         </button>
//         <button
//           type="button"
//           onClick={palier2}
//           className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
//                        bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
//                        shadow"
//         >
//           Palier 2
//         </button>
//         <button
//           type="button"
//           onClick={palier3}
//           className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
//                        bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
//                        shadow"
//         >
//           Palier 3
//         </button>
//         <button
//           type="button"
//           onClick={felicitation}
//           className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
//                        bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
//                        shadow"
//         >
//           Félicitation
//         </button>
//       </div>

//       <div className="flex flex-col gap-4 md:gap-6">
//         <div className="flex items-center justify-between gap-3 flex-wrap">
//           <h2 className="text-xl md:text-2xl font-semibold">
//             Panel – Nombres (1–50)
//           </h2>

//           <button
//             type="button"
//             onClick={resetBingo}
//             className="rounded-xl px-4 py-2 text-sm md:text-base font-semibold
//                        bg-red-600 text-white hover:bg-red-500 active:scale-[0.99]
//                        shadow"
//           >
//             Reset grilles Bingo
//           </button>
//         </div>

//         <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
//           <div
//             className="
//               grid gap-2
//               grid-cols-5
//               sm:grid-cols-8
//               md:grid-cols-10
//             "
//           >
//             {nums.map((n) => {
//               const isActive = n === active;
//               return (
//                 <button
//                   key={n}
//                   type="button"
//                   onClick={() => sendNumber(n)}
//                   className={`
//                     aspect-square rounded-xl font-bold
//                     text-sm sm:text-base md:text-lg
//                     transition
//                     ${
//                       isActive
//                         ? "bg-[#00A6D9] text-white shadow-[0_0_30px_rgba(0,166,217,0.45)]"
//                         : "bg-white/90 hover:bg-white text-slate-900"
//                     }
//                   `}
//                 >
//                   {n}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="mt-4 text-sm text-white/70">
//             Dernier numéro envoyé :{" "}
//             <span className="font-semibold text-white">{active ?? "—"}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { getSocket } from "@/lib/socket";
import { useEffect, useRef } from "react";

// import { ShowMessage } from "@/types/show";


export default function ControlPanel() {
    const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

    useEffect(() => {
    socketRef.current = getSocket();
  }, []);

  const sendNumber = (value: number) => {
    socketRef.current?.emit("show-action", { type: "number", value });
  };
  const resetBingo = () => {
    socketRef.current?.emit("show-action", { type: "reset-bingo" });
  };
  const sendPalier = (level: 1 | 2 | 3) => {
    socketRef.current?.emit("show-action", { type: "palier", level });
  };
  const feliciter = () => {
    socketRef.current?.emit("show-action", { type: "felicitation" });
  };
  return (
    <div className="p-4 flex flex-col gap-4">
      {" "}
      <div className="grid grid-cols-5 gap-2">
        {" "}
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            onClick={() => sendNumber(i + 1)}
            className="bg-blue-600 hover:bg-blue-700 rounded p-2"
          >
            {" "}
            {i + 1}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      <button onClick={resetBingo} className="bg-red-600 p-2 rounded">
        {" "}
        Reset Bingo{" "}
      </button>{" "}
      <div className="flex gap-2">
        {" "}
        <button
          onClick={() => sendPalier(1)}
          className="bg-yellow-500 p-2 rounded"
        >
          {" "}
          Palier 1{" "}
        </button>{" "}
        <button
          onClick={() => sendPalier(2)}
          className="bg-orange-500 p-2 rounded"
        >
          {" "}
          Palier 2{" "}
        </button>{" "}
        <button
          onClick={() => sendPalier(3)}
          className="bg-red-500 p-2 rounded"
        >
          {" "}
          Palier 3{" "}
        </button>{" "}
      </div>{" "}
      <button onClick={feliciter} className="bg-green-600 p-2 rounded">
        {" "}
        Félicitations 🎉{" "}
      </button>{" "}
    </div>
  );
}
