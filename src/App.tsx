import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ClientIntake from "./pages/ClientIntake";
import Schedule from "./pages/Schedule";
import Exercises from "./pages/Exercises";
import ExercisePlanGenerator from "./pages/ExercisePlanGenerator";
import Examination from "./pages/Examination";

import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Handle splash screen for mobile - call immediately
(async () => {
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (error) {
    // SplashScreen not available (web environment)
  }
})();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/intake" element={
                <ProtectedRoute>
                  <ClientIntake />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/exercises" element={
                <ProtectedRoute>
                  <Exercises />
                </ProtectedRoute>
              } />
              <Route path="/exercise-plan-generator" element={
                <ProtectedRoute>
                  <ExercisePlanGenerator />
                </ProtectedRoute>
              } />
              <Route path="/examination" element={
                <ProtectedRoute>
                  <Examination />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
