import React from "react";
import { Github, Linkedin, Mail, Twitter, ChevronDown, ExternalLink, LogIn, Users } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import DumbCard from "./DumbCard";
import { useFirebase } from "../context/FirebaseContext";

export default function Hero() {
  const { user, loginWithGoogle } = useFirebase();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize to -1 to 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  return (
    <section 
      id="home" 
      className="min-h-screen w-full overflow-x-hidden flex flex-col justify-center items-center relative px-6"
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      <motion.div 
        className="max-w-6xl mx-auto mt-20 w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full" style={{ transformStyle: "preserve-3d" }}>
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-emerald-500 font-mono mb-4 text-sm md:text-base">Hi, my name is</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-200 tracking-tight mb-4">
            Tasfiya Tabassum.
          </h1>
        </motion.div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-400 tracking-tight mb-8">
            I build things for the web.
          </h1>
        </motion.div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            I'm a software engineer specializing in building (and occasionally designing) exceptional, high-quality websites and applications.
          </p>
        </motion.div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center relative z-10"
        >
          <a href="#projects" className="px-8 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500 rounded font-mono hover:bg-emerald-500/20 transition-colors pointer-events-auto text-sm w-full sm:w-auto text-center">
            Check out my work
          </a>
 
          {!user ? (
            <button 
              onClick={loginWithGoogle}
              className="px-8 py-3 bg-emerald-500 text-slate-950 font-sans font-bold hover:bg-emerald-400 transition-all rounded pointer-events-auto flex items-center justify-center gap-2 text-sm cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] w-full sm:w-auto uppercase tracking-wider"
            >
              <LogIn size={14} />
              <span>Join Dumb World</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#0d211a] border border-emerald-500/15 px-4 py-2.5 rounded text-sm w-full sm:w-auto justify-center">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">Dumbland Citizen</span>
            </div>
          )}
        </motion.div>
      </div>
 
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        className="flex-shrink-0 w-full lg:w-auto my-8 lg:my-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <DumbCard />
      </motion.div>
    </div>
  </motion.div>

  <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400"
      >
        <a href="#about" aria-label="Scroll down">
          <ChevronDown size={32} />
        </a>
      </motion.div>
    </section>
  );
}
