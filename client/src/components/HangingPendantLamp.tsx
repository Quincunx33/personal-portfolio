import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface HangingPendantLampProps {
  onSwayChange?: (angle: number) => void;
  onStateChange?: (state: { angle: number; isOn: boolean; intensity: number }) => void;
  centerX?: number;
  topOffset?: number;
  portraitWidth?: number;
  isReady?: boolean;
}

export function HangingPendantLamp({
  onStateChange,
  centerX,
  topOffset,
  isReady,
}: HangingPendantLampProps) {
  const [isOn, setIsOn] = useState(true);

  // Physics simulation references (zero React re-renders during frame loop)
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendulumRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Gyroscope / Device orientation references
  const gyroAngleRef = useRef(0);
  const hasGyroRef = useRef(false);

  // Web Audio click generator for tactile mechanical toggle
  const playSwitchClick = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(840, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 90);
    } catch {
      // Audio context may be restricted before user gesture
    }
  }, []);

  const toggleLight = useCallback(() => {
    setIsOn((prev) => {
      const next = !prev;
      onStateChange?.({ angle: angleRef.current, isOn: next, intensity: next ? 1 : 0 });
      return next;
    });
    playSwitchClick();
  }, [onStateChange, playSwitchClick]);

  // Gyroscope / Device Orientation + Desktop Mouse Parallax Listener
  useEffect(() => {
    let mounted = true;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!mounted) return;
      if (e.gamma !== null && e.gamma !== undefined) {
        hasGyroRef.current = true;
        const clampedGamma = Math.max(-20, Math.min(20, e.gamma));
        gyroAngleRef.current = (clampedGamma / 20) * 3.5;
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (hasGyroRef.current || isDraggingRef.current) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      gyroAngleRef.current = normX * 2.0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      mounted = false;
      if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Butter-smooth Pendulum Physics Loop via direct DOM transform (zero React state updates)
  useEffect(() => {
    const startTime = performance.now();
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (!isDraggingRef.current) {
        const elapsed = (now - startTime) / 1000;
        const ambientDraft = Math.sin(elapsed * 1.35) * 4.8 + Math.sin(elapsed * 0.7) * 1.5;
        const targetAngle = ambientDraft + gyroAngleRef.current;

        const gravitySpring = 7.0;
        const damping = 1.6;

        const force = -gravitySpring * (angleRef.current - targetAngle);
        velocityRef.current += force * dt;
        velocityRef.current *= Math.exp(-damping * dt);
        angleRef.current += velocityRef.current * dt;

        angleRef.current = Math.max(-9.0, Math.min(9.0, angleRef.current));

        if (pendulumRef.current) {
          pendulumRef.current.style.transform = `translateX(-50%) rotate(${angleRef.current.toFixed(2)}deg)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Pointer drag handling for pendulum swing
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartAngleRef.current = angleRef.current;
    isDraggingRef.current = false;
    velocityRef.current = 0;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - dragStartXRef.current;
      const dy = moveEv.clientY - dragStartYRef.current;
      if (Math.hypot(dx, dy) > 8) {
        isDraggingRef.current = true;
        const deltaAngle = (dx / 220) * 18;
        const targetAngle = Math.max(-9.0, Math.min(9.0, dragStartAngleRef.current + deltaAngle));
        angleRef.current = targetAngle;
        if (pendulumRef.current) {
          pendulumRef.current.style.transform = `translateX(-50%) rotate(${targetAngle.toFixed(2)}deg)`;
        }
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      const dx = upEv.clientX - dragStartXRef.current;
      const dy = upEv.clientY - dragStartYRef.current;
      const dist = Math.hypot(dx, dy);

      if (dist > 8 && isDraggingRef.current) {
        velocityRef.current = (angleRef.current - dragStartAngleRef.current) * 0.35;
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 80);
      } else {
        isDraggingRef.current = false;
      }

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleLampClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    toggleLight();
  };

  const handleHoverNudge = () => {
    if (!isDraggingRef.current && Math.abs(velocityRef.current) < 1.5) {
      velocityRef.current += Math.random() > 0.5 ? 1.5 : -1.5;
    }
  };

  // Dynamic cord length: shade rim hovers gracefully right above/at the headline/portrait
  const cordHeight = useMemo(() => {
    if (topOffset && topOffset > 100) {
      return Math.max(50, Math.min(115, Math.round(topOffset - 96)));
    }
    return 75; // Default aesthetic cord length
  }, [topOffset]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 z-20 pointer-events-none select-none transition-[left,right] duration-150 ease-out"
      style={{
        width: "250px",
        height: "820px",
        willChange: "transform",
        ...(isReady && centerX && centerX > 0
          ? {
              left: `${centerX}px`,
              transform: "translateX(-50%)",
            }
          : {
              right: "var(--lamp-fallback-right, calc(10vw + 45px))",
            }),
      }}
    >
      {/* Heavy-duty Cast Iron Ceiling Canopy with Hex Bolts */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div
          className="w-13 h-3 rounded-b-md relative shadow-[0_4px_12px_rgba(0,0,0,0.85)] border-b border-[#3d3833]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, #3a3632 0%, #1e1c19 65%, #0f0e0d 100%)",
          }}
        >
          <div className="absolute top-0.5 left-2 w-1.5 h-1.5 rounded-full bg-[#9e6732] border border-[#ffeed8]/40 shadow-sm" />
          <div className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-[#9e6732] border border-[#ffeed8]/40 shadow-sm" />
        </div>
        <div
          className="w-4 h-2.5 rounded-b-sm border-x border-[#ffcaa0]/30 shadow-sm"
          style={{
            background:
              "linear-gradient(90deg, #6d3f18 0%, #c88947 35%, #ffd090 50%, #85491c 75%, #4a270d 100%)",
          }}
        />
      </div>

      {/* PENDULUM ASSEMBLY: Mutated directly via requestAnimationFrame on the GPU compositor */}
      <div
        ref={pendulumRef}
        className="absolute top-4 left-1/2 origin-top"
        style={{
          transform: "translateX(-50%) rotate(0deg)",
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        {/* VINTAGE TWISTED BRAIDED CORD (Drag here to swing) */}
        <div
          className="w-[3px] mx-auto relative cursor-grab active:cursor-grabbing pointer-events-auto transition-[height] duration-200"
          style={{ height: `${cordHeight}px` }}
          onPointerDown={handlePointerDown}
          onMouseEnter={handleHoverNudge}
          title="Drag to swing • Click light to toggle"
        >
          <div
            className="w-full h-full shadow-[0_0_5px_rgba(0,0,0,0.7)]"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #141312 0px,
                #141312 2px,
                #2d2824 2px,
                #2d2824 4px,
                #100f0e 4px,
                #100f0e 6px
              )`,
            }}
          />
          {isOn && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(216,137,75,0.25) 45%, rgba(255,240,210,0.15) 60%, transparent 100%)",
              }}
            />
          )}
        </div>

        {/* 
          LIGHT FIXTURE & SHADE (CLICK TO TURN ON / OFF)
          String/dori removed as requested. Clicking directly toggles state.
        */}
        <div
          className="relative flex flex-col items-center cursor-pointer pointer-events-auto select-none group"
          onPointerDown={handlePointerDown}
          onClick={handleLampClick}
          title={isOn ? "Click light to turn OFF" : "Click light to turn ON"}
        >
          {/* Antique Brass Threaded Socket Cap */}
          <div
            className="w-5.5 h-3 rounded-t-sm shadow-sm border-t border-[#ffeed8]/40 group-hover:brightness-110 transition-all"
            style={{
              background:
                "linear-gradient(90deg, #6d3f18 0%, #c88947 30%, #ffd090 50%, #85491c 75%, #4a270d 100%)",
            }}
          />

          {/* Knurled Socket Body */}
          <div
            className="w-7 h-5 relative shadow-md border-y border-[#734316] group-hover:brightness-110 transition-all"
            style={{
              background: `
                repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px),
                repeating-linear-gradient(-45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px),
                linear-gradient(90deg, #573312, #c88947 30%, #ffd090 50%, #7e4518 80%, #452408 100%)
              `,
            }}
          >
            <div className="absolute inset-x-0 top-1.5 h-[1px] bg-[#ffeed8]/25" />
            <div className="absolute inset-x-0 bottom-1.5 h-[1px] bg-[#381a04]/40" />
          </div>

          {/* Brass Retaining Ring */}
          <div
            className="w-8 h-1.5 rounded-sm shadow-sm"
            style={{
              background:
                "linear-gradient(90deg, #78350f, #fed7aa 25%, #d97706 50%, #fef3c7 75%, #78350f 100%)",
            }}
          />

          {/* SPUN METAL SHADE */}
          <div className="relative flex flex-col items-center">
            <div
              className="w-24 h-11 relative shadow-[0_8px_20px_rgba(0,0,0,0.85)] group-hover:brightness-105 transition-all"
              style={{
                clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(170deg, #302c28 0%, #1c1a18 45%, #0e0d0c 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 42%, rgba(255,235,200,0.16) 50%, transparent 64%)",
                }}
              />
            </div>

            <div
              className="w-24 h-1.5 rounded-sm shadow-sm -mt-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, #78350f, #fed7aa 25%, #d97706 50%, #fef3c7 75%, #78350f 100%)",
              }}
            />

            {/* GOLD REFLECTOR & EDISON BULB */}
            <div className="relative w-24 h-6 -mt-[1px] flex justify-center items-start">
              <div
                className="w-22 h-4 rounded-[100%] transition-colors duration-300"
                style={{
                  background: isOn
                    ? "radial-gradient(ellipse at 50% 25%, #fffbeb 0%, #fde68a 30%, #d97706 70%, #451a03 100%)"
                    : "radial-gradient(ellipse at center, #262320 0%, #151413 75%, #0a0908 100%)",
                  boxShadow: isOn ? "0 0 20px 5px rgba(216, 137, 75, 0.5)" : "none",
                }}
              />

              <div
                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5.5 h-7 rounded-b-full transition-all duration-300 flex flex-col items-center justify-center pointer-events-none"
                style={{
                  background: isOn
                    ? "radial-gradient(circle at 45% 35%, rgba(255,250,240,0.95) 0%, rgba(251,191,36,0.7) 50%, rgba(217,119,6,0.3) 85%, transparent 100%)"
                    : "radial-gradient(circle at 45% 35%, rgba(65,60,55,0.4) 0%, rgba(25,23,21,0.65) 80%, transparent 100%)",
                  borderLeft: isOn ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(80,75,70,0.3)",
                  borderRight: isOn ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(60,55,50,0.2)",
                  boxShadow: isOn
                    ? "0 0 16px 5px rgba(251, 191, 36, 0.7), 0 0 32px 10px rgba(217, 119, 6, 0.4)"
                    : "none",
                }}
              >
                <div
                  className="w-2.5 h-3 rounded-t-sm border-t-2 border-x-2 transition-colors duration-200"
                  style={{
                    borderColor: isOn ? "#ffffff" : "#443e37",
                    boxShadow: isOn ? "0 0 7px 2px #fef08a" : "none",
                  }}
                />
                <div className="w-[1px] h-1.5 bg-[#78716c]" />
              </div>

              {isOn && (
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full pointer-events-none mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,248,225,0.85) 0%, rgba(251,191,36,0.45) 35%, transparent 75%)",
                    filter: "blur(5px)",
                  }}
                />
              )}
            </div>
          </div>

          {/* HARDWARE-ACCELERATED VOLUMETRIC LIGHT BEAM */}
          <div
            className="relative pointer-events-none transition-opacity duration-300 ease-out flex justify-center"
            style={{
              width: "400px",
              height: "580px",
              marginTop: "-3px",
              opacity: isOn ? 1 : 0,
              willChange: "transform, opacity",
            }}
          >
            <div
              className="w-full h-full pointer-events-none"
              style={{
                clipPath: "polygon(46% 0%, 54% 0%, 94% 96%, 6% 96%)",
                background:
                  "linear-gradient(180deg, rgba(255,245,225,0.55) 0%, rgba(245,175,100,0.22) 18%, rgba(216,137,75,0.08) 50%, rgba(216,137,75,0.02) 80%, transparent 100%)",
                filter: "blur(14px)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
