import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Volume2, VolumeX, FastForward, Play } from "lucide-react";

interface FirstLaunchSequenceProps {
  onComplete: () => void;
  isManualReplay?: boolean;
}

// Module-scope scratch vectors for zero garbage collection during animation loop
const _vec3 = new THREE.Vector3();

// Web Audio API procedural sound synthesizer (100% zero external assets / zero 404s)
class LaunchAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  playBootHum() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playConvergenceChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A major 7th chord harmonics
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.5);
      });
    } catch {
      // Audio fallback
    }
  }
}

export function FirstLaunchSequence({ onComplete, isManualReplay = false }: FirstLaunchSequenceProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("CALIBRATING QUINCUNX-33 KERNEL...");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioSynthRef = useRef<LaunchAudioSynthesizer | null>(null);

  useEffect(() => {
    audioSynthRef.current = new LaunchAudioSynthesizer();
    audioSynthRef.current.playBootHum();
  }, []);

  const toggleMute = () => {
    if (audioSynthRef.current) {
      audioSynthRef.current.enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Three.js 3D Cinematic Procedural Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0b);
    scene.fog = new THREE.FogExp2(0x0c0c0b, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.5);

    // Renderer
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.5);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xd8894b, 0x111110, 1.2);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffbe85, 3.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7ea3cc, 2.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Composite 12-Part Procedural 3D Subject: Quincunx Astrolabe Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Gimbal Ring (Dark brushed steel)
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.045, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x242422,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    // 2. Middle Gimbal Ring (Burnt amber metal)
    const ring2Geo = new THREE.TorusGeometry(1.5, 0.038, 16, 72);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd8894b,
      metalness: 0.88,
      roughness: 0.22,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    coreGroup.add(ring2);

    // 3. Inner Armature Ring (Warm copper)
    const ring3Geo = new THREE.TorusGeometry(1.15, 0.032, 16, 64);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x845d46,
      metalness: 0.82,
      roughness: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    coreGroup.add(ring3);

    // 4. Central Faceted Crystal Nucleus (Optical dielectric crystal)
    const crystalGeo = new THREE.IcosahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffedd8,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.94,
      ior: 1.62,
      thickness: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystal);

    // 5. Emissive Energy Sphere inside the crystal
    const innerCoreGeo = new THREE.SphereGeometry(0.25, 24, 24);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffaa5e,
      emissive: 0xd8894b,
      emissiveIntensity: 3.5,
      roughness: 0.2,
      metalness: 0.5,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCore);

    // 6-9. Four Cardinal Calibration Nodes
    const nodeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xe8e1d5,
      metalness: 0.9,
      roughness: 0.1,
    });
    const cardinalNodes: THREE.Mesh[] = [];
    const cardinalPositions = [
      [1.9, 0, 0, 0, 0, Math.PI / 2],
      [-1.9, 0, 0, 0, 0, Math.PI / 2],
      [0, 1.9, 0, 0, 0, 0],
      [0, -1.9, 0, 0, 0, 0],
    ];
    cardinalPositions.forEach((pos) => {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(pos[0], pos[1], pos[2]);
      node.rotation.set(pos[3], pos[4], pos[5]);
      coreGroup.add(node);
      cardinalNodes.push(node);
    });

    // 10. Concentric Coordinate Reticle (Outer dashed circle)
    const reticleGeo = new THREE.RingGeometry(2.2, 2.22, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xd8894b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const reticle = new THREE.Mesh(reticleGeo, reticleMat);
    coreGroup.add(reticle);

    // 11. Instanced Telemetry Particle Field (120 orbiting micro-nodes)
    const particleCount = 120;
    const particleGeo = new THREE.BoxGeometry(0.025, 0.025, 0.025);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xd8894b,
      transparent: true,
      opacity: 0.75,
    });
    const particleMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particleMesh.frustumCulled = false;

    const dummy = new THREE.Object3D();
    const particleData: { radius: number; speed: number; angle: number; y: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      const y = (Math.random() - 0.5) * 2.2;
      particleData.push({ radius, speed, angle, y });
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.updateMatrix();
      particleMesh.setMatrixAt(i, dummy.matrix);
    }
    particleMesh.instanceMatrix.needsUpdate = true;
    coreGroup.add(particleMesh);

    // 12. Soft Radial Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    // Procedural radial alpha canvas texture (zero 404s)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext("2d");
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.65)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.4;
    scene.add(shadowMesh);

    // Animation & Launch Lifecycle Controller
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let hasPlayedChime = false;
    let startTime = performance.now();
    const duration = 3200; // 3.2 seconds cinematic intro

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const progressRatio = Math.min((performance.now() - startTime) / duration, 1.0);

      // Smooth progress update for UI HUD
      const pct = Math.floor(progressRatio * 100);
      setProgress(pct);

      // Terminal status progression
      if (pct < 30) {
        setStatusMessage("CALIBRATING QUINCUNX-33 KERNEL...");
      } else if (pct < 65) {
        setStatusMessage("ALIGNING AXIAL GIMBALS & TELEMETRY...");
      } else if (pct < 90) {
        if (!hasPlayedChime) {
          hasPlayedChime = true;
          audioSynthRef.current?.playConvergenceChime();
        }
        setStatusMessage("HARMONIZING SYSTEMS WORKBENCH...");
      } else {
        setStatusMessage("SYSTEM ONLINE // ACCESS GRANTED");
      }

      // Three.js multi-axial kinematic rotation
      ring1.rotation.x += 0.8 * delta;
      ring1.rotation.y += 0.5 * delta;

      ring2.rotation.y -= 1.1 * delta;
      ring2.rotation.z += 0.7 * delta;

      ring3.rotation.x -= 1.3 * delta;
      ring3.rotation.z -= 0.9 * delta;

      crystal.rotation.x += 0.6 * delta;
      crystal.rotation.y += 0.9 * delta;

      // Pulse inner core emissive intensity
      innerCoreMat.emissiveIntensity = 2.5 + Math.sin(elapsed * 6) * 1.5;

      // Update instanced particles
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        p.angle += p.speed * delta;
        dummy.position.set(Math.cos(p.angle) * p.radius, p.y + Math.sin(elapsed * 2 + i) * 0.1, Math.sin(p.angle) * p.radius);
        dummy.updateMatrix();
        particleMesh.setMatrixAt(i, dummy.matrix);
      }
      particleMesh.instanceMatrix.needsUpdate = true;

      // Exponential damping on camera dolly: starts at z=7.5 and gently moves in to z=5.8
      const targetCamZ = THREE.MathUtils.lerp(7.5, 5.4, Math.sin(progressRatio * Math.PI * 0.5));
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, delta);

      // Subtle float on core group
      coreGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;
      coreGroup.rotation.y = elapsed * 0.2;

      // Completion check
      if (progressRatio >= 1.0 && !isFadingOut) {
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }

      renderer.render(scene, camera);
    };

    // Pre-warm shaders
    renderer.compile(scene, camera);
    animate();

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      reticleGeo.dispose();
      reticleMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowTexture.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#0c0c0b] text-[#e8e1d5] font-mono transition-opacity duration-700 ${
        isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{ transitionProperty: "opacity, transform" }}
      aria-label="Website Launch Sequence"
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Screen Film Grain & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(12,12,11,0.85)_100%)]" />

      {/* Top Header Controls (Minimalist & Crisp) */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d8894b] shadow-[0_0_8px_#d8894b]" />
          <div className="flex flex-col">
            <span className="font-serif tracking-tight text-lg text-[#e8e1d5] font-semibold">taaissu</span>
            <span className="text-[10px] tracking-widest text-[#a59e92] uppercase">
              Quincunx33 // Field Lab
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161614]/80 border border-[#e8e1d5]/20 hover:border-[#d8894b] text-[11px] text-[#e8e1d5] transition-colors"
            title={isMuted ? "Unmute audio synthesizer" : "Mute audio"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={14} className="text-[#a59e92]" /> : <Volume2 size={14} className="text-[#d8894b]" />}
            <span className="hidden sm:inline">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d8894b] text-[#111110] font-semibold text-[11px] hover:bg-[#e49b5d] active:scale-95 transition-all"
            aria-label="Skip website launch intro"
          >
            <span>Enter Lab</span>
            <span className="text-[9px] opacity-75 font-mono hidden sm:inline">[Esc]</span>
            <FastForward size={13} />
          </button>
        </div>
      </header>

      {/* Center Reticle Coordinate HUD Overlay */}
      <div className="relative z-20 pointer-events-none self-center flex flex-col items-center justify-center text-center px-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#d8894b] mb-1">
          Systems Initialization
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#e8e1d5] font-normal tracking-wide">
          Useful experiments, <em className="italic text-[#d8894b]">shipped with intent.</em>
        </h2>
        <p className="text-[11px] text-[#a59e92] max-w-md mt-2 leading-relaxed hidden sm:block">
          Khulna, BD · 22°48′N 89°32′E · Low-level virtualization, systems security, and the modern web.
        </p>
      </div>

      {/* Bottom Unified Telemetry Dock */}
      <footer className="relative z-20 px-6 py-8 sm:px-10 flex flex-col gap-3 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between text-[11px] tracking-wider text-[#a59e92]">
          <span className="text-[#d8894b]">{statusMessage}</span>
          <span className="font-mono text-[#e8e1d5]">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1a1a18] border border-[#e8e1d5]/15 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#85491c] via-[#d8894b] via-[#f5af64] to-[#ffeed8] bg-[length:240%_100%] animate-progress-flow transition-all duration-150 ease-out relative overflow-hidden shadow-[0_0_8px_rgba(216,137,75,0.7)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-y-0 w-20 -left-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-[#7a7469]">
          <span>Node: Khulna / PKI Active</span>
          <span>Security Lab 2026</span>
          <span>Open Architecture</span>
        </div>
      </footer>
    </div>
  );
}
