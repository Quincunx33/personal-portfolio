import profilePic from "../assets/IMG_5197.jpeg";
import React, { useState } from "react";
import { Facebook, Github, Instagram, Fingerprint, Info, ShieldCheck, Zap, Scan, Cpu, CheckCircle } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "motion/react";
import { useMock } from "../App";
import SecureImage from "./SecureImage";

export default function DumbCard() {
  const { openApp } = useMock();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "AUTHORIZED" | "DECRYPTING">("IDLE");

  // States for interactive timeline and hover tilt parallax
  const cardControls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // Hover Tilt Parallax states
  const [rotateX, setRotateX] = useState(0);
  const [rotateYVal, setRotateYVal] = useState(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Keep it subtle: max 10 degrees tilt
    const rawX = (centerY - y) / 12;
    const rawY = (x - centerX) / 14;
    setRotateX(rawX);
    setRotateYVal(isFlipped ? -rawY : rawY);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setRotateX(0);
    setRotateYVal(0);
  };

  const handleSocialClick = (e: React.MouseEvent, app: "fb" | "ig" | "github") => {
    e.stopPropagation();
    openApp(app);
  };

  // High-performance biometric security flip timeline (Aggressive slammed physical shock sequence)
  const handleFlip = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsScanning(true);
    setScanStatus(isFlipped ? "DECRYPTING" : "AUTHORIZED");
    setRotateX(0);
    setRotateYVal(0);

    const toBack = !isFlipped;

    // 1. Kinetic Wind-up: Card lifts into high 3D space, tilts back slightly
    await cardControls.start({
      scale: 1.06,
      y: -35,
      z: 75,
      rotateX: toBack ? -15 : 15,
      transition: { duration: 0.16, ease: "easeOut" }
    });

    // 2. Violent downward slam snap impact + High-speed rotation along the Y axis!
    await cardControls.start({
      rotateY: toBack ? 180 : 0,
      rotateX: 0,
      y: 65,            // Forces the card deep downwards
      scale: 0.88,      // Squishes under impact force
      z: -50,           // Pushed hard against the table substrate
      transition: { duration: 0.28, ease: "easeInOut" }
    });

    // Toggle flips state precisely at bottom extreme
    setIsFlipped(toBack);

    // 3. Crisp high-tension reactive recoil & bounce
    await cardControls.start({
      y: -12,
      scale: 1.03,
      z: 15,
      transition: { duration: 0.1, ease: "easeOut" }
    });

    // 4. Solid final heavy plate spring lock settle
    await cardControls.start({
      y: 0,
      scale: 1,
      z: 0,
      transition: { 
        type: "spring", 
        stiffness: 480, 
        damping: 14 
      }
    });

    // Auto-complete the laser cryptographic scan sweep after settle
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus("IDLE");
      setIsAnimating(false);
    }, 450);
  };

  return (
    <div 
      id="nid-card-container"
      className="relative w-[290px] h-[181px] min-[375px]:w-[340px] min-[375px]:h-[212px] sm:w-[380px] sm:h-[238px] md:w-[420px] md:h-[262px] lg:w-[460px] lg:h-[288px] xl:w-[500px] xl:h-[312px] cursor-pointer group select-none flex items-center justify-center transition-all duration-300 origin-center my-4 sm:my-6 md:my-8 lg:my-10"
      style={{ perspective: "1250px", WebkitPerspective: "1250px" } as React.CSSProperties}
      onClick={handleFlip}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Absolute floating helper tooltip on hover */}
      {/* Absolute floating helper tooltip / Biometric scanning indicator */}
      <div 
        id="card-hover-hint" 
        className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-slate-300 uppercase transition-all duration-300 shadow-xl pointer-events-none flex items-center gap-1.5 z-50 ${isScanning ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        {isScanning ? (
          <>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-emerald-400 font-bold">{scanStatus}</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span>Click to flip NID</span>
          </>
        )}
      </div>

      <motion.div
        id="nid-card-tilt-wrapper"
        className="w-full h-full relative"
        animate={{
          rotateX: isAnimating ? 0 : rotateX,
          rotateY: isAnimating ? 0 : rotateYVal,
          scale: isAnimating ? 1.01 : undefined
        }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" } as React.CSSProperties}
      >
        <motion.div
          id="nid-card-mesh"
          className="w-full h-full relative"
          initial={{ rotateY: 0 }}
          animate={cardControls}
          style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" } as React.CSSProperties}
        >
        {/* FRONT SIDE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(1px)"
          }}
        >
          <div className="absolute inset-0 w-full h-full bg-[#f4f7f6] overflow-hidden rounded-xl border border-slate-300 font-sans text-slate-800 flex flex-col">
          {/* Top Banner (NID Style) */}
          <div className="bg-[#006a4e] w-full pt-2 min-[375px]:pt-3 pb-1 flex flex-col items-center justify-center border-b-[4px] border-[#f42a41] relative z-10 shadow-sm">
            <h4 className="text-[7.5px] min-[375px]:text-[9px] sm:text-[10px] md:text-[11px] text-white font-bold uppercase tracking-wider mb-0.5 text-center px-1">Government of the People's Republic of Dumbland</h4>
            <h3 className="text-[10px] min-[375px]:text-[12px] sm:text-[13px] md:text-sm text-white font-black tracking-widest leading-none">NATIONAL DUMB CARD</h3>
          </div>
          
          {/* Microprint backdrop */}
          <div className="absolute inset-0 opacity-[0.03] text-[6px] leading-[6px] overflow-hidden break-all text-justify pointer-events-none z-0">
            {Array(200).fill("DUMB CARD OFFICIALLY CERTIFIED ").join("")}
          </div>

          <div className="flex p-2 min-[375px]:p-3 md:p-4 gap-2.5 min-[375px]:gap-3 md:gap-4 h-full relative z-10">
            {/* Left - Photo */}
            <div className="flex flex-col items-center gap-1 w-[70px] min-[375px]:w-[80px] sm:w-[90px] md:w-[100px] flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-full h-[85px] min-[375px]:h-[100px] sm:h-[110px] md:h-[120px] p-[1.5px] sm:p-[2px] bg-white border border-slate-300 shadow-sm relative overflow-hidden select-none"
              >
                <SecureImage 
                  srcUri={profilePic} 
                  alt="Tasfiya Tabassum" 
                  className="w-full h-full object-cover select-none"
                />
                {/* Secure transparent click block */}
                <div className="absolute inset-0 z-30 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} />
              </motion.div>
              <div className="mt-1 sm:mt-2 text-[10px] min-[375px]:text-[12px] md:text-[14px] font-[signature,cursive] text-slate-700 border-t border-slate-400 w-[80%] text-center pt-0.5 italic">
                Tasfiya
              </div>
              <span className="text-[7.5px] uppercase text-slate-400 font-bold">Signature</span>
            </div>

            {/* Right - Profile Info */}
            <div className="flex flex-col flex-1 pl-1">
              <div className="mb-2 md:mb-3">
                <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Name</p>
                <p className="text-[11px] min-[375px]:text-[13px] sm:text-[14px] md:text-[16px] font-black text-slate-900 leading-none">Tasfiya Tabassum</p>
              </div>
              <div className="mb-2 md:mb-3">
                <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Occupation</p>
                <p className="text-[10px] min-[375px]:text-[11px] sm:text-[12px] md:text-[13.5px] font-bold text-slate-800 leading-none">Certified Dumb Developer</p>
              </div>
              <div className="mb-2 md:mb-3">
                <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Social Profile</p>
                <div className="flex gap-1.5 sm:gap-2 text-[#006a4e] mt-0.5 sm:mt-1 relative z-20">
                  <button onClick={(e) => handleSocialClick(e, "fb")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                    <Facebook className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button onClick={(e) => handleSocialClick(e, "ig")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                    <Instagram className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button onClick={(e) => handleSocialClick(e, "github")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                    <Github className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
              
              <div className="mt-auto pb-1">
                <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">ID NO</p>
                <p className="text-[11px] min-[375px]:text-[13px] sm:text-[15px] md:text-[16px] font-mono font-black text-[#f42a41] tracking-[0.2em]">824 934 6219</p>
              </div>
            </div>
            
            <div className="absolute right-[-10px] bottom-[10px] opacity-[0.05] pointer-events-none z-0 scale-[0.7] sm:scale-100 origin-bottom-right">
               <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="8"/>
                <circle cx="50" cy="50" r="28" stroke="black" strokeWidth="3" strokeDasharray="4 4"/>
                <text x="50" y="55" fontSize="20" textAnchor="middle" fill="black" fontWeight="900" fontFamily="monospace">DUMB</text>
              </svg>
            </div>
          </div>
          
          {/* Holographic scanning HUD overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-500/[0.02] z-30 pointer-events-none">
              <motion.div 
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 0.65, ease: "linear" }}
                className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.85)] z-40"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(16,185,129,0.06))] animate-pulse" />
            </div>
          )}
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden", 
            transform: "rotateY(180deg) translateZ(1px)" 
          }}
        >
          <div className="absolute inset-0 w-full h-full bg-[#f4f7f6] overflow-hidden rounded-xl border border-slate-300 font-sans text-slate-800 flex flex-col">
          {/* Back Banner */}
          <div className="bg-[#006a4e] w-full py-1 sm:py-2 flex items-center justify-center border-b-[4px] border-[#f42a41] relative z-10">
            <p className="text-[6.5px] min-[375px]:text-[7.5px] sm:text-[8px] md:text-[9px] text-white font-bold text-center px-4 leading-normal">This card is property of the Dumbland Department of Absurdity. If found, please return to the nearest chaos center.</p>
          </div>

          <div className="p-2 min-[375px]:p-3 md:p-4 flex flex-col h-full gap-2 sm:gap-3 relative z-10">
            <div className="flex gap-2 sm:gap-4">
              <div className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 sm:w-16 sm:h-16 bg-slate-200 rounded flex items-center justify-center border border-slate-300 shadow-inner flex-shrink-0">
                <Fingerprint className="w-6 h-6 min-[375px]:w-8 min-[375px]:h-8 sm:w-10 sm:h-10 text-slate-400 opacity-50" />
              </div>
              <div className="flex-1 space-y-1 sm:space-y-2">
                <div className="flex items-center gap-1 sm:gap-2 leading-none">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#006a4e]" />
                  <span className="text-[7.5px] min-[375px]:text-[8.5px] sm:text-[9px] font-bold uppercase text-slate-500">Security Clearance</span>
                  <span className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-[10px] font-black text-emerald-600">LEVEL OMEGA</span>
                </div>
                <div className="flex items-start gap-1 sm:gap-2">
                  <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[8px] min-[375px]:text-[9px] sm:text-[10px] text-slate-700 leading-tight">Subject exhibits high resistance to standard logic and maintains a 98% success rate in producing bug-free chaos.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-0.5 sm:mt-1">
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-[7px] min-[375px]:text-[7.5px] sm:text-[8px] font-bold text-slate-400 uppercase">Coding Skill</p>
                <div className="flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />
                  <span className="text-[9.5px] min-[375px]:text-[10.5px] sm:text-[11px] font-black italic">Brilliant Chaos</span>
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-[7px] min-[375px]:text-[7.5px] sm:text-[8px] font-bold text-slate-400 uppercase">Favorite Bug</p>
                <span className="text-[9.5px] min-[375px]:text-[10.5px] sm:text-[11px] font-black italic text-[#f42a41]">Off-by-one</span>
              </div>
            </div>

            <div className="mt-auto flex flex-col items-center">
              <div className="w-full h-5 min-[375px]:h-7 sm:h-8 bg-white border border-slate-300 flex items-center justify-center mb-1 overflow-hidden">
                <div className="flex gap-[1px] sm:gap-[2px]">
                   {Array(40).fill(0).map((_, i) => (
                     <div key={i} className={`h-6 w-[2px] bg-slate-900`} style={{ width: `${Math.random() * 3 + 1}px` }}></div>
                   ))}
                </div>
              </div>
              <p className="text-[6.5px] min-[375px]:text-[7.5px] sm:text-[8px] font-mono text-slate-400">8249346219-TASFIYA-TABASSUM</p>
            </div>
          </div>
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none -rotate-12">
            <span className="text-[80px] font-black tracking-tighter">DUMB</span>
          </div>

          {/* Holographic scanning HUD overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-500/[0.02] z-30 pointer-events-none">
              <motion.div 
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 0.65, ease: "linear" }}
                className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-450 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.85)] z-40"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(52,211,153,0.06))] animate-pulse" />
            </div>
          )}
          </div>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}


