import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        graphite: "#394252",
        porcelain: "#f7f8f5",
        brass: "#b58a43",
        teal: "#0f766e",
        coral: "#c65b4a",
        mist: "#e8ede8",
      },
      boxShadow: {
        premium: "0 22px 60px rgba(24, 33, 47, 0.14)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
