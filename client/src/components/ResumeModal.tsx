import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Download, FileText, Mail, Printer, X } from "lucide-react";
import { toast } from "sonner";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyMarkdownResume = async () => {
    const markdown = `# Tasfiya Tabassum
Full-Stack Developer · Systems & Security Researcher
Location: Remote / Worldwide
Email: liquiderror600@gmail.com | GitHub: https://github.com/Quincunx33

## Executive Summary
Builder of resilient web architectures, defensive security tooling, and low-level Linux environments. Passionate about systems programming, userland x86 emulation, high-fidelity browser simulations, and responsive user interfaces.

## Core Technical Competencies
- Languages: TypeScript, JavaScript (ESNext), Python 3, Bash, Shell Scripting, C basics, HTML5/CSS3
- Web & Interfaces: React 19, Vite, Tailwind CSS v4, Canvas API, MediaPipe Computer Vision, Three.js, Framer Motion
- Systems & Virtualization: Alpine Linux x86 rootfs, Kali Linux Live-Build, QEMU, UTM SE, VNC servers, Sockets
- Security Tooling: Penetration Testing CLI suites, Network Recon, WPA2 Handshake Analysis, Headless Auditing, OSINT

## Key Featured Projects
1. PS2-WebXperience: PlayStation 2 OS recreation in browser with Web Audio synthesis & procedural 3D stars.
2. ishkali-vnc: 925+ command Alpine x86 pentesting rootfs for iOS iSH sandbox with GUI TigerVNC.
3. penbox: 72-in-1 modular Python CLI penetration testing toolbox.
4. phishGard: Defensive phishing URL intelligence engine with headless DOM inspection.
5. kali-minimal: Ultra-minimal sub-500MB Kali Linux ISOs optimized for QEMU & low-memory environments.
6. cronjob: Visual cron scheduling engine and HTTP ping monitor with failure alert deduplication.

## Open Source Activity
- 934+ contributions / year on GitHub (@Quincunx33)
- Public repository archive of security tools, system emulators, and web experiments.
`;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success("Markdown resume copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy resume");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#141413] border border-[#e8e1d5]/25 text-[#e8e1d5] shadow-2xl shadow-black overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#191917] border-b border-[#e8e1d5]/15 select-none print:hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d8894b]">
            <FileText size={15} />
            <span>Curriculum Vitae / Field Record</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyMarkdownResume}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#e8e1d5]/20 hover:border-[#d8894b] text-[#a59e92] hover:text-[#e8e1d5] transition-colors"
              title="Copy markdown formatted resume"
            >
              {copied ? <Check size={13} className="text-[#d8894b]" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy Markdown"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-[#e8e1d5]/20 hover:border-[#d8894b] text-[#a59e92] hover:text-[#e8e1d5] transition-colors"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#a59e92] hover:text-[#d8894b] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#111110]">
          {/* Header */}
          <div className="border-b border-[#e8e1d5]/20 pb-6">
            <span className="text-[11px] uppercase tracking-widest text-[#d8894b]">
              Field Notes / Curriculum Vitae
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#e8e1d5] mt-1 tracking-tight">
              Tasfiya Tabassum
            </h1>
            <p className="text-sm text-[#a59e92] mt-1">
              Full-Stack Developer · Systems Enthusiast · Security Researcher
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#8f887c]">
              <span>📍 Available Worldwide (Remote)</span>
              <span>·</span>
              <a
                href="mailto:liquiderror600@gmail.com"
                className="text-[#d8894b] hover:underline"
              >
                liquiderror600@gmail.com
              </a>
              <span>·</span>
              <a
                href="https://github.com/Quincunx33"
                target="_blank"
                rel="noreferrer"
                className="text-[#e8e1d5] hover:underline inline-flex items-center gap-1"
              >
                github.com/Quincunx33 <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Statement */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#d8894b] mb-2 font-bold">
              Engineering Statement
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#c6beb1]">
              Full-stack developer focused on the intersection of low-level systems, responsive web interfaces, and defensive security tooling. Passionate about building minimal Linux distributions, userland x86 root filesystems for mobile sandboxes, high-fidelity browser emulations, and performant web applications. "Systems should feel useful before they feel impressive."
            </p>
          </div>

          {/* Core Technical Arsenal */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#d8894b] mb-3 font-bold">
              Technical Arsenal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#171715] border border-[#e8e1d5]/10">
                <strong className="text-[#e8e1d5] block mb-1">Security &amp; Systems</strong>
                <p className="text-[#8f887c] leading-relaxed">
                  Kali Linux, Alpine Linux x86 rootfs, QEMU/UTM SE Virtualization, WPA2 Handshake Analysis, Network Sockets, Python Pentest Toolchains, OSINT.
                </p>
              </div>
              <div className="p-3 bg-[#171715] border border-[#e8e1d5]/10">
                <strong className="text-[#e8e1d5] block mb-1">Web Platform</strong>
                <p className="text-[#8f887c] leading-relaxed">
                  TypeScript, React 19, Vite, Tailwind CSS v4, Canvas 2D/3D, MediaPipe Vision, Three.js, Web Audio API, Express, WebSockets.
                </p>
              </div>
              <div className="p-3 bg-[#171715] border border-[#e8e1d5]/10">
                <strong className="text-[#e8e1d5] block mb-1">DevOps &amp; Tooling</strong>
                <p className="text-[#8f887c] leading-relaxed">
                  Python CLI Engineering, Linux Shell (Bash/Zsh), Cron daemons, Git/GitHub Actions, Docker, Automated Uptime Monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Featured Engineering Implementations */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#d8894b] mb-4 font-bold">
              Selected Engineering Projects
            </h2>
            <div className="space-y-4 text-xs">
              <div className="border-l-2 border-[#d8894b] pl-3 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#e8e1d5]">PS2-WebXperience — PlayStation 2 Browser Architecture</h3>
                  <span className="text-[10px] text-[#8f887c]">TypeScript / React / Web Audio</span>
                </div>
                <p className="text-[#b5ada1] mt-1 leading-relaxed">
                  Recreated the Sony PlayStation 2 OS within modern web standards. Built custom Web Audio synthesis to recreate dynamic startup chime harmonics without static sound files, alongside 60fps physics-accurate camera navigation.
                </p>
              </div>

              <div className="border-l-2 border-[#e8e1d5]/30 pl-3 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#e8e1d5]">ishkali-vnc — iOS Alpine x86 Pentesting Lab</h3>
                  <span className="text-[10px] text-[#8f887c]">Alpine Linux / iSH / TigerVNC</span>
                </div>
                <p className="text-[#b5ada1] mt-1 leading-relaxed">
                  Engineered an Alpine 3.14 root filesystem tailored for iOS iSH userland x86 emulator. Bundled 925+ penetration testing utilities, compilers, and a low-latency TigerVNC desktop server for on-the-go security assessments.
                </p>
              </div>

              <div className="border-l-2 border-[#e8e1d5]/30 pl-3 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#e8e1d5]">penbox — 72-in-1 Python Security Workbench</h3>
                  <span className="text-[10px] text-[#8f887c]">Python 3 / Sockets / Linux CLI</span>
                </div>
                <p className="text-[#b5ada1] mt-1 leading-relaxed">
                  Engineered an extensible modular CLI framework unifying 72 security assessment workflows: multi-threaded port discovery, wireless WPA2 handshake capture parsing, hashing algorithms, and OSINT automation.
                </p>
              </div>

              <div className="border-l-2 border-[#e8e1d5]/30 pl-3 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#e8e1d5]">phishGard — Automated Defensive Intelligence</h3>
                  <span className="text-[10px] text-[#8f887c]">TypeScript / Puppeteer / Heuristics</span>
                </div>
                <p className="text-[#b5ada1] mt-1 leading-relaxed">
                  Headless browser auditing system analyzing phishing infrastructure. Uses DOM entropy, redirect path tracing, and brand asset visual similarity scoring to detect credential harvest campaigns in real time.
                </p>
              </div>

              <div className="border-l-2 border-[#e8e1d5]/30 pl-3 py-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#e8e1d5]">kali-minimal — Headless Virtualization ISOs</h3>
                  <span className="text-[10px] text-[#8f887c]">Debian Live-Build / Linux Kernel / QEMU</span>
                </div>
                <p className="text-[#b5ada1] mt-1 leading-relaxed">
                  Stripped Kali Linux down to under 500MB compressed bootable ISOs for ARM64 and x86_64, configured for instant headless boot and serial terminal passthrough in UTM SE and QEMU.
                </p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="border-t border-[#e8e1d5]/15 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8f887c]">
            <span>Activity: 934+ GitHub contributions in the past year</span>
            <span>Available for engineering roles &amp; high-impact collaborations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
