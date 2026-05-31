/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#1c3aa8", // hero royal blue
          deep: "#142a78", // footer / darker navy
          ink: "#0d1b4c", // darkest navy (admin shell)
        },
        brand: {
          red: "#e0492f", // CTA / donate
          redHover: "#c93d26",
          gold: "#f0b429", // accent (warmth / belonging)
        },
        mist: "#eef1fb", // light section background
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
