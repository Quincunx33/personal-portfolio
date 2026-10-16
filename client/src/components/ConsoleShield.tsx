import { useEffect, useState, useRef } from "react";

export function ConsoleShield() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      table: console.table,
      dir: console.dir,
      debug: console.debug,
      trace: console.trace,
      clear: console.clear,
    };

    // Play subtle synthesized warning alarm using Web Audio API
    const playWarningBeep = () => {
      if (audioPlayedRef.current) return;
      audioPlayedRef.current = true;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } catch {
        // Safe to ignore if blocked
      }
    };

    const triggerRedirect = () => {
      setDevToolsOpen(true);
      playWarningBeep();

      try {
        document.body.style.overflow = "hidden";
        originalConsole.clear();
      } catch {
        // Ignore
      }
    };

    // 100% Deterministic: Detect if a call originates strictly from user's DevTools console REPL
    // (Never fires for normal app scripts, Vite HMR, or bundles)
    const isConsoleEvaluation = (): boolean => {
      try {
        const stack = new Error().stack;
        if (!stack) return false;

        const lines = stack.split("\n");
        const callerLines = lines.slice(2).join("\n");

        // Legitimate app scripts (Zero False Positives)
        const hasAppScript =
          callerLines.includes("localhost") ||
          callerLines.includes(".run.app") ||
          callerLines.includes("/client/src/") ||
          callerLines.includes("/src/") ||
          callerLines.includes("/assets/") ||
          callerLines.includes("/@fs/") ||
          callerLines.includes("/node_modules/") ||
          callerLines.includes("vite") ||
          callerLines.includes("index.html");

        if (hasAppScript) {
          return false;
        }

        // True DevTools interactive REPL caller markers
        const isFromConsoleREPL =
          callerLines.includes("<anonymous>") ||
          callerLines.includes("debugger eval code") ||
          callerLines.includes("eval code") ||
          /at VM\d+/.test(callerLines) ||
          callerLines.includes("eval at <anonymous>");

        return isFromConsoleREPL;
      } catch {
        return false;
      }
    };

    // Intercept console methods: ONLY triggers if someone evaluates in DevTools REPL
    const wrapConsoleMethod = (originalMethod: (...args: any[]) => void) => {
      return (...args: any[]) => {
        if (isConsoleEvaluation()) {
          triggerRedirect();
          return;
        }
        originalMethod(...args);
      };
    };

    console.log = wrapConsoleMethod(originalConsole.log);
    console.warn = wrapConsoleMethod(originalConsole.warn);
    console.error = wrapConsoleMethod(originalConsole.error);
    console.info = wrapConsoleMethod(originalConsole.info);
    console.table = wrapConsoleMethod(originalConsole.table);
    console.dir = wrapConsoleMethod(originalConsole.dir);
    console.debug = wrapConsoleMethod(originalConsole.debug);
    console.trace = wrapConsoleMethod(originalConsole.trace);

    // Pure DOM element id getter detection (Real-time detection without RegExp or Image probes)
    const domProbe = document.createElement("div");
    Object.defineProperty(domProbe, "id", {
      get: () => {
        // Tab is hidden or in background: do not trigger
        if (typeof document !== "undefined" && document.hidden) {
          return "";
        }
        triggerRedirect();
        return "taaissu-shield";
      },
      configurable: true,
    });

    // Heartbeat probe: executes only when the tab is actively focused and visible
    const probeInterval = setInterval(() => {
      if (document.hidden) return;
      originalConsole.log("%c", domProbe);
      try {
        originalConsole.clear();
      } catch {
        // Ignore
      }
    }, 1000);

    // Trap DevTools Keyboard Shortcuts (Zero False Positives - Normal users never hit these)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isModifier = e.ctrlKey || e.metaKey;

      // F12 key
      const isF12 = e.key === "F12" || e.keyCode === 123;

      // Windows/Linux Ctrl+Shift combos: I (inspect), J (console), C (element picker), K (firefox console), E (network), S (debugger)
      const isDevToolsCombo =
        isModifier &&
        e.shiftKey &&
        ["i", "j", "c", "k", "e", "s"].includes(key);

      // Mac Cmd+Option combos: I (inspect), J (console), C (element picker), K (console), U (source)
      const isMacDevTools =
        e.metaKey &&
        e.altKey &&
        ["i", "j", "c", "k", "u"].includes(key);

      // View Source (Ctrl+U / Cmd+Option+U)
      const isViewSource = isModifier && key === "u";

      // Save page source (Ctrl+S / Cmd+S)
      const isSaveSource = isModifier && !e.shiftKey && key === "s";

      if (isF12 || isDevToolsCombo || isMacDevTools || isViewSource || isSaveSource) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        triggerRedirect();
      }
    };

    // Right-Click Context Menu Suppression (prevents right-click -> "Inspect element")
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      clearInterval(probeInterval);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.body.style.overflow = "";

      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
      console.table = originalConsole.table;
      console.dir = originalConsole.dir;
      console.debug = originalConsole.debug;
      console.trace = originalConsole.trace;
    };
  }, []);

  if (!devToolsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1b0922] via-[#0d0914] to-[#180b1e] text-white p-6 select-none animate-in fade-in duration-300 backdrop-blur-2xl">
      <div className="max-w-lg w-full bg-[#120b18]/95 backdrop-blur-2xl border border-pink-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-pink-950/80 text-center space-y-6 relative overflow-hidden">
        {/* Ambient Neon Halos */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
            You are gay!
          </h1>

          {/* Authentic Bengali Troll Warning */}
          <div className="space-y-2.5 text-pink-200/95 font-mono text-sm sm:text-base font-bold bg-pink-950/50 border border-pink-500/30 rounded-2xl p-6 leading-relaxed shadow-inner text-center">
            <p className="text-pink-300">Hacker howar sokh hyse?</p>
            <p>Tui to akta gay.</p>
            <p className="text-purple-300">Console khulso kn?</p>
            <p className="text-pink-400">Madarchod, basai giye dud kha.</p>
            <p>Coding tor baba asleo hobe na.</p>
            <p className="text-amber-300 font-semibold pt-1">Salah, vibe coder ra! 🤡</p>
          </div>
        </div>
      </div>
    </div>
  );
}
