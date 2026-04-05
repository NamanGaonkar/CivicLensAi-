import { motion } from "framer-motion";
import { Logo } from "./Logo";
import {
  MapPin, 
  Camera, 
  Brain,
  BarChart3, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Shield,
  Image,
  Zap
} from "lucide-react";
// AI chatbot is shown only on the dashboard now

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onGetStarted, isAuthenticated = false }: LandingPageProps) {
  const featureCards = [
    {
      title: "Issue Reporting",
      description: "Citizens can report local issues with photos, category, and location details.",
      icon: MapPin,
    },
    {
      title: "AI Image Analysis",
      description: "AI helps classify reports faster so teams can prioritize the right action.",
      icon: Camera,
    },
    {
      title: "Role Dashboards",
      description: "Separate experiences for citizens, officials, and admins in one platform.",
      icon: Shield,
    },
    {
      title: "Community Feed",
      description: "Residents can share updates, discuss progress, and stay informed.",
      icon: Users,
    },
    {
      title: "Status Tracking",
      description: "Track issue progress from open to resolved with clear timeline visibility.",
      icon: BarChart3,
    },
    {
      title: "Notifications",
      description: "Get updates when reports receive responses or status changes.",
      icon: MessageSquare,
    },
    {
      title: "Map View",
      description: "Visualize reports geographically to detect area-level patterns quickly.",
      icon: Globe,
    },
    {
      title: "AI Assistant",
      description: "In-app AI support helps users ask questions and navigate platform actions.",
      icon: Brain,
    },
  ];

  return (
    <div className="landing-root min-h-screen bg-[#060810] text-slate-100 relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute top-40 -right-10 w-[380px] h-[380px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 px-3 sm:px-5 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo size="md" showText={true} textColor="text-white" />

          <button
            onClick={onGetStarted}
            className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition-colors"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"}
          </button>
        </div>
      </nav>

      <section id="home-section" className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-white">
              Transforming Civic Data
              <br />
              into <span className="text-violet-300">Intelligent</span>
              <br />
              <span className="text-fuchsia-300">Decisions</span>
            </h1>

            <p className="mt-6 text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed">
              CivicLens combines reporting, maps, analytics, role-based dashboards, and AI support
              to help communities solve real civic issues faster.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition-colors"
              >
                {isAuthenticated ? "Open Dashboard" : "Sign In"}
              </button>
              <button
                onClick={() => {
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-colors"
              >
                Our Services
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative h-[340px] sm:h-[430px] lg:h-[500px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] lg:w-[390px] lg:h-[390px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 45% 40%, rgba(255,255,255,0.95) 0%, rgba(240,171,252,0.75) 20%, rgba(168,85,247,0.35) 50%, rgba(17,24,39,0) 72%)",
                  boxShadow:
                    "0 0 40px rgba(217,70,239,0.55), 0 0 120px rgba(139,92,246,0.45), inset 0 0 80px rgba(255,255,255,0.22)",
                }}
              >
                <div className="absolute inset-8 rounded-full border border-fuchsia-200/40" />
                <div className="absolute inset-14 rounded-full border border-violet-200/30" />
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/90 blur-sm" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about-section" className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">About CivicLens</h2>
          <p className="mt-4 text-slate-300 leading-relaxed max-w-4xl">
            CivicLens is built for practical civic problem-solving. Citizens report issues, officials respond with
            progress updates, and communities can track outcomes transparently using AI-assisted workflows.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-violet-200 font-semibold">Simple reporting</p>
              <p className="text-sm text-slate-300 mt-2">Share location, photos, and issue details in minutes.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-violet-200 font-semibold">Faster resolution</p>
              <p className="text-sm text-slate-300 mt-2">Officials prioritize and respond with structured updates.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-violet-200 font-semibold">Public trust</p>
              <p className="text-sm text-slate-300 mt-2">Track issue status from open to resolved.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="team-section" className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Who It Serves</h2>
          <p className="mt-2 text-slate-300">CivicLens supports every role in the civic workflow.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Users className="w-5 h-5 text-violet-200" />
              <h3 className="mt-3 text-white font-semibold">Citizens</h3>
              <p className="mt-2 text-sm text-slate-300">Report issues and monitor updates from officials.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Shield className="w-5 h-5 text-violet-200" />
              <h3 className="mt-3 text-white font-semibold">Officials</h3>
              <p className="mt-2 text-sm text-slate-300">Review reports and communicate status transparently.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <BarChart3 className="w-5 h-5 text-violet-200" />
              <h3 className="mt-3 text-white font-semibold">Admins</h3>
              <p className="mt-2 text-sm text-slate-300">Monitor trends and keep system quality high.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features-section" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">All Platform Features</h2>
            <p className="mt-2 text-slate-300">All key functions remain available across the app.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featureCards.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-400/20 text-violet-200 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How it works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-violet-200 font-semibold">
                <Image className="w-4 h-4" />
                1. Report with details
              </div>
              <p className="mt-2 text-sm text-slate-300">Submit issue details with location and photos for better clarity.</p>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-violet-200 font-semibold">
                <CheckCircle className="w-4 h-4" />
                2. Official response
              </div>
              <p className="mt-2 text-sm text-slate-300">Officials review reports, respond, and update progress in real time.</p>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-violet-200 font-semibold">
                <ArrowRight className="w-4 h-4" />
                3. Track resolution
              </div>
              <p className="mt-2 text-sm text-slate-300">Citizens follow each update until the issue is resolved.</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition-colors"
            >
              {isAuthenticated ? "Go to App" : "Get Started"}
            </button>
          </div>
        </div>
      </section>

      <section id="contact-section" className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Contact & Access</h2>
          <p className="mt-2 text-slate-300 max-w-3xl">
            Continue to sign in if you already have access, or start now to enter CivicLens and begin reporting or monitoring issues.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition-colors"
            >
              {isAuthenticated ? "Go to Dashboard" : "Sign In"}
            </button>
            <button
              onClick={() => document.getElementById("home-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-slate-200 font-medium hover:bg-white/10 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </section>

      <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%]">
        <button
          onClick={onGetStarted}
          aria-label="Open dashboard"
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold"
        >
          {isAuthenticated ? "Open Dashboard" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
