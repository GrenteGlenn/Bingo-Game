import DisplayScreen from "@/components/DisplayScreen";
import FuturisticStage from "@/components/FuturisticStage";

export default function Affichage() {
  return (
    <main className="min-h-screen w-full bg-black">
      <div className="relative w-full aspect-[11/5] overflow-hidden">
        <FuturisticStage />
        <div className="absolute inset-0 z-10">
          <DisplayScreen />
        </div>
      </div>
    </main>
  );
}
