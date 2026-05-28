import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX, 
  Disc, Sparkles, Heart, FileText, Check, ListMusic, Headset
} from "lucide-react";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  description: string;
  lyrics: string;
  translation: string;
  baseFreq: number;
  synthStyle: "acoustic" | "space" | "rhythmic" | "haunting" | "pulse" | "choral";
  accent: string;
  audioUrl: string;
}

const POPEYE_SONGS: Song[] = [
  {
    id: 1,
    title: "Asha (আশা)",
    artist: "Popeye Bangladesh",
    album: "Amra 90 Based",
    duration: 372,
    description: "A soothing melodic reflection about hope, light, and surviving dark nights.",
    lyrics: "আশা জেগে থাকে মনে, নিভু নিভু আলোকোনে...\nখুঁজে পাই পথ আমি তোমার ওই হাসিতে。\nবুকের গভীরে জমে থাকা মেঘ সব উড়ে যায়,\nআশার প্রদীপ জ্বেলে পথ খুঁজে নিই ঠিকই।",
    translation: "Hope stays alive in the corner of fading light...\nI find the pathway in your beautiful smile.\nThe storm clouds compiled deep inside simply float away,\nI light the candle of hope and always find my way.",
    baseFreq: 220,
    synthStyle: "acoustic",
    accent: "from-emerald-500 to-teal-400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Bhalobasa Baki (ভালোবাসা বাকি)",
    artist: "Popeye",
    album: "Nostalgia",
    duration: 423,
    description: "Nostalgic alternative post-grunge ballad pleading for remaining fractions of love.",
    lyrics: "ভালোবাসা বাকি এখনও কিছুটা, হয়তো বা বেশি ভালোবাসা বাকি...\nতুমি কি আসবে ফিরে, হাত দুটো ছুঁয়ে দিতে?\nকতটা বছর কেটে গেল এই বিরান পথে একা একা,\nভালোবাসা বাকি এখনও, শেষ কথা বলতে বাকি।",
    translation: "Some love remains even now, maybe a whole lot of love is left...\nWill you come back to touch my hands again?\nSo many years swept by on this barren road alone,\nLove remains still, and the final word is yet to be spoken.",
    baseFreq: 196,
    synthStyle: "space",
    accent: "from-rose-500 to-amber-500",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Iccha (ইচ্ছে)",
    artist: "Popeye Bangladesh",
    album: "Prithibi",
    duration: 344,
    description: "High-flying, uplifting indie alternative theme driving toward free skies.",
    lyrics: "ইচ্ছে করে উড়ে যাই ওই নীল সীমানায়, যেখানে মেঘেরা ভেসে যায়...\nবাঁধ ভেঙ্গে দিয়ে সব সীমানা পেরিয়ে,\nমুক্ত পাখির মত ডানা মেলে গান গাই,\nইচ্ছে যত ডানা মেলে ছড়াক নীল আসমানে।",
    translation: "I wish to drift away into that deep blue limit where clouds float...\nBreaking all barriers, crossing every horizon,\nSpreading wings and singing like a wild free bird,\nLet all my desires take flight in the cyan sky.",
    baseFreq: 294,
    synthStyle: "rhythmic",
    accent: "from-sky-400 to-blue-600",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Neshar Bojha (নেশার বোঝা)",
    artist: "Popeye",
    album: "Dark Whispers",
    duration: 302,
    description: "A deep, emotional masterpiece highlighting heavy burdens, internal battles, and redemption.",
    lyrics: "নেশার বোঝা বইতে বইতে ক্লান্ত হলো মন,\nমিথ্যে মায়ার পেছনে ছুটে ভাঙলো আমার ঘর...\nতবুও তো আলো ফোটে প্রতিটা ভোরের শেষে,\nএই বোঝা নামিয়ে দিয়ে বাঁচবো আবার নিজের দেশে।",
    translation: "The soul grew weary carrying the heavy burden of escape...\nChasing deceitful illusions broke my sanctuary down.\nYet, the pure dawn breaks after every long pitch dark night,\nI'll drop this burden and breathe in my own homeland again.",
    baseFreq: 147,
    synthStyle: "haunting",
    accent: "from-purple-600 to-indigo-800",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Amar Dehokhan (আমার দেহখান)",
    artist: "Popeye Bangladesh",
    album: "Inner Peace",
    duration: 362,
    description: "A hauntingly beautiful acoustic spiritual track honoring cosmic transience and melody.",
    lyrics: "আমার দেহখান যদি ভেঙে যায় ধুলোয়,\nআমার সুর বেঁচে রবে নদী ও হাওয়ায়...\nতুমি কেঁদোনা শুধু গেয়ে যেও গীত,\nএই নশ্বর প্রাণ পেরিয়ে জয় হবে সংগীতের।",
    translation: "If this body of mine crumbles to absolute dust,\nMy melodies shall survive in the rivers and warm breeze...\nDo not shed tears; just carry on singing the songs,\nThis mortal life fades but pure music conquers forever.",
    baseFreq: 165,
    synthStyle: "pulse",
    accent: "from-amber-400 to-red-500",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "Prabhu (প্রভু)",
    artist: "Popeye",
    album: "Spiritual Surrender",
    duration: 316,
    description: "Spiritual, atmospheric song of deep prayer, introspection, and grace.",
    lyrics: "প্রভু তোমার কাছেই ফেরা সবার শেষে,\nভুলগুলো সব ক্ষমা করো দয়া করে...\nতুমি ছাড়া কে মেটাবে বুকের হাহাকার?\nআলোর দিশা দেখাও প্রভু এ আঁধারে এবার।",
    translation: "Lord, everyone returns to You at the ultimate end of days,\nPlease forgive all our errors with your endless grace...\nWho else but You can soothe this hollow crying soul?\nShow the shining star of guidance in this deep darkness, O Lord.",
    baseFreq: 130,
    synthStyle: "choral",
    accent: "from-violet-500 to-fuchsia-400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

export default function FavMusic() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const currentSong = POPEYE_SONGS[currentSongIndex];
  
  // HTML5 audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Audio synthesis state
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorGroupRef = useRef<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize HTML5 audio element source and speed
  useEffect(() => {
    // Instantiating non-UI HTML5 audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    
    // Stop synthesize if playing audio
    audio.src = currentSong.audioUrl;
    audio.load();
    audio.volume = isMuted ? 0 : volume;
    
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio play interrupted/blocked by gestures", err);
      });
    }

    // Audio tracking events
    const handleTimeUpdate = () => {
      setProgress(Math.floor(audio.currentTime));
    };

    const handleEnded = () => {
      handleNextSong();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex]);

  // Synchronize Play/Pause controls
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Gesture restriction block playing track", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Adjust volume dynamically in audio tag
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Setup reactive canvas audio visualizer drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 90);
    
    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener("resize", handleResize);

    const particles: { x: number; y: number; s: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.8 + 0.2
      });
    }

    let phase = 0;
    const renderVisualizer = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Render flowing waves reflecting simulated frequencies
      const songAccent = currentSong.accent;
      const isGreen = songAccent.includes("emerald");
      const isRose = songAccent.includes("rose");
      const isBlue = songAccent.includes("sky");
      const isPurple = songAccent.includes("purple");
      const isAmber = songAccent.includes("amber");

      let strokeColorHex = "#10b981"; // default emerald
      if (isRose) strokeColorHex = "#f43f5e";
      else if (isBlue) strokeColorHex = "#38bdf8";
      else if (isPurple) strokeColorHex = "#a855f7";
      else if (isAmber) strokeColorHex = "#f59e0b";

      // Draw active sine wave
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColorHex;
      
      const waveAmplitude = isPlaying ? 22 : 2.5;
      const freqMultiplier = isPlaying ? 0.015 : 0.008;
      phase += isPlaying ? 0.04 : 0.005;

      ctx.shadowBlur = 12;
      ctx.shadowColor = strokeColorHex;

      for (let x = 0; x < width; x++) {
        // Modulate secondary visual beats
        const y = height / 2 + 
          Math.sin(x * freqMultiplier + phase) * waveAmplitude + 
          Math.cos(x * 0.03 - phase * 1.5) * (waveAmplitude / 3.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Secondary ambient wave (transparent mirror)
      ctx.beginPath();
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = strokeColorHex + "33"; // lower opacity
      ctx.shadowBlur = 0;
      for (let x = 0; x < width; x++) {
        const yPlus = height / 2 - 
          Math.sin(x * freqMultiplier * 1.2 - phase * 0.8) * (waveAmplitude * 0.7) -
          Math.cos(x * 0.045 + phase) * (waveAmplitude * 0.25);
        if (x === 0) {
          ctx.moveTo(x, yPlus);
        } else {
          ctx.lineTo(x, yPlus);
        }
      }
      ctx.stroke();

      // Render floating aesthetic microparticles
      particles.forEach((p) => {
        p.x -= isPlaying ? p.speed * 2.0 : p.speed * 0.3;
        if (p.x < 0) p.x = width;

        ctx.fillStyle = strokeColorHex;
        ctx.globalAlpha = isPlaying ? p.alpha : p.alpha * 0.25;
        ctx.beginPath();
        const yOffset = isPlaying ? Math.sin(phase + p.x * 0.01) * 8 : 0;
        ctx.arc(p.x, p.y + yOffset, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw small timeline ticks at the bottom border
      ctx.fillStyle = "#334155";
      for (let tx = 0; tx < width; tx += 40) {
        ctx.fillRect(tx, height - 4, 1.5, 4);
      }

      animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentSongIndex]);

  // Player handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % POPEYE_SONGS.length);
    setProgress(0);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + POPEYE_SONGS.length) % POPEYE_SONGS.length);
    setProgress(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    const mm = Math.floor(secs / 60);
    const ss = Math.floor(secs % 60);
    return `${mm}:${ss < 10 ? "0" : ""}${ss}`;
  };

  return (
    <section id="music" className="py-24 px-6 max-w-4xl mx-auto font-sans scroll-mt-24">
      {/* Title block */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-3xl font-bold text-slate-200 flex items-center">
          <span className="text-emerald-500 font-mono text-xl mr-2">04.</span>
          My Favorite Tracks (Popeye)
        </h2>
        <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
      </div>
      
      <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-12 font-mono">
        Popeye (Popeye Bangladesh) is a pioneer in progressive post-grunge acoustic rock in Bangladesh. These tracks echo true nostalgic emotions. Turn on the player to trigger realistic acoustic/ambient synthesizer outputs!
      </p>

      {/* Main Music Console */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Modern Rotating Decal Deck & Controls */}
        <div className="md:col-span-7 bg-[#0b0f19]/90 border border-slate-800/80 p-5 md:p-7 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          
          {/* Subtle internal glowing glass light */}
          <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top header state */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 select-none relative z-10">
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black py-1 px-3 rounded-full flex items-center gap-1.5 uppercase tracking-widest leading-none">
              <Headset size={12} className="animate-pulse" />
              <span>HQ Interactive Synth Link</span>
            </span>
            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Popeye Archives V14</span>
          </div>

          {/* Core Interactive Audio Visualizer Screen */}
          <div className="bg-[#05070c] border border-slate-900 rounded-2xl p-4 mb-5 relative z-10 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-start mb-3 select-none">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">PLAYING FROM PARTITION</span>
                <h3 className="text-sm font-black text-slate-200 tracking-tight leading-none uppercase truncate max-w-[210px]">
                  {currentSong.title}
                </h3>
              </div>
              <div className="text-right font-mono text-[9px] text-[#8b949e]">
                <span>MODE: </span>
                <span className="text-emerald-400 font-black">{currentSong.synthStyle.toUpperCase()}</span>
              </div>
            </div>

            {/* Simulated Live Reactive Canvas */}
            <div className="h-[90px] w-full bg-[#020408] rounded-xl border border-slate-950/80 relative overflow-hidden">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>
            
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2 hover:text-slate-400 select-none">
              <span className="flex items-center gap-1">
                <Sparkles size={9} className="text-emerald-400" />
                Press play to generate beautiful audio frequencies.
              </span>
              <span>SYNTH_ACTIVE</span>
            </div>
          </div>

          {/* Interactive Decal deck cover & slider knobs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 relative z-10">
            
            {/* Spinning Disc Record */}
            <div className="relative flex-shrink-0">
              <motion.div 
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { repeat: Infinity, duration: 6, ease: "linear" } : { duration: 0.5 }}
                className="w-28 h-28 rounded-full bg-radial-[circle_at_center,black_50%,#111827_75%] border-2 border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center relative relative overflow-hidden"
              >
                {/* Grooves */}
                <div className="absolute inset-2 rounded-full border border-slate-900 opacity-60" />
                <div className="absolute inset-4 rounded-full border border-slate-900 opacity-50" />
                <div className="absolute inset-6 rounded-full border border-slate-900 opacity-45" />
                <div className="absolute inset-8 rounded-full border border-slate-950/90" />

                {/* Custom glowing core theme sticker */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${currentSong.accent} p-0.5 flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.3)]`}>
                  <div className="w-2 h-2 rounded-full bg-slate-950" />
                </div>
              </motion.div>
              
              {/* Arm overlay decoration */}
              <div className="absolute top-1 right-2 w-4 h-11 border-l-2 border-t-2 border-slate-500/40 rounded-tl-lg pointer-events-none origin-top rotate-[15deg]" />
            </div>

            {/* Details panel and description */}
            <div className="flex-1 text-center sm:text-left select-none">
              <span className="font-mono text-[9px] text-[#8b949e] uppercase tracking-widest mb-1 block">Selected Masterpiece</span>
              <h4 className="text-base font-black text-slate-100 flex items-center justify-center sm:justify-start gap-1.5 leading-none mb-1">
                {currentSong.title} 
                <Heart size={13} className="text-rose-500 fill-rose-500/20" />
              </h4>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">{currentSong.artist} • {currentSong.album}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                "{currentSong.description}"
              </p>
            </div>
          </div>

          {/* Interactive Seek Bar Scrubbing Controls */}
          <div className="space-y-1 mb-6 relative z-10 select-none">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
            
            {/* Custom interactive progress bar track */}
            <div 
              className="h-1.5 w-full bg-slate-900 rounded-full border border-slate-800/60 overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                setProgress(Math.floor(pct * currentSong.duration));
              }}
            >
              <div 
                className={`h-full bg-gradient-to-r ${currentSong.accent} rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
                style={{ width: `${(progress / currentSong.duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Buttons & Volume */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto relative z-10">
            {/* Play, Pause, Jump controls */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={handlePrevSong}
                className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="Previous track"
              >
                <SkipBack size={15} />
              </button>

              <button 
                type="button"
                onClick={handlePlayPause}
                className={`w-14 h-14 rounded-full bg-gradient-to-r ${currentSong.accent} text-slate-950 flex items-center justify-center cursor-pointer active:scale-90 transition-all shadow-[0_5px_20px_rgba(16,185,129,0.25)] border-t border-white/20`}
                title={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  <Pause size={22} className="fill-current stroke-[2.5px]" />
                ) : (
                  <Play size={22} className="fill-current ml-1 stroke-[2.5px]" />
                )}
              </button>

              <button 
                type="button"
                onClick={handleNextSong}
                className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                title="Next track"
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Volume feedback loop */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto bg-slate-900/50 border border-slate-900 p-2 rounded-xl text-xs">
              <button 
                type="button"
                onClick={toggleMute}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24 accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                title="Volume slider"
              />
              
              <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[9.5px] uppercase font-black tracking-wider flex items-center gap-1.5 transition-all ${showLyrics ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700"}`}
              >
                <FileText size={11} /> 
                <span>{showLyrics ? "Visualizer" : "Lyrics"}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Side: Track List / Interactive Lyrics Pane */}
        <div className="md:col-span-5 flex flex-col gap-5 h-full">
          
          <AnimatePresence mode="wait">
            {showLyrics ? (
              /* Lyrics Panel */
              <motion.div 
                key="lyrics-pane"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0b0f19] border border-slate-800/70 p-5 rounded-3xl h-full flex flex-col min-h-[460px] justify-between relative relative overflow-hidden"
              >
                {/* Light visual bg decorative ornament */}
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="border-b border-slate-800 pb-3 mb-4 select-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono text-purple-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <FileText size={11} /> Bengali Lyrics Deck
                    </span>
                    <button 
                      onClick={() => setShowLyrics(false)}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-1 space-y-5 text-center flex flex-col justify-center scrollbar-thin">
                  
                  {/* Bengali standard section */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 block uppercase">Original lines</span>
                    <p className="text-sm font-semibold text-slate-200 leading-relaxed font-sans whitespace-pre-line antialiased italic">
                      {currentSong.lyrics}
                    </p>
                  </div>

                  <div className="w-16 h-px bg-slate-800 mx-auto" />

                  {/* Poetic English description translation */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-500/75 block uppercase">Emotional English Translation</span>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed pl-3 pr-3 whitespace-pre-line">
                      {currentSong.translation}
                    </p>
                  </div>

                </div>

                <p className="text-[9px] font-mono text-slate-500 text-center select-none pt-4 border-t border-slate-850 mt-4 uppercase">
                  Nostalgic Tracks // Translation curated by Tasfiya 🤡
                </p>
              </motion.div>
            ) : (
              /* Songs Playlist Deck */
              <motion.div 
                key="playlist-pane"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0b0f19] border border-slate-800/70 p-5 rounded-3xl h-full flex flex-col min-h-[460px] relative overflow-hidden"
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-850 select-none">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ListMusic size={13} className="text-emerald-500" /> Popeye Masterlist
                  </span>
                  <span className="text-[10px] font-mono text-[#8b949e]">
                    {POPEYE_SONGS.length} FILES
                  </span>
                </div>

                {/* Vertical scroll list of tracks */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[350px] scrollbar-thin">
                  {POPEYE_SONGS.map((song, index) => {
                    const isSelected = index === currentSongIndex;
                    
                    return (
                      <motion.button
                        key={song.id}
                        type="button"
                        onClick={() => {
                          setCurrentSongIndex(index);
                          setProgress(0);
                        }}
                        whileHover={{ x: 4 }}
                        className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected 
                            ? "bg-slate-900/90 border-emerald-500/25 shadow-md" 
                            : "bg-slate-900/30 border-slate-850 hover:bg-slate-900/60 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Animated speaker bars or simple indexed badge */}
                          <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center font-mono text-xs text-slate-500 font-extrabold select-none shrink-0">
                            {isSelected && isPlaying ? (
                              <div className="flex items-end gap-0.5 h-3">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.75 bg-emerald-400 rounded-full" />
                                <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-0.75 bg-emerald-400 rounded-full" />
                                <motion.div animate={{ height: [6, 11, 4] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.25 }} className="w-0.75 bg-emerald-400 rounded-full" />
                              </div>
                            ) : (
                              <span>0{song.id}</span>
                            )}
                          </div>

                          <div className="truncate max-w-[155px]">
                            <h4 className={`text-xs font-black truncate ${isSelected ? "text-emerald-400" : "text-slate-200"}`}>
                              {song.title}
                            </h4>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{song.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-[#8b949e]">
                            {formatTime(song.duration)}
                          </span>
                          {isSelected && <Check size={12} className="text-emerald-400 shrink-0" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-auto border-t border-slate-850 pt-4 font-mono text-[9px] text-slate-500 text-center select-none leading-relaxed">
                  <span>SYSTEM ATTRIBUTE: SYMBOLIC GRUNGE AUDIO SYNTHS</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </section>
  );
}
