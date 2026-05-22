import { motion } from "motion/react";
import SecureImage from "./SecureImage";
import profileImage from "../assets/IMG_5197.jpeg";

export default function About() {
  const skills = [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Node.js",
    "Tailwind CSS",
    "Next.js"
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
            About Me
          </h2>
          <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3 text-slate-400 space-y-4 text-lg leading-relaxed" style={{ transform: "translateZ(30px)" }}>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.1 }}>
              Let’s be completely honest: my name is Tasfiya, and I am a certified chaos engineer. I can easily spend four agonizing hours debugging a simple, minor layout issue only to realize I was editing the wrong file the entire time. My code is 10% logic, 40% wishful thinking, and 50% flat-out garbage that somehow compiles. 🤡
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.2 }}>
              My daily routine consists of copy-pasting code from ChatGPT, ignoring compilation warnings, and deploying straight to the main branch while praying key servers do not catch fire. I have zero productivity, a severe caffeine dependency, and a special talent for breaking perfectly functional databases. If you are looking for an impeccable, standard developer, you should definitely keep scrolling. 💀
            </motion.p>
            <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.3 }}>
              Here are a few technologies I frequently ruin, complain about, and have a highly toxic relationship with:
            </motion.p>
            <ul className="grid grid-cols-2 gap-2 mt-4 font-mono text-sm text-slate-300">
              {skills.map((skill, index) => (
                <motion.li 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 5, color: "#10b981" }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 cursor-default"
                >
                  <span className="text-emerald-500 text-xs">▸</span> {skill}
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 space-y-4 font-mono text-sm">
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Home Addr:</span>
                <span className="text-slate-300">Khulna</span>
              </div>
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Education:</span>
                <span className="text-slate-300">Not gonna tell you</span>
              </div>
              <div className="flex gap-4 border-b border-slate-800 pb-2">
                <span className="text-emerald-500 font-bold w-24">Work:</span>
                <span className="text-slate-300">Not gonna tell you</span>
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

        {/* Khulna University Map */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 sm:mt-20"
        >
          <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
            <span className="text-emerald-500 font-mono text-lg mr-2">📍</span>
            My Orbit (Khulna University)
          </h3>
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border-2 border-slate-800 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.892055106575!2d89.535035!3d22.80556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff8f82869fb041%3A0xe5419ebd8ebdd83b!2sKhulna%20University!5e0!3m2!1sen!2sbd!4v1716180325492!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
