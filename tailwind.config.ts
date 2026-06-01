import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coast: {
          sand: "#f3e7d1",
          shell: "#fffaf2",
          foam: "#f5fbfa",
          blue: "#196b85",
          deep: "#16465a",
          slate: "#263942",
          green: "#6d8f75",
          moss: "#4f7258",
          coral: "#d9785f",
          cider: "#b88232",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 70, 90, 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
