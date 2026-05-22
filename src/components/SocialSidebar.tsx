import { Github, Facebook, Instagram } from "lucide-react";
import { motion } from "motion/react";
import { useMock } from "../App";

export default function SocialSidebar() {
  const { openApp } = useMock();

  return (
    <>
      {/* Left Social Sidebar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="hidden md:flex fixed bottom-0 left-10 flex-col items-center gap-6 text-slate-400 after:content-[''] after:w-px after:h-24 after:bg-slate-700 z-40"
      >
        {/* GitHub Link Button with Premium custom tooltip text */}
        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => openApp("github")} 
            className="hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300 transform cursor-pointer p-1.5 rounded-full hover:bg-slate-800/40" 
            aria-label="GitHub"
          >
            <Github size={20} />
          </button>
          
          <span className="absolute left-10 scale-0 group-hover:scale-100 transition-all duration-200 origin-left font-mono text-[9px] bg-slate-950/95 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded shadow-xl tracking-wider select-none whitespace-nowrap z-50">
            GITHUB: @Quincunx33 💻
          </span>
        </div>

        {/* Facebook Link Button with Premium custom tooltip text */}
        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => openApp("fb")} 
            className="hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300 transform cursor-pointer p-1.5 rounded-full hover:bg-slate-800/40" 
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </button>
          
          <span className="absolute left-10 scale-0 group-hover:scale-100 transition-all duration-200 origin-left font-mono text-[9px] bg-slate-950/95 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded shadow-xl tracking-wider select-none whitespace-nowrap z-50">
            FACEBOOK: @taissuuu 🌐
          </span>
        </div>

        {/* Instagram Link Button with Premium custom tooltip text */}
        <div className="relative group flex items-center justify-center">
          <button 
            onClick={() => openApp("ig")} 
            className="hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300 transform cursor-pointer p-1.5 rounded-full hover:bg-slate-800/40" 
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </button>
          
          <span className="absolute left-10 scale-0 group-hover:scale-100 transition-all duration-200 origin-left font-mono text-[9px] bg-slate-950/95 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded shadow-xl tracking-wider select-none whitespace-nowrap z-50">
            INSTAGRAM: @taissuuu 📸
          </span>
        </div>
      </motion.div>

      {/* Right Email Sidebar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="hidden md:flex fixed bottom-0 right-10 flex-col items-center gap-6 text-slate-400 after:content-[''] after:w-px after:h-24 after:bg-slate-700 z-40"
      >
        <div className="relative group flex items-center justify-center">
          <a 
            href="mailto:taaissu@gmail.com" 
            className="font-mono text-xs tracking-[0.2em] leading-loose hover:text-emerald-400 hover:-translate-y-1 transition-all duration-300 transform [writing-mode:vertical-rl] py-2 cursor-pointer select-none"
            title="Send email"
          >
            taaissu@gmail.com
          </a>
          
          <span className="absolute right-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-right font-mono text-[9px] bg-slate-950/95 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded shadow-xl tracking-wider select-none whitespace-nowrap z-50">
            ✉️ SEND MAIL
          </span>
        </div>
      </motion.div>
    </>
  );
}
