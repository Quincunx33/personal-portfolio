import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2400); // Reduced to 2.4s for snappier feel
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Handle subtle background mouse spotlight effect
  useEffect(() => {
    const handleInitialPosition = () => {
      setMousePos({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };
    handleInitialPosition();
    window.addEventListener("resize", handleInitialPosition);
    return () => window.removeEventListener("resize", handleInitialPosition);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setHasMoved(true);
  };

  // Generate gorgeous organic drifting particles
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5, // 1.5px to 4.5px
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      delay: Math.random() * 2.5,
      duration: Math.random() * 5 + 6, // 6s to 11s
    }))
  );

  const words1 = ["before", "I", "die,"];
  const words2 = ["will", "anyone", "cry??"];

  return (
    <motion.div
      id="loading-screen-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040711] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic light lens background */}
      <motion.div
        id="loading-spotlight"
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity duration-1000 blur-[130px]"
        style={{
          background: hasMoved
            ? `radial-gradient(circle 350px at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.12), rgba(99, 102, 241, 0.08), transparent)`
            : `radial-gradient(circle 450px at 50% 50%, rgba(239, 68, 68, 0.1), rgba(99, 102, 241, 0.06), transparent)`,
        }}
      />

      {/* Atmospheric organic dust/ember particles */}
      <div id="particles-container" className="absolute inset-0 pointer-events-none overflow-hidden z-1">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            id={`particle-${p.id}`}
            className="absolute rounded-full bg-gradient-to-b from-rose-200/35 to-indigo-300/10 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -140],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Center content wrapper */}
      <div id="loading-content-card" className="relative z-10 flex flex-col items-center max-w-lg px-6">
        {/* Aesthetic tiny indicator node */}
        <motion.div
          id="loading-indicator-node"
          className="w-1.5 h-1.5 bg-rose-500/80 rounded-full mb-10 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
        />

        {/* Emotion-driven Quote - Line 1 */}
        <div id="quote-line-1" className="flex flex-wrap justify-center gap-x-3 md:gap-x-5 mb-4 md:mb-6">
          {words1.map((word, idx) => (
            <motion.span
              key={idx}
              id={`quote-word-l1-${idx}`}
              initial={{ opacity: 0, y: 25, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                delay: idx * 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.05,
                color: "#ffffff",
                textShadow: "0 0 20px rgba(255, 255, 255, 0.85), 0 0 50px rgba(99, 102, 241, 0.4)",
              }}
              className="font-serif italic text-4xl md:text-5xl lg:text-6.5xl text-slate-200/95 font-light cursor-default transition-all duration-300 select-none pb-1"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Emotion-driven Quote - Line 2 */}
        <div id="quote-line-2" className="flex flex-wrap justify-center gap-x-3 md:gap-x-5">
          {words2.map((word, idx) => (
            <motion.span
              key={idx}
              id={`quote-word-l2-${idx}`}
              initial={{ opacity: 0, y: 25, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                delay: 1.0 + idx * 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.05,
                color: "#fecdd3",
                textShadow: "0 0 22px rgba(244, 63, 94, 0.9), 0 0 50px rgba(99, 102, 241, 0.45)",
              }}
              className="font-serif italic text-4xl md:text-5xl lg:text-6.5xl text-rose-300/80 font-light cursor-default transition-all duration-300 select-none pb-1"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Minimalist Progress Loader */}
        <motion.div
          id="loading-progress-wrapper"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1.2 }}
          className="flex flex-col items-center mt-12 md:mt-16 w-full"
        >
          {/* Progress bar container */}
          <div id="loading-bar-track" className="w-56 md:w-64 h-[2px] bg-slate-950/90 relative rounded-full overflow-hidden border border-slate-800/40">
            <motion.div
              id="loading-bar-fill"
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-violet-600 via-rose-500 to-amber-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </div>

          {/* Subtext info */}
          <div id="loading-subtext" className="flex items-center gap-2 mt-4 text-slate-500/85 font-mono text-[9px] tracking-[0.25em] uppercase">
            <motion.span
              animate={{
                opacity: [0.35, 0.95, 0.35],
                scale: [0.97, 1.03, 0.97],
                textShadow: [
                  "0 0 0px rgba(244, 63, 94, 0)",
                  "0 0 10px rgba(244, 63, 94, 0.4)",
                  "0 0 0px rgba(244, 63, 94, 0)"
                ],
                color: ["#94a3b8", "#fecdd3", "#94a3b8"]
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              connecting subconscious...
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Clean, minimalist skip shortcut */}
      <motion.button
        id="skip-loading-button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.8, color: "#fca5a5" }}
        transition={{ delay: 2.8, duration: 0.8 }}
        onClick={onComplete}
        className="absolute bottom-6 font-mono text-[10px] tracking-widest text-slate-500 pointer-events-auto cursor-pointer focus:outline-none"
      >
        [ click to pass ]
      </motion.button>
    </motion.div>
  );
}
