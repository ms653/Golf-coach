import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fairway: {
          50: "#f0f5f0",
          100: "#dcebdd",
          200: "#b9d6bc",
          300: "#8dbb93",
          400: "#5c9a66",
          500: "#3d7d48",
          600: "#2f6b3f",
          700: "#234f2f",
          800: "#1c3f26",
          900: "#16311e",
        },
        marker: {
          DEFAULT: "#c98a2c",
          tint: "#f7e9d2",
        },
        mist: "#7c93a0",
        surface: {
          page: "#f4f6f1",
          deep: "#16281c",
        },
        ink: {
          DEFAULT: "#1c2420",
          muted: "#5b6b60",
          ondeep: "#eef3ec",
        },
        alert: "#a23b2e",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        data: ["var(--font-data)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
