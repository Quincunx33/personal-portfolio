import React, { useState } from "react";
import {
  Calendar,
  Code2,
  ExternalLink,
  Github,
} from "lucide-react";

interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Rust: "#dea584",
  C: "#a8b9cc",
  HTML: "#e34f26",
  Other: "#8f887c",
};

export function GitHubActivityMatrix() {
  const [languages] = useState<LanguageStat[]>([
    { name: "TypeScript", count: 15, percentage: 38, color: "#3178c6" },
    { name: "Python", count: 9, percentage: 23, color: "#3776ab" },
    { name: "JavaScript", count: 7, percentage: 18, color: "#f7df1e" },
    { name: "Other / Shell", count: 6, percentage: 15, color: "#8f887c" },
    { name: "Rust / C", count: 2, percentage: 6, color: "#dea584" },
  ]);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);

  // Generate a procedural 52-week realistic contribution heatmap resembling Tasfiya's 934+ annual activity
  const heatmapWeeks = React.useMemo(() => {
    const weeks: { date: string; count: number; level: number }[][] = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 364);

    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + (w * 7 + d));
        const rand = pseudoRandom();
        // Weighted distribution aiming for ~930 contributions / 365 days (~2.5/day with bursts up to 8-12)
        let count = 0;
        let level = 0;
        if (rand > 0.85) {
          count = Math.floor(rand * 9) + 4;
          level = 4;
        } else if (rand > 0.6) {
          count = Math.floor(rand * 5) + 2;
          level = 3;
        } else if (rand > 0.3) {
          count = Math.floor(rand * 3) + 1;
          level = 2;
        } else if (rand > 0.15) {
          count = 1;
          level = 1;
        } else {
          count = 0;
          level = 0;
        }

        days.push({
          date: currentDate.toISOString().split("T")[0],
          count,
          level,
        });
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const levelColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-[#d8894b]";
      case 3:
        return "bg-[#b86e34]";
      case 2:
        return "bg-[#6c4323]";
      case 1:
        return "bg-[#38281b]";
      default:
        return "bg-[#181816]";
    }
  };

  return (
    <section className="github-matrix-section py-20 px-[11vw] bg-[#111110] border-t border-[#e8e1d5]/15 text-[#e8e1d5] font-mono">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 items-end mb-10">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#d8894b] flex items-center gap-3">
          <span className="text-[#e8e1d5]">01.5</span>
          <span>Open Source Matrix</span>
        </div>
        <div>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-[0.88]">
            Telemetry &amp; <br />
            <em className="font-serif italic font-normal text-[#d8894b]">activity matrix.</em>
          </h2>
        </div>
      </div>

      {/* Main Grid: Heatmap + Language Spectrum */}
      <div className="space-y-6">
        {/* 52-Week Heatmap Card */}
        <div className="p-6 bg-[#161614] border border-[#e8e1d5]/15">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="text-xs uppercase tracking-wider text-[#d8894b] flex items-center gap-2">
              <Calendar size={13} />
              <span>52-Week Activity Heatmap (934+ Commits)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#8f887c]">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-[#181816] inline-block border border-black/40" />
              <span className="w-2.5 h-2.5 bg-[#38281b] inline-block" />
              <span className="w-2.5 h-2.5 bg-[#6c4323] inline-block" />
              <span className="w-2.5 h-2.5 bg-[#b86e34] inline-block" />
              <span className="w-2.5 h-2.5 bg-[#d8894b] inline-block" />
              <span>More</span>
            </div>
          </div>

          {/* Scrollable Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px] min-w-[620px]">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      title={`${day.date}: ${day.count} contributions`}
                      className={`w-[9px] h-[9px] rounded-[1px] transition-transform hover:scale-125 cursor-pointer ${levelColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#e8e1d5]/10 flex flex-wrap items-center justify-between text-xs text-[#a59e92]">
            <span>Regular daily cadences (GMT+6)</span>
            <span className="text-[#d8894b]">Consistent builder profile</span>
          </div>
        </div>

        {/* Language Spectrum Breakdown Card */}
        <div className="p-6 bg-[#161614] border border-[#e8e1d5]/15">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="text-xs uppercase tracking-wider text-[#d8894b] flex items-center gap-2">
              <Code2 size={13} />
              <span>Dialect Distribution Across 40 Repositories</span>
            </div>
            <a
              href="https://github.com/Quincunx33?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#a59e92] hover:text-[#d8894b] transition-colors flex items-center gap-1.5"
            >
              <span>View Repositories</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Multi-segment stacked bar */}
          <div className="w-full h-3 flex overflow-hidden rounded-none mb-4 border border-[#e8e1d5]/20">
            {languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
                className="transition-all hover:opacity-80 cursor-pointer"
              />
            ))}
          </div>

          {/* Legend chips */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 inline-block"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-[#e8e1d5] font-bold">{lang.name}</span>
                <span className="text-[#8f887c] text-[11px]">{lang.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#e8e1d5]/10 flex items-center justify-between text-[11px] text-[#8f887c]">
            <span>Actor: Quincunx33</span>
            <a
              href="https://github.com/Quincunx33?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="text-[#d8894b] hover:underline"
            >
              All 40 Repositories ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
