import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { useQuery } from "@tanstack/react-query";
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/useTheme';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LoadingScreen from '@/components/LoadingScreen';
import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectDetail from './pages/ProjectDetail';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [isInitialDelayDone, setIsInitialDelayDone] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { data: siteVisible = true, isLoading: isLoadingSiteVisibility } = useQuery({
    queryKey: ["site-settings", "site_visibility_enabled"],
    enabled: isSupabaseConfigured(),
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "site_visibility_enabled")
        .maybeSingle();
      if (error) throw error;
      const raw = String(data?.value ?? "true").toLowerCase();
      return raw === "true" || raw === "1" || raw === "yes";
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitialDelayDone(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  // Keep loader visible for 5 seconds on refresh and while auth/settings are loading.
  if (!isInitialDelayDone || isLoadingPublicSettings || isLoadingAuth || (isLoadingSiteVisibility && !isAdminRoute)) {
    return <LoadingScreen />;
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  if (!siteVisible && !isAdminRoute) {
    return <ComingSoonOverlay />;
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App