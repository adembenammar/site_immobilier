import { useEffect } from "react";
import { Bath, BedDouble, Heart, MapPin, Ruler, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const imageBaseUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
const FAVORITES_KEY = "tentation-favorites";

const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

const TX_LABEL = { sale: "Vente", rent: "Location" };

/**
 * Modal d'aperçu rapide d'un bien.
 * Props: property, onClose
 */
const PropertyQuickView = ({ property, onClose }) => {
  const image = property.cover_image?.startsWith("/uploads")
    ? `${imageBaseUrl}${property.cover_image}`
    : property.cover_image;

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* favorites */
  const [isFav, setIsFav] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]").some(
        (p) => p.id === property.id
      );
    } catch { return false; }
  });
  const toggleFav = () => {
    try {
      const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const next = isFav
        ? favs.filter((p) => p.id !== property.id)
        : [...favs, property];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setIsFav(!isFav);
    } catch {}
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900"
        style={{ animation: "fadeScaleIn 0.18s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition hover:bg-white/40"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <div className="relative h-56 overflow-hidden sm:h-72">
          <img
            src={image}
            alt={property.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Tx badge */}
          {property.transaction_type && (
            <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ${
              property.transaction_type === "rent" ? "bg-sky-600/90" : "bg-forest/90"
            }`}>
              {TX_LABEL[property.transaction_type]}
            </span>
          )}

          {/* Fav */}
          <button
            type="button"
            onClick={toggleFav}
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`absolute right-14 top-4 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition ${
              isFav ? "bg-red-500/90" : "bg-black/30 hover:bg-black/50"
            }`}
          >
            <Heart size={14} className={isFav ? "fill-white text-white" : "text-white"} />
          </button>

          {/* Bottom overlay */}
          <div className="absolute inset-x-5 bottom-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">{property.city}</p>
            <h3 className="mt-1 font-display text-2xl font-light leading-tight text-white">{property.title}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="flex-shrink-0 text-bronze" />
              <span>{property.address || property.city}</span>
            </div>
            <p className="text-2xl font-semibold text-forest dark:text-mist">{fmt(property.price)}</p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: BedDouble, label: `${property.bedrooms} chambre${property.bedrooms > 1 ? "s" : ""}` },
              { icon: Bath,      label: `${property.bathrooms} sdb` },
              { icon: Ruler,     label: `${property.surface} m²` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <Icon size={15} className="text-bronze" />
                <span className="text-sm font-medium text-ink dark:text-white">{label}</span>
              </div>
            ))}
          </div>

          {/* Description excerpt */}
          {property.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
              {property.description}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-6 flex gap-3">
            <Link
              to={`/properties/${property.id}`}
              className="btn-primary flex-1 text-center"
              onClick={onClose}
            >
              Voir le bien
            </Link>
            <button
              type="button"
              onClick={toggleFav}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                isFav
                  ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-800 dark:bg-red-900/20"
                  : "border-slate-200 text-slate-600 hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              <Heart size={14} className={isFav ? "fill-current" : ""} />
              {isFav ? "Favori" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PropertyQuickView;
