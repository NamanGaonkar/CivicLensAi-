import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export function Logo({ size = "md", showText = true, textColor = "text-slate-900", className = "" }: LogoProps) {
  const sizes = {
    sm: { box: "w-8 h-8", text: "text-lg", icon: "text-xs" },
    md: { box: "w-10 h-10", text: "text-xl", icon: "text-sm" },
    lg: { box: "w-14 h-14", text: "text-2xl", icon: "text-base" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${currentSize.box} rounded-lg bg-gradient-to-br from-civic-teal to-civic-darkBlue flex items-center justify-center shadow-lg relative overflow-hidden group`}>
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-civic-darkBlue to-civic-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        {/* Icon - City Building with Eye */}
        <svg className={`${currentSize.icon} relative z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Buildings */}
          <path d="M3 21V11L8 6V21H3Z" fill="white" fillOpacity="0.9"/>
          <path d="M9 21V3L14 8V21H9Z" fill="white" fillOpacity="0.9"/>
          <path d="M15 21V8L20 13V21H15Z" fill="white" fillOpacity="0.9"/>
          {/* Eye/Lens in center */}
          <circle cx="11.5" cy="13" r="2.5" fill="#BAE4F0" stroke="white" strokeWidth="0.5"/>
          <circle cx="11.5" cy="13" r="1" fill="#004F9B"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`${currentSize.text} font-bold ${textColor} tracking-tight`}>
          CIVIC<span className="text-civic-teal">LENS</span>
        </span>
      )}
    </div>
  );
}
