import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Mail,
  MapPin,
  Menu,
  Send,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EngineeringTimeline } from "@/components/EngineeringTimeline";
import { GitHubActivityMatrix } from "@/components/GitHubActivityMatrix";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import {
  ProjectDetail,
  ProjectInspectorModal,
  PROJECT_DETAILS_MAP,
} from "@/components/ProjectInspectorModal";
import { QuickContactModal } from "@/components/QuickContactModal";
import { ResumeModal } from "@/components/ResumeModal";
import { TechnicalArsenal } from "@/components/TechnicalArsenal";

const portrait = "/assets/taaissu-portrait.jpg";
const heroTexture = "/assets/taaissu-hero-texture.jpg";
const atlasTexture = "/assets/taaissu-project-atlas.jpg";
const signalTexture = "/assets/taaissu-signal.jpg";
const logoMark = "/assets/taaissu-mark.png";

const projectImages = [atlasTexture, signalTexture, heroTexture, portrait];

interface GithubRepository {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
}

interface Project extends ProjectDetail {}

const fallbackProjects: Project[] = [
  {
    name: "PS2-WebXperience",
    displayName: "PS2 WebXperience",
    type: "Interactive experience",
    language: "TypeScript",
    description:
      "A nostalgic PlayStation 2-inspired browser interface simulation built with React, TypeScript, Vite, and Motion.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/PS2-WebXperience",
    image: "/assets/taaissu-project-atlas.jpg",
    isFork: false,
  },
  {
    name: "ishkali-vnc",
    displayName: "ishkali VNC",
    type: "Systems experiment",
    language: "Unspecified",
    description:
      "Tasfia's Hacker Lab — pre-built Alpine 3.14 x86 rootfs for iSH (iOS), with 925+ commands, pentest tools, compilers, editors, and a VNC server.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/ishkali-vnc",
    image: "/assets/taaissu-signal.jpg",
    isFork: false,
  },
  {
    name: "kali-minimal",
    displayName: "Kali Minimal",
    type: "Systems experiment",
    language: "Unspecified",
    description:
      "Ultra-minimal terminal-only Kali Linux ISOs for i386, ARM64, and x86_64 virtualization with QEMU and UTM SE support.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/kali-minimal",
    image: "/assets/taaissu-hero-texture.jpg",
    isFork: false,
  },
  {
    name: "penbox",
    displayName: "Penbox",
    type: "Security tooling",
    language: "Python",
    description:
      "72-in-1 Python CLI penetration testing toolbox covering scanning, WPA2 handshake analysis, shellcode, hash cracking, OSINT, and more.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/penbox",
    image: "/assets/taaissu-portrait.jpg",
    isFork: false,
  },
  {
    name: "mycat-companion",
    displayName: "MyCat Companion",
    type: "Desktop experiment",
    language: "Python",
    description:
      "A cross-platform desktop cat companion with pet care, Pomodoro focus sessions, sticky notes, sounds, smooth eye tracking, and dark skins.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/mycat-companion",
    image: "/assets/taaissu-project-atlas.jpg",
    isFork: false,
  },
  {
    name: "Ai-jailbreak",
    displayName: "AI Jailbreak",
    type: "AI safety research",
    language: "Unspecified",
    description:
      "A collection of jailbreak prompts and exploit techniques for local and frontier AI models, described on GitHub as a red-teaming and AI safety research collection.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/Ai-jailbreak",
    image: "/assets/taaissu-signal.jpg",
    isFork: false,
  },
  {
    name: "ipad-simulation",
    displayName: "iPad Simulation",
    type: "Interactive experience",
    language: "TypeScript",
    description:
      "Interactive iPad mini 5 and iPadOS 26-inspired browser simulator with responsive controls, app surfaces, and Liquid Glass-style icons.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/ipad-simulation",
    image: "/assets/taaissu-hero-texture.jpg",
    isFork: false,
  },
  {
    name: "phishGard",
    displayName: "phishGard",
    type: "Security tooling",
    language: "TypeScript",
    description:
      "Defensive server-side phishing URL analysis with headless auditing and Gemini supplemental intelligence.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/phishGard",
    image: "/assets/taaissu-portrait.jpg",
    isFork: false,
  },
  {
    name: "solar-sclipse",
    displayName: "Solar Sclipse",
    type: "Interactive experience",
    language: "TypeScript",
    description:
      "Interactive 3D total solar eclipse simulator with a historical replay archive.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/solar-sclipse",
    image: "/assets/taaissu-project-atlas.jpg",
    isFork: false,
  },
  {
    name: "personal-portfolio",
    displayName: "Personal Portfolio",
    type: "Portfolio",
    language: "TypeScript",
    description:
      "Interactive React/Vite portfolio for Tasfiya Tabassum — useful experiments, security tooling, systems work, and the modern web.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/personal-portfolio",
    image: "/assets/taaissu-signal.jpg",
    isFork: false,
  },
  {
    name: "cronjob",
    displayName: "Cronjob",
    type: "Automation tooling",
    language: "TypeScript",
    description:
      "A visual cron and HTTP ping dashboard for recurring schedules, next-run visibility, execution history, and deduplicated failure alerts.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/cronjob",
    image: "/assets/taaissu-hero-texture.jpg",
    isFork: false,
  },
  {
    name: "naruto-sasuke",
    displayName: "Naruto / Sasuke",
    type: "Interactive experience",
    language: "HTML",
    description:
      "Naruto and Sasuke Hand Tracking Power Effects with MediaPipe, featuring dynamic visuals, immersive audio, and interactive UI/UX.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/naruto-sasuke",
    image: "/assets/taaissu-project-atlas.jpg",
    isFork: false,
  },
  {
    name: "BananaOs-",
    displayName: "BananaOS",
    type: "Systems experiment",
    language: "JavaScript",
    description: "Public repository on GitHub; description not provided.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/BananaOs-",
    image: "/assets/taaissu-signal.jpg",
    isFork: false,
  },
  {
    name: "WebOs",
    displayName: "WebOS",
    type: "Systems experiment",
    language: "JavaScript",
    description: "Lightweight webOs.",
    stat: "public repository",
    url: "https://github.com/Quincunx33/WebOs",
    image: "/assets/taaissu-hero-texture.jpg",
    isFork: false,
  },
];

