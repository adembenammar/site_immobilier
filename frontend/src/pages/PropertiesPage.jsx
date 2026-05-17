import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, LayoutGrid, Map } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  const { data: categories } = useFetch("/categories");

  useEffect(() => {
    const t = searchParams.get("transactionType") || "";
    const c = searchParams.get("city") || "";
    setFilters((prev) => ({ ...prev, transactionType: t, city: c }));
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
      const { data } = await api.get(`/properties${queryString ? `?${queryString}` : ""}`);
      setProperties(data);
      setLoading(false);
    };
    fetchProperties();
  }, [queryString]);

  const sorted = useMemo(() => sortProperties(properties, sortBy), [properties, sortBy]);
  const paginated = useMemo(() => sorted.slice(0, page * PAGE_SIZE), [sorted, page]);
  const hasMore = paginated.length < sorted.length;

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
      {/* En-tête + filtres */}
      <section className="border-b border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-night">
        <div className="section-shell">
          <SectionHeading eyebrow={t("properties.search_eyebrow")} title={pageTitle} description={pageDescription} />
          <div className="mt-10">
            <PropertyFilters
              filters={filters}
              onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
              onReset={() => setFilters(emptyFilters)}
              categories={categories}
            />
          </div>
        </div>
      </section>

      {/* Barre sticky résultats + tri + toggle vue */}
      <div className="sticky top-[119px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-night/95">
        <div className="section-shell flex flex-wrap items-center justify-between gap-2 py-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-ink dark:text-white">{sorted.length}</span>{" "}
            {sorted.length !== 1 ? t("properties.results_count_other") : t("properties.results_count_one")}
          </p>
          <div className="flex items-center gap-3">
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
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${view === "grid" ? "bg-forest text-white" : "text-slate-500 hover:text-bronze"}`}
              >
                <LayoutGrid size={14} />
                {t("properties.view_grid")}
              </button>
              <button
                type="button"
                onClick={() => setView("map")}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${view === "map" ? "bg-forest text-white" : "text-slate-500 hover:text-bronze"}`}
              >
                <Map size={14} />
                {t("properties.view_map")}
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
            <div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-3">
              {paginated.map((property) => (
                <PropertyCard key={property.id} property={property} compact />
              ))}
            </div>
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary gap-2 px-10"
                >
                  {t("properties.load_more")}
                  <span className="text-slate-400">({sorted.length - paginated.length} restants)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState title={t("properties.empty_title")} description={t("properties.empty_desc")} />
        )}
      </section>
    </div>
  );
};

export default PropertiesPage;
