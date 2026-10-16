import React, { useState, useMemo } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { ProjectDetail } from "./ProjectInspectorModal";

export interface Project extends ProjectDetail {}

interface ProjectBentoGridProps {
  projects: Project[];
  filter: string;
  setFilter: (filter: string) => void;
  filters: string[];
  filterCounts: Record<string, number>;
  onInspect: (project: Project) => void;
}

export function ProjectBentoGrid({
  projects,
  filter,
  setFilter,
  filters,
  filterCounts,
  onInspect,
}: ProjectBentoGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "name" | "tech">("default");
  const [layoutMode, setLayoutMode] = useState<"showcase" | "modular">("showcase");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    let result =
      filter === "All work"
        ? projects
        : projects.filter((project) => project.type === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const inName = p.displayName.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inLang = p.language.toLowerCase().includes(q);
        const inType = p.type.toLowerCase().includes(q);
        const inTech = p.techStack?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return inName || inDesc || inLang || inType || inTech;
      });
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) =>
        (a.displayName || a.name).localeCompare(b.displayName || b.name)
      );
    } else if (sortBy === "tech") {
      result = [...result].sort((a, b) => {
        const countA = a.techStack?.length || 0;
        const countB = b.techStack?.length || 0;
        return countB - countA;
      });
    }

    return result;
  }, [projects, filter, searchQuery, sortBy]);

  const handleCopyClone = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloneCmd = `git clone ${project.url}.git`;
    try {
      await navigator.clipboard.writeText(cloneCmd);
      setCopiedRepo(project.name);
      toast.success("Clone command copied to clipboard", {
        description: cloneCmd,
      });
      setTimeout(() => setCopiedRepo(null), 2000);
    } catch {
      toast.error("Failed to copy command");
    }
  };

  const toggleExpand = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === name ? null : name));
  };

  return (
    <div className="w-full">
      {/* Dynamic Controls Bar: Search, Category Filters, Sort, Layout */}
      <div className="space-y-4 mb-8">
        {/* Category Filters Ribbon */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#e8e1d5]/15"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {filters.map((item) => {
            const count = filterCounts[item] ?? 0;
            const isActive = filter === item;
            return (
              <button
                key={item}
                onClick={() => setFilter(item)}
                role="tab"
                aria-selected={isActive}
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? "border-[#d8894b] text-[#d8894b] bg-[#d8894b]/10 shadow-[0_0_12px_rgba(216,137,75,0.2)] font-medium"
                    : "border-transparent text-[#a59e92] hover:text-[#e8e1d5] hover:border-[#e8e1d5]/20 bg-transparent"
                }`}
              >
                <span>{item}</span>
                <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort, and Bento Layout Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
          {/* Live Search input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a59e92] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments, tools, or stacks (e.g. WASM, Python)..."
              className="w-full bg-[#161614] border border-[#e8e1d5]/20 text-[#e8e1d5] pl-8 pr-3 py-2 text-xs font-mono placeholder:text-[#a59e92]/60 focus:outline-none focus:border-[#d8894b] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a59e92] hover:text-[#e8e1d5] text-[10px] uppercase font-mono px-1"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort & Layout Mode Toggles */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-[#a59e92]">
              <SlidersHorizontal size={12} />
              <label htmlFor="bento-sort" className="text-[10px] uppercase tracking-wider">
                Sort:
              </label>
              <select
                id="bento-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#161614] border border-[#e8e1d5]/20 text-[#e8e1d5] py-1 px-2 text-[11px] font-mono focus:outline-none focus:border-[#d8894b] cursor-pointer"
              >
                <option value="default">Default order</option>
                <option value="name">Name (A-Z)</option>
                <option value="tech">Architectural depth</option>
              </select>
            </div>

            {/* Layout Mode Toggle: Showcase vs Modular */}
            <div className="hidden md:inline-flex items-center bg-[#161614] border border-[#e8e1d5]/20 p-0.5">
              <button
                onClick={() => setLayoutMode("showcase")}
                title="Showcase Bento Grid with featured visual anchors"
                aria-label="Showcase Bento Grid layout"
                className={`px-2.5 py-1 text-[10px] uppercase font-mono flex items-center gap-1.5 transition-colors ${
                  layoutMode === "showcase"
                    ? "bg-[#d8894b] text-[#111110] font-semibold"
                    : "text-[#a59e92] hover:text-[#e8e1d5]"
                }`}
              >
                <LayoutGrid size={11} />
                <span>Showcase</span>
              </button>
              <button
                onClick={() => setLayoutMode("modular")}
                title="Modular 3-column equal Bento Grid"
                aria-label="Modular 3-column equal Bento Grid layout"
                className={`px-2.5 py-1 text-[10px] uppercase font-mono flex items-center gap-1.5 transition-colors ${
                  layoutMode === "modular"
                    ? "bg-[#d8894b] text-[#111110] font-semibold"
                    : "text-[#a59e92] hover:text-[#e8e1d5]"
                }`}
              >
                <Grid3X3 size={11} />
                <span>3-Col Grid</span>
              </button>
            </div>

            {/* Total Count Telemetry */}
            <span className="text-[#a59e92] text-[10px] uppercase tracking-widest pl-1">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "artifact" : "artifacts"}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Container: 3 columns on desktop (lg), 2 on tablet (md), 1 on mobile */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center text-[#a59e92] font-mono text-xs border border-dashed border-[#e8e1d5]/15 my-6 p-8 bg-[#161614]/60">
          <p className="text-base text-[#e8e1d5] font-serif mb-2">No engineering artifacts located.</p>
          <p className="text-[#a59e92] text-xs">
            No projects matched {searchQuery ? `"${searchQuery}"` : ""} under &ldquo;{filter}&rdquo;.
          </p>
          <button
            onClick={() => {
              setFilter("All work");
              setSearchQuery("");
            }}
            className="inline-block mt-4 px-4 py-2 border border-[#d8894b] text-[#d8894b] uppercase tracking-wider text-[11px] hover:bg-[#d8894b] hover:text-[#111110] transition-colors font-mono"
          >
            Reset Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredProjects.map((project, index) => {
            // In showcase mode, make the 1st and every 7th card featured (span 2 columns on desktop)
            const isFeatured =
              layoutMode === "showcase" &&
              (index === 0 || (index > 0 && index % 7 === 0)) &&
              filteredProjects.length > 2;
            const isExpanded = expandedId === project.name;

            return (
              <article
                key={project.name}
                onClick={() => onInspect(project)}
                className={`group relative bg-[#161614] border border-[#e8e1d5]/15 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-[#d8894b]/60 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(216,137,75,0.14)] hover:-translate-y-1 ${
                  isFeatured
                    ? "md:col-span-2 lg:col-span-2 ring-1 ring-[#d8894b]/20"
                    : "col-span-1"
                }`}
              >
                {/* Precision Illuminated Corner Accents */}
                <span
                  className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#e8e1d5]/30 group-hover:border-[#d8894b] transition-colors pointer-events-none z-10"
                  aria-hidden="true"
                />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#e8e1d5]/30 group-hover:border-[#d8894b] transition-colors pointer-events-none z-10"
                  aria-hidden="true"
                />
                <span
                  className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#e8e1d5]/30 group-hover:border-[#d8894b] transition-colors pointer-events-none z-10"
                  aria-hidden="true"
                />
                <span
                  className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#e8e1d5]/30 group-hover:border-[#d8894b] transition-colors pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Top Section: Visual Media Stage with Dark Vignette */}
                <div
                  className={`relative w-full overflow-hidden border-b border-[#e8e1d5]/10 bg-[#0f0f0e] ${
                    isFeatured ? "h-48 sm:h-56" : "h-36 sm:h-40"
                  }`}
                >
                  <img
                    src={project.image}
                    alt={`${project.displayName} visual preview`}
                    className="w-full h-full object-cover object-center filter saturate-90 contrast-105 brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback texture if image fails to load
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                  {/* Subtle Scrim Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161614] via-[#161614]/40 to-transparent" />

                  {/* Header Badges Overlay inside Media Banner */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-[#e8e1d5] z-10">
                    <span className="bg-[#111110]/80 backdrop-blur-sm px-2 py-0.5 border border-[#e8e1d5]/20 text-[#d8894b] font-mono tabular-nums">
                      #{String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.isFork && (
                        <span className="bg-[#111110]/80 backdrop-blur-sm px-2 py-0.5 border border-[#e8e1d5]/20 text-[#a59e92] uppercase tracking-wider">
                          Fork
                        </span>
                      )}
                      <span className="bg-[#111110]/80 backdrop-blur-sm px-2 py-0.5 border border-[#e8e1d5]/20 text-[#e8e1d5] font-medium tracking-wide">
                        {project.language}
                      </span>
                    </div>
                  </div>

                  {/* Hover Floating Action Quick Peek */}
                  <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#d8894b] text-[#111110] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-md">
                      Inspect <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata: Category & Status */}
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#a59e92] mb-2">
                      <span className="text-[#d8894b]">{project.type}</span>
                      <span aria-hidden="true" className="opacity-40">·</span>
                      <span className="truncate">{project.stat}</span>
                    </div>

                    {/* Headline / Title */}
                    <h3 className="font-serif text-2xl lg:text-3xl text-[#e8e1d5] tracking-tight group-hover:text-[#d8894b] transition-colors leading-tight mb-2.5">
                      {project.displayName || project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#aaa297] leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>

                    {/* Architecture Teaser / Key Highlights for Featured or Expanded */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-[#e8e1d5]/10 text-xs">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#a59e92] mb-1.5 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-[#d8894b]" />
                          <span>Key Architecture Focus:</span>
                        </div>
                        <p className="text-[#e8e1d5]/90 text-[11px] leading-snug line-clamp-2 italic">
                          &ldquo;{project.highlights[0]}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Tech Stack Unboxed Metadata */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-mono text-[#a59e92]">
                          {project.techStack.slice(0, isFeatured ? 6 : 4).map((tech, i, arr) => (
                            <React.Fragment key={tech}>
                              <span className="text-[#e8e1d5]/75">{tech}</span>
                              {i < arr.length - 1 && (
                                <span aria-hidden="true" className="text-[#d8894b]/60">·</span>
                              )}
                            </React.Fragment>
                          ))}
                          {project.techStack.length > (isFeatured ? 6 : 4) && (
                            <span className="text-[#d8894b] opacity-80">
                              +{project.techStack.length - (isFeatured ? 6 : 4)} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* In-place Accordion Expansion for Architecture Notes */}
                    {isExpanded && project.architectureNotes && (
                      <div
                        className="p-3 my-3 bg-[#111110] border border-[#d8894b]/30 text-xs font-mono text-[#e8e1d5]/90 space-y-2 animate-in fade-in slide-in-from-top-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#d8894b] uppercase tracking-wider">
                          <span>Architectural Blueprint Excerpt</span>
                          <button
                            onClick={(e) => toggleExpand(project.name, e)}
                            className="hover:underline text-[9px]"
                          >
                            Close
                          </button>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#aaa297]">
                          {project.architectureNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Action Strip */}
                  <div
                    className="pt-4 border-t border-[#e8e1d5]/10 flex items-center justify-between gap-2 mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      {/* Inspect Architectural Blueprint Button */}
                      <button
                        onClick={() => onInspect(project)}
                        className="px-2.5 py-1.5 border border-[#d8894b] text-[#d8894b] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#d8894b] hover:text-[#111110] transition-colors"
                        aria-label={`Inspect architecture of ${project.displayName}`}
                      >
                        <span>Inspect</span>
                        <ArrowUpRight size={11} />
                      </button>

                      {/* Quick Accordion Toggle if details exist */}
                      {project.architectureNotes && (
                        <button
                          onClick={(e) => toggleExpand(project.name, e)}
                          className={`px-2 py-1.5 border text-[10px] font-mono uppercase tracking-wider transition-colors ${
                            isExpanded
                              ? "border-[#e8e1d5] text-[#e8e1d5] bg-[#e8e1d5]/10"
                              : "border-[#e8e1d5]/20 text-[#a59e92] hover:text-[#e8e1d5] hover:border-[#e8e1d5]/50"
                          }`}
                          title="Toggle architectural notes preview"
                        >
                          {isExpanded ? "Hide notes" : "Notes"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copy Git Clone Snippet */}
                      <button
                        onClick={(e) => handleCopyClone(project, e)}
                        className="p-1.5 border border-[#e8e1d5]/20 text-[#a59e92] hover:text-[#d8894b] hover:border-[#d8894b]/60 transition-colors"
                        title="Copy 'git clone' command to clipboard"
                        aria-label={`Copy clone command for ${project.displayName}`}
                      >
                        {copiedRepo === project.name ? (
                          <Check size={13} className="text-[#d8894b]" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>

                      {/* External GitHub link */}
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border border-[#e8e1d5]/20 text-[#a59e92] hover:text-[#d8894b] hover:border-[#d8894b]/60 transition-colors inline-flex items-center"
                        title="Open GitHub repository"
                        aria-label={`Open ${project.displayName} GitHub repository in new tab`}
                      >
                        <Github size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
