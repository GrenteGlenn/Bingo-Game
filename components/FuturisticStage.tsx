export default function FuturisticStage() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* fond clair (sans “ligne d’horizon”) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_20%,rgba(235,250,255,0.70),rgba(160,225,245,0.30)_35%,rgba(6,30,42,0.85)_70%,#061e2a_100%)]" />

      {/* spot du haut (doux) */}
      <div
        className="absolute left-1/2 top-[-220px] h-[900px] w-[1200px] -translate-x-1/2 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(190,240,255,0.55) 26%, rgba(0,166,217,0.18) 52%, rgba(0,0,0,0) 78%)",
          clipPath: "polygon(50% 0%, 8% 100%, 92% 100%)",
          opacity: 0.9,
        }}
      />

      {/* néons obliques uniquement */}
      <AngledNeons />

      {/* bokeh discret (profondeur) */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen [background-image:radial-gradient(rgba(0,166,217,0.35)_1px,transparent_2px)] [background-size:120px_120px]" />
      <div className="absolute inset-0 opacity-12 mix-blend-screen [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_2px)] [background-size:180px_180px]" />

      {/* vignette légère */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0)_40%,rgba(0,0,0,0.22)_78%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}

function AngledNeons() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="neon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#E6F9FF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#00A6D9" stopOpacity="0.20" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#glow)">
        {/* Convergence vers ~520 au lieu de 600 */}
        {/* gauche */}
        <path d="M140 -20 L380 620" stroke="url(#neon)" strokeWidth="12" />
        <path d="M220 -20 L450 620" stroke="url(#neon)" strokeWidth="10" opacity="0.85" />
        <path d="M300 -20 L520 620" stroke="url(#neon)" strokeWidth="8" opacity="0.65" />

        {/* droite */}
        <path d="M860 -20 L620 620" stroke="url(#neon)" strokeWidth="12" />
        <path d="M780 -20 L550 620" stroke="url(#neon)" strokeWidth="10" opacity="0.85" />
        <path d="M700 -20 L480 620" stroke="url(#neon)" strokeWidth="8" opacity="0.65" />
      </g>
    </svg>
  );
}

