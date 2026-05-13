import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        purple: {
          dim: "#6D28D9",
          main: "#8B5CF6",
          vivid: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
        mono: ["'Cascadia Code'", "'Consolas'", "monospace"],
      },
      animation: {
        "ring-pulse": "ring-pulse 1.4s ease-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
      keyframes: {
        "ring-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(168, 85, 247, 0.6)" },
          "70%": { boxShadow: "0 0 0 24px rgba(168, 85, 247, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(168, 85, 247, 0)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
