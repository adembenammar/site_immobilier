import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyCard from "../components/property/PropertyCard";
import EmptyState from "../components/common/EmptyState";
import SectionHeading from "../components/common/SectionHeading";

const FAVORITES_KEY = "tentation-favorites";
const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const remove = (id) => {
    setFavorites((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearAll = () => {
    localStorage.removeItem(FAVORITES_KEY);
    setFavorites([]);
  };

  return (
    <div>
      <Helmet>
        <title>Mes favoris — Tentation Immobilière</title>
        <meta name="description" content="Retrouvez les biens immobiliers que vous avez sauvegardés." />
      </Helmet>

      {/* ── Header ── */}
      <section className="bg-ink py-20 dark:bg-obsidian">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-bronze/60" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">Ma sélection</p>
              </div>
              <h1 className="mt-5 font-display text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                Mes favoris
              </h1>
              <p className="mt-5 text-base text-white/40">
                {favorites.length > 0
                  ? `${favorites.length} bien${favorites.length > 1 ? "s" : ""} sauvegardé${favorites.length > 1 ? "s" : ""} sur cet appareil.`
                  : "Vos biens sauvegardés apparaîtront ici."}
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-500 hover:text-white hover:border-rose-500"
              >
                <Trash2 size={14} /> Tout effacer
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="section-shell py-16">
        {favorites.length ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {favorites.map((property) => (
              <motion.div key={property.id} variants={fadeUp} className="relative">
                <PropertyCard property={property} compact />
                {/* Remove button overlay */}
                <button
                  type="button"
                  aria-label="Retirer des favoris"
                  onClick={() => remove(property.id)}
                  className="absolute left-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white backdrop-blur-sm transition hover:bg-red-600"
                >
                  <Heart size={13} className="fill-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
              <Heart size={32} className="text-rose-300" />
            </div>
            <h2 className="mt-6 font-display text-3xl text-ink dark:text-white">Aucun favori</h2>
            <p className="mt-3 max-w-sm text-base text-slate-500 dark:text-slate-400">
              Cliquez sur l'icône ♥ sur une annonce pour la retrouver ici.
            </p>
            <Link to="/properties" className="btn-primary mt-8 gap-2">
              Parcourir les biens
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoritesPage;
