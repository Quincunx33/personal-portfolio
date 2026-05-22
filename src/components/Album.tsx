import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, AlertTriangle } from "lucide-react";

export default function Album() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTroll, setShowTroll] = useState(false);

  const handleOpenAlbum = () => {
    setIsOpen(true);
    setIsLoading(true);
    setShowTroll(false);

    setTimeout(() => {
      setIsLoading(false);
      setShowTroll(true);
    }, 10000); // 10 seconds load
  };

  return (
    <section id="album" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-3xl font-bold text-slate-200">
          <span className="text-emerald-500 font-mono text-xl mr-2">03.</span>
          Private Album
        </h2>
        <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 md:p-12 text-center min-h-[350px] md:min-h-[450px] w-full flex flex-col items-center justify-center relative overflow-hidden">
        {!isOpen ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAlbum}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all">
              <Folder size={40} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="font-mono text-slate-400 group-hover:text-emerald-400 font-bold tracking-widest uppercase">Unlock Hidden Gallery</p>
          </motion.button>
        ) : (
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="font-mono text-emerald-400 text-sm tracking-widest uppercase flex flex-col gap-2">
                  <span>Loading...</span>
                  <span className="animate-pulse opacity-50">Estimated time: 10s</span>
                </div>
              </motion.div>
            )}

            {showTroll && (
              <motion.div 
                key="troll"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center gap-6 text-[#f42a41]"
              >
                <AlertTriangle size={80} className="animate-bounce drop-shadow-[0_0_15px_rgba(244,42,65,0.8)]" />
                <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black font-sans uppercase tracking-tight text-center leading-tight">
                  Asshole.<br/>Why are you here you pervert?!
                </h3>
                <p className="font-mono text-rose-400/80">Go touch some grass.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
