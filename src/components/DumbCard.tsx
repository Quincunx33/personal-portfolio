import profilePic from "../assets/IMG_5197.jpeg";
import React, { useState, useRef } from "react";
import { 
  Facebook, Github, Instagram, Fingerprint, Info, ShieldCheck, 
  Zap, Scan, Cpu, CheckCircle, Sliders, ChevronDown, RefreshCw, 
  Sparkles, Palette, Crown, MapPin, Eye, BookOpen, LogIn, LogOut,
  Upload, Download, Edit3, Settings, Camera, Trash2
} from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "motion/react";
import { useMock } from "../App";
import { useFirebase } from "../context/FirebaseContext";
import SecureImage from "./SecureImage";

const generateProperDumbID = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

interface DumbCardProps {
  showConsole?: boolean;
  hideCard?: boolean;
  alwaysShowDeveloper?: boolean;
}

export default function DumbCard({ showConsole = true, hideCard = false, alwaysShowDeveloper = false }: DumbCardProps) {
  const { openApp } = useMock();
  const { user, loginWithGoogle, logoutUser, updateCitizenProfile } = useFirebase();
  
  // Custom picture upload reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  
  // State for active view type ("developer" for Tasfiya, "citizen" for custom user)
  const [viewMode, setViewMode] = useState<"developer" | "citizen">("developer");

  // Automatically switch view modes depending on real Firebase login state
  React.useEffect(() => {
    if (alwaysShowDeveloper) {
      setViewMode("developer");
      return;
    }
    if (user) {
      setViewMode("citizen");
    } else {
      setViewMode("developer");
    }
  }, [user, alwaysShowDeveloper]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "AUTHORIZED" | "DECRYPTING">("IDLE");

  // States for interactive timeline and hover tilt parallax
  const cardControls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // Hover Tilt Parallax states
  const [rotateX, setRotateX] = useState(0);
  const [rotateYVal, setRotateYVal] = useState(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Keep it subtle: max 10 degrees tilt
    const rawX = (centerY - y) / 12;
    const rawY = (x - centerX) / 14;
    setRotateX(rawX);
    setRotateYVal(isFlipped ? -rawY : rawY);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setRotateX(0);
    setRotateYVal(0);
  };

  const handleSocialClick = (e: React.MouseEvent, app: "fb" | "ig" | "github") => {
    e.stopPropagation();
    openApp(app);
  };

  // High-performance biometric security flip timeline (Aggressive slammed physical shock sequence)
  const handleFlip = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsScanning(true);
    setScanStatus(isFlipped ? "DECRYPTING" : "AUTHORIZED");
    setRotateX(0);
    setRotateYVal(0);

    const toBack = !isFlipped;

    // 1. Kinetic Wind-up: Card lifts into high 3D space, tilts back slightly
    await cardControls.start({
      scale: 1.06,
      y: -35,
      z: 75,
      rotateX: toBack ? -15 : 15,
      transition: { duration: 0.16, ease: "easeOut" }
    });

    // 2. Violent downward slam snap impact + High-speed rotation along the Y axis!
    await cardControls.start({
      rotateY: toBack ? 180 : 0,
      rotateX: 0,
      y: 65,            // Forces the card deep downwards
      scale: 0.88,      // Squishes under impact force
      z: -50,           // Pushed hard against the table substrate
      transition: { duration: 0.28, ease: "easeInOut" }
    });

    // Toggle flips state precisely at bottom extreme
    setIsFlipped(toBack);

    // 3. Crisp high-tension reactive recoil & bounce
    await cardControls.start({
      y: -12,
      scale: 1.03,
      z: 15,
      transition: { duration: 0.1, ease: "easeOut" }
    });

    // 4. Solid final heavy plate spring lock settle
    await cardControls.start({
      y: 0,
      scale: 1,
      z: 0,
      transition: { 
        type: "spring", 
        stiffness: 480, 
        damping: 14 
      }
    });

    // Auto-complete the laser cryptographic scan sweep after settle
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus("IDLE");
      setIsAnimating(false);
    }, 450);
  };

  // Set up default citizen profile if none exists
  const ensureCitizenProfile = () => {
    if (!user) {
      const defaultProfile = {
        uid: generateProperDumbID(),
        displayName: "Div Centering Guru 🤡",
        photoURL: profilePic,
        joinedAt: new Date().toISOString(),
        occupation: "Certified Dumb Developer",
        favoriteBug: "Off-by-one error",
        clearance: "LEVEL OMEGA",
        codingSkill: "Brilliant Chaos",
        address: "Khulna, Sector 7",
        accentColor: "#006a4e",
        sticker: "clown",
        bloodGroup: "O+",
        dateOfIssuance: new Date().toLocaleDateString()
      };
      updateCitizenProfile(defaultProfile);
    }
  };

  const handleModeSwitch = (mode: "developer" | "citizen") => {
    if (mode === "citizen") {
      ensureCitizenProfile();
    }
    setViewMode(mode);
  };

  // Access computed properties depending on Developer vs Customized identity profile
  // The developer mode is only strictly forced if alwaysShowDeveloper is passed.
  const forceQueen = alwaysShowDeveloper;
  const isActualQueen = user && (user.email === "taaissu@gmail.com" || user.uid === "824 934 6219" || user.displayName?.includes("Tasfiya"));
  const isCitizenActive = !forceQueen && user != null;
  const isQueen = forceQueen || isActualQueen;
  
  const cardName = isCitizenActive ? (user.displayName || "Cherished Citizen 🌸") : (forceQueen ? "Tasfiya Tabassum 👑" : "Your Name Here");
  const cardOccupation = isCitizenActive ? (user.occupation || "Noble Developer") : (forceQueen ? "Sovereign Queen of Dumbland" : "Future Citizen");
  const cardSignature = isCitizenActive ? (user.displayName?.split(" ")[0] || "Citizen") : (forceQueen ? "taaissu" : "Citizen");
  const cardIdNo = isCitizenActive ? (user.uid || (isQueen ? "824 934 6219" : "CLICK TO GENERATE")) : (forceQueen ? "824 934 6219" : "CLICK TO GENERATE");
  const cardClearance = isCitizenActive ? (user.clearance || (isQueen ? "LEVEL OMEGA (ROOT SOVEREIGN)" : "LEVEL GOLD")) : (forceQueen ? "LEVEL OMEGA (SOVEREIGN QUEEN)" : "UNVERIFIED");
  const cardDivineAura = isCitizenActive ? (user.favoriteBug || (isQueen ? "Absolute Power 👑" : "Magical Elegance ✨")) : (forceQueen ? "Absolute Power 👑" : "Unknown Error");
  const cardRoyalPower = isCitizenActive ? (user.codingSkill || (isQueen ? "Divine Command ✨" : "Beautiful Chaos")) : (forceQueen ? "Divine Command ✨" : "Awaiting Assignment");
  const cardAddress = isCitizenActive ? (user.address || "Sweet Grid, Sector 1") : (forceQueen ? "Main Grid, Sector 0" : "Dumbland Border");
  const cardSticker = isCitizenActive ? (user.sticker || "star") : (forceQueen ? "star" : "star");
  const cardBloodGroup = isCitizenActive ? (user.bloodGroup || "O+") : (isQueen ? "AB-" : "N/A");
  const cardDateOfIssuance = isCitizenActive ? (user.dateOfIssuance || new Date().toLocaleDateString()) : (isQueen ? "2024-01-01" : "N/A");
  
  // Queen gets special Purple/Gold Royal Theme, normal users get whatever color is selected or default Indigo
  const defaultRoyalColor = "#4f46e5"; // Indigo 600
  const cardColor = isQueen ? defaultRoyalColor : (isCitizenActive ? (user.accentColor || "#4338ca") : "#4338ca");
  const accentColorClass = isQueen ? "border-purple-600 bg-purple-900" : "border-indigo-600 bg-indigo-700";

  const barcodeValue = isCitizenActive || forceQueen
    ? `${cardIdNo.replace("-", "")}-${cardName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 15)}`
    : "0000000000-AWAITING-CITIZEN";

  // Stickers / Accessories rendered on top of the portrait photo
  const renderSticker = () => {
    switch (cardSticker) {
      case "clown":
        return (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-2 right-1.5 text-xl min-[375px]:text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none select-none z-[35]"
          >
            🔴
          </motion.div>
        );
      case "glasses":
        return (
          <div className="absolute top-[28px] min-[375px]:top-[35px] sm:top-[38px] left-[10px] min-[375px]:left-[16px] sm:left-[18px] text-lg min-[375px]:text-xl filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] pointer-events-none select-none z-[35]">
            🕶️
          </div>
        );
      case "mug":
        return (
          <div className="absolute bottom-1 right-1 text-lg min-[375px]:text-xl filter drop-shadow-md pointer-events-none select-none z-[35]">
            ☕
          </div>
        );
      case "brain":
        return (
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-[6px] min-[375px]:-top-[8px] sm:-top-[10px] left-[16px] min-[375px]:left-[20px] sm:left-[24px] text-lg min-[375px]:text-xl pointer-events-none select-none z-[35]"
          >
            🧠
          </motion.div>
        );
      case "star":
        return (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute top-1 right-1 text-sm text-yellow-400 filter drop-shadow-md pointer-events-none select-none z-[35]"
          >
            ⭐
          </motion.div>
        );
      default:
        return null;
    }
  };

  const PRESETS_OCCUPATIONS = [
    "Certified Dumb Developer 🤡",
    "CSS Grid Survivor 💀",
    "Git Push --Force Expert 💣",
    "React Loop Creator 🔄",
    "StackOverflow Historian 🕵️‍♀️",
    "TypeScript Any-Caster 🌟",
    "10x Copy-Paster Pro 🚀",
    "Coffee Optimizer ☕"
  ];

  const PRESETS_BUGS = [
    "Off-by-one error",
    "Infinite re-render loop",
    "npm audit (14,290 vulnerabilities)",
    "SyntaxError: unexpected ';'",
    "Uncaught TypeError: undefined is not a function",
    "CSS Flexbox wrap collapse",
    "Merged main with 140 conflicts"
  ];

  const PRESETS_SKILLS = [
    "Brilliant Chaos",
    "Ctrl-C / Ctrl-V Master",
    "Compile and Pray",
    "Slinging Spaghetti Code",
    "Force pushing to main at 4 PM"
  ];

  const PRESETS_CLEARANCES = [
    "LEVEL OMEGA",
    "DUMBLAND INTERN",
    "CHAOS MONKEY LEVEL 99",
    "DIV-CENTERER MAGNUS",
    "POTATO CHASSIS SUPERVISOR"
  ];

  const COLOR_SWATCHES = [
    { value: "#006a4e", label: "Emerald Security" },
    { value: "#ef4444", label: "Crimson Cyber" },
    { value: "#7c3aed", label: "Mystic Violet" },
    { value: "#1e293b", label: "Deep Charcoal" },
    { value: "#0284c7", label: "Ocean Silicon" },
    { value: "#ca8a04", label: "Golden Solder" }
  ];

  const STICKERS = [
    { value: "none", label: "No accessory" },
    { value: "clown", label: "Meme Clown Nose (🔴)" },
    { value: "glasses", label: "Shades of Intellect (🕶️)" },
    { value: "mug", label: "Emergency Brew (☕)" },
    { value: "brain", label: "Active Neurons (🧠)" },
    { value: "star", label: "Verified Star (⭐)" }
  ];

  // Helper to generate coordinates of chaotic randomness
  const rollRandomProfile = () => {
    ensureCitizenProfile();
    const funnyNames = [
      "Div Centering Oracle", "Quantum Copy-Paster", "Infinite Recursion", 
      "CSS Grid Sorcerer", "Bug Manufacturer", "Legacy Code Excavator", 
      "Callback Hell Ranger", "Git Conflict Enjoyer"
    ];
    const funnySurnames = ["Clown", "Senior", "Expert", "Intern", "Survivor", "Pro", "Overlord"];
    const randomN = funnyNames[Math.floor(Math.random() * funnyNames.length)] + " " + funnySurnames[Math.floor(Math.random() * funnySurnames.length)];
    const randomId = generateProperDumbID();
    const randomOcc = PRESETS_OCCUPATIONS[Math.floor(Math.random() * PRESETS_OCCUPATIONS.length)];
    const randomBug = PRESETS_BUGS[Math.floor(Math.random() * PRESETS_BUGS.length)];
    const randomSkill = PRESETS_SKILLS[Math.floor(Math.random() * PRESETS_SKILLS.length)];
    const randomClearance = PRESETS_CLEARANCES[Math.floor(Math.random() * PRESETS_CLEARANCES.length)];
    const randomColor = COLOR_SWATCHES[Math.floor(Math.random() * COLOR_SWATCHES.length)].value;
    const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)].value;

    const randomized = {
      uid: randomId,
      displayName: randomN,
      photoURL: profilePic,
      occupation: randomOcc,
      favoriteBug: randomBug,
      clearance: randomClearance,
      codingSkill: randomSkill,
      address: "Khulna, Sector " + Math.floor(Math.random() * 9 + 1),
      accentColor: randomColor,
      sticker: randomSticker
    };
    updateCitizenProfile(randomized);
  };

  // Picture upload action
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = () => {
        updateCitizenProfile({
          photoURL: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe manual ID regeneration
  const handleRegenerateID = () => {
    if (user) {
      updateCitizenProfile({
        ...user,
        uid: generateProperDumbID()
      });
    }
  };

  // PNG Exporter Engine
  const downloadNIDImage = async (side: "front" | "back") => {
    const canvas = document.createElement("canvas");
    canvas.width = 1012; // High definition print resolution
    canvas.height = 638;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background block filling with soft greenish mesh hue
    ctx.fillStyle = "#f4f7f6";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, 1012, 638, 30);
    } else {
      ctx.rect(0, 0, 1012, 638);
    }
    ctx.fill();

    // Outlining card edge border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.stroke();

    if (side === "front") {
      // 1. Draw solid colored header ribbon
      ctx.fillStyle = cardColor || "#006a4e";
      ctx.fillRect(0, 0, 1012, 108);

      // Red or Gold security stripe below banner
      ctx.fillStyle = isQueen ? "#fbbf24" : "#f42a41";
      ctx.fillRect(0, 108, 1012, 10);

      // Banner Text lines
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Government of the People's Republic of Dumbland", 506, 45);
      
      ctx.font = "900 28px sans-serif";
      ctx.fillText("NATIONAL DUMB CARD", 506, 85);

      // Background decorative watermark text
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.font = "bold 150px sans-serif";
      ctx.save();
      ctx.translate(506, 319);
      ctx.rotate(-Math.PI / 12);
      ctx.fillText("DUMB", 0, 40);
      ctx.restore();

      // Right bottom secure crest seal
      ctx.shadowBlur = 0;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(0,106,78,0.15)";
      ctx.beginPath();
      ctx.arc(880, 480, 75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,106,78,0.08)";
      ctx.font = "900 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("DUMBLAND", 880, 485);

      // Left column: Profile Photo
      const drawPhoto = () => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 70, 175, 230, 290);
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 3;
            ctx.strokeRect(70, 175, 230, 290);
            resolve();
          };
          img.onerror = () => {
            // Silhouette fallback
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(70, 175, 230, 290);
            ctx.fillStyle = "#475569";
            ctx.font = "60px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("🤡", 185, 335);
            resolve();
          };
          img.src = isCitizenActive ? (user.photoURL || profilePic) : profilePic;
        });
      };

      await drawPhoto();

      // Signature rendering
      ctx.fillStyle = "#334155";
      ctx.font = "italic 32px cursive";
      ctx.textAlign = "center";
      ctx.fillText(cardSignature, 185, 520);
      
      // Signature line
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 535);
      ctx.lineTo(300, 535);
      ctx.stroke();
      
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Signature", 185, 555);

      // Metadata labels write-out
      ctx.textAlign = "left";

      // Card Name
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Name", 350, 195);
      ctx.fillStyle = "#0f172a";
      ctx.font = "900 32px sans-serif";
      ctx.fillText(cardName, 350, 240);

      // Card Occupation
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Occupation", 350, 295);
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(cardOccupation, 350, 335);

      // Clearance Rating
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Clearance Rating", 350, 390);
      ctx.fillStyle = "#0284c7";
      ctx.font = "800 24px sans-serif";
      ctx.fillText(cardClearance, 350, 428);

      // ID NO block
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("ID NO", 350, 490);
      ctx.fillStyle = isQueen ? "#7e22ce" : "#f42a41";
      ctx.font = "900 34px monospace";
      ctx.fillText(cardIdNo, 350, 535);

    } else {
      // 2. BACK SIDE rendering
      ctx.fillStyle = cardColor || "#006a4e";
      ctx.fillRect(0, 0, 1012, 100);

      ctx.fillStyle = isQueen ? "#fbbf24" : "#f42a41";
      ctx.fillRect(0, 100, 1012, 10);

      // Top text lines
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("This card remains structural property of the Dumbland Department of Absurdity.", 506, 40);
      ctx.fillText("If found, please drop at the nearest physical binary chaos bin.", 506, 70);

      // Watermark Text layer
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.font = "bold 150px sans-serif";
      ctx.save();
      ctx.translate(506, 319);
      ctx.rotate(Math.PI / 12);
      ctx.fillText("DUMB", 0, 40);
      ctx.restore();

      // Fingerprint scanner emblem background panel
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(70, 175, 140, 140);
      ctx.fillStyle = "#64748b";
      ctx.font = "60px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👤", 140, 260);

      // Secure clearance info blocks
      ctx.textAlign = "left";
      ctx.fillStyle = "#475569";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("AUTHENTIC DATABASE ENTRY", 240, 205);
      
      ctx.fillStyle = "#006a4e";
      ctx.font = "900 24px sans-serif";
      ctx.fillText(`System Level: ${cardClearance}`, 240, 245);

      ctx.fillStyle = "#64748b";
      ctx.font = "18px sans-serif";
      ctx.fillText("Subject exhibits incredible defense of unvetted logic, CSS gaps,", 240, 280);
      ctx.fillText("and executes pristine code chaos without warning parameters.", 240, 310);

      // Skill Ratings
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("ROYAL POWER", 70, 385);
      ctx.fillStyle = "#0f172a";
      ctx.font = "900 24px sans-serif";
      ctx.fillText(cardRoyalPower, 70, 420);

      // Critical bug parameters
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("DIVINE AURA", 520, 385);
      ctx.fillStyle = isQueen ? "#7e22ce" : "#f42a41";
      ctx.font = "900 24px sans-serif";
      ctx.fillText(cardDivineAura, 520, 420);

      // Barcode elements drawing
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(70, 475, 872, 75);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.strokeRect(70, 475, 872, 75);

      ctx.fillStyle = "#000000";
      let barPos = 90;
      for (let i = 0; i < 90; i++) {
        const barW = (i % 3 === 0) ? 6 : (i % 2 === 0) ? 2 : 4;
        ctx.fillRect(barPos, 485, barW, 55);
        barPos += barW + ((i % 5 === 0) ? 5 : 3);
        if (barPos > 910) break;
      }

      ctx.fillStyle = "#64748b";
      ctx.font = "900 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(barcodeValue, 506, 580);
    }

    // Trigger local PNG download file action
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const labelSanitized = cardSignature.toLowerCase().replace(/[^a-z0-9]/g, "");
    link.download = `dumb_nid_${side}_${labelSanitized || "citizen"}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      
      {/* 3D CARD BOX WORKSPACE */}
      {!hideCard && (
        <div 
          id="nid-card-container"
        className="relative w-[285px] h-[178px] min-[375px]:w-[340px] min-[375px]:h-[212px] sm:w-[380px] sm:h-[238px] md:w-[420px] md:h-[262px] lg:w-[460px] lg:h-[288px] xl:w-[500px] xl:h-[312px] cursor-pointer group select-none flex items-center justify-center transition-all duration-300 origin-center my-4 sm:my-6 md:my-8"
        style={{ perspective: "1250px", WebkitPerspective: "1250px" } as React.CSSProperties}
        onClick={handleFlip}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Absolute floating helper tooltip / Biometric scanning indicator */}
        <div 
          id="card-hover-hint" 
          className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-slate-300 uppercase transition-all duration-300 shadow-xl pointer-events-none flex items-center gap-1.5 z-50 ${isScanning ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isScanning ? (
            <>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-emerald-400 font-bold">{scanStatus}</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              <span>Click to flip NID</span>
            </>
          )}
        </div>

        <motion.div
          id="nid-card-tilt-wrapper"
          className="w-full h-full relative"
          animate={{
            rotateX: isAnimating ? 0 : rotateX,
            rotateY: isAnimating ? 0 : rotateYVal,
            scale: isAnimating ? 1.01 : undefined
          }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" } as React.CSSProperties}
        >
          <motion.div
            id="nid-card-mesh"
            className="w-full h-full relative"
            initial={{ rotateY: 0 }}
            animate={cardControls}
            style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" } as React.CSSProperties}
          >
            {/* FRONT SIDE */}
            <div 
              className="absolute inset-0 w-full h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none"
              style={{ 
                backfaceVisibility: "hidden", 
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(1px)"
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-[#f4f7f6] overflow-hidden rounded-xl border border-slate-300 font-sans text-slate-800 flex flex-col">
                  {/* Top Banner (NID Style) */}
                <div 
                  style={{ backgroundColor: cardColor, borderColor: isQueen ? "#fbbf24" : "#f42a41" }}
                  className="w-full pt-2 min-[375px]:pt-3 pb-1 flex flex-col items-center justify-center border-b-[4px] relative z-10 shadow-sm transition-colors duration-300"
                >
                  {isQueen && <div className="text-[6px] font-black uppercase tracking-[0.2em] text-amber-300 mb-0.5">Sovereign Authority</div>}
                  <h4 className="text-[7.5px] min-[375px]:text-[9px] sm:text-[10px] md:text-[11px] text-white font-bold uppercase tracking-wider mb-0.5 text-center px-1">Government of the People's Republic of Dumbland</h4>
                  <h3 className="text-[10px] min-[375px]:text-[12px] sm:text-[13px] md:text-sm text-white font-black tracking-widest leading-none">NATIONAL DUMB CARD</h3>
                </div>
                
                {/* Microprint backdrop */}
                <div className="absolute inset-0 opacity-[0.03] text-[6px] leading-[6px] overflow-hidden break-all text-justify pointer-events-none z-0">
                  {Array(200).fill("DUMB CARD OFFICIALLY CERTIFIED ").join("")}
                </div>

                <div className="flex p-2 min-[375px]:p-3 md:p-4 gap-2.5 min-[375px]:gap-3 md:gap-4 h-full relative z-10">
                  {/* Left - Photo */}
                  <div className="flex flex-col items-center gap-1 w-[70px] min-[375px]:w-[80px] sm:w-[90px] md:w-[100px] flex-shrink-0 relative">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-full h-[85px] min-[375px]:h-[100px] sm:h-[110px] md:h-[120px] p-[1.5px] sm:p-[2px] bg-white border border-slate-300 shadow-sm relative overflow-hidden select-none"
                    >
                      <SecureImage 
                        srcUri={isCitizenActive ? (user.photoURL || profilePic) : profilePic} 
                        alt={cardName} 
                        className="w-full h-full object-cover select-none"
                      />
                      {/* Secure transparent click block */}
                      <div className="absolute inset-0 bg-transparent select-none z-30" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} />
                      
                      {/* Accessories Overlays */}
                      {isCitizenActive && renderSticker()}
                    </motion.div>
                    
                    <div className="mt-1 sm:mt-2 text-[10px] min-[375px]:text-[12px] md:text-[14px] font-[signature,cursive] text-slate-700 border-t border-slate-400 w-[80%] text-center pt-0.5 italic truncate">
                      {cardSignature}
                    </div>
                    <span className="text-[7.5px] uppercase text-slate-400 font-bold">Signature</span>
                  </div>

                  {/* Right - Profile Info */}
                  <div className="flex flex-col flex-1 pl-1">
                    <div className="mb-2 md:mb-3">
                      <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Name</p>
                      <p className="text-[11px] min-[375px]:text-[13px] sm:text-[14px] md:text-[16px] font-black text-slate-900 leading-none truncate">{cardName}</p>
                    </div>
                    <div className="mb-2 md:mb-3">
                      <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Occupation</p>
                      <p className="text-[10px] min-[375px]:text-[11px] sm:text-[12px] md:text-[13.5px] font-bold text-slate-800 leading-none truncate">{cardOccupation}</p>
                    </div>
                    <div className="mb-2 md:mb-3">
                      <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">Social Profile</p>
                      <div className="flex gap-1.5 sm:gap-2 text-[#006a4e] mt-0.5 sm:mt-1 relative z-20">
                        <button onClick={(e) => handleSocialClick(e, "fb")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                          <Facebook className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button onClick={(e) => handleSocialClick(e, "ig")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                          <Instagram className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button onClick={(e) => handleSocialClick(e, "github")} className="hover:text-[#f42a41] cursor-pointer pointer-events-auto transition-colors focus:outline-none">
                          <Github className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-auto pb-1">
                      <p className="text-[7px] min-[375px]:text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 font-bold uppercase leading-none mb-1">ID NO</p>
                      <p className={`text-[11px] min-[375px]:text-[13px] sm:text-[15px] md:text-[16px] font-mono font-black tracking-[0.15em] truncate ${isQueen ? "text-purple-700" : "text-[#f42a41]"}`}>{cardIdNo}</p>
                    </div>
                  </div>
                  
                  <div className="absolute right-[#5px] bottom-[5px] sm:right-[-10px] bottom-[10px] opacity-[0.05] pointer-events-none z-0 scale-[0.6] sm:scale-100 origin-bottom-right">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="28" stroke="black" strokeWidth="3" strokeDasharray="4 4"/>
                      <text x="50" y="55" fontSize="20" textAnchor="middle" fill="black" fontWeight="900" fontFamily="monospace">DUMB</text>
                    </svg>
                  </div>
                </div>
                
                {/* Holographic scanning HUD overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-500/[0.02] z-30 pointer-events-none">
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 0.65, ease: "linear" }}
                      className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.85)] z-40"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(16,185,129,0.06))] animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* BACK SIDE */}
            <div 
              className="absolute inset-0 w-full h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
              style={{ 
                backfaceVisibility: "hidden", 
                WebkitBackfaceVisibility: "hidden", 
                transform: "rotateY(180deg) translateZ(1px)" 
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-[#f4f7f6] overflow-hidden rounded-xl border border-slate-300 font-sans text-slate-800 flex flex-col">
                {/* Back Banner */}
                <div 
                  style={{ backgroundColor: cardColor, borderColor: isQueen ? "#fbbf24" : "#f42a41" }}
                  className="w-full py-1 sm:py-2 flex items-center justify-center border-b-[4px] relative z-10 transition-colors duration-300"
                >
                  <p className="text-[6.5px] min-[375px]:text-[7.5px] sm:text-[8px] md:text-[9px] text-white font-bold text-center px-4 leading-normal">This card is property of the Dumbland Department of Absurdity. If found, please return to the nearest chaos center.</p>
                </div>

                <div className="p-2 min-[375px]:p-3 md:p-4 flex flex-col h-full gap-2 sm:gap-3 relative z-10">
                  <div className="flex gap-2 sm:gap-4">
                    <div className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 sm:w-16 sm:h-16 bg-slate-200 rounded flex items-center justify-center border border-slate-300 shadow-inner flex-shrink-0">
                      <Fingerprint className="w-6 h-6 min-[375px]:w-8 min-[375px]:h-8 sm:w-10 sm:h-10 text-slate-400 opacity-50" />
                    </div>
                    <div className="flex-1 space-y-1 sm:space-y-2">
                      <div className="flex items-center gap-1 sm:gap-2 leading-none">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: cardColor }} />
                        <span className="text-[7.5px] min-[375px]:text-[8.5px] sm:text-[9px] font-bold uppercase text-slate-500">Security Clearance</span>
                        <span className="text-[8.5px] min-[375px]:text-[9.5px] sm:text-[10px] font-black text-emerald-600 truncate">{cardClearance}</span>
                      </div>
                      <div className="flex items-start gap-1 sm:gap-2">
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[8px] min-[375px]:text-[9px] sm:text-[10px] text-slate-700 leading-tight">Subject exhibits high resistance to standard logic and maintains a 98% success rate in producing bug-free chaos.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-0.5 sm:mt-1">
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[7px] min-[375px]:text-[7.5px] sm:text-[8px] font-bold text-slate-400 uppercase">Royal Power</p>
                      <div className="flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />
                        <span className="text-[9.5px] min-[375px]:text-[10.5px] sm:text-[11px] font-black italic truncate">{cardRoyalPower}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[7px] min-[375px]:text-[7.5px] sm:text-[8px] font-bold text-slate-400 uppercase">Divine Aura</p>
                      <span className={`text-[9.5px] min-[375px]:text-[10.5px] sm:text-[11px] font-black italic truncate ${isQueen ? "text-purple-700" : "text-[#f42a41]"}`}>{cardDivineAura}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-center bg-slate-100 rounded p-1 border border-slate-200">
                    <p className="text-[7px] font-bold uppercase text-slate-500">Blood Group: {cardBloodGroup} | Issued: {cardDateOfIssuance}</p>
                  </div>

                  <div className="mt-auto flex flex-col items-center">
                    <div className="w-full h-5 min-[375px]:h-7 sm:h-8 bg-white border border-slate-300 flex items-center justify-center mb-1 overflow-hidden">
                      <div className="flex gap-[1px] sm:gap-[2px]">
                        {Array(40).fill(0).map((_, i) => (
                          <div key={i} className="h-6 w-[2px] bg-slate-900" style={{ width: `${(i % 3 === 0) ? 3 : (i % 2 === 0) ? 1.5 : 2}px` }}></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-[6.5px] min-[375px]:text-[7.5px] sm:text-[8px] font-mono text-slate-500 truncate">{barcodeValue}</p>
                  </div>
                </div>
                
                {/* Subtle Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none -rotate-12">
                  <span className="text-[80px] font-black tracking-tighter">DUMB</span>
                </div>

                {/* Holographic scanning HUD overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-500/[0.02] z-30 pointer-events-none">
                    <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 0.65, ease: "linear" }}
                      className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-450 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.85)] z-40"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(52,211,153,0.06))] animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>)}

      {/* METRIC-GRADE CONTROL CONSOLE PANEL */}
      {showConsole && (
        <div className="w-full">
          {/* Hidden File Input for Citizen Portrait Upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handlePhotoUpload} 
          />

          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="logged-out-controls"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                <div className="bg-slate-900/90 border border-slate-800/85 p-5 rounded-2xl w-full text-center space-y-4 shadow-xl">
                  <div className="flex items-center justify-center gap-2">
                    <Fingerprint className="w-5 h-5 text-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block">SECURE CREDENTIAL GATEWAY</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                    Claim your own signature <span className="text-emerald-400 font-extrabold font-mono">National Dumbland NID Card</span> with instant custom profile parameters, custom image uploads, & local image downloads!
                  </p>
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-400 text-slate-950 font-sans font-black rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_25px_rgba(16,185,129,0.25)] border-t border-emerald-300/30 font-bold"
                  >
                    <LogIn size={14} className="stroke-[2.5px]" />
                    <span>Authenticate & Claim My NID Card 🤡</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logged-in-controls"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                {/* Primary Horizontal Interactive Menu */}
                <div className="bg-slate-900/95 border border-slate-850 p-4 rounded-xl w-full space-y-3.5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">ROYAL ARCHIVES LIVE</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 uppercase">SOVEREIGN IDENTITY CARD</span>
                  </div>

                  {/* Grid layout for major quick action pins */}
                  <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 text-center">
                    <button
                      type="button"
                      onClick={handleFlip}
                      className="p-3.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 text-slate-200 border border-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      <RefreshCw size={16} className="text-emerald-400 animate-spin-slow" />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Flip NID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomizerOpen(!customizerOpen)}
                      className={`p-3.5 rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
                        customizerOpen 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-800/40 hover:bg-slate-800/70 text-slate-200 border-slate-800'
                      }`}
                    >
                      <Camera size={16} className={customizerOpen ? "text-emerald-400" : "text-emerald-400"} />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase">Edit Pic</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadNIDImage("front")}
                      className="p-3.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 text-slate-200 border border-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      <Download size={16} className="text-teal-400" />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-center leading-none">Download<br/>Front</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadNIDImage("back")}
                      className="p-3.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 text-slate-200 border border-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      <Download size={16} className="text-rose-400" />
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-center leading-none">Download<br/>Back</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end font-mono pt-1 text-[10px]">
                    <button
                      type="button"
                      onClick={logoutUser}
                      className="py-1.5 px-3 rounded-md transition-all flex items-center gap-1 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 cursor-pointer text-[10px]"
                    >
                      <LogOut size={11} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Advanced Customizer Form dashboard */}
                <AnimatePresence>
                  {customizerOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full overflow-hidden"
                    >
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">Update Identity Portrait</h4>
                          </div>
                        </div>

                        {/* Photo upload grid box */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                            <div className="w-16 h-16 rounded overflow-hidden bg-slate-900 border border-slate-800 relative group flex-shrink-0">
                              <img src={user.photoURL || profilePic} className="w-full h-full object-cover" alt="Avatar upload preview" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <Camera className="w-4 h-4 text-emerald-400" />
                              </div>
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <p className="text-[10px] text-slate-400 leading-normal">
                                Upload a custom face shot (PNG, JPEG). Immediately formatted as a legal smart secure picture!
                              </p>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Upload size={11} />
                                <span>Select Image File</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
