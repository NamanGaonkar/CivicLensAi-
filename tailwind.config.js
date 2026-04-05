/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#18122B",
          dark: "#1A1A2E",
          card: "#232946",
        },
        neon: {
          purple: "#A259FF",
          purple2: "#C084FC",
          cyan: "#00F0FF",
          cyan2: "#5EFCE8",
        },
        text: {
          DEFAULT: "#FFFFFF",
          muted: "#E0E0E0",
        },
        surface: {
          DEFAULT: "#232946",
          alt: "#2D2A4A",
        },
        primary: {
          DEFAULT: "#A259FF",
          hover: "#C084FC",
          light: "#BAE4F0",
          dark: "#00F0FF",
        },
        accent: {
          orange: "#FF6500",
          yellow: "#FFD500",
        },
        civic: {
          teal: "#A259FF",
          lightBlue: "#BAE4F0",
          darkBlue: "#00F0FF",
          orange: "#FF6500",
          yellow: "#FFD500",
        },
      },
      boxShadow: {
        neon: "0 0 16px #A259FF, 0 0 32px #00F0FF",
        'neon-cyan': "0 0 16px #00F0FF, 0 0 32px #5EFCE8",
        'neon-purple': "0 0 16px #A259FF, 0 0 32px #C084FC",
      },
      textShadow: {
        neon: "0 0 8px #A259FF, 0 0 16px #00F0FF",
      },
      borderRadius: {
        container: "0.75rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
