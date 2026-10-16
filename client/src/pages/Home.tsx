import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Menu,
  Send,
  Terminal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DeveloperConsole } from "@/components/DeveloperConsole";
import { GitHubActivityMatrix } from "@/components/GitHubActivityMatrix";
import {
  ProjectDetail,
  ProjectInspectorModal,
  PROJECT_DETAILS_MAP,
} from "@/components/ProjectInspectorModal";
import { QuickContactModal } from "@/components/QuickContactModal";
import { SecurePortraitCanvas } from "@/components/SecurePortraitCanvas";
import { HangingPendantLamp } from "@/components/HangingPendantLamp";
import { useDocumentSeo } from "@/hooks/useDocumentSeo";

const heroTexture = "/assets/taaissu-hero-texture.jpg";
const atlasTexture = "/assets/taaissu-project-atlas.jpg";
const signalTexture = "/assets/taaissu-signal.jpg";
const logoMark = "/assets/taaissu-mark.png";

const projectImages = [atlasTexture, signalTexture, heroTexture];

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
    image: "/assets/taaissu-project-atlas.jpg",
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
    image: "/assets/taaissu-project-atlas.jpg",
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
  const name = (repo.name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const text = `${name} ${desc}`;

  if (name.includes("portfolio") || desc.includes("portfolio")) return "Portfolio";
  if (/jailbreak|ai safety|red-team/.test(text)) return "AI safety research";
  if (
    /phish|stress|hacking|pentest|penetration|kali|security|wpa2|osint|shellcode|codeshield|bot-guard|onion/.test(
      text
    )
  )
    return "Security tooling";
  if (/cron|schedule|automation|http ping|downloader|bomber/.test(text)) return "Automation tooling";
  if (
    /browser|webassembly|wasm|web os|webos|ipad|playstation|ps2|simulator|simulation|hand tracking|game|fastroads/.test(
      text
    )
  )
    return "Interactive experience";
  return "Systems experiment";
};

const mapRepository = (repo: GithubRepository, index: number): Project => {
  const customDetail = PROJECT_DETAILS_MAP[repo.name];
  return {
    name: repo.name,
    displayName: customDetail?.displayName ?? readableName(repo.name),
    type: customDetail?.type ?? classifyRepository(repo),
    language: customDetail?.language ?? repo.language ?? "Unspecified",
    description:
      customDetail?.description ??
      repo.description ??
      "Public repository on GitHub; description not provided.",
    stat: repo.fork ? "public fork / reference" : "public repository",
    url: repo.html_url,
    image: customDetail?.image ?? projectImages[index % projectImages.length],
    isFork: repo.fork,
    architectureNotes: customDetail?.architectureNotes,
    highlights: customDetail?.highlights,
    techStack: customDetail?.techStack,
    solvedChallenges: customDetail?.solvedChallenges,
  };
};

const filters = [
  "All work",
  "Security tooling",
  "Systems experiment",
  "Interactive experience",
  "Automation tooling",
  "AI safety research",
  "Portfolio",
];

const NAV_ITEMS = [
  { id: "work", label: "Selected work" },
  { id: "activity", label: "Activity" },
  { id: "about", label: "About" },
  { id: "connect", label: "Connect" },
];

