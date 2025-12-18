"use client";

import { BigPlatform } from "../../components/BigPlatform";
import FuturisticStage from "../../components/FuturisticStage";
import PixiCavans from "../../components/PixiCavans";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-black flex items-center justify-center">
      {/* Scène LED ratio 11:5 */}
      <div className="relative w-full aspect-[11/5] overflow-hidden">
        <FuturisticStage />

        {/* Centre: cagnotte + logo */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-0">
            {/* Cagnotte responsive (ne dépasse jamais la scène) */}
            <div className="w-[min(420px,32vw)]">
              <div className="aspect-[4/5] w-full">
                <PixiCavans />
              </div>
            </div>
            <div className="-mt-[11vh] md:-mt-[12vh] lg:-mt-[13vh]">
              <BigPlatform />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

//      <img
//               src="/images/RTE.png"
//               alt="RTE"
//               className="
//   -mt-[3vh]
//   md:-mt-[4vh]
//   lg:-mt-[5vh]
//   h-[15vh]
//   md:h-[22vh]
//   lg:h-[26vh]
//   w-auto
//   opacity-95
//   drop-shadow-[0_10px_40px_rgba(0,166,217,0.35)]
// "
//             />
