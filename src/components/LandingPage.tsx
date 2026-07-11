import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Logo } from "./Logo";
import {
  MapPin,
  Camera,
  Brain,
  BarChart3,
  Users,
  Globe,
  ArrowRight,
  MessageSquare,
  Shield,
  ChevronDown,
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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoSrc = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";
  const videoPoster =
    "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      const handleMeta = () => video.play().catch((e) => console.log("Auto-play prevented:", e));
      video.addEventListener("loadedmetadata", handleMeta);
      return () => video.removeEventListener("loadedmetadata", handleMeta);
    }
    return () => {
      hls?.destroy();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="landing-root min-h-screen bg-black text-white relative overflow-x-hidden font-instrument-sans">
      <nav className="fixed top-0 inset-x-0 z-50 bg-transparent px-6 py-4 flex items-center justify-between">
        <Logo size="sm" showText={true} textColor="text-white" />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <button onClick={() => scrollTo("about-section")} className="hover:text-white transition-colors">
            About
          </button>
          <button onClick={() => scrollTo("features-section")} className="flex items-center gap-1 hover:text-white transition-colors">
            Features <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={() => scrollTo("contact-section")} className="hover:text-white transition-colors">
            Contact
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="rounded-full bg-white text-black px-5 py-2.5 font-semibold text-sm hover:scale-[1.02] transition-transform"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section id="home-section" className="relative w-full min-h-screen bg-black text-white overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          muted
          loop
          playsInline
          poster={videoPoster}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        <div className="pointer-events-none absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center mt-40 sm:mt-48 px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-instrument-serif text-3xl sm:text-5xl lg:text-[48px] leading-[1.1] text-white"
          >
            Civic intelligence for every neighborhood
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 font-semibold text-6xl sm:text-8xl lg:text-[136px] leading-[0.9] tracking-tighter bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
          >
            Report. Resolve.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 text-lg sm:text-[20px] leading-[1.65] text-white max-w-xl"
          >
            LocalityAI combines reporting, maps, analytics, and AI assistance to help citizens
            report issues faster and help officials respond with clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-6"
          >
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center pl-6 pr-2 py-2 rounded-full bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-200"
            >
              <span className="font-medium text-lg text-[#0a0400]">
                {isAuthenticated ? "Open Dashboard" : "Get Started"}
              </span>
              <span className="ml-3 w-10 h-10 rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <section id="about-section" className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14 pt-16 sm:pt-24">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">About LocalityAI</h2>
          <p className="mt-4 text-white/70 leading-relaxed max-w-4xl">
            LocalityAI is a civic-issue platform that helps citizens report local problems,
            track them on a map, and stay informed as officials respond. AI assistance helps
            classify reports faster, while dashboards give teams the visibility they need to act
            with clarity and build public trust.
          </p>
        </div>
      </section>

      <section id="features-section" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Features</h2>
            <p className="mt-2 text-white/70">All key functions stay available across the app.</p>
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
                <div className="w-10 h-10 rounded-lg bg-white/10 text-[#b4c0ff] flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-section" className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Contact</h2>
          <p className="mt-2 text-white/70 max-w-3xl">
            Have a civic project in mind or want to get in touch? Reach out through the portfolio below.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="https://naman-gaonkar.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center pl-6 pr-2 py-2 rounded-full bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-200"
            >
              <span className="font-medium text-lg text-[#0a0400]">
                Contact Me
              </span>
              <span className="ml-3 w-10 h-10 rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60">
          <span>Built by Naman Gaonkar</span>
          <a
            href="https://naman-gaonkar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            naman-gaonkar.vercel.app
          </a>
        </div>
      </footer>
    </div>
  );
}
