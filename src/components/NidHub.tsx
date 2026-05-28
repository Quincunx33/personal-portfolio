import React, { useState, useEffect } from "react";
import { 
  motion, AnimatePresence 
} from "motion/react";
import { 
  Search, ShieldCheck, ShieldAlert, Calendar, MapPin, User, Cpu, 
  Briefcase, Fingerprint, FileText, CheckCircle2, Sparkles, Clock, 
  Lock, RefreshCw, Eye, BookOpen, AlertCircle
} from "lucide-react";
import { useFirebase } from "../context/FirebaseContext";
import DumbCard from "./DumbCard";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

interface VerifiedUser {
  uid: string;
  displayName: string;
  occupation: string;
  joinedAt: string;
  clearance: string;
  codingSkill: string;
  favoriteBug: string;
  address: string;
  accentColor: string;
  sticker: string;
  photoURL?: string;
  email?: string;
  isCustomMock?: boolean;
}

export default function NidHub() {
  const { user, updateCitizenProfile } = useFirebase();
  const [royalMode, setRoyalMode] = useState(user?.royalMode ?? true);

  useEffect(() => {
    if (user && user.royalMode !== undefined) {
      setRoyalMode(user.royalMode);
    }
  }, [user?.royalMode]);

  const toggleRoyalMode = () => {
    const newVal = !royalMode;
    setRoyalMode(newVal);
    if (user) {
      updateCitizenProfile({ royalMode: newVal });
    }
  };

  const isQueen = user && (user.email === "taaissu@gmail.com" || user.uid === "824 934 6219" || user.displayName?.includes("Tasfiya") || user.displayName?.includes("Tasfiya Tabassum"));
  const isActiveRoyal = isQueen && royalMode;

  return (
    <section id="id-hub" className={`py-24 border-t transition-colors duration-700 relative overflow-hidden ${isActiveRoyal ? "bg-[#160624] border-purple-900/50" : "bg-[#1f0d14] border-rose-900/50"}`}>
      {/* Background aesthetics */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none select-none transition-colors duration-700 ${isActiveRoyal ? "bg-amber-500/10" : "bg-rose-500/15"}`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full filter blur-[120px] pointer-events-none select-none transition-colors duration-700 ${isActiveRoyal ? "bg-purple-600/15" : "bg-orange-500/10"}`} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Royal Mode Toggle */}
        {isQueen && (
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleRoyalMode}
              className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest border transition-all flex items-center gap-2 ${
                isActiveRoyal 
                  ? "bg-purple-900/40 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]" 
                  : "bg-rose-900/50 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
              }`}
            >
              <Sparkles size={14} className={isActiveRoyal ? "text-amber-400" : "text-rose-400"} />
              {isActiveRoyal ? "Royal Mode Active 👑" : "Enable Royal Mode"}
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full mb-4 transition-colors ${isActiveRoyal ? "bg-[#2d1145] border-amber-500/30" : "bg-[#381119] border-rose-500/30"}`}>
            <Fingerprint className={`w-4 h-4 animate-pulse ${isActiveRoyal ? "text-amber-400" : "text-rose-400"}`} />
            <span className={`font-mono text-[10px] font-extrabold tracking-[0.25em] uppercase ${isActiveRoyal ? "text-amber-400" : "text-rose-400"}`}>
              {isActiveRoyal ? "Sovereign Command" : "Join Dumbland"}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-200 tracking-tight font-sans mb-4">
            {isActiveRoyal ? "Royal " : "Dumbland "} 
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isActiveRoyal ? "from-amber-300 via-yellow-200 to-amber-500" : "from-rose-400 via-pink-400 to-orange-300"}`}>
              Identity Portal
            </span> {isActiveRoyal ? "👑" : ""}
          </h2>
          <p className={`${isActiveRoyal ? "text-purple-200/70" : "text-rose-200/50"} text-sm md:text-base leading-relaxed`}>
            The sovereign identity distribution block. Claim your authentic Dumbland ID card, edit your portrait, and download your credentials to prove your citizenship.
          </p>
        </div>

        {/* Highlighting Queen Card All the Time */}
        <div className="w-full flex flex-col items-center justify-center mb-16">
           <h3 className={`font-mono text-[11px] font-bold tracking-widest uppercase mb-4 ${isActiveRoyal ? "text-amber-400" : "text-slate-500"}`}>
             Registry Showcase: Sovereign Entity
           </h3>
           <DumbCard alwaysShowDeveloper={true} showConsole={false} />
        </div>

        {/* Regular Citizen Form area */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className={`p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative w-full border transition-colors duration-700 ${isActiveRoyal ? "bg-[#2d1145]/40 border-purple-500/30" : "bg-slate-950/40 border-slate-850"}`}>
            <div className="absolute top-4 right-4 items-center gap-1 hidden sm:flex">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isActiveRoyal ? "bg-amber-400" : "bg-purple-500"}`} />
              <span className={`font-mono text-[8px] font-bold uppercase tracking-widest ${isActiveRoyal ? "text-amber-400" : "text-purple-500"}`}>Registrar Terminal Connection Live</span>
            </div>
            
            <div className="space-y-2 mb-8 text-center sm:text-left">
              <h3 className={`text-lg md:text-xl font-bold font-sans ${isActiveRoyal ? "text-amber-100" : "text-slate-200"}`}>Card Issuance Control</h3>
              <p className={`text-xs ${isActiveRoyal ? "text-purple-200/60" : "text-slate-400"}`}>
                View your authorized digital citizen profile below. Use the control panel to authenticate, edit your portrait, and download a digital copy of your Smart Identity Card.
              </p>
            </div>

            <DumbCard showConsole={true} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
