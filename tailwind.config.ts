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
          50: "#f2f8f2",
          100: "#dfeee0",
          200: "#bedcc1",
          300: "#93c398",
          400: "#66a56d",
          500: "#478a4f",
          600: "#356e3c",
          700: "#2b5731",
          800: "#25462a",
          900: "#1f3b24",
        },
      },
    },
  },
  plugins: [],
};
export default config;
