import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "var(--background)",
          surface: "var(--surface)",
          surface2: "var(--surface-2)",
          surface3: "var(--surface-3)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
        },
      },
      letterSpacing: {
        tight: "-0.01em",
        tighter: "-0.02em",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0)", opacity: "0.3" },
          "50%": { transform: "translateY(48px)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "0.3" },
        },
      },
      animation: {
        scan: "scan 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
