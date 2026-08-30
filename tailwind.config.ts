import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: "#17140F",
          surface: "#211D16",
          surface2: "#2A2419",
          seam: "#3A3222",
          text: "#F1E9D8",
          muted: "#A69A80",
          faint: "#6E6552",
        },
        grain: {
          DEFAULT: "#C9A227",
          soft: "#E0C158",
          deep: "#8F7318",
        },
        ok: {
          DEFAULT: "#5B9279",
          soft: "#7FB69B",
          dim: "#233A30",
        },
        warn: {
          DEFAULT: "#E0932F",
          soft: "#F0AD52",
          dim: "#3D2C15",
        },
        high: {
          DEFAULT: "#CE5335",
          soft: "#E27A5F",
          dim: "#3D1E15",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain-noise":
          "radial-gradient(circle at 1px 1px, rgba(241,233,216,0.04) 1px, transparent 0)",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(241,233,216,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        rivet: "inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 rgba(241,233,216,0.06)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        blink: "blink 1.6s ease-in-out infinite",
        sweep: "sweep 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
