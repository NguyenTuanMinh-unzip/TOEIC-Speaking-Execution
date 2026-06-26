import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme — "ink" is repurposed as a LIGHT surface scale so that
        // existing bg-ink-* / border-ink-* classes resolve to light values.
        ink: {
          950: "#ffffff", // also used as text-on-accent → reads white on blue
          900: "#ffffff",
          850: "#ffffff",
          800: "#eef4fb", // inset surfaces inside white cards
          700: "#dde8f3", // tracks, dots, soft borders
          600: "#c4d6e6", // stronger borders / toggle-off
          500: "#9bb1c6",
        },
        // "gray" repurposed as a DARK text scale (low number = darkest) so that
        // text-gray-* classes read well on a light background.
        gray: {
          100: "#15324a",
          200: "#1e3a54",
          300: "#324b63",
          400: "#56708a",
          500: "#64788d",
          600: "#8093a6",
          700: "#2d4257",
          800: "#1c3149",
          900: "#0f2436",
        },
        accent: {
          DEFAULT: "#0d8be0", // ocean / sea blue
          600: "#0a6fb3",
          soft: "#e6f2fd",
        },
        danger: {
          DEFAULT: "#e11d48",
          soft: "#fdecef",
        },
        gold: "#b7791f",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,40,70,0.05), 0 14px 32px -18px rgba(15,40,70,0.22)",
        glow: "0 12px 30px -10px rgba(13,139,224,0.45)",
        "glow-sm": "0 6px 16px -8px rgba(13,139,224,0.5)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(120% 120% at 100% 0%, rgba(13,139,224,0.14) 0%, rgba(13,139,224,0) 48%), linear-gradient(160deg, #ffffff 0%, #eef6fd 100%)",
        "card-grad": "linear-gradient(160deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
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
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
        recordPulse: "recordPulse 1.1s ease-in-out infinite",
        riseIn: "riseIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