export default function Home() {
  // Static SEO configuration
  useDocumentSeo({
    title: "taaissu (Quincunx33) — Useful experiments, shipped with intent.",
    description:
      "taaissu (Quincunx33) — Tasfiya Tabassum's engineering field notebook for full-stack systems, offensive security tooling, Linux setups, and modern web apps.",
    canonical: "https://taissu.pages.dev/",
  });

  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [syncState, setSyncState] = useState<"live" | "fallback">("fallback");
  const [filter, setFilter] = useState("All work");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Modals state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [inspectingProject, setInspectingProject] = useState<ProjectDetail | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
  const [lampAngle, setLampAngle] = useState(0);
  const [lampIsOn, setLampIsOn] = useState(true);

  // Scroll spy effect to highlight active section in navbar
  useEffect(() => {
    const sectionIds = ["about", "activity", "work", "connect"];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // If close to bottom of document, activate connect
      const totalHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollY + windowHeight >= totalHeight - 80) {
        setActiveSection("connect");
        return;
      }

      // If near top of page, clear active nav highlight
      if (scrollY < 260) {
        setActiveSection("");
        return;
      }

      const triggerPosition = 160;
      let currentSection = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPosition && rect.bottom > triggerPosition) {
            currentSection = id;
            break;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyD") {
        e.preventDefault();
        setIsDevConsoleOpen((prev) => !prev);
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

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { "All work": projects.length };
    filters.forEach((f) => {
      if (f !== "All work") {
        counts[f] = projects.filter((p) => p.type === f).length;
      }
    });
    return counts;
  }, [projects]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const topbarHeight = 78;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
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
      <header className={isScrolled ? "topbar scrolled" : "topbar"}>
        <button className="brand" onClick={() => scrollTo("top")} aria-label="taaissu homepage - back to top">
          <img
            src={logoMark}
            alt="taaissu monogram insignia logo"
            width={32}
            height={32}
            className="brand-mark"
            loading="eager"
            decoding="async"
          />
          <span>taaissu</span>
        </button>

        <nav
          className={menuOpen ? "nav-links nav-open" : "nav-links"}
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={activeSection === item.id ? "active" : ""}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-3">
          <a
            className="top-github"
            href="https://github.com/Quincunx33"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Tasfiya Tabassum GitHub profile @Quincunx33"
          >
            <Github size={16} /> GitHub <ArrowUpRight size={14} />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="top"
        className="hero relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(12,12,11,.92) 0%, rgba(12,12,11,.6) 44%, rgba(12,12,11,.15) 100%), url(${heroTexture})`,
        }}
      >
        <div className="md:hidden">
          <HangingPendantLamp
            onSwayChange={setLampAngle}
            onStateChange={({ angle, isOn }) => {
              setLampAngle(angle);
              setLampIsOn(isOn);
            }}
          />
          {/* Subtle Ambient Warmth matching the lamp beam position */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10"
            style={{
              opacity: lampIsOn ? 1 : 0,
              background: `radial-gradient(ellipse 60% 50% at ${65 + lampAngle * 0.9}% 45%, rgba(216, 137, 75, 0.08) 0%, rgba(216, 137, 75, 0.02) 50%, transparent 80%)`,
            }}
          />
        </div>
        <div className="hero-3d-scene" aria-hidden="true">
          <span className="hero-orb hero-orb-one" />
          <span className="hero-orb hero-orb-two" />
          <span className="hero-ring hero-ring-one" />
          <span className="hero-ring hero-ring-two" />
          <span className="hero-depth-grid" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="signal-dot" /> Field notes / 2026
          </p>
          <h1>
            Useful experiments,<br />
            <em>shipped with intent.</em>
          </h1>
          <p className="hero-deck">
            I’m Tasfiya Tabassum (@Quincunx33) — a security researcher and systems developer from Khulna, Bangladesh,
            exploring the seam between low-level virtualization, security tooling, and the modern web.
          </p>
          <div className="hero-actions flex flex-wrap gap-4 items-center mt-8">
            <button className="signal-button" onClick={() => scrollTo("work")}>
              Trace the work <ArrowUpRight size={17} />
            </button>
          </div>
        </div>

        <div className="hero-portrait-wrap">
          <div className="portrait-lighting-halo" aria-hidden="true" />
          <div className="portrait-frame">
            <span className="portrait-light-accent portrait-light-tl" aria-hidden="true" />
            <span className="portrait-light-accent portrait-light-tr" aria-hidden="true" />
            <span className="portrait-light-accent portrait-light-bl" aria-hidden="true" />
            <span className="portrait-light-accent portrait-light-br" aria-hidden="true" />
            <div className="portrait-canvas-stage">
              <SecurePortraitCanvas className="h-full w-full object-cover" />
              <div className="portrait-lens-vignette" aria-hidden="true" />
            </div>
          </div>
          <div className="portrait-caption">
            <span>Tasfiya Tabassum</span>
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
          <h2 className="large-statement">
            Systems should feel <em>useful</em> before they feel impressive.
          </h2>
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
          <div />
          <div />
        </div>

        <div className="filter-row" role="tablist" aria-label="Filter projects">
          {filters.map((item) => {
            const count = filterCounts[item] ?? 0;
            return (
              <button
                key={item}
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
                role="tab"
                aria-selected={filter === item}
              >
                <span>{item}</span>
                <span className="ml-1 opacity-70 font-mono text-[9px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="project-list">
          {visibleProjects.length === 0 ? (
            <div className="py-16 text-center text-[#a59e92] font-mono text-xs border border-dashed border-[#e8e1d5]/15 my-6 p-8">
              <p>No repositories found under &ldquo;{filter}&rdquo;.</p>
              <button
                onClick={() => setFilter("All work")}
                className="inline-block mt-3 px-3 py-1.5 border border-[#d8894b] text-[#d8894b] uppercase tracking-wider text-[10px] hover:bg-[#d8894b] hover:text-[#111110] transition-colors"
              >
                Show all work ({projects.length})
              </button>
            </div>
          ) : (
            visibleProjects.map((project, index) => (
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
                    aria-label={`Inspect architectural blueprint for ${project.displayName}`}
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
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Open repository for ${project.displayName} on GitHub`}
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
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${project.displayName} system details`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setInspectingProject(project);
                  }
                }}
              >
                <span>
                  Inspect <ArrowUpRight size={16} />
                </span>
              </div>
            </article>
          )))}
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
                aria-label="Copy email address liquiderror600@gmail.com"
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
                rel="noopener noreferrer"
                aria-label="Visit Tasfiya Tabassum GitHub Profile"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
              <a
                href="https://instagram.com/tasfiya__tabassum__"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Tasfiya Tabassum Instagram Profile"
              >
                Instagram <ArrowUpRight size={14} />
              </a>
              <a
                href="https://facebook.com/taissuuu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Tasfiya Tabassum Facebook Profile"
              >
                Facebook <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="location-note">
          <MapPin size={15} /> 22°48′N 89°32′E{" "}
          <span>—</span> Khulna, Bangladesh · available for high-impact engineering problems
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 taaissu · Tasfiya Tabassum (@Quincunx33)</span>
        <div className="flex items-center gap-4">
          <span>
            Built from the public lab of{" "}
            <a href="https://github.com/Quincunx33" target="_blank" rel="noopener noreferrer">
              @Quincunx33
            </a>
          </span>
        </div>
        <button
          onClick={() => scrollTo("top")}
          className="hover:text-[#d8894b] transition-colors"
          aria-label="Scroll back to top of page"
        >
          ↑ back to top
        </button>
      </footer>

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#161614]/95 backdrop-blur-md border border-[#d8894b]/35 shadow-xl shadow-black p-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsContactOpen(true)}
          className="w-full py-2.5 px-3 bg-[#d8894b] text-[#111110] font-semibold text-[12px] font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          aria-label="Open contact form"
        >
          <Mail size={14} />
          <span>Contact</span>
        </button>
      </div>

      {/* Interactive Modals */}
      <ProjectInspectorModal
        project={inspectingProject}
        onClose={() => setInspectingProject(null)}
      />

      <QuickContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <DeveloperConsole
        isOpen={isDevConsoleOpen}
        onClose={() => setIsDevConsoleOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </main>
  );
}
