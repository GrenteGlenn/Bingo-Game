export function BigPlatform() {
  return (
    <div className="relative h-[200px] w-[980px] max-w-[96vw]">
      {/* glow au sol */}
      <div className="absolute left-1/2 top-[70px] h-20 w-[70%] -translate-x-1/2 rounded-full bg-[#00A6D9]/18 blur-3xl" />

      {/* anneau extérieur large */}
      <div
        className="absolute left-1/2 top-[40px] h-[86px] w-[78%] -translate-x-1/2 rounded-[999px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0) 55%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.35) 66%, rgba(0,166,217,0.16) 74%, rgba(0,0,0,0) 84%)",
        }}
      />

      {/* anneau intérieur */}
      <div
        className="absolute left-1/2 top-[58px] h-[56px] w-[58%] -translate-x-1/2 rounded-[999px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.22), rgba(0,166,217,0.18) 52%, rgba(0,166,217,0) 80%)",
        }}
      />
    </div>
  );
}
