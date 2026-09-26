import React, { useState } from "react";
import { Cpu, Globe, Server, Shield, Terminal, Zap } from "lucide-react";

interface SkillItem {
  name: string;
  category: "security" | "web" | "devops";
  description: string;
  appliedIn: string;
  level: "Advanced" | "Proficient" | "Core";
}

const SKILLS_DATA: SkillItem[] = [
  // Security & Systems
  {
    name: "Kali Linux & Penetration Toolchains",
    category: "security",
    description: "Custom ISO live-builds, kernel trimming, headless VM orchestration, wireless & network audit tooling.",
    appliedIn: "kali-minimal, penbox",
    level: "Advanced",
  },
  {
    name: "Userland x86 Emulation & Rootfs",
    category: "security",
    description: "Alpine 3.14 x86 root filesystem packaging, syscall limitation mitigation inside iOS sandbox.",
    appliedIn: "ishkali-vnc",
    level: "Advanced",
  },
  {
    name: "WebAssembly & Rust Systems",
    category: "security",
    description: "Rust-compiled WASM modules, SIMD float matrix operations, execution jitter reduction, microsecond benchmarks.",
    appliedIn: "StressTest-wasm",
    level: "Advanced",
  },
  {
    name: "Cluster Load & WAF Stress Testing",
    category: "security",
    description: "Multi-worker Node.js cluster HTTP generation, firewall benchmarking, and connection pool exhaustion diagnostics.",
    appliedIn: "Stress-Tester, stress-test-server",
    level: "Advanced",
  },
  {
    name: "Python Security Architecture",
    category: "security",
    description: "Multi-threaded socket port scanners, WPA2 handshake analysis, payload encoders, OSINT tools.",
    appliedIn: "penbox",
    level: "Advanced",
  },
  {
    name: "Automated Defensive Auditing",
    category: "security",
    description: "Headless browser DOM traversal, redirect tracing, visual similarity heuristics, and anti-phishing intelligence.",
    appliedIn: "phishGard",
    level: "Proficient",
  },

  // Web & Interfaces
  {
    name: "TypeScript & ESNext",
    category: "web",
    description: "Strict typing, functional architectures, asynchronous streams, and reactive UI patterns.",
    appliedIn: "PS2-WebXperience, cronjob, personal-portfolio",
    level: "Advanced",
  },
  {
    name: "React 19 & Modern Component Systems",
    category: "web",
    description: "Vite workflows, custom hooks, headless UI integrations, state decoupling, and responsive design systems.",
    appliedIn: "PS2-WebXperience, personal-portfolio",
    level: "Advanced",
  },
  {
    name: "Computer Vision & MediaPipe",
    category: "web",
    description: "Real-time 21-joint 3D hand tracking, gesture state machines, Web Audio triggering, HTML5 Canvas shaders.",
    appliedIn: "naruto-sasuke",
    level: "Proficient",
  },
  {
    name: "Web Audio & Retro Simulation Physics",
    category: "web",
    description: "Dynamic algorithmic harmonic synthesis, 60fps Framer Motion navigation physics, CRT shaders.",
    appliedIn: "PS2-WebXperience",
    level: "Advanced",
  },

  // DevOps & Tooling
  {
    name: "Automation & Daemon Engineering",
    category: "devops",
    description: "Visual cron syntax parsers, HTTP heartbeat probes, microsecond jitter tracking, alert deduplication.",
    appliedIn: "cronjob",
    level: "Advanced",
  },
  {
    name: "Virtualization (QEMU & UTM SE)",
    category: "devops",
    description: "Console redirection, serial tty passthrough, cross-architecture ISO builds across x86_64, ARM64, i386.",
    appliedIn: "kali-minimal, ishkali-vnc",
    level: "Proficient",
  },
  {
    name: "Linux Shell Scripting & UNIX Tooling",
    category: "devops",
    description: "Automated installation scripts, checksum verification, cron management, environment bootstrapping.",
    appliedIn: "ishkali-vnc, kali-minimal",
    level: "Advanced",
  },
  {
    name: "Git & Open-Source Maintenance",
    category: "devops",
    description: "Managing 934+ annual contributions, CI/CD automated validations, public repository documentation.",
    appliedIn: "Quincunx33 public lab",
    level: "Core",
  },
];

export function TechnicalArsenal() {
  const [activeCategory, setActiveCategory] = useState<"all" | "security" | "web" | "devops">("all");

  const filtered = activeCategory === "all"
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section className="arsenal-section py-24 px-[11vw] bg-[#141413] border-t border-b border-[#e8e1d5]/15 text-[#e8e1d5]">
      {/* Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_260px] gap-8 items-end mb-12">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#d8894b] flex items-center gap-3">
          <span className="text-[#e8e1d5]">02</span>
          <span>Technical Arsenal</span>
        </div>
        <div>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-[0.88]">
            Systems, security, <br />
            <em className="font-serif italic font-normal text-[#d8894b]">&amp; modern web.</em>
          </h2>
        </div>
        <p className="text-xs text-[#a59e92] font-mono leading-relaxed">
          Crafting tools at the intersection of low-level OS environments and fluid browser interfaces.
        </p>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e8e1d5]/15 pb-4 font-mono text-xs">
        {[
          { id: "all", label: "All Capabilities" },
          { id: "security", label: "01 / Security & Systems" },
          { id: "web", label: "02 / Web & Interfaces" },
          { id: "devops", label: "03 / Automation & Tooling" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3 py-1.5 transition-colors uppercase tracking-wider text-[11px] ${
              activeCategory === tab.id
                ? "border border-[#d8894b] text-[#d8894b] bg-[#d8894b]/10"
                : "border border-transparent text-[#a59e92] hover:text-[#e8e1d5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filtered.map((skill) => (
          <div
            key={skill.name}
            className="p-5 bg-[#171715] border border-[#e8e1d5]/15 hover:border-[#d8894b]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] text-[#a59e92] uppercase tracking-wider mb-2">
                <span className="text-[#d8894b]">
                  {skill.category === "security" && "Security & Kernel"}
                  {skill.category === "web" && "Web & Platform"}
                  {skill.category === "devops" && "Automation & Systems"}
                </span>
                <span className="text-[#787268]">{skill.level}</span>
              </div>
              <h3 className="text-sm font-bold text-[#e8e1d5] group-hover:text-[#d8894b] transition-colors mb-2">
                {skill.name}
              </h3>
              <p className="text-xs text-[#a59e92] leading-relaxed mb-4">
                {skill.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#e8e1d5]/10 text-[10px] text-[#8f887c]">
              <span className="text-[#787268] uppercase tracking-wider">Applied in: </span>
              <span className="text-[#e8e1d5]">{skill.appliedIn}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
