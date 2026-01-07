import DisplayScreen from "@/components/DisplayScreen";

export default function Affichage() {
  return (
    <main className="min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/affichage.webp')" }}
      >
        <div className="absolute inset-0 z-10">
          <DisplayScreen />
        </div>
      </div>
      <div
        className="
    absolute
    top-1/2 left-4
    -translate-y-1/2
    z-10
    w-[220px]
    md:w-[280px]
    lg:w-[320px]
  "
      >
        <img src="/images/qrcode2.png" alt="" />
      </div>
    </main>
  );
}