const readableName = (name: string) =>
  name.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const classifyRepository = (repo: GithubRepository): string => {
  const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  if (/jailbreak|ai safety|red-team/.test(text)) return "AI safety research";
  if (
    /phish|stress|hacking|pentest|penetration|kali|security|wpa2|osint|shellcode/.test(
      text
    )
  )
    return "Security tooling";
  if (/cron|schedule|automation|http ping/.test(text)) return "Automation tooling";
  if (/portfolio/.test(text)) return "Portfolio";
  if (/media|iptv|tv/.test(text)) return "Media workflow";
  if (
    /browser|webassembly|web os|webos|ipad|playstation|ps2|simulator|simulation|hand tracking/.test(
      text
    )
  )
    return "Interactive experience";
  if (/share|file|p2p/.test(text)) return "File workflow";
  if (/api|server|http/.test(text)) return "API laboratory";
  if (
    /three\.js|ammo|bullet|engine|library|linux|rootfs|virtual|vnc|iso|qemu|operating system|os experiment/.test(
      text
    )
  )
    return "Systems library";
  return "Systems experiment";
};

const mapRepository = (repo: GithubRepository, index: number): Project => ({
  name: repo.name,
  displayName: readableName(repo.name),
  type: classifyRepository(repo),
  language: repo.language ?? "Unspecified",
  description:
    repo.description ?? "Public repository on GitHub; description not provided.",
  stat: repo.fork ? "public fork / reference" : "public repository",
  url: repo.html_url,
  image: projectImages[index % projectImages.length],
  isFork: repo.fork,
});

