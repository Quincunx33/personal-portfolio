import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useTracker } from './hooks/useTracker';
import { ConsoleShield } from "./components/ConsoleShield";
import { ClickGlitchEffect } from "./components/ClickGlitchEffect";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Real-time visitor activity tracker to Telegram
  useTracker('portfolio');

  useEffect(() => {
    const blockCommonDevToolsShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const devToolsShortcut =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) ||
        (modifier && key === "u");

      if (devToolsShortcut) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const blockInspectContextMenu = (event: MouseEvent) => event.preventDefault();

    window.addEventListener("keydown", blockCommonDevToolsShortcuts, true);
    document.addEventListener("contextmenu", blockInspectContextMenu);
    return () => {
      window.removeEventListener("keydown", blockCommonDevToolsShortcuts, true);
      document.removeEventListener("contextmenu", blockInspectContextMenu);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ConsoleShield />
          <ClickGlitchEffect />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

