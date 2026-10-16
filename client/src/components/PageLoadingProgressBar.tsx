import React, { useEffect, useState } from "react";

export function PageLoadingProgressBar() {
  const [progress, setProgress] = useState(15);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Step 1: Initial mount progression
    const timer1 = setTimeout(() => {
      setProgress(45);
    }, 120);

    const timer2 = setTimeout(() => {
      setProgress(80);
    }, 350);

    // Step 2: Track window load / document ready state
    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    if (document.readyState === "complete") {
      setProgress(100);
      const t = setTimeout(() => setIsVisible(false), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(t);
      };
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback timer in case load event takes too long
      const fallbackTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsVisible(false), 500);
      }, 1200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(fallbackTimer);
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="false"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page initialization progress"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none transition-opacity duration-500 ease-out"
      style={{
        opacity: progress === 100 ? 0 : 1,
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-[#d8894b] via-[#ffb475] to-[#d8894b] shadow-[0_0_12px_#d8894b] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
