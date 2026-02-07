/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0091B9",
          hover: "#007A9A",
          light: "#BAE4F0",
          dark: "#004F9B",
        },
        accent: {
          orange: "#FF6500",
          yellow: "#FFD500",
        },
        civic: {
          teal: "#0091B9",
          lightBlue: "#BAE4F0",
          darkBlue: "#004F9B",
          orange: "#FF6500",
          yellow: "#FFD500",
        },
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
