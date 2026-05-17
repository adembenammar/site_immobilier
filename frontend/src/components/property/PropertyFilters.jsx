import { RotateCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const PropertyFilters = ({ filters, onChange, onReset, categories }) => {
  const { t } = useTranslation();
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_auto]">
        {/* Ville */}
        <div className="col-span-2 md:col-span-1 xl:col-span-1">
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.city")}</label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="input-ui border-none bg-slate-50 pl-8 dark:bg-slate-800"
              placeholder={t("filters.city_placeholder")}
              value={filters.city}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>
        </div>

        {/* Prix min */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.price_min")}</label>
          <input
            className="input-ui border-none bg-slate-50 dark:bg-slate-800"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
          />
        </div>

        {/* Prix max */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.price_max")}</label>
          <input
            className="input-ui border-none bg-slate-50 dark:bg-slate-800"
            type="number"
            placeholder={t("filters.price_max_placeholder")}
            value={filters.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
          />
        </div>

        {/* Surface min */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.surface_min")}</label>
          <input
            className="input-ui border-none bg-slate-50 dark:bg-slate-800"
            type="number"
            placeholder="0"
            value={filters.minSurface}
            onChange={(e) => onChange("minSurface", e.target.value)}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.property_type")}</label>
          <select
            className="input-ui border-none bg-slate-50 dark:bg-slate-800"
            value={filters.type}
            onChange={(e) => onChange("type", e.target.value)}
          >
            <option value="">{t("filters.type_all")}</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Pièces */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-1.5">{t("filters.rooms")}</label>
          <select
            className="input-ui border-none bg-slate-50 dark:bg-slate-800"
            value={filters.rooms}
            onChange={(e) => onChange("rooms", e.target.value)}
          >
            <option value="">{t("filters.rooms_all")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 transition hover:border-bronze hover:text-bronze dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            >
              <RotateCcw size={13} />
              {t("filters.reset")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
