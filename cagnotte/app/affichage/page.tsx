import DisplayScreen from "@/components/DisplayScreen";

export default function Affichage() {
  return (
    <main className="min-h-screen w-full">
      
      <div  className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/affichage.webp')" }}>
        <div className="absolute inset-0 z-10">
          <DisplayScreen />
        </div>
      </div>
      
    </main>
  );
}
