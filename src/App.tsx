import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { ApiErrorBoundary } from "@/components/error-states/ApiErrorBoundary";
import { Dashboard } from "@/components/Dashboard";
import { CallbackPage } from "@/components/auth/CallbackPage";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LandingPage } from "@/components/LandingPage";
import { SandboxMode } from "@/components/SandboxMode";
import { HelpPage } from "@/pages/HelpPage";
import { LegalPage } from "@/pages/LegalPage";
import { DataQualityPage } from "@/pages/DataQualityPage";
import { MetricCalculationsPage } from "@/pages/MetricCalculationsPage";
import NotFound from "./pages/NotFound";
import { DashboardBootstrap } from "@/pages/DashboardBootstrap";

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
      <LoadingProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GlobalLoader />
            <ApiErrorBoundary>
              <Routes>
                {/* Public landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authenticated dashboard */}
                <Route 
                  path="/dashboard" 
                  element={<AuthGuard dashboardComponent={<DashboardBootstrap />} />} 
                />

                {/* Legacy /index route for backward compatibility */}
                <Route path="/index" element={<LandingPage />} />

                {/* Other routes */}
                <Route path="/sandbox" element={<SandboxMode />} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/data-quality" element={<DataQualityPage />} />
                <Route path="/calculations" element={<MetricCalculationsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ApiErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
