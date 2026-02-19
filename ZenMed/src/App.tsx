import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import GlucoseTracking from "./pages/dashboard/GlucoseTracking";
import Exercises from "./pages/dashboard/Exercises";
import AIPosture from "./pages/dashboard/AIPosture";
import Nutrition from "./pages/dashboard/Nutrition";
import Reminders from "./pages/dashboard/Reminders";
import Analytics from "./pages/dashboard/Analytics";
import DoctorPortal from "./pages/dashboard/DoctorPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="glucose" element={<GlucoseTracking />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="posture" element={<AIPosture />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="doctor" element={<DoctorPortal />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
