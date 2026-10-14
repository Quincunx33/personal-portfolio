import React from "react";
import { Calendar, CheckCircle2, ChevronRight, Milestone } from "lucide-react";

interface MilestoneItem {
  year: string;
  quarter?: string;
  title: string;
  theme: string;
  points: string[];
}

const MILESTONES: MilestoneItem[] = [
  {
    year: "2026",
    quarter: "Current Focus",
    theme: "Defensive Intelligence & Resilient Web Systems",
    title: "Automated Auditing & High-Fidelity Web Interfaces",
    points: [
      "Engineered PhishGard: dual-layer defensive threat analysis combining headless DOM inspection with heuristic entropy scoring.",
      "Shipped Cronjob visual orchestration: heartbeat health pings, microsecond jitter tracking, and alert deduplication.",
      "Enhanced responsive editorial systems and client-side performance architectures.",
    ],
  },
  {
    year: "2025",
    theme: "Virtualization & Embedded Environments",
    title: "Alpine x86 Rootfs & Minimalist Kali Distros",
    points: [
      "Compiled and deployed ishkali-vnc: pre-built Alpine 3.14 x86 rootfs for iOS iSH sandbox bundling 925+ pentest tools, compilers, and TigerVNC.",
      "Engineered kali-minimal: sub-500MB terminal-only Kali Linux ISOs for ARM64 and x86_64 virtualization in UTM SE and QEMU.",
      "Explored userland syscall emulation and socket passthrough on constrained hardware.",
    ],
  },
  {
    year: "2024",
    theme: "Open-Source Security Tooling",
    title: "Python Security Architecture & CLI Workbenches",
    points: [
      "Authored and published penbox: a 72-in-1 modular Python CLI penetration testing toolbox.",
      "Implemented socket-based multi-threaded port discovery, wireless WPA2 handshake parsing, and OSINT workflow automation.",
      "Contributed to open-source security toolchains and developer utilities.",
    ],
  },
  {
    year: "2023",
    theme: "Interactive Physics & Systems Simulation",
    title: "Browser Hardware Recreations & Computer Vision",
    points: [
      "Engineered PS2-WebXperience: authentic PlayStation 2 OS simulation featuring custom Web Audio harmonic synthesis and 60fps navigation curves.",
      "Developed real-time computer vision experiments using Google MediaPipe hand landmark tracking for gesture-driven audio/visual effects.",
      "Began active open-source footprint on GitHub (@Quincunx33), crossing 900+ annual contributions.",
    ],
  },
];

export function EngineeringTimeline() {
  return (
    <section className="timeline-section py-24 px-[11vw] bg-[#111110] text-[#e8e1d5]">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_260px] gap-8 items-end mb-14">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#d8894b] flex items-center gap-3">
          <span className="text-[#e8e1d5]">03</span>
          <span>Trajectory</span>
        </div>
        <div>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-[0.88]">
            Engineering <br />
            <em className="font-serif italic font-normal text-[#d8894b]">milestones.</em>
          </h2>
        </div>
        <p className="text-xs text-[#a59e92] font-mono leading-relaxed">
          From hardware emulations and minimal Linux kernels to modern reactive web platforms.
        </p>
      </div>

      {/* Timeline track */}
      <div className="relative border-l border-[#e8e1d5]/20 ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12 font-mono">
        {MILESTONES.map((item, index) => (
          <div key={item.year} className="relative group">
            {/* Timeline Marker Dot */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3 h-3 rounded-full bg-[#111110] border-2 border-[#d8894b] group-hover:bg-[#d8894b] transition-colors" />

            {/* Year & Tag */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
              <span className="font-bold text-lg text-[#d8894b]">{item.year}</span>
              {item.quarter && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#d8894b]/40 text-[#d8894b] bg-[#d8894b]/10">
                  {item.quarter}
                </span>
              )}
              <span className="text-[#787268]">/</span>
              <span className="text-xs text-[#a59e92] uppercase tracking-wider">{item.theme}</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold text-[#e8e1d5] mb-3 group-hover:text-[#d8894b] transition-colors">
              {item.title}
            </h3>

            {/* Bullet points */}
            <ul className="space-y-2 text-xs text-[#b5ada1] leading-relaxed max-w-2xl">
              {item.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#d8894b] mt-0.5">›</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
