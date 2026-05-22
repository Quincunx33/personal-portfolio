/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SocialSidebar from "./components/SocialSidebar";
import MockSocialApps from "./components/MockSocialApps";
import LoadingScreen from "./components/LoadingScreen";
import DumbCard from "./components/DumbCard";
import SecurityShield from "./components/SecurityShield";
import Album from "./components/Album";
import { ChevronDown, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";

type AppType = "fb" | "ig" | "github";

interface MockContextType {
  openApp: (app: AppType) => void;
}

export const MockContext = createContext<MockContextType | undefined>(undefined);

export const useMock = () => {
  const context = useContext(MockContext);
  if (!context) throw new Error("useMock must be used within MockProvider");
  return context;
};

export default function App() {
  const [activeApp, setActiveApp] = useState<AppType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const openApp = (app: AppType) => {
    setActiveApp(app);
    setIsModalOpen(true);
  };

  // Auto-scroll helper
  useEffect(() => {
    if (isLoading) return;
    const scrollTimer = setTimeout(() => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    }, 5000);
    return () => clearTimeout(scrollTimer);
  }, [isLoading, hasScrolled]);

  useEffect(() => {
    if (isLoading) return;
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentY = e.targetTouches[0].clientY;
    const diffY = touchStart - currentY;
    if (diffY > 40) {
      setHasScrolled(true);
      setTouchStart(null);
    }
  };

  return (
    <MockContext.Provider value={{ openApp }}>
      <SecurityShield>
        <AnimatePresence>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900 min-h-screen w-full overflow-x-hidden text-slate-200 font-sans selection:bg-rose-500/0 selection:text-current"
            >
              {/* Subtle Top Horizontal Scroll Progress Bar */}
              <motion.div 
                id="global-scroll-progress"
                style={{ scaleX }} 
                className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 origin-left z-[100] shadow-[0_1px_15px_rgba(16,185,129,0.7)]" 
              />

              {/* Ambient Centered Card Showcase */}
              <AnimatePresence>
                {!hasScrolled && (
                  <motion.div
                    id="intro-card-overlay"
                    initial={{ opacity: 1, zIndex: 100 }}
                    exit={{ opacity: 0, y: -100, filter: "blur(20px)" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    onWheel={(e) => {
                      if (e.deltaY > 10) {
                        setHasScrolled(true);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    className="fixed inset-0 bg-[#040711] flex flex-col items-center justify-center overflow-hidden select-none"
                    style={{ zIndex: 100, transform: "translateZ(100px)" }}
                  >
                    {/* Cosmic gentle radial lights */}
                    <div className="absolute inset-0 z-0 bg-radial-[circle_800px_at_50%_50%] from-rose-950/10 via-slate-950/40 to-[#040711]" />
                    
                    {/* Delicate glowing microgrid background details */}
                    <div className="absolute inset-0 flex items-center justify-between px-10 md:px-14 opacity-[0.03] font-mono text-[9px] tracking-[0.25em] pointer-events-none select-none text-slate-400 z-0 leading-none">
                      <div className="flex flex-col gap-6">
                        <span>CORE_SYS_ACTIVE</span>
                        <span>DUMB_ENVELOPE: ATTESTED</span>
                        <span>CRYSTAL_SPAR_SHELL</span>
                      </div>
                      <div className="flex flex-col text-right gap-6">
                        <span>TASFIYA_PORTFOLIO_V2</span>
                        <span>ABSURDITY_SECTOR_7</span>
                        <span>ORBIT: STABLE_GREEN</span>
                      </div>
                    </div>

                    {/* Header ambient content */}
                    <motion.div
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      transition={{ delay: 0.3, duration: 1.2 }}
                      className="absolute top-10 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-slate-400 uppercase flex items-center gap-2 z-10"
                    >
                      <Sparkles size={11} className="text-rose-400 animate-pulse" />
                      <span>Tasfiya Tabassum // National Dumb Identity</span>
                    </motion.div>

                    {/* Gorgeous centered Card floating container */}
                    <motion.div
                      id="intro-card-wrapper"
                      initial={{ scale: 0.88, opacity: 0, y: 35 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.15, 
                        duration: 1.3, 
                        type: "spring",
                        bounce: 0.15
                      }}
                      className="z-10 focus:outline-none my-12 md:my-16 lg:my-20 xl:my-24 flex items-center justify-center"
                      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                    >
                      <DumbCard />
                    </motion.div>

                    {/* High quality interactive layout bottom prompt */}
                    <motion.div
                      id="intro-scroll-helper"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ 
                        opacity: [0.4, 1, 0.4], 
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        delay: 0.5, 
                        duration: 2.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      onClick={() => {
                        setHasScrolled(true);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer group z-10 select-none pb-4"
                    >
                      <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] font-bold uppercase text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300">
                        Enter Portfolio
                      </span>
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-emerald-500"
                      >
                        <ChevronDown size={28} className="stroke-[2px]" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {hasScrolled && <Navbar />}
              <SocialSidebar />
              
              <main className={`px-6 md:px-24 max-w-7xl mx-auto transition-opacity duration-1000 ${hasScrolled ? 'opacity-100' : 'opacity-0'}`}>
                <Hero />
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                  <About />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                  <Projects />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                  <Album />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                  <Contact />
                </motion.div>
              </main>
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                <Footer />
              </motion.div>
              
              <MockSocialApps 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                activeApp={activeApp} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </SecurityShield>
    </MockContext.Provider>
  );
}
