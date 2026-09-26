import React from "react";
import { ArrowUpRight, Check, Copy, ExternalLink, GitBranch, Github, Layers, Shield, Terminal, X } from "lucide-react";
import { toast } from "sonner";

export interface ProjectDetail {
  name: string;
  displayName: string;
  type: string;
  language: string;
  description: string;
  stat: string;
  url: string;
  image: string;
  isFork?: boolean;
  architectureNotes?: string;
  highlights?: string[];
  techStack?: string[];
  solvedChallenges?: string;
}

// Architectural knowledge base for Tasfiya's key projects
export const PROJECT_DETAILS_MAP: Record<string, Partial<ProjectDetail>> = {
  "PS2-WebXperience": {
    architectureNotes:
      "A high-fidelity browser recreation of the iconic PlayStation 2 System Architecture UI. Engineered with custom Web Audio synthesis for authentic startup ambient frequencies, 60fps hardware-accelerated Framer Motion navigation curves, and procedural 3D particle star fields.",
    highlights: [
      "Custom synthesized startup chime & sound engine without heavy pre-baked audio",
      "Procedural 3D star field with variable camera rotation angles",
      "Responsive navigation physics mimicking Sony's original 128-bit Emotion Engine OS",
      "Zero runtime lag with optimized Vite bundle tree-shaking",
    ],
    techStack: ["TypeScript", "React", "Vite", "Framer Motion", "Web Audio API", "Tailwind CSS"],
    solvedChallenges:
      "Balancing authentic retro CRT glow and audio waveform precision inside modern browser sandboxes without performance degradation across mobile viewports.",
  },
  "ishkali-vnc": {
    architectureNotes:
      "A complete, portable hacker lab engineered specifically for the iOS iSH userland x86 emulator. Pre-compiled Alpine 3.14 rootfs containing over 925 essential commands, security auditing utilities, compilers, network analyzers, and a lightweight VNC server for graphical access.",
    highlights: [
      "Customized Alpine 3.14 x86 root filesystem tailored for iSH iOS sandbox constraints",
      "Integrated TigerVNC server with lightweight window manager for touch interfaces",
      "Pre-configured suite of 925+ pentesting, reverse-engineering, and C/Python compilers",
      "Automated one-line bootstrap installation script with checksum validation",
    ],
    techStack: ["Alpine Linux", "x86 Emulation", "Bash", "TigerVNC", "iSH iOS", "Networking"],
    solvedChallenges:
      "Overcoming the severe memory and syscall limitations of userland x86 emulation on iOS while maintaining stable socket operations and compiler functionality.",
  },
  "kali-minimal": {
    architectureNotes:
      "Stripped-down, ultra-minimal terminal-focused Kali Linux distribution ISOs designed for lightweight virtualization inside UTM SE, QEMU, and low-spec environments on i386, ARM64, and x86_64 architectures.",
    highlights: [
      "Minimal footprint: sub-500MB compressed bootable ISO images",
      "Pre-configured for headless QEMU console redirection and serial port passthrough",
      "Multi-arch support across i386, ARM64, and x86_64 instruction sets",
      "Rapid boot sequence in under 4 seconds in constrained virtual machines",
    ],
    techStack: ["Kali Linux", "Debian Live-Build", "Linux Kernel", "QEMU", "UTM SE", "Bash"],
    solvedChallenges:
      "Aggressively stripping non-essential firmware and GUI overhead while preserving essential penetration testing network toolchains and cryptographic libraries.",
  },
  "penbox": {
    architectureNotes:
      "A monolithic 72-in-1 Python command-line penetration testing workbench. Provides structured modular wrappers for network mapping, wireless WPA2 handshake capture analysis, shellcode generation, hash cracking, and OSINT investigation.",
    highlights: [
      "Modular plugin-based architecture for easily extending new exploit definitions",
      "Automated socket-level port scanning with multi-threaded banner grabbing",
      "Integrated wordlist generators, hashing primitives, and payload encoders",
      "Interactive ncurses-style terminal interface with history and parameter memories",
    ],
    techStack: ["Python 3", "Sockets", "Cryptography", "Network Protocols", "OSINT", "Linux CLI"],
    solvedChallenges:
      "Unifying heterogeneous CLI pentest tools with disparate argument structures into a coherent, self-updating interactive terminal console.",
  },
  "phishGard": {
    architectureNotes:
      "Automated defensive threat intelligence system for detecting zero-day phishing campaigns. Analyzes target URLs using headless browser DOM traversal, visual entropy heuristics, SSL certificate lineage inspection, and AI threat verification.",
    highlights: [
      "Dual-layer verification: Static lexical URL analysis + Dynamic DOM inspection",
      "Headless browser auditing for capturing redirected credential harvester flows",
      "Visual similarity scoring against top financial and enterprise login portals",
      "Real-time heuristic risk scoring with contextual mitigation advice",
    ],
    techStack: ["TypeScript", "Node.js", "Puppeteer", "Gemini API", "Cybersecurity", "Heuristics"],
    solvedChallenges:
      "Detecting sophisticated phishing setups that deploy anti-bot cloaking scripts and multi-hop domain redirects designed to fool simple DNS blocklists.",
  },
  "cronjob": {
    architectureNotes:
      "Lightweight visual cron orchestration and HTTP endpoint monitor. Visualizes upcoming cron schedules, measures jitter and latency variance on HTTP pings, and dispatches deduplicated failure notifications across webhook channels.",
    highlights: [
      "Visual cron parser with human-readable next-execution schedule projections",
      "Low-overhead heartbeat worker with microsecond HTTP latency tracking",
      "Intelligent alert deduplication to prevent notification fatigue during outages",
      "Clean dashboard with historical uptime metrics and status codes",
    ],
    techStack: ["TypeScript", "React", "Node.js", "Cron Engine", "Webhooks", "Tailwind CSS"],
    solvedChallenges:
      "Ensuring sub-second accuracy across concurrent scheduled tasks while keeping the host daemon resource footprint below 30MB of RAM.",
  },
  "mycat-companion": {
    architectureNotes:
      "A cross-platform desktop companion application combining interactive virtual pet physics, Pomodoro focus cycles, distraction blocking, desktop sticky notes, and smooth cursor eye-tracking.",
    highlights: [
      "Smooth trigonometric eye-tracking algorithms following cursor vector velocities",
      "Built-in Pomodoro productivity timers with customizable audio signals",
      "Floating desktop canvas with translucent borderless window management",
      "Multiple themes and expressive animation state machines",
    ],
    techStack: ["Python", "PyQt / Tkinter", "Math & Trigonometry", "Desktop Systems", "Audio"],
    solvedChallenges:
      "Maintaining smooth 60fps eye tracking and sprite animation without consuming noticeable CPU cycles during background desktop idle states.",
  },
  "StressTest-wasm": {
    architectureNotes:
      "A high-performance WebAssembly and Rust-based stress testing and mathematical throughput benchmarking harness. Evaluates client-side memory safety, SIMD matrix multiplication cycles, thread jitter, and CPU throughput directly inside modern WebAssembly runtimes.",
    highlights: [
      "Rust-compiled WebAssembly binary targeted for near-native CPU computation speed",
      "SIMD floating point matrix operations for realistic compute load testing",
      "Microsecond-accurate latency and memory allocation telemetry",
      "Cross-platform execution within headless Node.js and browser WebAssembly sandbox",
    ],
    techStack: ["Rust", "WebAssembly (WASM)", "SIMD", "Benchmarking", "Systems Engineering"],
    solvedChallenges:
      "Mitigating browser thread starvation during intensive compute cycles through asynchronous yielding while maintaining peak FLOPS measurement fidelity.",
  },
  "Stress-Tester": {
    architectureNotes:
      "XIO Stress Tester is an ultra-fast, modern, cluster-driven HTTP load generator designed to benchmark servers, stress-test firewalls, and audit Web Application Firewalls (WAF) under massive concurrency waves.",
    highlights: [
      "Multi-worker cluster architecture utilizing all available host CPU cores",
      "Configurable attack/load profiles: steady ramp, pulse waves, and burst spikes",
      "Real-time P95 and P99 latency percentiles with HTTP status code distributions",
      "WAF rule bypass auditing and connection pool exhaustion diagnostics",
    ],
    techStack: ["TypeScript", "Node.js Cluster", "HTTP/2", "Network Protocols", "Security Auditing"],
    solvedChallenges:
      "Overcoming Node.js single-thread event loop I/O bottlenecks to achieve tens of thousands of outbound HTTP requests per second with negligible client-side jitter.",
  },
  "stress-test-server": {
    architectureNotes:
      "Permanent high-performance HTTP testing target server and synthetic discovery fixture. Built to receive high-concurrency load tests with live telemetry logging and automated ephemeral buffer cleanup.",
    highlights: [
      "High-throughput endpoint targets with programmable delay and jitter injectors",
      "Automated periodic buffer flushes to sustain days of non-stop stress testing",
      "Detailed request inspection headers and live socket health diagnostics",
    ],
    techStack: ["TypeScript", "Express", "Sockets", "Benchmarking Target", "Linux"],
    solvedChallenges:
      "Handling thousands of concurrent keep-alive socket connections without leaking memory or file descriptors under prolonged load.",
  },
};

