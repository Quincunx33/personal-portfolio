/*
 * taaissu editorial cyber-organic system: field-notebook layout, burnt amber signal,
 * Cormorant Garamond + IBM Plex Mono, tactile textures, asymmetric content rhythm.
 */
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Github, Mail, MapPin, Menu, X } from "lucide-react";

const portrait = "/assets/taaissu-portrait.jpg";
const heroTexture = "/assets/taaissu-hero-texture.jpg";
const atlasTexture = "/assets/taaissu-project-atlas.jpg";
const signalTexture = "/assets/taaissu-signal.jpg";
const logoMark = "/assets/taaissu-mark.png";

const projects = [
  { name: "PS2-WebXperience", displayName: "PS2 WebXperience", type: "Interactive experience", language: "TypeScript", description: "A nostalgic PlayStation 2-inspired browser interface simulation built with React, TypeScript, Vite, and Motion.", stat: "public repository", url: "https://github.com/Quincunx33/PS2-WebXperience", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "ishkali-vnc", displayName: "ishkali VNC", type: "Systems experiment", language: "Unspecified", description: "Tasfia's Hacker Lab — pre-built Alpine 3.14 x86 rootfs for iSH (iOS), with 925+ commands, pentest tools, compilers, editors, and a VNC server.", stat: "public repository", url: "https://github.com/Quincunx33/ishkali-vnc", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "kali-minimal", displayName: "Kali Minimal", type: "Systems experiment", language: "Unspecified", description: "Ultra-minimal terminal-only Kali Linux ISOs for i386, ARM64, and x86_64 virtualization with QEMU and UTM SE support.", stat: "public repository", url: "https://github.com/Quincunx33/kali-minimal", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "penbox", displayName: "Penbox", type: "Security tooling", language: "Python", description: "72-in-1 Python CLI penetration testing toolbox covering scanning, WPA2 handshake analysis, shellcode, hash cracking, OSINT, and more.", stat: "public repository", url: "https://github.com/Quincunx33/penbox", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "mycat-companion", displayName: "MyCat Companion", type: "Desktop experiment", language: "Python", description: "A cross-platform desktop cat companion with pet care, Pomodoro focus sessions, sticky notes, sounds, smooth eye tracking, and dark skins.", stat: "public repository", url: "https://github.com/Quincunx33/mycat-companion", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "Ai-jailbreak", displayName: "AI Jailbreak", type: "AI safety research", language: "Unspecified", description: "A collection of jailbreak prompts and exploit techniques for local and frontier AI models, described on GitHub as a red-teaming and AI safety research collection.", stat: "public repository", url: "https://github.com/Quincunx33/Ai-jailbreak", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "ipad-simulation", displayName: "iPad Simulation", type: "Interactive experience", language: "TypeScript", description: "Interactive iPad mini 5 and iPadOS 26-inspired browser simulator with responsive controls, app surfaces, and Liquid Glass-style icons.", stat: "public repository", url: "https://github.com/Quincunx33/ipad-simulation", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "phishGard", displayName: "phishGard", type: "Security tooling", language: "TypeScript", description: "Defensive server-side phishing URL analysis with headless auditing and Gemini supplemental intelligence.", stat: "public repository", url: "https://github.com/Quincunx33/phishGard", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "solar-sclipse", displayName: "Solar Sclipse", type: "Interactive experience", language: "TypeScript", description: "Interactive 3D total solar eclipse simulator with a historical replay archive.", stat: "public repository", url: "https://github.com/Quincunx33/solar-sclipse", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "personal-portfolio", displayName: "Personal Portfolio", type: "Portfolio", language: "TypeScript", description: "Interactive React/Vite portfolio for Tasfiya Tabassum — useful experiments, security tooling, systems work, and the modern web.", stat: "public repository", url: "https://github.com/Quincunx33/personal-portfolio", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "cronjob", displayName: "Cronjob", type: "Automation tooling", language: "TypeScript", description: "A visual cron and HTTP ping dashboard for recurring schedules, next-run visibility, execution history, and deduplicated failure alerts.", stat: "public repository", url: "https://github.com/Quincunx33/cronjob", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "Quincunx33", displayName: "Quincunx33", type: "Identity", language: "Unspecified", description: "Public repository on GitHub; description not provided.", stat: "public repository", url: "https://github.com/Quincunx33/Quincunx33", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "stress-test-server", displayName: "Stress Test Server", type: "Security tooling", language: "TypeScript", description: "High-performance permanent HTTP test server & benchmarking target for stress-testing tools with live logging, scheduled cleanup, and synthetic discovery fixtures.", stat: "public repository", url: "https://github.com/Quincunx33/stress-test-server", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "stressTest-landing", displayName: "Stress Test Landing", type: "Security tooling", language: "TypeScript", description: "Pipeline Stress Tester - focused HTTP load testing and API performance benchmarking.", stat: "public repository", url: "https://github.com/Quincunx33/stressTest-landing", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "Ip-tv", displayName: "IP TV", type: "Media workflow", language: "TypeScript", description: "Ip-tv", stat: "public repository", url: "https://github.com/Quincunx33/Ip-tv", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "Stress-Tester", displayName: "Stress Tester", type: "Security tooling", language: "TypeScript", description: "XIO Stress Tester is an ultra-fast, modern, cluster-driven HTTP load generator designed to benchmark servers, stress-test firewalls, and audit Web Application Firewalls (WAF).", stat: "public repository", url: "https://github.com/Quincunx33/Stress-Tester", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "Virtual-machine", displayName: "Virtual Machine", type: "Browser experiment", language: "HTML", description: "Emulator", stat: "public repository", url: "https://github.com/Quincunx33/Virtual-machine", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "Bolt-share", displayName: "Bolt Share", type: "File workflow", language: "JavaScript", description: "Advanced p2p file's sharing both local and online", stat: "public repository", url: "https://github.com/Quincunx33/Bolt-share", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "bomber-v2", displayName: "Bomber v2", type: "API laboratory", language: "Python", description: "Ultimate SMS & Email Bomber v2.1 | Interactive | High-Speed | Proxy Support | Cross-Platform.", stat: "public repository", url: "https://github.com/Quincunx33/bomber-v2", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "reVCDOS", displayName: "reVCDOS", type: "Browser experiment", language: "Python", description: "Web-based port of GTA: Vice City running in browser via WebAssembly.", stat: "public repository", url: "https://github.com/Quincunx33/reVCDOS", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "ammo.js", displayName: "Ammo.js", type: "Systems library", language: "Unspecified", description: "Direct port of the Bullet physics engine to JavaScript using Emscripten.", stat: "public repository", url: "https://github.com/Quincunx33/ammo.js", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "EthicalHackingTools", displayName: "Ethical Hacking Tools", type: "Security tooling", language: "Python", description: "HackerAI Framework (Project Sirra): a modular security testing environment with automated orchestration, security sandboxing, and vulnerability assessment capabilities.", stat: "public repository", url: "https://github.com/Quincunx33/EthicalHackingTools", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "PyBrowser", displayName: "PyBrowser", type: "Browser experiment", language: "TypeScript", description: "PyBrowser: Python Playground.", stat: "public repository", url: "https://github.com/Quincunx33/PyBrowser", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "naruto-sasuke", displayName: "Naruto / Sasuke", type: "Interactive experience", language: "HTML", description: "Naruto and Sasuke Hand Tracking Power Effects with MediaPipe, featuring dynamic visuals, immersive audio, and interactive UI/UX.", stat: "public repository", url: "https://github.com/Quincunx33/naruto-sasuke", image: "/assets/taaissu-project-atlas.jpg", isFork: false },
  { name: "BananaOs-", displayName: "BananaOS", type: "Systems experiment", language: "JavaScript", description: "Public repository on GitHub; description not provided.", stat: "public repository", url: "https://github.com/Quincunx33/BananaOs-", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "WebOs", displayName: "WebOS", type: "Systems experiment", language: "JavaScript", description: "Lightweight webOs.", stat: "public repository", url: "https://github.com/Quincunx33/WebOs", image: "/assets/taaissu-hero-texture.jpg", isFork: false },
  { name: "bananaos", displayName: "BananaOS / OS", type: "Systems experiment", language: "TypeScript", description: "Operating system experiment.", stat: "public repository", url: "https://github.com/Quincunx33/bananaos", image: "/assets/taaissu-portrait.jpg", isFork: false },
  { name: "three.js", displayName: "Three.js", type: "Systems library", language: "JavaScript", description: "JavaScript 3D Library.", stat: "public fork / reference", url: "https://github.com/Quincunx33/three.js", image: "/assets/taaissu-project-atlas.jpg", isFork: true },
  { name: "fastroads", displayName: "Fast Roads", type: "Interactive experience", language: "Unspecified", description: "Slowroads.io with roadster modified to be fast.", stat: "public repository", url: "https://github.com/Quincunx33/fastroads", image: "/assets/taaissu-signal.jpg", isFork: false },
  { name: "re3", displayName: "re3", type: "Systems library", language: "Unspecified", description: "Public repository with a minimal description.", stat: "public fork / reference", url: "https://github.com/Quincunx33/re3", image: "/assets/taaissu-hero-texture.jpg", isFork: true },
];

