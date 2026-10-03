import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useTracker } from './hooks/useTracker';
import { useEffect } from 'react';
import { initAuth } from './lib/auth';

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
  useEffect(() => {
    // Initialize Auth listener on boot
    const unsubscribe = initAuth(
      (user, token) => {
        console.log("Auth session recovered:", user.email);
      },
      () => {
        console.log("No active authenticated session.");
      }
    );
    return () => unsubscribe();
  }, []);

  useTracker('1-9fQKAfbmOFBcYooNl_xKnNguHsqqaKN-vTjnzA2pXU');

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