interface ProjectInspectorModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

export function ProjectInspectorModal({ project, onClose }: ProjectInspectorModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!project) return null;

  const enriched = {
    ...project,
    ...PROJECT_DETAILS_MAP[project.name],
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(project.url);
      setCopied(true);
      toast.success("Repository URL copied to clipboard", {
        description: project.url,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#141413] border border-[#e8e1d5]/20 text-[#e8e1d5] p-6 sm:p-8 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-[#e8e1d5]/15 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-[#d8894b]">
            <Terminal size={14} />
            <span>Project Field Note / 0x{project.name.slice(0, 4)}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#a59e92] hover:text-[#d8894b] p-1 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Project Title & Classification */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#a59e92] tracking-wider uppercase mb-2">
            <span>{enriched.type}</span>
            <span className="text-[#e8e1d5]/30">/</span>
            <span className="text-[#d8894b] font-mono">{enriched.language}</span>
            <span className="text-[#e8e1d5]/30">/</span>
            <span className="text-[#a59e92]">{enriched.stat}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#e8e1d5] font-semibold tracking-tight">
            {enriched.displayName || enriched.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c6beb1] font-mono">
            {enriched.description}
          </p>
        </div>

        {/* Architecture & Engineering Rationale */}
        {enriched.architectureNotes && (
          <div className="mb-6 p-4 bg-[#1a1a18] border-l-2 border-[#d8894b]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#d8894b] mb-2 font-mono">
              <Layers size={13} />
              <span>Architectural Rationale</span>
            </div>
            <p className="text-xs leading-relaxed text-[#b5ada1] font-mono">
              {enriched.architectureNotes}
            </p>
          </div>
        )}

        {/* Technical Highlights */}
        {enriched.highlights && enriched.highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-[#a59e92] mb-3 flex items-center gap-2 font-mono">
              <Shield size={13} className="text-[#d8894b]" />
              <span>Key Technical Highlights</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#c6beb1] font-mono">
              {enriched.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#d8894b] mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solved Engineering Challenges */}
        {enriched.solvedChallenges && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-[#a59e92] mb-2 font-mono">
              Engineering Constraint & Resolution
            </h3>
            <p className="text-xs leading-relaxed text-[#8f887c] font-mono">
              {enriched.solvedChallenges}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {enriched.techStack && enriched.techStack.length > 0 && (
          <div className="mb-8 border-t border-[#e8e1d5]/10 pt-4">
            <div className="text-[10px] uppercase tracking-widest text-[#a59e92] mb-2 font-mono">
              Stack Architecture
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-[#d8894b]">
              {enriched.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-[#1c1c1a] border border-[#e8e1d5]/15 text-[#e8e1d5] text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e8e1d5]/15">
          <button
            onClick={copyUrl}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#a59e92] hover:text-[#e8e1d5] transition-colors border border-[#e8e1d5]/20 hover:border-[#e8e1d5]/40"
          >
            {copied ? <Check size={14} className="text-[#d8894b]" /> : <Copy size={14} />}
            <span>{copied ? "URL Copied" : "Copy Repository URL"}</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={enriched.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#d8894b] text-[#111110] font-mono text-xs font-bold hover:bg-[#e49b5d] transition-colors"
            >
              <Github size={15} />
              <span>Inspect on GitHub</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
