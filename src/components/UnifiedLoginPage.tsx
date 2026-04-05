import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, User, UserCheck, Shield, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";

interface UnifiedLoginPageProps {
  onCitizenLogin: (email: string, password: string) => Promise<void>;
  onOfficialLogin: (email: string, password: string) => Promise<void>;
  onAdminLogin: (email: string, password: string) => Promise<void>;
  onBackToLanding: () => void;
  onSignUpClick: (role: 'citizen' | 'official' | 'admin') => void;
}

export function UnifiedLoginPage({ 
  onCitizenLogin, 
  onOfficialLogin, 
  onAdminLogin, 
  onBackToLanding,
  onSignUpClick
}: UnifiedLoginPageProps) {
  const [activeTab, setActiveTab] = useState<"citizen" | "official" | "admin">("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "citizen") {
        await onCitizenLogin(email, password);
      } else if (activeTab === "official") {
        await onOfficialLogin(email, password);
      } else {
        await onAdminLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "citizen" as const, label: "Citizen", icon: User, color: "from-violet-500 to-fuchsia-500" },
    { id: "official" as const, label: "Official", icon: UserCheck, color: "from-violet-500 to-fuchsia-500" },
    { id: "admin" as const, label: "Admin", icon: Shield, color: "from-violet-500 to-fuchsia-500" }
  ];

  return (
    <div className="min-h-screen bg-[#060810] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 w-[360px] h-[360px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute top-32 -right-10 w-[360px] h-[360px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button - Mobile Optimized */}
        <motion.button
          onClick={onBackToLanding}
          className="mb-4 sm:mb-6 text-slate-300 hover:text-white transition-colors flex items-center gap-2 group px-2 py-1 rounded-lg hover:bg-white/10"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-medium">Back to Home</span>
        </motion.button>

        {/* Login Card */}
        <div className="rounded-2xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-violet-500/35 to-fuchsia-500/30 backdrop-blur-md border-b border-white/15 text-white p-4 sm:p-6 text-center">
            <div className="flex justify-center mb-2 sm:mb-3">
              <Logo textColor="text-white" lensColor="text-white/80" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Welcome Back</h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-black/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError("");
                }}
                className={`flex-1 py-3 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.color}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-rose-500/15 border border-rose-400/30 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-100">{error}</p>
              </motion.div>
            )}

            {/* Info Messages */}
            {activeTab === "official" && (
              <div className="mb-6 p-4 bg-violet-500/15 border border-violet-400/30 rounded-lg">
                <p className="text-sm text-violet-100">
                  <strong>Official Access:</strong> Login to respond to citizen reports and manage issues.
                </p>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="mb-6 p-4 bg-violet-500/15 border border-violet-400/30 rounded-lg">
                <p className="text-sm text-violet-100">
                  <strong>⚠️ Admin Access:</strong> Secure area for system administrators. All access is logged.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === "admin" ? "admin@civiclens.com" :
                      activeTab === "official" ? "official@government.in" :
                      "you@example.com"
                    }
                    required
                    className="w-full pl-11 pr-4 py-3 border border-white/15 bg-white/10 text-white placeholder:text-slate-300 rounded-lg focus:border-violet-400 focus:ring-2 focus:ring-violet-400/25 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-white/15 bg-white/10 text-white placeholder:text-slate-300 rounded-lg focus:border-violet-400 focus:ring-2 focus:ring-violet-400/25 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${
                  "from-violet-500 to-fuchsia-500"
                }`}
              >
                {loading ? "Signing in..." : `Sign in as ${tabs.find(t => t.id === activeTab)?.label}`}
              </button>
            </form>

            {/* Sign Up Link - Only for Citizens */}
            {activeTab === "citizen" && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-300">
                  Don't have an account?{" "}
                  <button
                    onClick={() => onSignUpClick(activeTab)}
                    className="font-semibold text-violet-300 hover:text-fuchsia-300"
                  >
                    Sign up as Citizen
                  </button>
                </p>
              </div>
            )}

            {/* Hardcoded credentials info for staff */}
            {activeTab !== "citizen" && (
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                  Use provided {activeTab === "admin" ? "admin" : "official"} credentials
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
