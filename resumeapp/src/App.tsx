import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import ResumeEditor from "./pages/ResumeEditor";
import ATSChecker from "./pages/ATSChecker";
import Templates from "./pages/Templates";
import JobTypes from "./pages/JobTypes";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgencyDashboard from "./pages/AgencyDashboard";
import BulkResumeAnalyzer from "./pages/BulkResumeAnalyzer";
import Profile from "./pages/Profile";
import Tips from "./pages/Tips";
import NotFound from "./pages/NotFound";
import PublicResume from "./pages/PublicResume";
import Payment from "./pages/Payment";
import HRDashboard from "./pages/HRDashboard";
import RecruiterRequest from "./pages/RecruiterRequest";
import AdminDashboard from "./pages/AdminDashboard";
import AgencyLanding from "./pages/AgencyLanding";
import AgencyPayment from "./pages/AgencyPayment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ResumeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agency-dashboard"
                element={
                  <ProtectedRoute>
                    <AgencyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bulk-analyze"
                element={
                  <ProtectedRoute>
                    <BulkResumeAnalyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <Templates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/builder/:resumeId"
                element={
                  <ProtectedRoute>
                    <ResumeEditor />
                  </ProtectedRoute>
                }
              />
              <Route path="/ats-checker" element={<ATSChecker />} />
              <Route path="/job-types" element={<JobTypes />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Public share page - no auth required */}
              <Route path="/share/:shareId" element={<PublicResume />} />
              <Route path="/for-agencies" element={<AgencyLanding />} />
              <Route path="/agency-payment" element={<AgencyPayment />} />
              <Route path="/hr-dashboard" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
              <Route path="/recruiter-request" element={<ProtectedRoute><RecruiterRequest /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ResumeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
