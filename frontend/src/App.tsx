import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CandidatePortalPage } from "./pages/CandidatePortalPage";
import { ContactPage } from "./pages/ContactPage";
import { EmployerPortalPage } from "./pages/EmployerPortalPage";
import { HomePage } from "./pages/HomePage";
import { JobDetailsPage } from "./pages/JobDetailsPage";
import { JobListingsPage } from "./pages/JobListingsPage";
import { LoginRegisterPage } from "./pages/LoginRegisterPage";
import { ServicesPage } from "./pages/ServicesPage";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/jobs" element={<JobListingsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/employers" element={<EmployerPortalPage />} />
        <Route path="/candidates" element={<CandidatePortalPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-porcelain text-ink">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
