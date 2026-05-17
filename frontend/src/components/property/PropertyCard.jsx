import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

const imageBaseUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";

const STATUS_BADGE = {
  available: { label: "Disponible", cls: "bg-emerald-500" },
  reserved:  { label: "Réservé",    cls: "bg-amber-500" },
  sold:      { label: "Vendu",      cls: "bg-rose-500" },
};

const PropertyCard = ({ property, compact = false }) => {
  const image = property.cover_image?.startsWith("/uploads")
    ? `${imageBaseUrl}${property.cover_image}`
    : property.cover_image;

  const badge = STATUS_BADGE[property.status];

  return (
    <article className="group overflow-hidden rounded-[28px] bg-white shadow-soft dark:bg-slate-900">
      <div className={`relative overflow-hidden ${compact ? "h-72" : "h-80"}`}>
        <img src={image} alt={property.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-forest">
            {property.featured_badge || property.category_name}
          </span>
          {badge && (
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white ${badge.cls}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {badge.label}
            </span>
          )}
        </div>
        <div className="absolute inset-x-6 bottom-6">
          <p className="text-xs uppercase tracking-[0.28em] text-white/75">{property.city}</p>
          <h3 className="mt-2 font-display text-3xl leading-tight text-white">{property.title}</h3>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={14} />
            {property.address}
          </p>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Prix</p>
            <p className="mt-1 text-xl font-semibold text-forest dark:text-mist">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(property.price)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <BedDouble size={16} /> {property.bedrooms} ch.
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Bath size={16} /> {property.bathrooms} sdb
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Ruler size={16} /> {property.surface} m²
          </div>
        </div>
        <Link to={`/properties/${property.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-bronze transition hover:text-forest dark:hover:text-mist">
          Voir le bien <span>+</span>
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
