/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f5f1ea",
        ink: "#111111",
        bronze: "#b08a57",
        forest: "#172925",
        mist: "#e8e3da",
        panel: "#fffdfa",
        night: "#131517"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(21, 21, 21, 0.08)"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "Segoe UI", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top right, rgba(168, 122, 75, 0.18), transparent 30%), linear-gradient(135deg, rgba(23,49,45,0.95), rgba(15,23,32,0.86))"
      }
    }
  },
  plugins: []
};
