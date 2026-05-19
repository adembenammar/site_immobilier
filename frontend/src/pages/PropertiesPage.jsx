import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowUpDown, ArrowUpRight, Bath, BedDouble, LayoutGrid, LayoutList, Map, MapPin, Ruler } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PropertyQuickView from "../components/property/PropertyQuickView";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import SectionHeading from "../components/common/SectionHeading";
import PropertyFilters from "../components/property/PropertyFilters";
import PropertyCard from "../components/property/PropertyCard";
import PropertyMap from "../components/property/PropertyMap";
import EmptyState from "../components/common/EmptyState";
import { PropertyGridSkeleton } from "../components/common/PropertyCardSkeleton";
import { useFetch } from "../hooks/useFetch";

const PAGE_SIZE = 9;

/* ── Inline list-view card ─────────────────────────────────────────── */
const imageBaseUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

const STATUS_BADGE = {
  available: { label: "Disponible", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  reserved:  { label: "Réservé",    cls: "bg-amber-500/10  text-amber-700  dark:text-amber-400"  },
  sold:      { label: "Vendu",      cls: "bg-red-500/10    text-red-700    dark:text-red-400"    },
};

const PropertyListItem = ({ property }) => {
  const image = property.cover_image?.startsWith("/uploads")
    ? `${imageBaseUrl}${property.cover_image}`
    : property.cover_image;
  const badge = STATUS_BADGE[property.status];
  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <article className="flex overflow-hidden rounded-2xl bg-ink shadow-deep ring-1 ring-white/5 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-luxury">
        {/* Image strip */}
        <div className="relative w-28 flex-shrink-0 overflow-hidden sm:w-44 md:w-60">
          <img
            src={image}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink/50" />
          {badge && (
            <span className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm ${badge.cls}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />{badge.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
          <div>
            <div className="mb-3 h-px w-8 bg-bronze/60 transition-all duration-500 group-hover:w-14 group-hover:bg-bronze" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.38em] text-white/35">{property.city}</p>
            <h3 className="mt-1.5 font-display text-2xl font-light leading-snug text-white">{property.title}</h3>
            {property.address && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-white/25">
                <MapPin size={11} className="flex-shrink-0 text-bronze/50" />
                <span className="truncate">{property.address}</span>
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 h-px w-full bg-white/8" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <BedDouble size={12} className="text-bronze/70" />{property.bedrooms} ch.
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <Bath size={12} className="text-bronze/70" />{property.bathrooms} sdb
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  <Ruler size={12} className="text-bronze/70" />{property.surface} m²
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl font-light text-bronze">{fmt(property.price)}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/40 transition-all duration-300 group-hover:bg-bronze group-hover:text-white">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const emptyFilters = { city: "", minPrice: "", maxPrice: "", minSurface: "", type: "", rooms: "", transactionType: "" };

const sortProperties = (list, sortBy) => {
  const arr = [...list];
  switch (sortBy) {
    case "price_asc":    return arr.sort((a, b) => a.price - b.price);
    case "price_desc":   return arr.sort((a, b) => b.price - a.price);
    case "surface_desc": return arr.sort((a, b) => b.surface - a.surface);
    case "date_desc":    return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    default:             return arr;
  }
};

const PropertiesPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const SORT_OPTIONS = [
    { value: "default",      label: t("properties.sort_default") },
    { value: "price_asc",    label: t("properties.sort_price_asc") },
    { value: "price_desc",   label: t("properties.sort_price_desc") },
    { value: "surface_desc", label: t("properties.sort_surface_desc") },
    { value: "date_desc",    label: t("properties.sort_date_desc") },
  ];

  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    transactionType: searchParams.get("transactionType") || "",
    city: searchParams.get("city") || ""
  }));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const sentinelRef = useRef(null);
  const { data: categories } = useFetch("/categories", []);

  /* Unique sorted city list for autocomplete */
  const cities = useMemo(
    () => [...new Set(properties.map((p) => p.city).filter(Boolean))].sort(),
    [properties]
  );

  useEffect(() => {
    const txType = searchParams.get("transactionType") || "";
    const c = searchParams.get("city") || "";
    setFilters((prev) => ({ ...prev, transactionType: txType, city: c }));
  }, [searchParams]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setPage(1);
      try {
        const { data } = await api.get(`/properties${queryString ? `?${queryString}` : ""}`);
        setProperties(data);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [queryString]);

  const sorted = useMemo(() => sortProperties(properties, sortBy), [properties, sortBy]);
  const paginated = useMemo(() => sorted.slice(0, page * PAGE_SIZE), [sorted, page]);
  const hasMore = paginated.length < sorted.length;

  /* Infinite scroll — load next page when sentinel enters viewport */
  useEffect(() => {
    if (!hasMore || view === "map") return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPage((p) => p + 1); },
      { rootMargin: "240px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, view, paginated.length]);

  const pageTitle =
    filters.transactionType === "sale" ? t("properties.page_title_sale") :
    filters.transactionType === "rent" ? t("properties.page_title_rent") :
    t("properties.page_title_all");

  const pageDescription =
    filters.transactionType === "sale" ? t("properties.page_desc_sale") :
    filters.transactionType === "rent" ? t("properties.page_desc_rent") :
    t("properties.page_desc_all");

  return (
    <div>
      {/* Quick View modal */}
      {quickViewProperty && (
        <PropertyQuickView
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
        />
      )}

      <Helmet>
        <title>{pageTitle} — Tentation Immobilière</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* En-tête + filtres */}
      <section className="bg-ink py-16 dark:bg-obsidian">
        <div className="section-shell">
          <SectionHeading eyebrow={t("properties.search_eyebrow")} title={pageTitle} description={pageDescription} dark />
          <div className="mt-10">
            <PropertyFilters
              filters={filters}
              onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
              onReset={() => setFilters(emptyFilters)}
              categories={categories}
              cities={cities}
            />
          </div>
        </div>
      </section>

      {/* Barre sticky résultats + tri + toggle vue */}
      <div className="sticky top-[72px] z-[50] border-b border-ink/10 bg-white/98 backdrop-blur-xl dark:border-white/6 dark:bg-ink/98 lg:top-[119px]">
        <div className="section-shell flex flex-wrap items-center justify-between gap-2 py-3">
          <p className="text-sm text-slate-400 dark:text-white/40">
            <span className="font-display text-lg font-light text-ink dark:text-white">{sorted.length}</span>{" "}
            <span className="hidden sm:inline">{sorted.length !== 1 ? t("properties.results_count_other") : t("properties.results_count_one")}</span>
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tri */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <ArrowUpDown size={13} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-600 outline-none dark:text-slate-300"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {/* Vue */}
            <div className="flex items-center gap-1 rounded-2xl border border-slate-200 p-1 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition sm:px-3 ${view === "grid" ? "bg-forest text-white" : "text-slate-500 hover:text-bronze"}`}
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">{t("properties.view_grid")}</span>
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition sm:px-3 ${view === "list" ? "bg-forest text-white" : "text-slate-500 hover:text-bronze"}`}
              >
                <LayoutList size={14} />
                <span className="hidden sm:inline">{t("properties.view_list")}</span>
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition sm:px-3 ${view === "map" ? "bg-forest text-white" : "text-slate-500 hover:text-bronze"}`}
              >
                <Map size={14} />
                <span className="hidden sm:inline">{t("properties.view_map")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <section className="section-shell py-16">
        {loading ? (
          <PropertyGridSkeleton count={9} />
        ) : view === "map" ? (
          <PropertyMap properties={sorted} />
        ) : sorted.length ? (
          <>
            {view === "list" ? (
              <div className="flex flex-col gap-4">
                {paginated.map((property) => (
                  <PropertyListItem key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    compact
                    onQuickView={setQuickViewProperty}
                  />
                ))}
              </div>
            )}
            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="mt-8 h-1" aria-hidden="true" />}
          </>
        ) : (
          <EmptyState title={t("properties.empty_title")} description={t("properties.empty_desc")} />
        )}
      </section>
    </div>
  );
};

export default PropertiesPage;
