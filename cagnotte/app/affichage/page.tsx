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
