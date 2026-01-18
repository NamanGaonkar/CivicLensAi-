import { motion } from "framer-motion";
import { ReactElement } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: ReactElement;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

export function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: "from-civic-teal/20 to-civic-darkBlue/20 border-civic-teal/30 text-civic-teal",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-600",
    yellow: "from-accent-yellow/20 to-accent-orange/20 border-accent-yellow/30 text-accent-orange",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-600",
    red: "from-accent-orange/20 to-red-600/20 border-accent-orange/30 text-red-600",
  };

  const isPositive = change.startsWith("+");

  return (
    <motion.div
      className={`glass-card p-6 bg-gradient-to-br ${colorClasses[color]} relative overflow-hidden group cursor-pointer`}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        rotateY: 5
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={colorClasses[color].split(' ').find(c => c.startsWith('text-')) || 'text-civic-teal'}
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              {icon}
            </div>
          </motion.div>
          <motion.div
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              isPositive ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {change}
          </motion.div>
        </div>
        <div className="space-y-1">
          <p className="text-slate-600 text-sm font-medium group-hover:text-slate-900 transition-colors">
            {title}
          </p>
          <motion.p
            className="text-3xl font-bold text-slate-900"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {value}
          </motion.p>
        </div>
      </div>
      
      {/* Hover Effect Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-civic-teal to-civic-darkBlue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />
    </motion.div>
  );
}
