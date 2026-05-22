import React, { useEffect, useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SecurityShield({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const triggerWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    setShowWarning(true);
    // Vibrate if mobile
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    setTimeout(() => setShowWarning(false), 3000);
  }, []);

  useEffect(() => {
    // 1. Prevent Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning("Protected content: Right-click disabled");
    };

    // 2. Prevent Common Capture & Source Viewing Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Screen capture combos (Mac: Cmd+Shift+3/4/5, Win: Win+Shift+S, PrtScn)
      const isMacCapture = e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5");
      const isWinCapture = e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S");

      if (e.key === "PrintScreen" || isMacCapture || isWinCapture) {
        triggerWarning("Security Alert: Screen capture restricted");
        return;
      }

      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      if (
        (ctrlOrMeta && (e.key === "s" || e.key === "u" || e.key === "p" || e.key === "c" || e.key === "+" || e.key === "-")) ||
        e.key === "F12" ||
        (ctrlOrMeta && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))
      ) {
        e.preventDefault();
        triggerWarning("Browser controls restricted");
      }
    };

    // 3. Prevent dragging of images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
        triggerWarning("Image download restricted");
      }
    };

    // 4. Prevent pinch zoom on touch devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // blocks pinch to zoom
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dragstart", handleDragStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [triggerWarning]);

  return (
    <div className="relative min-h-screen w-full selection:bg-transparent selection:text-transparent">
      {/* 
        Lightweight CSS to disable text selection, image saving overlays, 
        and tap highlights without breaking scrolling or performance 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version */
          -webkit-tap-highlight-color: transparent;
        }
        
        img {
          pointer-events: none;
          -webkit-user-drag: none;
          user-drag: none;
        }
      `}} />

      {/* Floating warning notification */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 border border-emerald-500/50 text-emerald-100 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-xl pointer-events-none"
          >
            <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase whitespace-nowrap">{warningMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dense Watermark Grid to ruin screenshots */}
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden opacity-[0.035] mix-blend-overlay select-none">
        <div className="absolute inset-0 flex flex-wrap gap-12 md:gap-24 items-center justify-center -rotate-12 scale-150">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="text-white font-sans text-[14px] md:text-[20px] font-black tracking-[0.4em] whitespace-nowrap uppercase">
              TASFIYA PORTFOLIO
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
