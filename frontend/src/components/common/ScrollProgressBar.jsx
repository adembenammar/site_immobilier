import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fine bronze line at the very top of the viewport that fills as the user scrolls.
 * Resets to 0 on every route change.
 */
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const { pathname } = useLocation();

  /* Reset on navigation */
  useEffect(() => { setProgress(0); }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min((scrolled / maxScroll) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[1000] h-[2px]">
      <div
        className="h-full bg-bronze"
        style={{ width: `${progress}%`, transition: "width 60ms linear" }}
      />
    </div>
  );
};

export default ScrollProgressBar;
