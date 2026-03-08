import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1220",
        text: "#e7eefc",
        muted: "rgba(231,238,252,0.75)",
        border: "rgba(231,238,252,0.16)",
        accent: "#4f8cff",
        good: "#2fd17b",
        bad: "#ff5a6a",
      },
      boxShadow: {
        card: "0 14px 40px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;