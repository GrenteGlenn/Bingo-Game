import DisplayScreen from "@/components/DisplayScreen";

export default function Affichage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/affichage.png')" }}
      />

      <div className="absolute inset-0 z-10">
        <DisplayScreen />
      </div>

      <div
        className="
          absolute
          top-1/2 left-4
          -translate-y-1/2
          z-20
          w-[220px]
          md:w-[280px]
          lg:w-[300px]
        "
      >
        <img src="/images/qrcode2.png" alt="QR Code" />
      </div>

      <footer
        className="
          fixed bottom-0 left-0
          w-full
          h-[100px] md:h-[100px] lg:h-[100px]
          z-30
          pointer-events-none
        "
      >
        <img
          src="/images/footer.png"
          alt="Footer"
          className="w-full h-full object-cover"
        />
      </footer>
    </main>
  );
}
