/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Core backgrounds ── */
        primary:  "#f9fafb",      // clean cool white-gray
        panel:    "#ffffff",      // pure white card
        night:    "#06090f",      // near-black with blue tint
        carbon:   "#111827",      // dark card background

        /* ── Typography ── */
        ink:      "#0a0f1e",      // deep navy-black text
        mist:     "#e5e9f0",      // cool light gray

        /* ── Brand accents ── */
        bronze:   "#c9a96e",      // premium gold (unchanged)
        gold:     "#c9a96e",      // alias
        forest:   "#0f172a",      // deep navy (modern luxury)

        /* ── Premium blue ── */
        azure:    "#1d4ed8",

        /* ── Luxury additions ── */
        sand:      "#f5f0e8",      // warm cream for luxury backgrounds
        obsidian:  "#080808",      // pure luxury black
        champagne: "#e8d5b0",      // light gold tint
      },
      boxShadow: {
        soft:  "0 4px 24px -4px rgba(10,15,30,0.08), 0 1px 4px rgba(10,15,30,0.04)",
        card:  "0 8px 40px -8px rgba(10,15,30,0.12), 0 2px 8px rgba(10,15,30,0.06)",
        glow:  "0 0 0 3px rgba(201,169,110,0.18)",
        deep:  "0 32px 100px -12px rgba(10,15,30,0.28)",
        luxury: "0 48px 120px -20px rgba(0,0,0,0.5)",
        "inner-sm": "inset 0 1px 3px rgba(10,15,30,0.06)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 70% 40%, rgba(201,169,110,0.12), transparent 50%), linear-gradient(135deg, rgba(6,9,15,0.92), rgba(10,15,30,0.80))",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease-out forwards",
        "fade-in":    "fadeIn 0.4s ease-out forwards",
        "slide-left": "slideLeft 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: "translateX(-12px)" }, to: { opacity: 1, transform: "translateX(0)" } },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34,1.56,0.64,1)",
      },
    }
  },
  plugins: []
};
