import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFirebase } from "../context/FirebaseContext";
import { LogIn, LogOut, X, Mail, Github, Instagram, Linkedin } from "lucide-react";
import profileImage from "../assets/IMG_5197.jpeg";

const TreeIcon = () => (
  <svg width="24" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 group-hover:text-emerald-400 transition-colors drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
    <path d="M12 22v-8"/>
    <path d="m8 14-2-2"/>
    <path d="m16 14 2-2"/>
    <path d="M12 14c-1.5 0-3-1-3-3s1-2 2-3c-1 0-2-1-2-3s2-2 3-2 3 1 3 2-2 3-2 3 1 1 2 3-1.5 3-3 3Z"/>
  </svg>
);

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { user, loginWithGoogle, logoutUser } = useFirebase();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const treeNodes = [
    { name: "Home", href: "/" },
    { name: "Join Dumbland", href: "/join" }
  ];

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 w-full px-6 py-4 flex justify-between items-center bg-slate-900/90 backdrop-blur-md z-50 border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/60 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-slate-800 flex items-center justify-center z-50 transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
            <img 
              src={profileImage} 
              alt="Tasfiya Tabassum" 
              className="w-full h-full object-cover select-none"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-[60]">
          {/* Desktop User state (optional small badge) */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 bg-[#0d211a]/80 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-lg">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Sovereign" 
                  className="w-5 h-5 rounded-full border border-emerald-400"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-xs text-emerald-300 font-bold max-w-[100px] truncate">{user.displayName}</span>
            </div>
          ) : (
             <div className="hidden md:flex bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
               <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Guest Traveler</span>
             </div>
          )}

          {/* Universal Tree Toggle Button for all screen sizes */}
          <button 
            className="p-2 focus:outline-none relative w-12 h-12 flex items-center justify-center cursor-pointer group bg-slate-800/80 hover:bg-slate-700/80 border border-emerald-500/30 hover:border-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Tree Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} className="text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="tree"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TreeIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Elegant Organic Full-Screen Tree Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-40 overflow-y-auto overflow-x-hidden pt-24 pb-12 px-4 flex flex-col"
          >
            {/* The Tree Structure (Navigation) */}
            <div className="relative w-full flex-grow flex flex-col justify-center max-w-2xl mx-auto z-10 py-8 min-h-[500px]">
              
              {/* Main Glowing Trunk */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                exit={{ height: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-1.5 md:w-2 lg:w-2.5 rounded-full z-10"
                style={{
                  background: "linear-gradient(to bottom, #022c22, #10b981, #022c22)",
                  boxShadow: "0 0 25px rgba(16,185,129,0.5)"
                }}
              />

              {/* Branched Nodes */}
              {treeNodes.map((node, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={i} className="flex w-full items-center justify-center relative h-[80px] md:h-[100px] my-3 group">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-80">
                      <defs>
                        <linearGradient id={`branchGraLeft-${i}`} x1="1" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id={`branchGraRight-${i}`} x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>
                      {isLeft ? (
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: "circOut" }}
                          d="M 50 100 C 50 85, 45 65, 10 50"
                          fill="none"
                          stroke={`url(#branchGraLeft-${i})`}
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : (
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: "circOut" }}
                          d="M 50 100 C 50 85, 55 65, 90 50"
                          fill="none"
                          stroke={`url(#branchGraRight-${i})`}
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                    </svg>

                    <div className="flex-1 flex justify-end pr-8 md:pr-12 relative">
                      {isLeft && (
                        <Link
                          to={node.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                          className="bg-slate-900 border border-emerald-500/50 py-2 md:py-3 px-5 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-300 relative z-20 flex items-center justify-center min-w-[120px] md:min-w-[150px] hover:bg-[#06241a] hover:border-emerald-400 block"
                        >
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.5, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.15, type: "spring", bounce: 0.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="font-extrabold tracking-widest uppercase text-[11px] md:text-xs inline-block"
                          >
                            {node.name}
                          </motion.span>
                        </Link>
                      )}
                    </div>

                    <div className="w-8 md:w-12 shrink-0 z-20 flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
                        className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399] border-2 border-slate-950"
                      />
                    </div>

                    <div className="flex-1 flex justify-start pl-8 md:pl-12 relative">
                      {!isLeft && (
                        <Link
                          to={node.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                          className="bg-slate-900 border border-emerald-500/50 py-2 md:py-3 px-5 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-300 relative z-20 flex items-center justify-center min-w-[120px] md:min-w-[150px] hover:bg-[#0d211a] hover:border-emerald-400 block"
                        >
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.15, type: "spring", bounce: 0.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="font-extrabold tracking-widest uppercase text-[11px] md:text-xs inline-block"
                          >
                            {node.name}
                          </motion.span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="h-20" />
            </div>

            {/* Tree Base Root (Auth Ground) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center mt-4 mb-16 z-30 relative"
            >
              {/* Ground visual */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-8 bg-emerald-600/20 blur-2xl rounded-full z-0" />
              
              <div className="relative z-10 flex flex-col items-center">
                {user ? (
                  <div className="flex flex-col gap-3 bg-[#091a15] border-2 border-emerald-500/30 p-5 rounded-3xl items-center shadow-[0_0_40px_rgba(16,185,129,0.2)] md:min-w-[280px]">
                    <div className="flex flex-col items-center gap-3">
                      {user.photoURL && (
                        <div className="p-1 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-200">
                          <img 
                            src={user.photoURL} 
                            alt="Sovereign" 
                            className="w-12 h-12 rounded-full border border-black"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <span className="text-base text-emerald-300 font-extrabold tracking-wide truncate max-w-[200px]">{user.displayName}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="mt-2 text-xs text-rose-400 border border-rose-500/20 bg-rose-500/10 px-5 py-2 hover:bg-rose-500/20 rounded-full font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all w-full"
                    >
                      <LogOut size={16} /> leave the realm
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      loginWithGoogle();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-400 text-slate-950 font-black rounded-full hover:scale-105 transition-transform w-max flex items-center justify-center gap-3 text-sm uppercase tracking-widest cursor-pointer shadow-[0_0_35px_rgba(16,185,129,0.6)] border-2 border-emerald-200/50"
                  >
                    <LogIn size={20} />
                    <span>Enter Dumbland</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
