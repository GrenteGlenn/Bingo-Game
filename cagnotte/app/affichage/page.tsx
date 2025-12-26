import DisplayScreen from "@/components/DisplayScreen";

export default function Affichage() {
  return (
    <main className="min-h-screen w-full">
      <div  className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/podium6.webp')" }}>
        <div className="absolute inset-0 z-10">
          <DisplayScreen />
        </div>
      </div>
       <div className="absolute bottom-60 left-1/2 transform -translate-x-2/4 z-10">
        <img src="/images/voeux.png" alt="" />
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/RTE_logo.png"
          alt="RTE"
          className="
          h-20 md:h-24 lg:h-28
          opacity-90
          drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]
          "
        />
      </div>
    </main>
  );
}
