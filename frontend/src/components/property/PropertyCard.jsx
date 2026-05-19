import { useState } from "react";
import { ArrowUpRight, Bath, BedDouble, Eye, Heart, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

const imageBaseUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
const FAVORITES_KEY = "tentation-favorites";

const STATUS_BADGE = {
  available: { label: "Disponible", cls: "bg-emerald-500/90" },
  reserved:  { label: "Réservé",    cls: "bg-amber-500/90"   },
  sold:      { label: "Vendu",      cls: "bg-red-500/90"      },
};

const TX_BADGE = {
  sale: { label: "Vente",    cls: "bg-forest/90"  },
  rent: { label: "Location", cls: "bg-sky-700/90" },
};

const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

const PropertyCard = ({ property, compact = false, onQuickView }) => {
  const image = property.cover_image?.startsWith("/uploads")
    ? `${imageBaseUrl}${property.cover_image}`
    : property.cover_image;

  const badge   = STATUS_BADGE[property.status];
  const txBadge = TX_BADGE[property.transaction_type];

  const isNew =
    property.created_at &&
    Date.now() - new Date(property.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;

  const [isFav, setIsFav] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]").some(
        (p) => p.id === property.id
      );
    } catch { return false; }
  });

  const toggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link to={`/properties/${property.id}`} className="group block">
      <article
        className={`relative overflow-hidden ${compact ? "rounded-2xl" : "rounded-3xl"} shadow-deep ring-1 ring-white/8`}
        style={{ height: compact ? "300px" : "400px" }}
      >
        {/* Background image */}
        <img
          src={image}
          alt={property.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Rich gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bronze/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* ── Top: badges + actions ── */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
          {/* Left badges */}
          <div className="flex flex-col gap-1.5">
            {(property.featured_badge || property.category_name) && (
              <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                {property.featured_badge || property.category_name}
              </span>
            )}
            {isNew && (
              <span className="w-fit rounded-full bg-bronze px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                Nouveau
              </span>
            )}
            {txBadge && (
              <span className={`w-fit rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white ${txBadge.cls}`}>
                {txBadge.label}
              </span>
            )}
          </div>

          {/* Right: status + heart + quick-view */}
          <div className="flex flex-col items-end gap-1.5">
            {badge && (
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white ${badge.cls}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                {badge.label}
              </span>
            )}
            <div className="flex gap-1.5">
              {onQuickView && (
                <button
                  type="button"
                  aria-label="Aperçu rapide"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(property); }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white transition hover:bg-white/30"
                >
                  <Eye size={13} />
                </button>
              )}
              <button
                type="button"
                aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                onClick={toggleFav}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
                  isFav ? "bg-red-500/90 scale-110" : "bg-white/15 hover:bg-white/30"
                }`}
              >
                <Heart size={13} className={isFav ? "fill-white text-white" : "text-white"} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom: all info ── */}
        <div className="absolute inset-x-5 bottom-5">
          {/* Thin bronze decorative line */}
          <div className="mb-3 h-px w-10 bg-bronze/70 transition-all duration-500 group-hover:w-16 group-hover:bg-bronze" />

          {/* City */}
          <p className="text-[9px] font-semibold uppercase tracking-[0.38em] text-white/50">
            {property.city}
          </p>

          {/* Title */}
          <h3 className="mt-1.5 font-display text-xl font-light leading-snug text-white">
            {property.title}
          </h3>

          {/* Separator */}
          <div className="my-3 h-px w-full bg-white/12" />

          {/* Stats + Price row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1 text-[11px] text-white/55">
                <BedDouble size={11} className="text-bronze/80" />
                {property.bedrooms}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/55">
                <Bath size={11} className="text-bronze/80" />
                {property.bathrooms}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/55">
                <Ruler size={11} className="text-bronze/80" />
                {property.surface} m²
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-display text-lg font-light text-bronze">
                {fmt(property.price)}
              </p>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all duration-300 group-hover:bg-bronze group-hover:text-white backdrop-blur-sm">
                <ArrowUpRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
