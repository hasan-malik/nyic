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
        },
        brand: {
          red: "#e0492f", // CTA / donate
          redHover: "#c93d26",
        },
        mist: "#eef1fb", // light section background
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
