import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Play,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface CommandHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
  type: "success" | "info" | "error" | "warning" | "system";
}

interface DeveloperConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

const ASCII_BANNER = `
 ████████╗ █████╗  █████╗ ██╗███████╗███████╗██╗   ██╗
╚══██╔══╝██╔══██╗██╔══██╗██║██╔════╝██╔════╝██║   ██║
   ██║   ███████║███████║██║███████╗███████╗██║   ██║
   ██║   ██╔══██║██╔══██║██║╚════██║╚════██║██║   ██║
   ██║   ██║  ██║██║  ██║██║███████║███████║╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝ ╚═════╝ 
   [Quincunx33 Developer Terminal & Execution Block v2.8]
`;

const HACKER_QUOTES = [
  "“There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.” — C.A.R. Hoare",
  "“Code is like humor. When you have to explain it, it’s bad.” — Cory House",
  "“Fix the cause, not the symptom.” — Steve Maguire",
  "“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra",
  "“Make it work, make it right, make it fast.” — Kent Beck",
];

export function DeveloperConsole({ isOpen, onClose, onOpenContact }: DeveloperConsoleProps) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: "init-1",
      command: "sys.boot",
      output: (
        <div className="space-y-1 text-xs font-mono text-[#d8894b]">
          <pre className="text-[10px] leading-tight text-[#d8894b]/90 overflow-x-auto">{ASCII_BANNER}</pre>
          <p className="text-[#a59e92]">Kernel: Linux taaissu-core 6.14.0-custom #1 SMP PREEMPT_DYNAMIC x86_64</p>
          <p className="text-[#e8e1d5]">Connected to live GitHub repos & telemetry stream. Type <span className="text-[#d8894b] font-bold">help</span> to list available commands.</p>
        </div>
      ),
      timestamp: new Date().toLocaleTimeString(),
      type: "system",
    },
  ]);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    setCommandLog((prev) => [...prev, cmd]);
    setCommandIndex(-1);
    setInputVal("");

    const timestamp = new Date().toLocaleTimeString();
    let outputNode: React.ReactNode = null;
    let type: CommandHistoryItem["type"] = "success";

    const lowerCmd = cmd.toLowerCase();
    const parts = lowerCmd.split(" ");
    const rootCmd = parts[0];
    const arg = parts.slice(1).join(" ");

    switch (rootCmd) {
      case "help":
        outputNode = (
          <div className="space-y-2 text-xs font-mono text-[#e8e1d5]">
            <p className="text-[#d8894b] font-bold">AVAILABLE SYSTEM COMMANDS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div><span className="text-[#d8894b]">help</span> - Display this help manual</div>
              <div><span className="text-[#d8894b]">repos / ls</span> - List all GitHub repositories</div>
              <div><span className="text-[#d8894b]">neofetch</span> - System & environment specs</div>
              <div><span className="text-[#d8894b]">whoami</span> - Maker identity & location</div>
              <div><span className="text-[#d8894b]">matrix</span> - Toggle matrix telemetry feed</div>
              <div><span className="text-[#d8894b]">skills</span> - View active tech stack & skills</div>
              <div><span className="text-[#d8894b]">quote</span> - Random software engineering quote</div>
              <div><span className="text-[#d8894b]">weather</span> - Khulna atmospheric telemetry</div>
              <div><span className="text-[#d8894b]">history</span> - Show executed command history</div>
              <div><span className="text-[#d8894b]">contact</span> - Open quick transmission modal</div>
              <div><span className="text-[#d8894b]">clear</span> - Clear terminal session log</div>
              <div><span className="text-[#d8894b]">date</span> - Display current ISO timestamp</div>
              <div><span className="text-[#d8894b]">ping [host]</span> - Simulated network latency test</div>
              <div><span className="text-[#d8894b]">sudo [cmd]</span> - Execute privileged developer command</div>
              <div><span className="text-[#d8894b]">cat README</span> - Read portfolio project summary</div>
            </div>
          </div>
        );
        break;

      case "repos":
      case "ls":
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-[#e8e1d5]">
            <p className="text-[#d8894b] font-bold">PUBLIC REPOSITORIES (@Quincunx33):</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#a59e92]">
              <li><span className="text-[#e8e1d5]">PS2-WebXperience</span> — Nostalgic PS2 browser simulation</li>
              <li><span className="text-[#e8e1d5]">ishkali-vnc</span> — Alpine rootfs with 925+ pentest commands</li>
              <li><span className="text-[#e8e1d5]">kali-minimal</span> — Minimal Kali Linux ARM64/x86 ISOs</li>
              <li><span className="text-[#e8e1d5]">penbox</span> — 72-in-1 Python penetration testing toolbox</li>
              <li><span className="text-[#e8e1d5]">mycat-companion</span> — Desktop cat companion with Pomodoro</li>
              <li><span className="text-[#e8e1d5]">Ai-jailbreak</span> — AI safety research & exploit collection</li>
              <li><span className="text-[#e8e1d5]">cronjob</span> — Visual cron & HTTP ping dashboard</li>
            </ul>
            <p className="text-[10px] text-[#d8894b] mt-1">Total: 14 public repositories indexed.</p>
          </div>
        );
        break;

      case "neofetch":
        outputNode = (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#161614] p-3 border border-[#d8894b]/20 text-[#e8e1d5]">
            <div className="flex items-center justify-center p-2 bg-[#111110] border border-[#d8894b]/30">
              <span className="text-[#d8894b] font-bold text-lg">T33</span>
            </div>
            <div className="sm:col-span-2 space-y-1 text-[11px]">
              <p><span className="text-[#d8894b]">User:</span> tasfiya@taaissu-core</p>
              <p><span className="text-[#d8894b]">OS:</span> Linux x86_64 Web Sandbox</p>
              <p><span className="text-[#d8894b]">Host:</span> Khulna Research Node #3</p>
              <p><span className="text-[#d8894b]">Uptime:</span> 99.9% uptime</p>
              <p><span className="text-[#d8894b]">IDE:</span> Google AI Studio Build Engine</p>
              <p><span className="text-[#d8894b]">Languages:</span> TypeScript, Python, C++, Bash</p>
            </div>
          </div>
        );
        break;

      case "whoami":
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-[#e8e1d5]">
            <p className="text-[#d8894b] font-bold">Tasfiya Tabassum (taaissu / Quincunx33)</p>
            <p className="text-[#a59e92]">Location: Khulna, Bangladesh (22°48′N 89°32′E)</p>
            <p className="text-[#a59e92]">Role: Full-stack engineer & security researcher.</p>
          </div>
        );
        break;

      case "matrix":
        outputNode = (
          <div className="text-xs font-mono text-emerald-400 space-y-1 bg-black/60 p-2 border border-emerald-500/30">
            <p>INITIALIZING MATRIX TELEMETRY STREAM...</p>
            <p className="text-[10px] text-emerald-500/70">01010011 01100101 01100011 01110101 01110010 01100101</p>
            <p className="text-[10px] text-emerald-300">GitHub contributions verified: 934 commits this year.</p>
          </div>
        );
        break;

      case "quote":
        const randomQuote = HACKER_QUOTES[Math.floor(Math.random() * HACKER_QUOTES.length)];
        outputNode = <div className="text-xs font-mono text-[#d8894b] italic bg-[#161614] p-2.5 border border-[#d8894b]/20">{randomQuote}</div>;
        break;

      case "weather":
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-[#e8e1d5] bg-[#161614] p-2.5 border border-[#d8894b]/20">
            <p className="text-[#d8894b] font-bold">KHULNA METEOROLOGICAL STATION:</p>
            <p className="text-[#a59e92]">Temperature: 29°C (Feels like 34°C)</p>
            <p className="text-[#a59e92]">Condition: Clear skies & moderate breeze</p>
            <p className="text-[#a59e92]">Humidity: 72% | Wind: 12 km/h SSE</p>
          </div>
        );
        break;

      case "history":
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-[#e8e1d5]">
            <p className="text-[#d8894b] font-bold">COMMAND EXECUTION HISTORY ({commandLog.length}):</p>
            <ul className="list-decimal list-inside space-y-0.5 text-[11px] text-[#a59e92]">
              {commandLog.map((c, idx) => (
                <li key={idx}><span className="text-[#e8e1d5]">{c}</span></li>
              ))}
            </ul>
          </div>
        );
        break;

      case "contact":
        if (onOpenContact) {
          onOpenContact();
          outputNode = <span className="text-xs font-mono text-[#d8894b]">Opening transmission modal...</span>;
        } else {
          outputNode = <span className="text-xs font-mono text-[#e8e1d5]">Email: liquiderror600@gmail.com</span>;
        }
        break;

      case "clear":
        setHistory([]);
        return;

      case "date":
        outputNode = <span className="text-xs font-mono text-[#e8e1d5]">{new Date().toISOString()}</span>;
        break;

      case "ping":
        const target = arg || "github.com";
        outputNode = (
          <div className="text-xs font-mono space-y-0.5 text-[#e8e1d5]">
            <p>PING {target} (140.82.112.4) 56(84) bytes of data.</p>
            <p className="text-[#a59e92]">64 bytes from {target}: icmp_seq=1 ttl=56 time=14.2 ms</p>
            <p className="text-[#a59e92]">64 bytes from {target}: icmp_seq=2 ttl=56 time=13.8 ms</p>
            <p className="text-[#d8894b]">--- {target} ping statistics ---</p>
            <p className="text-[11px]">2 packets transmitted, 2 received, 0% packet loss, time 1002ms</p>
          </div>
        );
        break;

      case "sudo":
        if (arg.includes("rm") || arg.includes("sh") || arg.includes("exec")) {
          type = "error";
          outputNode = (
            <div className="text-xs font-mono text-red-400 space-y-1">
              <p className="flex items-center gap-1 font-bold"><ShieldAlert size={14} /> SECURITY EXCEPTION:</p>
              <p>Permission denied. Incident logged to Khulna security audit stream.</p>
            </div>
          );
        } else {
          outputNode = (
            <div className="text-xs font-mono text-[#d8894b] space-y-1">
              <p>[SUDO] Executing privileged task: {arg || "none"}...</p>
              <p className="text-[#e8e1d5]">Command executed successfully with elevated privileges.</p>
            </div>
          );
        }
        break;

      case "skills":
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-[#e8e1d5]">
            <p className="text-[#d8894b] font-bold">CORE TECH STACK & COMPETENCIES:</p>
            <p className="text-[#a59e92]">Languages: TypeScript, JavaScript, Python, C++, HTML5/CSS3</p>
            <p className="text-[#a59e92]">Frameworks: React, Vite, Tailwind CSS, Node.js, Express</p>
            <p className="text-[#a59e92]">Security: Penetration Testing, WPA2 Analysis, Python Tooling</p>
          </div>
        );
        break;

      case "cat":
        if (arg.includes("readme") || arg.includes("readme.md") || !arg) {
          outputNode = (
            <div className="text-xs font-mono text-[#e8e1d5] space-y-1 bg-[#161614] p-2 border border-[#d8894b]/20">
              <p className="text-[#d8894b] font-bold"># taaissu / Quincunx33 Portfolio</p>
              <p className="text-[#a59e92]">Personal engineering playground and project archive. Built with React 19, TypeScript, and Vite.</p>
            </div>
          );
        } else {
          type = "error";
          outputNode = <span className="text-xs font-mono text-red-400">cat: {arg}: No such file or directory</span>;
        }
        break;

      default:
        type = "error";
        outputNode = (
          <span className="text-xs font-mono text-red-400">
            command not found: {rootCmd}. Type <span className="text-[#d8894b]">help</span> for valid commands.
          </span>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: cmd,
        output: outputNode,
        timestamp,
        type,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (commandLog.length === 0) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = commandIndex + 1;
      if (nextIndex < commandLog.length) {
        setCommandIndex(nextIndex);
        setInputVal(commandLog[commandLog.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = commandIndex - 1;
      if (nextIndex >= 0) {
        setCommandIndex(nextIndex);
        setInputVal(commandLog[commandLog.length - 1 - nextIndex]);
      } else if (nextIndex === -1) {
        setCommandIndex(-1);
        setInputVal("");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full bg-[#111110] border border-[#d8894b]/40 shadow-2xl shadow-black flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized ? "h-[96vh] max-w-[98vw]" : "h-[80vh] max-w-4xl"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#161614] border-b border-[#e8e1d5]/10 select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon size={16} className="text-[#d8894b]" />
            <span className="font-mono text-xs font-bold text-[#e8e1d5] tracking-wide">
              taaissu-dev-console ~ bash
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-[#d8894b]/15 text-[#d8894b] border border-[#d8894b]/30">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="p-1 text-[#a59e92] hover:text-[#e8e1d5] transition-colors"
              title="Clear Console"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 text-[#a59e92] hover:text-[#e8e1d5] transition-colors"
              title={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-[#a59e92] hover:text-red-400 transition-colors"
              title="Close Console"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#141412] border-b border-[#e8e1d5]/10 overflow-x-auto text-[11px] font-mono whitespace-nowrap">
          <span className="text-[#a59e92] text-[10px] mr-1 uppercase">Quick:</span>
          {["help", "repos", "neofetch", "whoami", "matrix", "quote", "weather", "skills", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInputVal(cmd);
                inputRef.current?.focus();
              }}
              className="px-2 py-0.5 bg-[#1f1f1d] hover:bg-[#d8894b] hover:text-[#111110] text-[#e8e1d5] border border-[#e8e1d5]/15 transition-colors text-[10px]"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono bg-[#0c0c0b]">
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5 animate-in fade-in duration-150">
              {item.type !== "system" && (
                <div className="flex items-center gap-2 text-xs text-[#a59e92]">
                  <span className="text-[#d8894b]">guest@taaissu:~$</span>
                  <span className="text-[#e8e1d5] font-semibold">{item.command}</span>
                  <span className="ml-auto text-[10px] opacity-60">{item.timestamp}</span>
                </div>
              )}
              <div className="pl-0">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 px-4 py-3 bg-[#161614] border-t border-[#e8e1d5]/15">
          <span className="text-[#d8894b] font-mono text-xs font-bold select-none">guest@taaissu:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. help, repos, neofetch, quote)..."
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-[#e8e1d5] placeholder-[#a59e92]/50"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#d8894b] text-[#111110] font-mono text-xs font-semibold flex items-center gap-1 hover:bg-[#c6783d] transition-colors"
          >
            <span>Exec</span>
            <Play size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
