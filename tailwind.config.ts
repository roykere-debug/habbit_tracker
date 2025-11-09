import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-cream": "#f7f5f0",
        "brand-dark": "#0f3d2e",
        "brand-dark-soft": "#14503c",
      },
      boxShadow: {
        subtle: "0 10px 30px -20px rgba(15, 61, 46, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

