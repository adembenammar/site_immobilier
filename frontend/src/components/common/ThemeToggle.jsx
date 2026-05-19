import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ frosted = true }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-200 ${
        frosted
          ? "border-ink/12 text-ink/50 hover:border-bronze hover:text-bronze dark:border-white/12 dark:text-white/50 dark:hover:border-bronze dark:hover:text-bronze"
          : "border-white/25 text-white/70 hover:border-bronze hover:text-bronze"
      }`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Sun — visible in light mode */}
        <Sun
          size={13}
          className={`absolute transition-all duration-300 ${
            isDark ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
          }`}
        />
        {/* Moon — visible in dark mode */}
        <Moon
          size={13}
          className={`absolute transition-all duration-300 ${
            isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
          }`}
        />
      </span>
      <span className="hidden sm:inline">{isDark ? "Clair" : "Sombre"}</span>
    </button>
  );
};

export default ThemeToggle;
