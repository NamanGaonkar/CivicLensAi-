import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { ReportForm } from "./components/ReportForm";
import { LandingPage } from "./components/LandingPage";
import { AIChatbot } from "./components/AIChatbot";
import { Logo } from "./components/Logo";
import { CommunityFeed } from "./components/CommunityFeed";
import { BeforeAfter } from "./components/BeforeAfter";
import { UserProfile } from "./components/UserProfile";
import { OfficialDashboard } from "./components/OfficialDashboard";
import { StatusTracker } from "./components/StatusTracker";
import { GoogleMapsProvider } from "./components/GoogleMapsProvider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, User, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "report" | "landing" | "community" | "beforeafter" | "profile" | "official" | "status">("landing");
  const [showAuth, setShowAuth] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "official">("citizen"); // In production, fetch from user profile
  const [userReports, setUserReports] = useState<any[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserReports();
    }
  }, [user]);

  const fetchUserReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserReports(data || []);
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setShowAuth(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-civic-lightBlue to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-civic-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen">
        {user ? (
        <AnimatePresence mode="wait">
          {currentView === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onGetStarted={() => setCurrentView("dashboard")} isAuthenticated={true} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-gradient-to-br from-slate-50 via-civic-lightBlue/30 to-white"
            >
              {/* Navigation */}
              <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-civic-teal/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                  <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
                    <div className="flex items-center space-x-2 sm:space-x-8">
                      <motion.button
                        onClick={handleBackToLanding}
                        className="hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Logo size="sm" showText={true} textColor="text-slate-900" />
                      </motion.button>
                      <div className="hidden md:flex space-x-1 lg:space-x-3">
                        <motion.button
                          onClick={() => setCurrentView("dashboard")}
                          className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                            currentView === "dashboard"
                              ? "bg-civic-teal text-white"
                              : "text-slate-700 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Dashboard
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentView("report")}
                          className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                            currentView === "report"
                              ? "bg-civic-teal text-white"
                              : "text-slate-700 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="hidden lg:inline">Report Issue</span>
                          <span className="lg:hidden">Report</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentView("community")}
                          className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm lg:text-base ${
                            currentView === "community"
                              ? "bg-civic-teal text-white"
                              : "text-slate-700 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Users className="w-4 h-4" />
                          <span className="hidden lg:inline">Community</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setCurrentView("status")}
                          className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm lg:text-base ${
                            currentView === "status"
                              ? "bg-civic-teal text-white"
                              : "text-slate-700 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Activity className="w-4 h-4" />
                          <span>My Status</span>
                        </motion.button>
                        {userRole === "official" && (
                          <motion.button
                            onClick={() => setCurrentView("official")}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                              currentView === "official"
                                ? "bg-civic-darkBlue text-white"
                                : "text-slate-700 hover:text-civic-darkBlue hover:bg-civic-lightBlue/30"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Official Portal</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={() => setCurrentView("profile")}
                        className="p-2 rounded-lg hover:bg-civic-lightBlue/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="My Profile"
                      >
                        <User className="w-5 h-5 text-slate-700" />
                      </motion.button>
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                <AnimatePresence mode="wait">
                  {currentView === "dashboard" && (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard onNavigate={setCurrentView} />
                    </motion.div>
                  )}
                  {currentView === "report" && (
                    <motion.div
                      key="report"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                        <ReportForm onBack={() => setCurrentView("dashboard")} />
                    </motion.div>
                  )}
                  {currentView === "community" && (
                    <motion.div
                      key="community"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CommunityFeed />
                    </motion.div>
                  )}
                  {currentView === "beforeafter" && (
                    <motion.div
                      key="beforeafter"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BeforeAfter reports={[]} />
                    </motion.div>
                  )}
                  {currentView === "status" && (
                    <motion.div
                      key="status"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StatusTracker userReports={userReports} />
                    </motion.div>
                  )}
                  {currentView === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UserProfile />
                    </motion.div>
                  )}
                  {currentView === "official" && userRole === "official" && (
                    <motion.div
                      key="official"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <OfficialDashboard />
                    </motion.div>
                  )}
                </AnimatePresence>
                  {/* Chatbot: render only on the dashboard view (per original request) */}
                  {currentView === "dashboard" && <AIChatbot />}
              </main>

              {/* Mobile-only floating Report button (visible when nav links are hidden) */}
              {currentView !== "report" && (
                <div className="md:hidden fixed bottom-6 right-4 z-40">
                  <button
                    onClick={() => setCurrentView("report")}
                    aria-label="Report an issue"
                    className="w-14 h-14 rounded-full bg-civic-teal text-white flex items-center justify-center shadow-2xl hover:bg-civic-darkBlue transition-all"
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        ) : (
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.div
              key="landing-unauth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onGetStarted={handleGetStarted} isAuthenticated={false} />
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-gradient-to-br from-civic-lightBlue via-white to-blue-50 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-md">
                <motion.button
                  onClick={handleBackToLanding}
                  className="mb-8 text-slate-700 hover:text-slate-900 transition-colors flex items-center space-x-2"
                  whileHover={{ x: -5 }}
                >
                  <span>←</span>
                  <span>Back to Landing</span>
                </motion.button>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <div className="flex justify-center mb-4">
                    <Logo size="lg" showText={true} textColor="text-slate-900" />
                  </div>
                  <p className="text-xl text-slate-800 font-semibold">
                    AI-Powered Civic Engagement Platform
                  </p>
                  <p className="text-slate-600 mt-2">
                    Sign in to start transforming your community
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <SignInForm />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}

      <Toaster />
    </div>
    </GoogleMapsProvider>
  );
}
