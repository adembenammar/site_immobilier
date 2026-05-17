import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import BackToTop from "../components/common/BackToTop";

const MainLayout = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
    <BackToTop />
  </div>
);

export default MainLayout;
