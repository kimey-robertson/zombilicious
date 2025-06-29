import { useEffect, useState } from "react";
import { IoSkullOutline } from "react-icons/io5";

const XPTracker = () => {
  const xp = 10;
  const segments = Array.from({ length: 44 }, (_, i) => i);
  
  const getXPSegmentColor = (index: number) => {
    const total = 43;
    const percentage = (index / total) * 100;
    if (percentage <= 20) return "bg-blue-900";
    if (percentage <= 60) return "bg-yellow-900";
    if (percentage <= 80) return "bg-orange-900";
    return "bg-red-900";
  };

  const [pulseEffect, setPulseEffect] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 300);
    }, 3000);

    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.08) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 120);
      }
    }, 2000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(flickerInterval);
    };
  }, []);

  return (
    <div className="relative mb-6">
      {/* Blood splatter decoration */}
      <div className="absolute -top-2 left-6 w-3 h-3 bg-red-900/60 rounded-full blur-sm" />
      <div className="absolute -top-1 right-12 w-2 h-2 bg-red-800/40 rounded-full blur-sm" />
      <div className="absolute -top-3 left-1/3 w-1 h-1 bg-red-900/50 rounded-full" />

      {/* Vital signs monitor with blood theme */}
      <div className="h-12 mb-4 relative overflow-hidden bg-black/80 rounded border border-red-900/40 shadow-inner">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-15">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-red-800"
              style={{ left: `${i * 6.25}%` }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-red-800"
              style={{ top: `${i * 25}%` }}
            />
          ))}
        </div>

        <svg className="w-full h-full" viewBox="0 0 800 60">
          <defs>
            <filter id="blood-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M0,30 L100,30 L110,10 L120,50 L130,30 L200,30 L210,15 L220,45 L230,30 L300,30 L310,20 L320,40 L330,30 L400,30 L410,25 L420,35 L430,30 L500,30 L510,20 L520,40 L530,30 L600,30 L610,15 L620,45 L630,30 L700,30 L710,25 L720,35 L730,30 L800,30"
            stroke="#dc2626"
            strokeWidth="2"
            fill="none"
            filter="url(#blood-glow)"
            className={`transition-all duration-200 ${
              pulseEffect ? "opacity-100" : "opacity-70"
            } ${flicker ? "opacity-30" : ""}`}
          />
        </svg>

        {/* Scan line effect */}
        <div
          className="absolute top-0 bottom-0 w-px bg-red-400/30 animate-pulse"
          style={{ left: `${(Date.now() / 60) % 100}%` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-950/10 to-transparent" />
      </div>

      {/* XP Track with blood progression */}
      <div className="relative">
        <div className="flex h-8 rounded border-2 border-red-900/50 overflow-hidden bg-black/60 shadow-inner">
          {segments.map((num) => (
            <div
              key={num}
              className={`flex-1 border-r border-black/50 last:border-r-0 ${getXPSegmentColor(
                num
              )} ${
                num <= xp ? "opacity-100 shadow-inner" : "opacity-20"
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* Skull indicator */}
        <div
          className="absolute -top-4 transition-all duration-500 transform -translate-x-1/2"
          style={{ left: `${(xp / 43) * 100}%` }}
        >
          <IoSkullOutline
            size={18}
            className="text-red-400 drop-shadow-lg animate-pulse"
          />
        </div>

        {/* Number labels */}
        <div className="flex justify-between mt-2 text-xs font-mono text-red-300/70">
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 43].map((num) => (
            <span key={num}>{num}</span>
          ))}
        </div>
      </div>

      <div className="text-center mt-3">
        <span className="text-red-400 font-bold tracking-widest font-mono">
          SURVIVAL XP: {xp}/43
        </span>
      </div>
    </div>
  );
};

export default XPTracker;
