import { motion } from "motion/react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-emerald-500 font-mono text-sm mb-4">03. What's Next?</p>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6 tracking-tight">
          Get In Touch
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          If you interest any frontend developing.. hire me asshole.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 font-mono">
          <a
            href="https://www.instagram.com/taissuuu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded transition-all hover:scale-105"
          >
            Instagram Profile
          </a>
          <a
            href="https://www.facebook.com/taissuuu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded transition-all hover:scale-105"
          >
            Facebook ID 1
          </a>
          <a
            href="https://www.facebook.com/taissuuu?"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-slate-800 text-blue-400 border border-blue-600/50 rounded transition-all hover:scale-105"
          >
            Facebook ID 2
          </a>
        </div>
      </motion.div>
    </section>
  );
}
