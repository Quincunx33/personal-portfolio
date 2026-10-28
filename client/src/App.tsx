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
import { AntiCaptureShield } from "./components/AntiCaptureShield";
import { ClickGlitchEffect } from "./components/ClickGlitchEffect";
import { PageLoadingProgressBar } from "./components/PageLoadingProgressBar";

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
  // Real-time visitor activity tracker to Telegram (Intelligence, Milestones, Security)
  useTracker('portfolio');

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <PageLoadingProgressBar />
          <Toaster />
          <ConsoleShield />
          <AntiCaptureShield />
          <ClickGlitchEffect />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

