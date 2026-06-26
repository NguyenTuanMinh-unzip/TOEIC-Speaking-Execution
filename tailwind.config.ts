import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070809",
          900: "#0b0d11",
          850: "#101319",
          800: "#161a22",
          700: "#1e232d",
          600: "#2a3140",
          500: "#3a4150",
        },
        accent: {
          DEFAULT: "#2ee6b0",
          600: "#16c79a",
          soft: "#0d3a30",
        },
        danger: {
          DEFAULT: "#ff4d67",
          soft: "#36101a",
        },
        gold: "#f5c451",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.8)",
        glow: "0 10px 30px -10px rgba(46,230,176,0.45)",
        "glow-sm": "0 6px 18px -8px rgba(46,230,176,0.5)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(120% 120% at 100% 0%, rgba(46,230,176,0.16) 0%, rgba(46,230,176,0) 45%), linear-gradient(160deg, rgba(30,35,45,0.9) 0%, rgba(11,13,17,0.9) 100%)",
        "card-grad": "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 60%)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        recordPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.12)", opacity: "0.7" },
        },
        floatGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
        recordPulse: "recordPulse 1.1s ease-in-out infinite",
        floatGlow: "floatGlow 4s ease-in-out infinite",
        riseIn: "riseIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
