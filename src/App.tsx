
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ApiErrorBoundary } from "@/components/error-states/ApiErrorBoundary";
import { Dashboard } from "@/components/Dashboard";
import { CallbackPage } from "@/components/auth/CallbackPage";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SandboxMode } from "@/components/SandboxMode";
import { HelpPage } from "@/pages/HelpPage";
import { LegalPage } from "@/pages/LegalPage";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ApiErrorBoundary>
              <Routes>
                <Route path="/index" element={<Index />} />
                <Route path="/sandbox" element={<SandboxMode />} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route 
                  path="/" 
                  element={
                    <AuthGuard 
                      dashboardComponent={<Dashboard />}
                    />
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ApiErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
