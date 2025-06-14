
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Dashboard } from "@/components/Dashboard";
import { LoginPage } from "@/components/auth/LoginPage";
import { CallbackPage } from "@/components/auth/CallbackPage";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { HelpPage } from "@/pages/HelpPage";
import { LegalPage } from "@/pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
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
            <Routes>
              <Route path="/callback" element={<CallbackPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route 
                path="/" 
                element={
                  <AuthGuard 
                    loginComponent={<LoginPage />}
                    dashboardComponent={<Dashboard />}
                  />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
