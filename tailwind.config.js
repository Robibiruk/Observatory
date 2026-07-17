/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        surface: "rgba(255,255,255,0.05)",
        primary: "#6C7CFF",
        accent: "#8D5BFF",
        highlight: "#AEEBFF",
        text: "#F7F8FC",
        muted: "#A5AEC0",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(109,124,255,0.25)",
        "glow-accent": "0 0 50px rgba(141,91,255,0.30)",
      },
      backdropBlur: {
        glass: "14px",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-12px) translateX(6px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};
