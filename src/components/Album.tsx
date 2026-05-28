import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, AlertTriangle, Sparkles, Award, RotateCcw, Volume2, TreePine } from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";

export default function Album() {
  const { user } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTroll, setShowTroll] = useState(false);
  
  // Touch grass game states
  const [grassCount, setGrassCount] = useState(0);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [floatingPops, setFloatingPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Dynamic status messages based on grass touch count
  const getMotivationalMessage = () => {
    if (grassCount === 0) return "PROVE YOU ARE A SANE MEMBER OF THE COGNITIVE ORDER. TOUCH REAL GRASS.";
    if (grassCount < 5) return "Your fingertips graze the surface of physical earth. Keep going...";
    if (grassCount < 15) return "Dew of morning detected. You remember that light exists outside your dark theme editor.";
    if (grassCount < 30) return "div centering obsession level decreased by 40%. Human sanity returning...";
    if (grassCount < 50) return " Blip... Blip... Synapses firing normal coordinates. Almost conforming.";
    return "CONFORMITY PROTOCOL COMPLETE! YOU ARE CERTIFIED AS AN APPROVED SYSTEM SURVIVOR.";
  };

  // Synthesize custom sound mathematically using Web Audio API on gesture click
  const playGrassPluck = (pitchFactor = 1) => {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Fun organic pluck sound: sudden pluck decay with slight sine pitch slide
      const baseFreq = 180 + pitchFactor * 12;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio context blocked
    }
  };

  const handleOpenAlbum = () => {
    setIsOpen(true);
    setIsLoading(true);
    setShowTroll(false);
    setGrassCount(0);

    setTimeout(() => {
      setIsLoading(false);
      setShowTroll(true);
    }, 10000); // 10 seconds load
  };

  const handleTouchGrass = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (grassCount >= 50) return;
    
    // Synthesize organic note pitch variance depending on cell index
    playGrassPluck(idx);
    
    // Random humor pop messages
    const pops = [
      "Dewdrops! 💦", "Photosynthesis! ☀️", "Fresh Air! 🍃", "No Git conflicts! 🕊️", 
      "Sane vibes 🌾", "Center div solved! ✨", "Uncaught Grass Touched 🌿", "StackOverflow who? 🕵️‍♀️"
    ];
    const randomPopText = pops[Math.floor(Math.random() * pops.length)];
    
    // Float element placement coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    
    setGrassCount(prev => prev + 1);
    setActiveCell(idx);
    
    const newPop = {
      id: Date.now(),
      x,
      y,
      text: randomPopText
    };
    
    setFloatingPops(prev => [...prev].slice(-15).concat(newPop)); // clamp to avoid overpop
    
    setTimeout(() => {
      setActiveCell(null);
    }, 150);
  };

  const resetGame = () => {
    setGrassCount(0);
    setFloatingPops([]);
  };

  // Safe username retrieval
  const citizenName = user?.displayName || "Dumb Citizen 🤡";

  return (
    <section id="album" className="py-24 px-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl font-bold text-slate-200 flex items-center">
          <span className="text-emerald-500 font-mono text-xl mr-2">03.</span>
          Private Archive
        </h2>
        <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
      </div>
      
      <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-8 font-mono">
        An encrypted, super-secure database vault containing private, highly credentialed citizen data coordinates.
      </p>

      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-10 md:p-12 text-center min-h-[460px] w-full flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        
        {/* Futuristic lock/mesh screen bg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(16,185,129,0.02))] pointer-events-none" />
        
        {!isOpen ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAlbum}
            className="flex flex-col items-center gap-4 group cursor-pointer relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-slate-950 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all relative">
              <Folder size={40} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#f42a41] border-2 border-slate-950 animate-ping" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#f42a41] border-2 border-slate-950" />
            </div>
            <p className="font-mono text-xs text-slate-500 group-hover:text-emerald-400 font-extrabold tracking-widest uppercase transition-colors">Decrypt Core Archive</p>
          </motion.button>
        ) : (
          <AnimatePresence mode="wait">
            
            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 relative z-10"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                  <Folder size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500 animate-pulse" />
                </div>
                
                <div className="font-mono text-emerald-400 text-xs tracking-widest uppercase flex flex-col gap-2">
                  <span className="font-black text-md">DECRYPTING ARCHIVE PARTITIONS...</span>
                  <div className="w-56 h-1.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden mt-1 mx-auto">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 10, ease: "linear" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                  <span className="animate-pulse opacity-50 mt-1 uppercase text-[9px] text-[#8b919a]">bypass secure handshake (ETA: ~10s)</span>
                </div>
              </motion.div>
            )}

            {showTroll && (
              <motion.div 
                key="troll"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="flex flex-col items-center gap-6 w-full max-w-xl relative z-10"
              >
                {/* Visual Alarm HUD Header */}
                <div className="flex items-center gap-2 border border-rose-500/20 bg-rose-500/5 px-4 py-2 rounded-full mb-2">
                  <AlertTriangle size={15} className="text-[#f42a41] animate-bounce shrink-0" />
                  <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest">PERVERT DETECTED // PROTOCOL INTERLOCK</span>
                </div>

                <div className="text-center font-sans">
                  <h3 className="text-2xl sm:text-3xl md:text-4.5xl font-black uppercase text-slate-200 tracking-tight leading-none mb-1.5 flex items-center justify-center gap-2">
                    Why are you here?! 🤡
                  </h3>
                  <p className="font-mono text-slate-400 text-xs leading-normal">
                    This decrypted sector triggers structural accountability. You must conform and balance your bio-rhythm.
                  </p>
                </div>

                {/* THE GAME AREA COMPONENT */}
                <div className="w-full bg-slate-950 border border-slate-850 rounded-3xl p-5 md:p-6 mt-2 relative select-none">
                  
                  {/* Top Game controls */}
                  <div className="flex items-center justify-between text-[9px] font-mono tracking-wider text-slate-500 mb-4 border-b border-slate-850 pb-2.5">
                    <span className="uppercase text-slate-400 font-extrabold flex items-center gap-1">
                      <TreePine size={11} className="text-emerald-500" /> Virtual pasture grass touched:
                    </span>
                    <span className="text-emerald-400 font-black text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {grassCount} / 50
                    </span>
                    
                    <button 
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                      className="hover:text-slate-300 font-bold transition-all p-1 hover:bg-slate-900 rounded opacity-80"
                      title="Toggle sound trigger"
                    >
                      <Volume2 size={13} className={isAudioEnabled ? "text-emerald-500" : "text-slate-600 line-through"} />
                    </button>
                  </div>

                  {grassCount < 50 ? (
                    <>
                      {/* Pasture Grid - 4x5 layout containing organic, randomized assets of emojis */}
                      <div className="grid grid-cols-5 gap-3.5 justify-center max-w-[360px] mx-auto py-3">
                        {Array(15).fill(0).map((_, idx) => {
                          const grassTypes = ["🌱", "🌿", "🍀", "🌾", "☘️"];
                          const emoji = grassTypes[(idx * 3 + 1) % grassTypes.length];
                          
                          return (
                            <motion.button
                              key={idx}
                              type="button"
                              onClick={(e) => handleTouchGrass(idx, e)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              className={`aspect-square w-full rounded-2xl border flex items-center justify-center text-2xl relative shadow-md transition-all cursor-pointer select-none origin-center ${activeCell === idx ? 'bg-emerald-500/30 border-emerald-400' : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'}`}
                            >
                              {emoji}
                              {activeCell === idx && (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0.5 }}
                                  animate={{ scale: 1.4, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute inset-0 rounded-2xl bg-emerald-500/20"
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Floating words indicators */}
                      {floatingPops.map((pop) => (
                        <motion.div
                          key={pop.id}
                          initial={{ opacity: 1, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -45, scale: 1.1 }}
                          transition={{ duration: 0.85, ease: "easeOut" }}
                          className="absolute pointer-events-none font-mono font-black text-[#58a6ff] text-[9.5px] uppercase tracking-wider backdrop-blur-xs bg-slate-950/80 border border-slate-850 px-1.5 py-0.5 rounded shadow z-40 select-none"
                          style={{ left: `${pop.x}px`, top: `${pop.y}px` }}
                        >
                          {pop.text}
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    /* 50+ TOUCHES CONFORMITY CERTIFICATE STAMP */
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-950 border-2 border-yellow-500/20 p-5 rounded-2xl flex flex-col items-center gap-3 relative relative overflow-hidden"
                    >
                      <div className="absolute top-[-10px] right-[-10px] scale-150 rotate-12 opacity-[0.03] text-yellow-400 font-extrabold select-none">
                        APPROVED
                      </div>

                      <div className="w-12 h-12 rounded-full border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center text-yellow-400 animate-pulse">
                        <Award size={24} />
                      </div>

                      <div className="space-y-1 font-sans text-center">
                        <h4 className="text-xs font-mono font-black tracking-widest text-[#ca8a04] uppercase">PEOPLE'S REPUBLIC OF DUMBLAND</h4>
                        <p className="text-[9px] font-mono tracking-widest uppercase text-slate-500 mb-1">CONFORMITY CERTIFICATE STAMP</p>
                        
                        <div className="h-0.5 w-full bg-slate-800"></div>
                        
                        <div className="pt-2 text-slate-300 font-serif leading-relaxed text-xs">
                          This hereby validates that <span className="font-sans font-black text-white hover:text-emerald-400 transition-colors uppercase select-all px-1 bg-white/5 border border-white/5 rounded">{citizenName}</span> has fulfilled all bio-harmony criteria by successfully conducting and logging a minimum of <strong>50 virtual lawn grass intersections</strong> in private sandbox partitions.
                        </div>

                        <p className="text-[10px] italic font-mono text-slate-400 pt-3 flex items-center justify-center gap-1.5">
                          Signed, Sovereign Queen: Tasfiya Tabassum
                        </p>
                      </div>

                      <div className="flex gap-2 w-full mt-4 border-t border-slate-850 pt-3">
                        <button
                          onClick={resetGame}
                          className="flex-1 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-md text-[9px] uppercase font-black text-slate-400 tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={10} /> Reset pasture
                        </button>
                        <a
                          href="https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=1200"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all rounded-md text-[9px] uppercase font-black tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={11} /> Real grass photo
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Motivational Text Prompter */}
                  <div className="mt-4 text-[9.5px] font-mono leading-none text-[#8b949e]">
                    STATUS: <span className="text-slate-330 font-bold uppercase select-none">{getMotivationalMessage()}</span>
                  </div>
                </div>

                {/* Reset entire album view */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8b919a] hover:text-[#f42a41] transition-colors cursor-pointer"
                >
                  Encrypt partitions & collapse
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
