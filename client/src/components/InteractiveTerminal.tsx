import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Maximize2, Minimize2, Terminal as TerminalIcon, X } from "lucide-react";
import { toast } from "sonner";
import { PROJECT_DETAILS_MAP } from "./ProjectInspectorModal";

interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject: (name: string) => void;
  onOpenResume: () => void;
}

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export function InteractiveTerminal({
  isOpen,
  onClose,
  onOpenProject,
  onOpenResume,
}: InteractiveTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      command: "welcome",
      output: (
        <div className="text-xs space-y-1.5 text-[#b5ada1]">
          <p className="text-[#d8894b] font-bold">
            TAAISSU SYSTEMS CONSOLE [v2.6.4]
          </p>
          <p>Type <span className="text-[#e8e1d5] underline">help</span> to list commands, or use quick pills below.</p>
          <p className="text-[10px] text-[#787268]">Host: taaissu-station · Node v22.x · User: guest</p>
        </div>
      ),
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputs]);

  // Global Ctrl+K or ` shortcut handled here or in Home
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input.trim());
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInput(history[history.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const executeCommand = (cmd: string) => {
    if (!cmd) return;
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput("");

    const lower = cmd.toLowerCase().trim();
    const parts = lower.split(" ");
    const root = parts[0];
    const arg = parts.slice(1).join(" ");

    let outputNode: React.ReactNode = null;

    switch (root) {
      case "help":
        outputNode = (
          <div className="text-xs space-y-1 font-mono text-[#c6beb1]">
            <p className="text-[#d8894b] font-bold mb-1">Available System Directives:</p>
            <div className="grid grid-cols-[140px_1fr] gap-x-2 gap-y-1">
              <span className="text-[#e8e1d5]">whoami</span>
              <span className="text-[#8f887c]">Identity profile, roots, and engineering thesis</span>
              <span className="text-[#e8e1d5]">skills</span>
              <span className="text-[#8f887c]">Categorized engineering capability matrix</span>
              <span className="text-[#e8e1d5]">projects</span>
              <span className="text-[#8f887c]">List active public experiments and repositories</span>
              <span className="text-[#e8e1d5]">inspect &lt;name&gt;</span>
              <span className="text-[#8f887c]">Deep-dive architecture view for a specific project</span>
              <span className="text-[#e8e1d5]">resume</span>
              <span className="text-[#8f887c]">Launch curriculum vitae field view</span>
              <span className="text-[#e8e1d5]">neofetch</span>
              <span className="text-[#8f887c]">Display system specifications &amp; ASCII art</span>
              <span className="text-[#e8e1d5]">contact</span>
              <span className="text-[#8f887c]">Direct communication channels &amp; coordinates</span>
              <span className="text-[#e8e1d5]">clear</span>
              <span className="text-[#8f887c]">Flush console output</span>
              <span className="text-[#e8e1d5]">exit</span>
              <span className="text-[#8f887c]">Terminate session and return to field view</span>
            </div>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="text-xs space-y-2 font-mono text-[#c6beb1]">
            <p>
              <strong className="text-[#d8894b]">Tasfiya Tabassum (taaissu / Quincunx33)</strong>
            </p>
            <p>
              Full-Stack Developer, Systems Enthusiast &amp; Security Researcher.
            </p>
            <p className="text-[#8f887c]">
              Thesis: "Systems should feel useful before they feel impressive."
              Focusing on low-level Linux environments (Alpine, Kali rootfs), penetration testing CLI architectures,
              real-time web systems (TypeScript, WebSockets, Canvas, MediaPipe), and resilient modern web platforms.
            </p>
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="text-xs space-y-3 font-mono text-[#c6beb1]">
            <div>
              <p className="text-[#d8894b] font-bold mb-1">01 / Security &amp; Systems Tooling</p>
              <p className="text-[#8f887c]">Kali Linux, Alpine x86 Emulation, QEMU/UTM SE, WPA2 Auditing, Socket Programming, Python Exploit Frameworks, OSINT.</p>
            </div>
            <div>
              <p className="text-[#d8894b] font-bold mb-1">02 / Modern Web &amp; Interfaces</p>
              <p className="text-[#8f887c]">TypeScript, React 19, Vite, Tailwind CSS v4, Express/Node.js, Canvas 2D/3D, MediaPipe Vision, Web Audio API.</p>
            </div>
            <div>
              <p className="text-[#d8894b] font-bold mb-1">03 / Tooling, Automation &amp; DevOps</p>
              <p className="text-[#8f887c]">Python CLI Engineering, Cronjob Daemons, Git/GitHub Actions, Docker, Linux Shell Scripting (Bash/Zsh).</p>
            </div>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="text-xs space-y-2 font-mono text-[#c6beb1]">
            <p className="text-[#d8894b] font-bold">Featured Projects (type "inspect &lt;name&gt;" or click):</p>
            <div className="space-y-1.5">
              {[
                { id: "StressTest-wasm", desc: "Rust & WebAssembly stress testing & SIMD throughput benchmark" },
                { id: "Stress-Tester", desc: "XIO cluster-driven HTTP load generator & WAF auditor" },
                { id: "PS2-WebXperience", desc: "PlayStation 2 browser simulation w/ Web Audio & Framer Motion" },
                { id: "ishkali-vnc", desc: "925+ tool Alpine x86 pentest rootfs for iOS iSH sandbox w/ VNC" },
                { id: "kali-minimal", desc: "Sub-500MB terminal-focused Kali Linux ISOs for QEMU & UTM SE" },
                { id: "penbox", desc: "72-in-1 Python CLI penetration testing workbench" },
                { id: "phishGard", desc: "Automated defensive phishing URL analysis & threat engine" },
                { id: "cronjob", desc: "Visual cron daemon & HTTP ping monitor" },
                { id: "mycat-companion", desc: "Cross-platform desktop cat companion w/ eye tracking & Pomodoro" },
              ].map((p) => (
                <div key={p.id} className="flex items-start gap-2">
                  <button
                    onClick={() => onOpenProject(p.id)}
                    className="text-[#d8894b] hover:underline font-bold text-left"
                  >
                    {p.id}
                  </button>
                  <span className="text-[#8f887c]">— {p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "inspect":
        if (!arg) {
          outputNode = <p className="text-xs text-red-400">Syntax error: inspect &lt;project-name&gt;. Example: inspect penbox</p>;
        } else {
          const matchKey = Object.keys(PROJECT_DETAILS_MAP).find(
            (k) => k.toLowerCase() === arg.toLowerCase() || k.toLowerCase().includes(arg.toLowerCase())
          );
          if (matchKey) {
            outputNode = (
              <p className="text-xs text-[#d8894b]">
                Launching field inspector for <span className="underline">{matchKey}</span>...
              </p>
            );
            setTimeout(() => onOpenProject(matchKey), 300);
          } else {
            outputNode = (
              <p className="text-xs text-[#8f887c]">
                No detailed record for '{arg}'. Type <span className="text-[#d8894b]">projects</span> to see valid names.
              </p>
            );
          }
        }
        break;

      case "resume":
      case "cv":
        outputNode = (
          <p className="text-xs text-[#d8894b]">
            Opening Curriculum Vitae field view...
          </p>
        );
        setTimeout(() => onOpenResume(), 300);
        break;

      case "neofetch":
      case "sysinfo":
        outputNode = (
          <div className="text-xs font-mono grid grid-cols-[140px_1fr] gap-4 items-center">
            <pre className="text-[#d8894b] text-[10px] leading-tight select-none">
{`   /\\_/\\  
  ( o.o ) 
   > ^ <  
  [TAAISSU]
 /_______\\ 
`}
            </pre>
            <div className="space-y-0.5 text-[11px] text-[#c6beb1]">
              <p><strong className="text-[#d8894b]">taaissu@station</strong></p>
              <p className="text-[#787268]">---------------------</p>
              <p><span className="text-[#8f887c]">OS:</span> Kali / Alpine Linux x86_64</p>
              <p><span className="text-[#8f887c]">Host:</span> Local Workstation</p>
              <p><span className="text-[#8f887c]">Uptime:</span> 934+ GitHub contributions / year</p>
              <p><span className="text-[#8f887c]">Shell:</span> zsh 5.9 / WebConsole 2.6</p>
              <p><span className="text-[#8f887c]">Stack:</span> TypeScript · Python · React · C/Bash</p>
              <p><span className="text-[#8f887c]">Identity:</span> @Quincunx33</p>
            </div>
          </div>
        );
        break;

      case "contact":
        outputNode = (
          <div className="text-xs space-y-1.5 font-mono text-[#c6beb1]">
            <p className="text-[#d8894b] font-bold">Contact Coordinates:</p>
            <p>Email: <a href="mailto:liquiderror600@gmail.com" className="text-[#e8e1d5] underline">liquiderror600@gmail.com</a></p>
            <p>GitHub: <a href="https://github.com/Quincunx33" target="_blank" rel="noreferrer" className="text-[#d8894b] underline">https://github.com/Quincunx33</a></p>
            <p>Instagram: <a href="https://instagram.com/tasfiya__tabassum__" target="_blank" rel="noreferrer" className="text-[#8f887c] underline">@tasfiya__tabassum__</a></p>
            <p>Facebook: <a href="https://facebook.com/taissuuu" target="_blank" rel="noreferrer" className="text-[#8f887c] underline">taissuuu</a></p>
          </div>
        );
        break;

      case "clear":
        setOutputs([]);
        return;

      case "exit":
      case "quit":
        onClose();
        return;

      default:
        outputNode = (
          <p className="text-xs text-[#8f887c]">
            Command not recognized: <span className="text-red-400">{cmd}</span>. Type <span className="text-[#d8894b]">help</span> for options.
          </p>
        );
    }

    setOutputs((prev) => [...prev, { command: cmd, output: outputNode }]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${
          isExpanded ? "max-w-5xl h-[85vh]" : "max-w-2xl h-[520px]"
        } flex flex-col bg-[#111110] border border-[#d8894b]/40 shadow-2xl shadow-black font-mono transition-all duration-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#171715] border-b border-[#e8e1d5]/15 text-[#e8e1d5] select-none">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8894b] inline-block animate-pulse" />
            <span className="text-[#d8894b] font-bold">taaissu@station:~</span>
            <span className="text-[10px] text-[#8f887c] hidden sm:inline">[zsh]</span>
          </div>
          <div className="flex items-center gap-2 text-[#a59e92]">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:text-[#d8894b] transition-colors"
              title={isExpanded ? "Collapse" : "Maximize"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-[#d8894b] transition-colors"
              title="Close terminal (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {outputs.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.command !== "welcome" && (
                <div className="flex items-center gap-2 text-[#d8894b]">
                  <span>taaissu@station:~$</span>
                  <span className="text-[#e8e1d5]">{item.command}</span>
                </div>
              )}
              <div className="pl-0">{item.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#141413] border-t border-[#e8e1d5]/10 flex flex-wrap gap-2 text-[10px] text-[#a59e92]">
          <span className="text-[#8f887c] py-0.5">Quick triggers:</span>
          {["whoami", "skills", "projects", "resume", "neofetch", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2 py-0.5 border border-[#e8e1d5]/15 hover:border-[#d8894b] hover:text-[#d8894b] transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111110] border-t border-[#e8e1d5]/15">
          <span className="text-[#d8894b] text-xs font-bold whitespace-nowrap">
            taaissu@station:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 outline-none text-[#e8e1d5] font-mono text-xs placeholder-[#545048]"
            placeholder="Type 'help' or command..."
            autoFocus
          />
          <button
            onClick={() => executeCommand(input.trim())}
            className="text-[10px] uppercase tracking-wider text-[#d8894b] border border-[#d8894b]/40 px-2 py-1 hover:bg-[#d8894b] hover:text-[#111110] transition-colors font-bold"
          >
            Run ↵
          </button>
        </div>
      </div>
    </div>
  );
}
