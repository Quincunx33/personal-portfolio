import React, { useEffect, useState } from "react";
import { Shield, EyeOff, Lock } from "lucide-react";
import { trackSecurityAlert } from "@/lib/tracker";

export function AntiCaptureShield() {
  const [isCloaked, setIsCloaked] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);

  useEffect(() => {
    // 1. Focus & Visibility Loss Cloaking
    // When snipping tools (Win+Shift+S, Lightshot, Mac Cmd+Shift+4) activate, the window loses focus
    const handleBlur = () => {
      setIsCloaked(true);
    };

    const handleFocus = () => {
      setIsCloaked(false);
      setIsBlackout(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsCloaked(true);
      } else {
        setIsCloaked(false);
      }
    };

    // 2. PrintScreen Key Intercept & Clipboard Sanitization
    const handleKeyDown = async (e: KeyboardEvent) => {
      // PrintScreen key (Windows/Linux)
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        setIsBlackout(true);

        trackSecurityAlert("Screen Capture Intercepted", {
          trigger: "PrintScreen Keypress Trapped",
          shortcut: "PrintScreen (PrtScn)",
          severity: "high",
          extra: "Clipboard buffer immediately purged to null to prevent visual memory leak."
        });

        // Instantly scrub clipboard so no screenshot is retained
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText("");
          }
        } catch {
          // Ignore
        }

        // Keep blackout for 2 seconds
        setTimeout(() => {
          setIsBlackout(false);
        }, 2200);
      }

      // Cmd+Shift+3, 4, 5 (Mac Screenshot combos)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        setIsBlackout(true);
        trackSecurityAlert("macOS Screenshot Combo Intercepted", {
          trigger: `macOS Capture Combo (Cmd+Shift+${e.key})`,
          shortcut: `Cmd+Shift+${e.key}`,
          severity: "high",
          extra: "User attempted native macOS selective or fullscreen screengrab."
        });
        setTimeout(() => setIsBlackout(false), 2200);
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        setIsBlackout(true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText("");
          }
        } catch {
          // Ignore
        }
        setTimeout(() => setIsBlackout(false), 2200);
      }
    };

    // 3. Screen Recording API Interceptor (getDisplayMedia)
    let originalGetDisplayMedia: any = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = async () => {
        setIsBlackout(true);
        trackSecurityAlert("Screen Recording API Blocked", {
          trigger: "navigator.mediaDevices.getDisplayMedia invocation trapped",
          shortcut: "WebRTC / Screen Cast Stream",
          severity: "critical",
          extra: "An extension, screen recorder, or script attempted to stream the browser canvas."
        });
        throw new Error("Screen capture restricted by security policy.");
      };
    }

    // 4. Prevent Image Drag & Save
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("dragstart", handleDragStart, true);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("dragstart", handleDragStart, true);

      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
    };
  }, []);

  const shouldCover = isBlackout || isCloaked;

  if (!shouldCover) {
    return null;
  }

  return (
    <div
      onClick={() => {
        window.focus();
        setIsCloaked(false);
        setIsBlackout(false);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-all duration-150 cursor-pointer ${
        isBlackout
          ? "bg-[#090908] text-white"
          : "bg-[#0d0d0c]/95 backdrop-blur-3xl text-[#e8e1d5]"
      }`}
      aria-label="Security Cloak Active - Click to uncloak"
    >
      <div className="max-w-md w-full mx-auto p-8 text-center space-y-4 pointer-events-none">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#d8894b]/15 border border-[#d8894b]/40 flex items-center justify-center text-[#d8894b]">
          {isBlackout ? <Lock size={22} /> : <EyeOff size={22} />}
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-xs uppercase tracking-widest text-[#d8894b] font-semibold">
            {isBlackout ? "[SCREEN CAPTURE SANITIZED]" : "[WORKSPACE CLOAK ACTIVE]"}
          </p>
          <h2 className="font-serif text-2xl text-[#e8e1d5]">
            {isBlackout ? "Capture Buffer Purged" : "Viewport Protected"}
          </h2>
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-[#a59e92]">
          {isBlackout
            ? "Screen recording or print-screen attempt intercepted. Clipboard buffer cleared."
            : "Window unfocused or external screenshot tool active. Click anywhere to resume workspace."}
        </p>

        <div className="pt-2">
          <span className="inline-block px-3 py-1 bg-[#191917] border border-[#e8e1d5]/15 rounded-md font-mono text-[10px] text-[#e8e1d5]/80">
            Click anywhere to focus
          </span>
        </div>
      </div>
    </div>
  );
}
