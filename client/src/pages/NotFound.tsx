import { ArrowLeft, Home, Terminal } from "lucide-react";
import { useLocation } from "wouter";
import { useDocumentSeo } from "@/hooks/useDocumentSeo";

export default function NotFound() {
  const [, setLocation] = useLocation();

  useDocumentSeo({
    title: "404: Page Not Found | taaissu (Quincunx33)",
    description:
      "This address does not match an entry in Tasfiya Tabassum's engineering field notebook and portfolio.",
    canonical: "https://taissu.pages.dev/",
    robots: "noindex, follow",
  });

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#111110] text-[#e8e1d5] p-6 font-mono relative overflow-hidden">
      <div className="grain" aria-hidden="true" />
      <div className="w-full max-w-lg p-8 sm:p-10 border border-[#e8e1d5]/20 bg-[#161614]/90 backdrop-blur-sm shadow-2xl relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-[#d8894b]/40 flex items-center justify-center bg-[#d8894b]/10 text-[#d8894b]">
            <Terminal className="h-8 w-8" />
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-[#d8894b] mb-2">
          HTTP 404 / Route Not Found
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#e8e1d5] mb-4">
          404
        </h1>

        <h2 className="text-sm font-mono uppercase tracking-wider text-[#a59e92] mb-4">
          Missing Reference
        </h2>

        <p className="text-xs sm:text-sm text-[#b5ada1] mb-8 leading-relaxed max-w-md mx-auto">
          The requested coordinate does not exist in the current index. It may have been relocated, pruned, or never compiled.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="signal-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#d8894b] text-[#111110] font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:bg-[#e49b5d] active:scale-95"
            aria-label="Return to portfolio homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    </main>
  );
}
