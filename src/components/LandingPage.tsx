import { motion } from "framer-motion";
import Particles from "./Particles";
import { Logo } from "./Logo";
import TextType from "./TextType";
import { 
  MapPin, 
  Camera, 
  Brain, 
  BarChart3, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  MessageSquare
} from "lucide-react";
// AI chatbot is shown only on the dashboard now

interface LandingPageProps {
  onGetStarted: () => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onGetStarted, isAuthenticated = false }: LandingPageProps) {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI-Powered Image Analysis",
      description: "Upload photos and let our AI automatically categorize and prioritize civic issues",
      color: "from-civic-teal to-civic-darkBlue"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-time Location Tracking",
      description: "Precise GPS coordinates and interactive maps for accurate issue reporting",
      color: "from-civic-teal to-civic-darkBlue"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive insights and trends to help city officials make data-driven decisions",
      color: "from-civic-teal to-civic-darkBlue"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Prioritization",
      description: "Machine learning algorithms automatically assess urgency and route issues efficiently",
      color: "from-civic-darkBlue to-slate-700"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Engagement",
      description: "Upvoting, commenting, and collaborative problem-solving for better communities",
      color: "from-civic-darkBlue to-slate-700"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI Chat Assistant",
      description: "Upload images and ask questions - our AI helps you understand issues and solutions",
      color: "from-civic-darkBlue to-slate-700"
    }
  ];

  const stats = [
    { number: "10K+", label: "Issues Resolved", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "50+", label: "Cities Connected", icon: <Globe className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Sparkles className="w-6 h-6" /> },
    { number: "4.9★", label: "User Rating", icon: <Star className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-lightBlue via-white to-civic-lightBlue relative overflow-hidden">
      {/* Background gradient with new civic palette */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-civic-lightBlue via-white to-blue-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,145,185,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,79,155,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Particle background (uses dynamic import of ogl) */}
      <Particles particleCount={220} particleSpread={12} speed={0.12} className="-z-20" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,200,255,0.1),rgba(255,255,255,0))]"></div>
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo on the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="md" showText={true} textColor="text-slate-900" />
          </motion.div>

          {/* Get started and Demo buttons on the right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-2 sm:space-x-3"
          >
            <motion.button
              onClick={onGetStarted}
              className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-lg text-xs sm:text-sm shadow-lg hover:shadow-civic-teal/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started"}
            </motion.button>

            {isAuthenticated && (
              <button className="px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 border-2 border-civic-teal text-slate-900 rounded-lg bg-white/80 hover:bg-white backdrop-blur-md text-xs sm:text-sm font-semibold transition-all shadow-sm">
                <span className="hidden sm:inline">Watch demo</span>
                <span className="sm:hidden">Demo</span>
              </button>
            )}
          </motion.div>
        </div>
      </nav>

      <div className="relative z-10 pt-20">
        {/* Hero Section - Clean & Fast */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Simple gradient background - no lag */}
          <div className="absolute inset-0 bg-gradient-to-br from-civic-lightBlue/30 via-white to-civic-teal/20" />
          
          {/* Subtle static decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-civic-teal/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-civic-darkBlue/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-civic-lightBlue/10 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
            {/* Centered Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Small Badge with subtle animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                <div className="px-6 py-2.5 bg-gradient-to-r from-civic-teal to-civic-darkBlue rounded-full border-2 border-white/50 shadow-lg">
                  <span className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI POWERED PLATFORM
                  </span>
                </div>
              </motion.div>

              {/* Main Title - Simple animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 relative"
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tight relative">
                  <span className="text-slate-700">CIVIC </span>
                  <span className="bg-gradient-to-r from-civic-teal via-civic-darkBlue to-civic-teal bg-clip-text text-transparent">
                    LENS
                  </span>
                </h1>
              </motion.div>

              {/* Description - Static */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-700 font-medium text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              >
                Empower your community with AI-driven civic issue reporting and resolution. Track problems in real-time, engage with your neighbors, and build a better future together.
              </motion.p>

              {/* CTA Buttons - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  onClick={onGetStarted}
                  className="px-8 py-3.5 border-2 border-civic-darkBlue text-civic-darkBlue font-bold rounded-full text-base shadow-lg hover:bg-civic-darkBlue hover:text-white transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {!isAuthenticated ? 'GET STARTED' : 'GO TO DASHBOARD'}
                </motion.button>

                <motion.button
                  onClick={() => {
                    document.getElementById('features-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-bold rounded-full text-base shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LEARN MORE
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-civic-lightBlue/20 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Powerful Features for
                <span className="bg-gradient-to-r from-civic-teal to-purple-500 bg-clip-text text-transparent"> Modern Cities</span>
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Discover how CivicLens revolutionizes civic engagement with cutting-edge AI and real-time analytics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
                  }}
                  className="group relative"
                >
                  <div className="bg-white backdrop-blur-xl border-2 border-civic-teal/30 p-4 sm:p-6 md:p-8 h-full rounded-2xl relative overflow-hidden shadow-xl hover:shadow-2xl hover:border-civic-teal transition-all duration-300">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 sm:mb-6 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-5 sm:text-6 md:text-8 w-6 h-6 sm:w-8 sm:h-8">{feature.icon}</span>
                    </motion.div>
                    
                    {/* Content */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-4 group-hover:text-civic-teal transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-civic-teal to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-civic-lightBlue/30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-white to-civic-lightBlue/50 backdrop-blur-xl border-2 border-civic-teal/40 p-12 rounded-3xl relative overflow-hidden shadow-2xl">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-civic-teal/5 to-purple-500/5"></div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-civic-teal/20 to-purple-500/20 rounded-full blur-xl"
              ></motion.div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8 px-4 sm:px-0">
                  Ready to Transform Your Community?
                </h2>
                
                <motion.button
                  onClick={onGetStarted}
                  className="group relative w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-bold rounded-2xl text-base sm:text-lg md:text-xl shadow-xl hover:shadow-civic-teal/50"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(0, 145, 185, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center space-x-3">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-civic-teal/80 to-civic-darkBlue/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-civic-teal/30 bg-civic-lightBlue/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Logo size="md" showText={true} textColor="text-slate-900" />
              </div>
              
              <p className="text-slate-700 text-sm sm:text-base mb-4">
                Empowering communities through intelligent civic engagement
              </p>
              
              <motion.p 
                className="text-slate-600 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Made by{" "}
                <span className="text-civic-teal font-semibold">
                  Naman Gaonkar
                </span>
              </motion.p>
            </motion.div>
          </div>
        </footer>
      </div>

        {/* Mobile-only sticky report CTA */}
        <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={onGetStarted}
            aria-label="Report an issue"
            className="w-[92%] mx-auto px-4 py-3 bg-civic-teal text-white font-bold rounded-xl shadow-2xl flex items-center justify-center space-x-3"
          >
            <MapPin className="w-5 h-5" />
            <span>Report an Issue</span>
          </button>
        </div>

        {/* AI chatbot removed from landing page - available in dashboard only */}
    </div>
  );
}
