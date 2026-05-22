import { Github, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 text-center font-mono text-sm text-slate-500 flex flex-col items-center gap-4">
      <div className="flex gap-6 md:hidden text-slate-400 mb-2">
        <a href="https://github.com/Quincunx33" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="GitHub"><Github size={20} /></a>
        <a href="https://www.facebook.com/taaissu?" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
        <a href="https://www.facebook.com/taissuuu?" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Facebook Secondary"><Facebook size={20} /></a>
        <a href="https://www.instagram.com/taissuuu" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
      </div>
      <p className="hover:text-emerald-500 transition-colors cursor-pointer">
        Built by Tasfiya Tabassum
      </p>
    </footer>
  );
}