const filters = ["All work","Identity","Desktop experiment","AI safety research","Portfolio","Automation tooling","Security tooling","Media workflow","Browser experiment","File workflow","API laboratory","Systems library","Interactive experience","Systems experiment"];

export default function Home() {
  const [filter, setFilter] = useState("All work");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleProjects = useMemo(() => filter === "All work" ? projects : projects.filter((project) => project.type === filter), [filter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="Back to top">
          <img src={logoMark} alt="" className="brand-mark" />
          <span>taaissu</span>
        </button>
        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
          <button onClick={() => scrollTo("work")}>Selected work</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("connect")}>Connect</button>
        </nav>
        <button className="menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <a className="top-github" href="https://github.com/Quincunx33" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
      </header>

      <section id="top" className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12,12,11,.9) 0%, rgba(12,12,11,.56) 44%, rgba(12,12,11,.1) 100%), url(${heroTexture})` }}>
        <div className="hero-copy">
          <p className="eyebrow"><span className="signal-dot" /> Field notes / 2026</p>
          <h1>Useful experiments,<br /><em>shipped with intent.</em></h1>
          <p className="hero-deck">I’m Tasfiya Tabassum — a full-stack developer from Khulna, Bangladesh, exploring the seam between systems, security tooling, and the modern web.</p>
          <div className="hero-actions">
            <button className="signal-button" onClick={() => scrollTo("work")}>Trace the work <ArrowUpRight size={17} /></button>
            <button className="text-button" onClick={() => scrollTo("about")}>Read the notes <ChevronDown size={16} /></button>
          </div>
        </div>
        <div className="hero-portrait-wrap">
          <div className="portrait-frame"><img src={portrait} alt="Tasfiya Tabassum playing guitar in the hills" /></div>
          <div className="portrait-caption"><span>01 / human signal</span><span>Khulna → everywhere</span></div>
        </div>
        <div className="hero-index"><span>Scroll to inspect</span><span className="index-line" /><span>00—30</span></div>
      </section>

      <section className="manifesto-band" id="about">
        <div className="section-kicker"><span>01</span><span>About the maker</span></div>
        <div className="manifesto-copy"><p className="large-statement">Systems should feel <em>useful</em> before they feel impressive.</p><p className="body-copy">My work moves across TypeScript, Python, real-time applications, browser APIs, web assembly, automation, and responsible security research. I like the part where a difficult idea becomes a tool someone can actually use.</p></div>
        <div className="stats-strip"><div><strong>30</strong><span>public repos</span></div><div><strong>934</strong><span>contributions / year</span></div><div><strong>30</strong><span>public repos indexed</span></div></div>
      </section>

      <section className="work-section" id="work">
        <div className="work-heading"><div className="section-kicker"><span>02</span><span>Selected work</span></div><h2>From the<br /><em>workbench.</em></h2><p>Systems, interfaces, and small provocations pulled from the public lab.</p></div>
        <div className="filter-row" role="tablist" aria-label="Filter projects">{filters.map((item) => <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item}</button>)}</div>
        <div className="project-list">{visibleProjects.map((project, index) => <article key={project.name} className={expanded === project.name ? "project-card expanded" : "project-card"} onClick={() => setExpanded(expanded === project.name ? null : project.name)}>
          <div className="project-number">0{index + 1}</div><div className="project-main"><div className="project-meta"><span>{project.type}</span><span className="language">{project.language}</span>{project.isFork && <span className="fork-tag">fork</span>}</div><h3>{project.name}</h3><p>{project.description}</p>{expanded === project.name && <div className="project-detail"><span>{project.stat}</span><a href={project.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Open repository <ArrowUpRight size={15} /></a></div>}</div><div className="project-visual" style={{ backgroundImage: `linear-gradient(130deg, rgba(18,18,17,.28), rgba(18,18,17,.7)), url(${project.image})` }}><span>Inspect <ArrowUpRight size={16} /></span></div>
        </article>)}</div>
      </section>

      <section className="connect-section" id="connect"><div className="section-kicker"><span>03</span><span>Connect</span></div><div className="connect-layout"><h2>Let’s make<br /><em>something useful.</em></h2><div className="connect-copy"><p>For thoughtful collaborations, curious problems, or a good conversation about what browsers can become.</p><a className="signal-button" href="mailto:liquiderror600@gmail.com">Send a signal <Mail size={17} /></a><div className="social-links"><a href="https://github.com/Quincunx33" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href="https://instagram.com/tasfiya__tabassum__" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14} /></a><a href="https://facebook.com/taissuuu" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /></a></div></div></div><div className="location-note"><MapPin size={15} /> 22°50′N / Khulna, Bangladesh <span>—</span> available for the next interesting problem</div></section>

      <footer className="footer"><span>© 2026 taaissu</span><span>Built from the public lab of <a href="https://github.com/Quincunx33" target="_blank" rel="noreferrer">@Quincunx33</a></span><span>↑ back to top</span></footer>
    </main>
  );
}
