import DisplayScreen from "@/components/DisplayScreen";

export default function Affichage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/affichageFinal.jpg')" }}
      />

      <div className="absolute inset-0 z-10">
        <DisplayScreen />
      </div>
    </main>
  );
}
