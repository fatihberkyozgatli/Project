import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#115E59",
          hover: "#0E4D49",
          pressed: "#0B3D3A",
          subtle: "#E7F1EF",
          fg: "#FFFFFF",
        },
        charity: {
          DEFAULT: "#16A34A",
          subtle: "#E3F5E9",
          text: "#15803D",
          fg: "#FFFFFF",
        },
        coral: {
          DEFAULT: "#E76F51",
          hover: "#DD5C3C",
          subtle: "#FBEAE4",
          text: "#C24A2E",
          fg: "#FFFFFF",
        },
        ink: "#0F172A",
        cream: "#FAF7F2",
        sand: {
          50: "#F6F2EC",
          100: "#EDE8E0",
          200: "#E0D9CE",
          300: "#CBC3B6",
          400: "#ABA293",
          500: "#877E6E",
          600: "#6A6253",
          700: "#4E4840",
          800: "#34302A",
          900: "#211D18",
        },
        success: { DEFAULT: "#16A34A", subtle: "#E3F5E9", text: "#15803D" },
        warning: { DEFAULT: "#E08A1E", subtle: "#FBEEDA", text: "#B45309" },
        error: { DEFAULT: "#DC2626", subtle: "#FCE9E9", text: "#B91C1C" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15,23,42,.06)",
        md: "0 4px 14px rgba(15,23,42,.06)",
        lg: "0 12px 32px rgba(15,23,42,.10)",
        brand: "0 10px 30px -8px rgba(17,94,89,.35)",
        coral: "0 10px 30px -8px rgba(231,111,81,.35)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.16,1,.3,1) both",
        "fade-in": "fade-in .4s ease both",
        float: "float 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
