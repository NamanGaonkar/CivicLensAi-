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
import { UnifiedLoginPage } from "./components/UnifiedLoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { StatusTracker } from "./components/StatusTracker";
import { NotificationCenter } from "./components/NotificationCenter";
import { NotificationSettings } from "./components/NotificationSettings";
import { GoogleMapsProvider } from "./components/GoogleMapsProvider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, User, ShieldCheck, Activity, BarChart3, ArrowLeft, Settings } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";
import { requestNotificationPermission } from "./lib/notifications";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "report" | "landing" | "community" | "beforeafter" | "profile" | "official" | "status" | "login" | "signup" | "admin-dash" | "official-dash" | "notifications">("landing");
  const [showAuth, setShowAuth] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "official" | "admin">("citizen");
  const [signupRole, setSignupRole] = useState<'citizen' | 'official' | 'admin'>('citizen');
  const [userReports, setUserReports] = useState<any[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserReports();
      // Request notification permission when user logs in
      requestNotificationPermission();
    }
  }, [user]);

  const fetchUserReports = async () => {
    try {
      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch responses for each report
      const reportsWithResponses = await Promise.all(
        (reportsData || []).map(async (report) => {
          const { data: responses } = await supabase
            .from('report_responses')
            .select('*')
            .eq('report_id', report.id)
            .order('created_at', { ascending: false });

          return {
            ...report,
            responses: responses || []
          };
        })
      );

      setUserReports(reportsWithResponses);
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const handleGetStarted = () => {
    setCurrentView("login");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setShowAuth(false);
  };

  const handleCitizenLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    setUserRole('citizen');
    setCurrentView('dashboard');
  };

  const handleAdminLogin = async (email: string, password: string) => {
    // Hardcoded admin credentials - no auth required
    if (email === 'admin@civiclens.com' && password === 'admin123') {
      setUserRole('admin');
      setCurrentView('admin-dash');
      return;
    }
    throw new Error('Invalid admin credentials');
  };

  const handleOfficialLogin = async (email: string, password: string) => {
    // Hardcoded official credentials - no auth required
    if (email === 'official@civiclens.com' && password === 'official123') {
      setUserRole('official');
      setCurrentView('official-dash');
      return;
    }
    throw new Error('Invalid official credentials');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole('citizen');
    setCurrentView('landing');
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
        {/* Unified Login Page */}
        {currentView === "login" && (
          <UnifiedLoginPage
            onCitizenLogin={handleCitizenLogin}
            onOfficialLogin={handleOfficialLogin}
            onAdminLogin={handleAdminLogin}
            onBackToLanding={handleBackToLanding}
            onSignUpClick={(role) => {
              setSignupRole(role);
              setCurrentView("signup");
            }}
          />
        )}

        {/* Sign Up Page */}
        {currentView === "signup" && (
          <div className="min-h-screen bg-gradient-to-br from-civic-lightBlue/30 via-white to-civic-teal/20 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              {/* Back Button - Mobile Optimized */}
              <motion.button
                onClick={() => setCurrentView("login")}
                className="mb-4 sm:mb-6 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 group px-2 py-1 rounded-lg hover:bg-white/50"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">Back to Sign In</span>
              </motion.button>
              
              <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border ${
                signupRole === 'admin' ? 'border-red-500/30' :
                signupRole === 'official' ? 'border-blue-500/30' :
                'border-civic-teal/20'
              }`}>
                <div className="mb-6">
                  <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${
                    signupRole === 'admin' ? 'text-red-600' :
                    signupRole === 'official' ? 'text-blue-600' :
                    'text-slate-900'
                  }`}>
                    Create {signupRole === 'citizen' ? 'Citizen' : signupRole === 'official' ? 'Official' : 'Admin'} Account
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    {signupRole === 'citizen' && 'Join CivicLens to report issues and engage with your community'}
                    {signupRole === 'official' && 'Create an official account to respond to citizen reports'}
                    {signupRole === 'admin' && 'Create an administrator account with full system access'}
                  </p>
                </div>
                <SignInForm 
                  initialFlow="signUp" 
                  onBackToLogin={() => setCurrentView("login")}
                  role={signupRole}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Admin Dashboard */}
        {currentView === "admin-dash" && (
          <AdminDashboard onLogout={handleLogout} />
        )}

        {/* Official Dashboard */}
        {currentView === "official-dash" && (
          <OfficialDashboard
            onLogout={handleLogout}
            userEmail="official@civiclens.com"
          />
        )}

        {/* Rest of the app */}
        {!["login", "signup", "admin-dash", "official-dash"].includes(currentView) && user ? (
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
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <NotificationCenter />
                      <ThemeToggle />
                      <motion.button
                        onClick={() => setCurrentView("notifications")}
                        className="p-2 rounded-lg hover:bg-civic-lightBlue/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Notification Settings"
                      >
                        <Settings className="w-5 h-5 text-slate-700" />
                      </motion.button>
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
              <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 md:pb-8">
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
                  {currentView === "notifications" && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <NotificationSettings />
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
                      <OfficialDashboard onLogout={handleLogout} userEmail={user?.email || ""} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Global Chatbot - Available on all pages */}
              {!["login", "signup", "admin-dash", "official-dash"].includes(currentView) && <AIChatbot />}

              {/* Mobile-only floating Report button (visible when nav links are hidden) */}
              {/* REMOVED - replaced with bottom navigation */}
              
              {/* Mobile Bottom Navigation Bar */}
              <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-civic-teal/20 shadow-2xl">
                <div className="grid grid-cols-4 gap-1 px-2 py-2">
                  {/* Dashboard */}
                  <motion.button
                    onClick={() => setCurrentView("dashboard")}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      currentView === "dashboard"
                        ? "bg-civic-teal text-white"
                        : "text-slate-600 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BarChart3 className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-medium">Dashboard</span>
                  </motion.button>

                  {/* Report */}
                  <motion.button
                    onClick={() => setCurrentView("report")}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      currentView === "report"
                        ? "bg-civic-teal text-white"
                        : "text-slate-600 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MapPin className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-medium">Report</span>
                  </motion.button>

                  {/* My Status */}
                  <motion.button
                    onClick={() => setCurrentView("status")}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      currentView === "status"
                        ? "bg-civic-teal text-white"
                        : "text-slate-600 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Activity className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-medium">My Status</span>
                  </motion.button>

                  {/* Community */}
                  <motion.button
                    onClick={() => setCurrentView("community")}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      currentView === "community"
                        ? "bg-civic-teal text-white"
                        : "text-slate-600 hover:text-civic-teal hover:bg-civic-lightBlue/30"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-medium">Community</span>
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        ) : currentView === "landing" && !user ? (
          // Unauthenticated Landing Page
          <LandingPage onGetStarted={handleGetStarted} isAuthenticated={false} />
        ) : null}

      <Toaster />
    </div>
    </GoogleMapsProvider>
  );
}
