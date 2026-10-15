import React, { useState, useEffect, useRef, useCallback } from "react";

interface HangingPendantLampProps {
  onSwayChange?: (angle: number) => void;
  onStateChange?: (state: { angle: number; isOn: boolean; intensity: number }) => void;
}

export function HangingPendantLamp({ onSwayChange, onStateChange }: HangingPendantLampProps) {
  const [swayAngle, setSwayAngle] = useState(0);
  const [isOn, setIsOn] = useState(true);
  const [chainPull, setChainPull] = useState(false);

  // Physics simulation references
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
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
    setChainPull(true);
    playSwitchClick();
    setTimeout(() => setChainPull(false), 240);
  }, [onStateChange, playSwitchClick]);

  // Gyroscope / Device Orientation + Desktop Mouse Parallax Listener
  useEffect(() => {
    let mounted = true;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!mounted) return;
      // gamma is the left-to-right tilt in degrees [-90, 90]
      if (e.gamma !== null && e.gamma !== undefined) {
        hasGyroRef.current = true;
        const clampedGamma = Math.max(-20, Math.min(20, e.gamma));
        gyroAngleRef.current = (clampedGamma / 20) * 3.5;
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    // Parallax sway for desktop cursor movement
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

  // Smooth Pendulum Physics Loop (Visibly and gently swings in a natural wave)
  useEffect(() => {
    let startTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      if (!isDraggingRef.current) {
        const elapsed = (now - startTime) / 1000;
        // Visible, gentle, hypnotic pendulum sway (~5.5 deg amplitude, ~2.5s cadence)
        const ambientDraft = Math.sin(elapsed * 1.35) * 5.2 + Math.sin(elapsed * 0.7) * 1.8;
        const targetAngle = ambientDraft + gyroAngleRef.current;

        const gravitySpring = 7.0;
        const damping = 1.6;

        const force = -gravitySpring * (angleRef.current - targetAngle);
        velocityRef.current += force * dt;
        velocityRef.current *= Math.exp(-damping * dt);
        angleRef.current += velocityRef.current * dt;

        // Bounded gently so it stays strictly within the right portrait sector
        angleRef.current = Math.max(-9.5, Math.min(9.5, angleRef.current));

        setSwayAngle(angleRef.current);
        onSwayChange?.(angleRef.current);
        onStateChange?.({
          angle: angleRef.current,
          isOn,
          intensity: isOn ? 1 : 0,
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOn, onStateChange, onSwayChange]);

  // Pointer drag & click handling
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = Date.now();
    dragStartAngleRef.current = angleRef.current;
    isDraggingRef.current = false;
    velocityRef.current = 0;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - dragStartXRef.current;
      const dy = moveEv.clientY - dragStartYRef.current;
      if (Math.hypot(dx, dy) > 5) {
        isDraggingRef.current = true;
        const deltaAngle = (dx / 220) * 18;
        const targetAngle = Math.max(-9.5, Math.min(9.5, dragStartAngleRef.current + deltaAngle));
        angleRef.current = targetAngle;
        setSwayAngle(targetAngle);
        onSwayChange?.(targetAngle);
        onStateChange?.({
          angle: targetAngle,
          isOn,
          intensity: isOn ? 1 : 0,
        });
      }
    };

    const onPointerUp = (upEv: PointerEvent) => {
      const dx = upEv.clientX - dragStartXRef.current;
      const dy = upEv.clientY - dragStartYRef.current;
      const dist = Math.hypot(dx, dy);
      const elapsed = Date.now() - dragStartTimeRef.current;

      // If user tapped/clicked without substantial dragging, toggle light!
      if (dist < 6 && elapsed < 450) {
        toggleLight();
      } else if (isDraggingRef.current) {
        velocityRef.current = (angleRef.current - dragStartAngleRef.current) * 0.35;
      }
      isDraggingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleHoverNudge = () => {
    if (!isDraggingRef.current && Math.abs(velocityRef.current) < 1.5) {
      velocityRef.current += (Math.random() > 0.5 ? 1.5 : -1.5);
    }
  };

  return (
    <div
      ref={containerRef}
      /* Positioned safely over the right-hand margin & portrait, safely away from left text */
      className="absolute top-0 right-4 sm:right-8 md:right-12 lg:right-20 xl:right-28 z-20 pointer-events-none select-none"
      style={{
        width: "250px",
        height: "820px",
      }}
    >
      {/* Heavy-duty Cast Iron Ceiling Canopy with Hex Bolts */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        {/* Cast Iron Flange with bevel and specular rim */}
        <div
          className="w-13 h-3 rounded-b-md relative shadow-[0_4px_12px_rgba(0,0,0,0.85)] border-b border-[#3d3833]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, #3a3632 0%, #1e1c19 65%, #0f0e0d 100%)",
          }}
        >
          {/* Twin antique brass mounting screws */}
          <div className="absolute top-0.5 left-2 w-1.5 h-1.5 rounded-full bg-[#9e6732] border border-[#ffeed8]/40 shadow-sm" />
          <div className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-[#9e6732] border border-[#ffeed8]/40 shadow-sm" />
        </div>
        {/* Turned brass cord strain-relief collar */}
        <div
          className="w-4 h-2.5 rounded-b-sm border-x border-[#ffcaa0]/30 shadow-sm"
          style={{
            background:
              "linear-gradient(90deg, #6d3f18 0%, #c88947 35%, #ffd090 50%, #85491c 75%, #4a270d 100%)",
          }}
        />
      </div>

      {/* 
        PENDULUM ASSEMBLY:
        Directly driven by requestAnimationFrame (no CSS transition conflict).
      */}
      <div
        className="absolute top-4 left-1/2 origin-top"
        style={{
          transform: `translateX(-50%) rotate(${swayAngle}deg)`,
          transformOrigin: "top center",
          willChange: "transform",
        }}
      >
        {/* 
          TEXTURE ENHANCEMENT: VINTAGE TWISTED CLOTH-WRAPPED BRAIDED CORD (150px)
          Features realistic diagonal woven herringbone fabric texture
        */}
        <div
          className="w-[3px] mx-auto relative cursor-grab active:cursor-grabbing pointer-events-auto"
          style={{ height: "150px" }}
          onPointerDown={handlePointerDown}
          onMouseEnter={handleHoverNudge}
          title="Drag to swing • Reacts to phone gyroscope tilt"
        >
          {/* Woven cloth texture pattern */}
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
          {/* Specular sheen strand along cord when light is on */}
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
          TEXTURE ENHANCEMENT: AGED SPUN BRASS SOCKET ASSEMBLY
          Knurled grip bands, threaded ring, and vintage turn key
        */}
        <div className="relative flex flex-col items-center">
          {/* Antique Brass Threaded Socket Cap */}
          <div
            className="w-5.5 h-3 rounded-t-sm shadow-sm border-t border-[#ffeed8]/40"
            style={{
              background:
                "linear-gradient(90deg, #6d3f18 0%, #c88947 30%, #ffd090 50%, #85491c 75%, #4a270d 100%)",
            }}
          />

          {/* Knurled Socket Body with Diamond Crosshatch Texture */}
          <div
            className="w-7 h-5 relative shadow-md border-y border-[#734316]"
            style={{
              background: `
                repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px),
                repeating-linear-gradient(-45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px),
                linear-gradient(90deg, #573312, #c88947 30%, #ffd090 50%, #7e4518 80%, #452408 100%)
              `,
            }}
          >
            {/* Horizontal machined ridges */}
            <div className="absolute inset-x-0 top-1.5 h-[1px] bg-[#ffeed8]/25" />
            <div className="absolute inset-x-0 bottom-1.5 h-[1px] bg-[#381a04]/40" />
          </div>

          {/* Threaded Shade-Retaining Brass Ring */}
          <div
            className="w-8 h-1.5 rounded-sm shadow-sm"
            style={{
              background:
                "linear-gradient(90deg, #78350f, #fed7aa 25%, #d97706 50%, #fef3c7 75%, #78350f 100%)",
            }}
          />

          {/* 
            TEXTURE ENHANCEMENT: 3D BRASS BEADED PULL-CHAIN
            Spherical shaded beads with high-gloss metallic highlights
          */}
          <div
            className="absolute top-5 right-[-14px] flex flex-col items-center cursor-pointer pointer-events-auto group z-30"
            onPointerDown={(e) => {
              e.stopPropagation();
              toggleLight();
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleLight();
            }}
            title={isOn ? "Turn light off" : "Turn light on"}
            style={{
              transform: `translateY(${chainPull ? "5px" : "0px"})`,
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* Beaded Chain */}
            <div className="w-[2px] h-13 flex flex-col justify-between items-center py-0.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full shadow-sm group-hover:brightness-125 transition-all"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #fff1d6 0%, #d8894b 55%, #592e07 100%)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  }}
                />
              ))}
            </div>
            {/* Antique Teardrop Brass Bobbin */}
            <div
              className="w-2.5 h-4 rounded-full border border-[#ffeed8]/60 shadow-[0_2px_5px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #fff1d6 0%, #f59e0b 40%, #85491c 80%, #3d1c03 100%)",
              }}
            />
          </div>

          {/* 
            TEXTURE ENHANCEMENT: PATINATED BLACKENED BRONZE & SPUN METAL SHADE
            Outer: Hand-spun blackened bronze with subtle lathe brush texture & specular sheen
            Rim: Rolled solid brass bead lip
            Inner: Hammered gold-leaf reflector bowl
          */}
          <div
            className="relative cursor-grab active:cursor-grabbing pointer-events-auto flex flex-col items-center"
            onPointerDown={handlePointerDown}
            onClick={toggleLight}
            title="Click to toggle light • Drag to swing"
          >
            {/* Outer Conical Shade with Brushed Gunmetal Texture */}
            <div
              className="w-24 h-11 relative shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
              style={{
                clipPath: "polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(170deg, #302c28 0%, #1c1a18 45%, #0e0d0c 100%)",
              }}
            >
              {/* Subtle brushed metal lathe striae */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
                }}
              />
              {/* Specular sheen curve reflection */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 42%, rgba(255,235,200,0.16) 50%, transparent 64%)",
                }}
              />
            </div>

            {/* Heavy Rolled Brass Rim Lip */}
            <div
              className="w-24 h-1.5 rounded-sm shadow-sm -mt-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, #78350f, #fed7aa 25%, #d97706 50%, #fef3c7 75%, #78350f 100%)",
              }}
            />

            {/* 
              TEXTURE ENHANCEMENT: HAMMERED SPUN GOLD REFLECTOR & EDISON BULB
            */}
            <div className="relative w-24 h-6 -mt-[1px] flex justify-center items-start">
              {/* Concentric Spun Gold Inner Reflector */}
              <div
                className="w-22 h-4 rounded-[100%] transition-colors duration-400"
                style={{
                  background: isOn
                    ? `
                      radial-gradient(ellipse at 50% 25%, #fffbeb 0%, #fde68a 30%, #d97706 70%, #451a03 100%)
                    `
                    : "radial-gradient(ellipse at center, #262320 0%, #151413 75%, #0a0908 100%)",
                  boxShadow: isOn ? "0 0 20px 5px rgba(216, 137, 75, 0.5)" : "none",
                }}
              />

              {/* Hand-blown Glass Edison Bulb Envelope */}
              <div
                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5.5 h-7 rounded-b-full transition-all duration-400 flex flex-col items-center justify-center pointer-events-none"
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
                {/* Vintage Coiled Filament */}
                <div
                  className="w-2.5 h-3 rounded-t-sm border-t-2 border-x-2 transition-colors duration-300"
                  style={{
                    borderColor: isOn ? "#ffffff" : "#443e37",
                    boxShadow: isOn ? "0 0 7px 2px #fef08a" : "none",
                  }}
                />
                {/* Filament support pins */}
                <div className="w-[1px] h-1.5 bg-[#78716c]" />
              </div>

              {/* Gentle warm bulb bloom */}
              {isOn && (
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full pointer-events-none mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,248,225,0.85) 0%, rgba(251,191,36,0.45) 35%, transparent 75%)",
                    filter: "blur(6px)",
                  }}
                />
              )}
            </div>
          </div>

          {/* 
            ATMOSPHERIC SOFT VOLUMETRIC LIGHT BEAM
            - Feathered Gaussian blur SVG spotlight
            - Perfectly aligned with lamp sway and gyroscope
            - Naturally falls into the right-hand portrait area, zero overlap on text
          */}
          <div
            className="relative pointer-events-none transition-opacity duration-500 ease-out flex justify-center"
            style={{
              width: "440px",
              height: "640px",
              marginTop: "-3px",
              opacity: isOn ? 1 : 0,
            }}
          >
            <svg
              viewBox="0 0 440 640"
              className="w-full h-full pointer-events-none overflow-visible"
              style={{ mixBlendMode: "screen" }}
            >
              <defs>
                <filter id="softVolumetricGlow" x="-30%" y="-20%" width="160%" height="150%">
                  <feGaussianBlur stdDeviation="24" />
                </filter>
                <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="12" />
                </filter>

                <linearGradient id="primaryBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.45" />
                  <stop offset="18%" stopColor="#f5af64" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#d8894b" stopOpacity="0.10" />
                  <stop offset="82%" stopColor="#d8894b" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#d8894b" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="coreBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="15%" stopColor="#fed7aa" stopOpacity="0.3" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.1" />
                  <stop offset="85%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>

                <radialGradient id="floorPoolGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.22" />
                  <stop offset="42%" stopColor="#f59e0b" stopOpacity="0.10" />
                  <stop offset="78%" stopColor="#d97706" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              <path
                d="M 195 0 L 245 0 L 400 600 L 40 600 Z"
                fill="url(#primaryBeamGrad)"
                filter="url(#softVolumetricGlow)"
              />

              <path
                d="M 206 0 L 234 0 L 320 540 L 120 540 Z"
                fill="url(#coreBeamGrad)"
                filter="url(#coreGlow)"
              />

              <ellipse
                cx="220"
                cy="585"
                rx="165"
                ry="40"
                fill="url(#floorPoolGrad)"
                filter="url(#softVolumetricGlow)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}



