import { motion } from "motion/react";
import SecureImage from "./SecureImage";
import profileImage from "../assets/IMG_5197.jpeg";
import mockMap from "../assets/images/dumbland_map_1779997056061.png";

export default function About() {
  const powers = [
    "Existential Overthinking 🧠",
    "Queen's Aura ✨",
    "Absolute Sleep Immunity 😴",
    "Caffeine Alchemy & Stories ☕",
    "Royal Chaos Governance 👑",
    "Unquestionable Sovereignty 🌟"
  ];

  return (
    <section id="about" className="py-24 px-6 max-w-4xl mx-auto" style={{ perspective: "1000px" }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.9, z: -100 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1, z: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex items-center gap-4 mb-10" style={{ transform: "translateZ(20px)" }}>
          <h2 className="text-3xl font-bold text-slate-200">
            <span className="text-emerald-500 font-mono text-xl mr-2">01.</span>
            History & Queen's Reign
          </h2>
          <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3 text-slate-400 space-y-4 text-lg leading-relaxed" style={{ transform: "translateZ(30px)" }}>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.1 }}>
              Let’s be honest: my name is Tasfiya, and I am the Sovereign **Queen** of Dumbland. I rule over this glorious empire of pure absurdity with an iron will, an invisible crown, and a profound talent for making decisions that defy conventional logic. My reign is built on absolute majesty, select silence, and the divine royal right to change my mind whenever I please. 👑
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.2 }}>
              My power is absolute and unquestionable. I govern the hearts, minds, and vibes of Dumbland. I have zero space for conventional rules, but a severe dependency on coffee, absolute authority, and setting peerless trends. My daily routine consists of issuing majestic decrees and maintaining perfect chaos without a second thought. 💀
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.3 }}>
              Here are a few of my sovereign, high-grade **Queenly Powers** that I exercise daily to maintain the peerless majesty of my realm:
            </motion.p>
            <ul className="grid grid-cols-2 gap-2 mt-4 font-mono text-sm text-slate-300">
              {powers.map((power, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 5, color: "#10b981" }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  <span className="text-emerald-500 text-xs">▸</span> {power}
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 space-y-4 font-mono text-sm">
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Royal Seat:</span>
                <span className="text-slate-300">Dumbland Capital</span>
              </div>
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Decrees:</span>
                <span className="text-slate-300">Absolute & Final</span>
              </div>
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Duties:</span>
                <span className="text-slate-300">Ruling the realm with perfection</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ rotateY: 30, rotateX: 10, scale: 0.8 }}
            whileInView={{ rotateY: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            className="md:col-span-2 relative group w-64 h-64 mx-auto md:w-full md:h-auto aspect-square overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              whileHover={{ translateZ: 20 }}
              className="absolute inset-x-0 inset-y-0 border-2 border-emerald-500 rounded translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 -z-10"
            ></motion.div>
            <div className="relative w-full h-full overflow-hidden rounded select-none pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
              <SecureImage 
                whileHover={{ translateZ: 50, scale: 1.05 }}
                srcUri={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover transition-all relative z-20 select-none"
              />
              {/* Absolutes transparent shield to block all interaction/image scraping */}
              <div 
                className="absolute inset-0 z-30 bg-transparent select-none"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </motion.div>
        </div>

        {/* Mock Dumbland Map */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20"
        >
          <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <span className="text-emerald-500 font-mono text-lg mr-2">📍</span>
            My Orbit (Dumbland Royal Grid)
          </h3>
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-900 flex items-center justify-center relative shadow-[0_0_25px_rgba(16,185,129,0.15)] group">
            <img 
              src={mockMap} 
              alt="Dumbland Map" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700 ease-in-out filter hue-rotate-15 contrast-125 saturate-150"
            />
            {/* Overlay Map UI Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute -top-2"></div>
              <div className="w-4 h-4 bg-emerald-400 rounded-full absolute -top-2"></div>
              
              <div className="mt-6 bg-slate-950/80 backdrop-blur border border-emerald-500/50 px-4 py-2 rounded shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest font-sans text-center">Dumbland Capital</h4>
                <p className="text-emerald-400 font-mono text-[10px] text-center mt-1">RESTRICTED ZONE (QUEEN ONLY)</p>
              </div>
            </div>
            {/* Map styling overlays */}
            <div className="absolute inset-0 border-[6px] border-slate-950/40 rounded-xl pointer-events-none"></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
