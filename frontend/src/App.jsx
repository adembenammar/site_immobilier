import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoadingState from "./components/common/LoadingState";

// Lazy-load heavy admin bundle (Recharts + dnd-kit) — only fetched when navigating to /admin
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<LoadingState />}>
            <AdminDashboardPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