const filters = [
  "All work",
  "Security tooling",
  "Systems experiment",
  "Interactive experience",
  "Automation tooling",
  "AI safety research",
  "Portfolio",
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [syncState, setSyncState] = useState<"live" | "fallback">("fallback");
  const [filter, setFilter] = useState("All work");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Modals state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [inspectingProject, setInspectingProject] = useState<ProjectDetail | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  // Keyboard shortcut listener for Ctrl+K, ~, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (!isInput && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsTerminalOpen(false);
        setIsResumeOpen(false);
        setIsContactOpen(false);
        setInspectingProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const syncRepositories = async () => {
      try {
        const repositories: GithubRepository[] = [];
        for (let page = 1; page <= 10; page += 1) {
          const response = await fetch(
            `https://api.github.com/users/Quincunx33/repos?type=public&sort=updated&per_page=100&page=${page}`,
            {
              signal: controller.signal,
              headers: { Accept: "application/vnd.github+json" },
            }
          );
          if (!response.ok)
            throw new Error(`GitHub API responded with ${response.status}`);
          const pageRepositories = (await response.json()) as GithubRepository[];
          repositories.push(
            ...pageRepositories.filter(
              (repository) => !repository.name.startsWith(".")
            )
          );
          if (pageRepositories.length < 100) break;
        }
        if (repositories.length > 0) {
          setProjects(repositories.map(mapRepository));
          setSyncState("live");
        }
      } catch {
        if (!controller.signal.aborted) setSyncState("fallback");
      }
    };
    void syncRepositories();
    return () => controller.abort();
  }, []);

  const visibleProjects = useMemo(
    () =>
      filter === "All work"
        ? projects
        : projects.filter((project) => project.type === filter),
    [filter, projects]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleOpenProjectByName = (projectName: string) => {
    const found = projects.find(
      (p) =>
        p.name.toLowerCase() === projectName.toLowerCase() ||
        p.name.toLowerCase().includes(projectName.toLowerCase())
    );
    if (found) {
      setInspectingProject(found);
    } else {
      setInspectingProject({
        name: projectName,
        displayName: readableName(projectName),
        type: "Systems experiment",
        language: "Unspecified",
        description: `Project experiment ${projectName}`,
        stat: "public repository",
        url: `https://github.com/Quincunx33/${projectName}`,
        image: atlasTexture,
      });
    }
  };

  const handleCopyEmail = async () => {
    const email = "liquiderror600@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      toast.success("Email copied to clipboard!", { description: email });
      setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />

      {/* Top Header Navigation */}
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="Back to top">
          <img src={logoMark} alt="" className="brand-mark" />
          <span>taaissu</span>
        </button>

        <nav
          className={menuOpen ? "nav-links nav-open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <button onClick={() => scrollTo("work")}>
            <span>Selected work</span>
            <span className="text-[10px] text-[#d8894b] font-mono">04</span>
          </button>
          <button onClick={() => scrollTo("activity")}>
            <span>Activity &amp; Telemetry</span>
            <span className="text-[10px] text-[#d8894b] font-mono">01.5</span>
          </button>
          <button onClick={() => scrollTo("arsenal")}>
            <span>Capabilities</span>
            <span className="text-[10px] text-[#d8894b] font-mono">02</span>
          </button>
          <button onClick={() => scrollTo("trajectory")}>
            <span>Trajectory</span>
            <span className="text-[10px] text-[#d8894b] font-mono">03</span>
          </button>
          <button onClick={() => scrollTo("about")}>
            <span>About</span>
            <span className="text-[10px] text-[#d8894b] font-mono">01</span>
          </button>
          <button onClick={() => scrollTo("connect")}>
            <span>Connect</span>
            <span className="text-[10px] text-[#d8894b] font-mono">05</span>
          </button>

          {/* Mobile-only action triggers inside menu */}
          <div className="md:hidden flex gap-2 pt-2 border-t border-[#e8e1d5]/15 mt-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                setIsTerminalOpen(true);
              }}
              className="flex-1 py-2 px-3 text-center bg-[#181816] border border-[#d8894b]/40 text-[#d8894b] text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <TerminalIcon size={12} />
              <span>Console</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setIsResumeOpen(true);
              }}
              className="flex-1 py-2 px-3 text-center bg-[#181816] border border-[#e8e1d5]/20 text-[#e8e1d5] text-xs font-mono flex items-center justify-center gap-1.5"
            >
              <FileText size={12} />
              <span>Inspect CV</span>
            </button>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="top-action-btn"
            title="Launch Interactive Terminal (Ctrl+K or ~)"
          >
            <TerminalIcon size={12} className="text-[#d8894b]" />
            <span>Console</span>
            <kbd>Ctrl+K</kbd>
          </button>

          <button
            onClick={() => setIsResumeOpen(true)}
            className="top-action-btn"
            title="Inspect Curriculum Vitae"
          >
            <FileText size={12} className="text-[#d8894b]" />
            <span>CV</span>
          </button>
        </div>

        <button
          className="menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          className="top-github"
          href="https://github.com/Quincunx33"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} /> GitHub <ArrowUpRight size={14} />
        </a>
      </header>

      {/* Hero Section */}
      <section
        id="top"
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(12,12,11,.92) 0%, rgba(12,12,11,.6) 44%, rgba(12,12,11,.15) 100%), url(${heroTexture})`,
        }}
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="signal-dot" /> Field notes / 2026
          </p>
          <h1>
            Useful experiments,<br />
            <em>shipped with intent.</em>
          </h1>
          <p className="hero-deck">
            I’m Tasfiya Tabassum — a full-stack developer and systems enthusiast,
            exploring the seam between systems, security tooling, and the modern web.
          </p>
          <div className="hero-actions flex flex-wrap gap-4 items-center mt-8">
            <button className="signal-button" onClick={() => scrollTo("work")}>
              Trace the work <ArrowUpRight size={17} />
            </button>
            <button
              className="top-action-btn py-3 px-4 font-mono text-xs"
              onClick={() => setIsTerminalOpen(true)}
            >
              <TerminalIcon size={14} className="text-[#d8894b]" />
              <span>Launch Console</span>
              <kbd>~</kbd>
            </button>
            <button
              className="text-button text-xs font-mono"
              onClick={() => setIsResumeOpen(true)}
            >
              Curriculum Vitae <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="hero-portrait-wrap">
          <div className="portrait-frame">
            <img
              src={portrait}
              alt="Tasfiya Tabassum playing guitar in the hills"
            />
          </div>
          <div className="portrait-caption">
            <span>Tasfiya Tabassum</span>
            <span>Worldwide / Remote</span>
          </div>
        </div>

        <div className="hero-index">
          <span>Scroll to inspect</span>
          <span className="index-line" />
          <span>00—{String(projects.length).padStart(2, "0")}</span>
        </div>
      </section>

      {/* Manifesto Band */}
      <section className="manifesto-band" id="about">
        <div className="section-kicker">
          <span>01</span>
          <span>About the maker</span>
        </div>
        <div className="manifesto-copy">
          <p className="large-statement">
            Systems should feel <em>useful</em> before they feel impressive.
          </p>
          <p className="body-copy">
            My work moves across TypeScript, Python, real-time applications, browser APIs,
            userland x86 emulation, automation, and responsible security research. I like the
            part where a difficult idea becomes a tool someone can actually use.
          </p>
        </div>
        <div className="stats-strip">
          <div>
            <strong>{projects.length}</strong>
            <span>public repos</span>
          </div>
          <div>
            <strong>934+</strong>
            <span>contributions / year</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>open architecture</span>
          </div>
        </div>
      </section>

      {/* Live GitHub Telemetry & Heatmap Matrix */}
      <div id="activity">
        <GitHubActivityMatrix />
      </div>

      {/* Technical Arsenal Section */}
      <div id="arsenal">
        <TechnicalArsenal />
      </div>

      {/* Engineering Trajectory / Milestones Section */}
      <div id="trajectory">
        <EngineeringTimeline />
      </div>

      {/* Selected Work Section */}
      <section className="work-section" id="work">
        <div className="work-heading">
          <div className="section-kicker">
            <span>04</span>
            <span>Selected work</span>
          </div>
          <h2>
            From the<br />
            <em>workbench.</em>
          </h2>
          <p>
            Systems, interfaces, and small provocations pulled from the public lab.
          </p>
          <div className="font-mono text-[10px] text-[#787268] uppercase tracking-wider">
            GitHub index / {syncState === "live" ? "live synchronized" : "bundled fallback"}
          </div>
        </div>

        <div className="filter-row" role="tablist" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "filter active" : "filter"}
              onClick={() => setFilter(item)}
              role="tab"
              aria-selected={filter === item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="project-list">
          {visibleProjects.map((project, index) => (
            <article
              key={project.name}
              className={
                expanded === project.name ? "project-card expanded" : "project-card"
              }
              onClick={() =>
                setExpanded(expanded === project.name ? null : project.name)
              }
            >
              <div className="project-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="project-main">
                <div className="project-meta">
                  <span>{project.type}</span>
                  <span className="language">{project.language}</span>
                  {project.isFork && <span className="fork-tag">fork</span>}
                </div>
                <h3>{project.displayName || project.name}</h3>
                <p>{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingProject(project);
                    }}
                    className="project-inspect-btn font-mono"
                  >
                    <span>Inspect Architecture</span>
                    <ArrowUpRight size={12} />
                  </button>

                  {expanded === project.name && (
                    <div className="project-detail">
                      <span>{project.stat}</span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Open repository <ArrowUpRight size={15} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="project-visual"
                style={{
                  backgroundImage: `linear-gradient(130deg, rgba(18,18,17,.32), rgba(18,18,17,.75)), url(${project.image})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setInspectingProject(project);
                }}
              >
                <span>
                  Inspect <ArrowUpRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Connect Section */}
      <section className="connect-section" id="connect">
        <div className="section-kicker">
          <span>05</span>
          <span>Connect</span>
        </div>
        <div className="connect-layout">
          <h2>
            Let’s make<br />
            <em>something useful.</em>
          </h2>
          <div className="connect-copy">
            <p>
              For thoughtful collaborations, curious problems, or a good
              conversation about what browsers and low-level tools can become.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="signal-button"
                onClick={() => setIsContactOpen(true)}
              >
                Transmit Signal <Send size={15} />
              </button>

              <button
                onClick={handleCopyEmail}
                className="top-action-btn py-3 px-4 font-mono text-xs"
                title="Copy email to clipboard"
              >
                {emailCopied ? (
                  <Check size={14} className="text-[#d8894b]" />
                ) : (
                  <Copy size={14} />
                )}
                <span>{emailCopied ? "Copied!" : "Copy Email"}</span>
              </button>
            </div>

            <div className="social-links mt-8">
              <a
                href="https://github.com/Quincunx33"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
              <a
                href="https://instagram.com/tasfiya__tabassum__"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowUpRight size={14} />
              </a>
              <a
                href="https://facebook.com/taissuuu"
                target="_blank"
                rel="noreferrer"
              >
                Facebook <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="location-note">
          <MapPin size={15} /> 22°48′N 89°32′E{" "}
          <span>—</span> available for high-impact engineering problems
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 taaissu · Tasfiya Tabassum</span>
        <span>
          Built from the public lab of{" "}
          <a href="https://github.com/Quincunx33" target="_blank" rel="noreferrer">
            @Quincunx33
          </a>
        </span>
        <button
          onClick={() => scrollTo("top")}
          className="hover:text-[#d8894b] transition-colors"
        >
          ↑ back to top
        </button>
      </footer>

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#161614]/95 backdrop-blur-md border border-[#d8894b]/35 shadow-xl shadow-black p-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsTerminalOpen(true)}
          className="flex-1 py-2 px-2.5 bg-[#1f1e1c] border border-[#d8894b]/30 text-[#d8894b] text-[11px] font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <TerminalIcon size={13} />
          <span>Console</span>
        </button>

        <button
          onClick={() => setIsResumeOpen(true)}
          className="flex-1 py-2 px-2.5 bg-[#1f1e1c] border border-[#e8e1d5]/15 text-[#e8e1d5] text-[11px] font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <FileText size={13} className="text-[#d8894b]" />
          <span>CV</span>
        </button>

        <button
          onClick={() => setIsContactOpen(true)}
          className="flex-1 py-2 px-2.5 bg-[#d8894b] text-[#111110] font-semibold text-[11px] font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Mail size={13} />
          <span>Contact</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <InteractiveTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenProject={handleOpenProjectByName}
        onOpenResume={() => {
          setIsTerminalOpen(false);
          setIsResumeOpen(true);
        }}
      />

      <ProjectInspectorModal
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <QuickContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </main>
  );
}
