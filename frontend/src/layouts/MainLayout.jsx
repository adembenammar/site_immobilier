import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import BackToTop from "../components/common/BackToTop";
import ScrollProgressBar from "../components/common/ScrollProgressBar";

/* Reset scroll position on every route change (React Router v6 does not do
   this automatically). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

/* On non-hero pages the header is position:fixed and therefore removed from
   the document flow.  This invisible spacer pushes page content down so it
   starts below the header instead of being hidden behind it.
   Heights match the actual header: mobile ≈ 73 px / desktop ≈ 106 px. */
const HeaderSpacer = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;           // hero page — no spacer needed
  return <div className="h-[73px] lg:h-[106px]" aria-hidden="true" />;
};

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const MainLayout = () => (
  <div className="min-h-screen">
    <ScrollProgressBar />
    <ScrollToTop />
    <Header />
    <main>
      <HeaderSpacer />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
    <Footer />
    <BackToTop />
  </div>
);

export default MainLayout;
