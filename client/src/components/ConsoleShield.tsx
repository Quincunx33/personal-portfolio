import { useEffect, useState } from "react";

export function ConsoleShield() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      table: console.table,
      dir: console.dir,
      clear: console.clear,
    };

    const triggerRedirect = () => {
      setDevToolsOpen(true);
      try {
        originalConsole.clear();
      } catch {
        // Ignore
      }
    };

    // Helper: Detect if a console call originates from user's DevTools console REPL vs normal app scripts
    const isConsoleEvaluation = (): boolean => {
      try {
        const stack = new Error().stack;
        if (!stack) return false;

        const lines = stack.split("\n");
        const callerLines = lines.slice(2).join("\n");

        const hasAppScript =
          callerLines.includes("localhost") ||
          callerLines.includes(".run.app") ||
          callerLines.includes("/client/src/") ||
          callerLines.includes("/assets/") ||
          callerLines.includes("/@fs/") ||
          callerLines.includes("/node_modules/");

        if (hasAppScript) {
          return false;
        }

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

    // Intercept console methods: ONLY trigger redirect if called from DevTools console REPL
    console.log = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.log(...args);
    };

    console.warn = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.warn(...args);
    };

    console.error = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.error(...args);
    };

    console.info = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.info(...args);
    };

    console.table = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.table(...args);
    };

    console.dir = (...args: any[]) => {
      if (isConsoleEvaluation()) {
        triggerRedirect();
        return;
      }
      originalConsole.dir(...args);
    };

    // 1. Dynamic decoy / nonsensical console log spammer to confuse debugging
    const decoyMessages = [
      "[Kernel] Warning: Quantum flux capacitor overheated at 0x9AF2",
      "[Security] Decoy memory dump active. Nice try attempting to debug!",
      "[Auth] Bypassing neural uplink firewall... 42% complete",
      "[Error] Undefined is not a banana in context 0x7F8",
      "[System] Warning: Too many script kiddies detected in memory space",
      "[Trace] Stack corruption in Matrix simulator sector 7G",
      "[Info] Attempting to decompile brain cells... failed (empty array)",
    ];

    const decoyInterval = setInterval(() => {
      const randomMsg = decoyMessages[Math.floor(Math.random() * decoyMessages.length)];
      const randomType = Math.random();
      if (randomType < 0.33) {
        originalConsole.log(`%c${randomMsg}`, "color: #a855f7; font-family: monospace;");
      } else if (randomType < 0.66) {
        originalConsole.warn(`%c${randomMsg}`, "color: #f59e0b; font-family: monospace;");
      } else {
        originalConsole.error(`%c${randomMsg}`, "color: #ef4444; font-family: monospace;");
      }
    }, 3000);

    // Check if the current context is inside an iframe or touch/mobile device (to prevent false positives)
    const isInsideIframe = (): boolean => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    };

    const isTouchOrMobileDevice = (): boolean => {
      return (
        navigator.maxTouchPoints > 0 ||
        /Android|iPhone|iPad|iPod|Windows Phone|Mobile|Tablet/i.test(navigator.userAgent)
      );
    };

    // Periodic detection with false-positive protections
    let consecutiveTriggers = 0;
    const checkInterval = setInterval(() => {
      if (document.hidden || !document.hasFocus()) {
        consecutiveTriggers = 0;
        return;
      }

      if (!isInsideIframe() && !isTouchOrMobileDevice()) {
        const widthDelta = window.outerWidth - window.innerWidth;
        const heightDelta = window.outerHeight - window.innerHeight;

        if (widthDelta > 260 || heightDelta > 260) {
          consecutiveTriggers++;
          if (consecutiveTriggers >= 2) {
            triggerRedirect();
            return;
          }
        } else {
          consecutiveTriggers = 0;
        }
      }

      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const duration = performance.now() - start;

      if (duration > 200 && document.hasFocus() && !document.hidden) {
        triggerRedirect();
      }
    }, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      const isF12 = e.key === "F12";
      const isCtrlShift = (e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "i", "J", "j", "C", "c", "K", "k"].includes(e.key);
      const isCtrlU = (e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U");

      if (isF12 || isCtrlShift || isCtrlU) {
        e.preventDefault();
        e.stopImmediatePropagation();
        triggerRedirect();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      clearInterval(checkInterval);
      clearInterval(decoyInterval);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);

      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
      console.table = originalConsole.table;
      console.dir = originalConsole.dir;
    };
  }, []);

  if (!devToolsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950 text-white p-6 select-none animate-in fade-in duration-300">
      <div className="max-w-lg w-full bg-slate-900/90 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">
            You are gay!
          </h1>
          <div className="space-y-2.5 text-pink-300/90 font-mono text-sm sm:text-base font-bold bg-pink-950/40 border border-pink-500/20 rounded-2xl p-5 leading-relaxed">
            <p>Hacker howar sokh hyse?</p>
            <p>Tui to akta gay.</p>
            <p>Console khulso kn?</p>
            <p>Madarchod, basai giye dud kha.</p>
            <p>Coding tor baba asleo hobe na.</p>
            <p>Salah, vibe coder ra! 🤡</p>
          </div>
        </div>
      </div>
    </div>
  );
}
