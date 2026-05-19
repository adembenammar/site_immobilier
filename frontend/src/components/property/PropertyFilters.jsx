import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, MapPin, RotateCcw, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ══════════════════════════════════════════
   Portal dropdown — rendered on <body> so
   no stacking context can clip it
══════════════════════════════════════════ */
const CustomSelect = ({ label, value, onChange, options, openId, activeId, setActiveId }) => {
  const open      = activeId === openId;
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = options.find((o) => o.value === value) || options[0];

  /* Calculate panel position from trigger rect */
  const recalc = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX, width: r.width });
  };

  /* Recalc whenever opening */
  useLayoutEffect(() => { if (open) recalc(); }, [open]);

  /* Close on outside click or scroll */
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) setActiveId(null);
    };
    const onScroll = () => setActiveId(null);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, setActiveId]);

  const panel = open && createPortal(
    <ul
      ref={panelRef}
      role="listbox"
      style={{
        position:  "absolute",
        top:       pos.top,
        left:      pos.left,
        minWidth:  Math.max(pos.width, 180),
        zIndex:    9999,
        margin:    0,
        padding:   "4px",
        listStyle: "none",
        background: "#0d1117",
        border:    "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.75)",
      }}
    >
      {/* Bronze top accent */}
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(201,169,110,0.45),transparent)", marginBottom: 4 }} />

      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <li key={opt.value} role="option" aria-selected={isActive} style={{ margin: 0, padding: 0 }}>
            <button
              type="button"
              onClick={() => { onChange(opt.value); setActiveId(null); }}
              style={{
                display:        "flex",
                width:          "100%",
                alignItems:     "center",
                justifyContent: "space-between",
                gap:            "24px",
                padding:        "8px 14px",
                margin:         0,
                border:         "none",
                borderRadius:   "10px",
                cursor:         "pointer",
                whiteSpace:     "nowrap",
                fontSize:       "13px",
                fontWeight:     500,
                lineHeight:     1.2,
                background:     isActive ? "#1a3a35" : "transparent",
                color:          isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                transition:     "background 0.1s, color 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              <span>{opt.label}</span>
              {isActive && (
                <Check size={11} color="#c9a96e" style={{ flexShrink: 0, opacity: 0.9 }} />
              )}
            </button>
          </li>
        );
      })}
    </ul>,
    document.body
  );

  return (
    <div className="group relative">
      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.38em] text-bronze/70">
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setActiveId(open ? null : openId)}
        className="flex w-full items-center justify-between border-b border-white/15 py-2.5 text-sm font-medium text-white/80 outline-none transition-colors duration-200 hover:border-white/30 hover:text-white"
      >
        <span className={value ? "text-white" : "text-white/40"}>{selected?.label}</span>
        <ChevronDown
          size={13}
          className={`flex-shrink-0 text-bronze/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Animated underline */}
      <div className={`absolute bottom-0 left-0 h-px bg-bronze transition-all duration-300 ${open ? "w-full" : "w-0"}`} />

      {panel}
    </div>
  );
};

/* ══════════════════════════════════════════
   Number input
══════════════════════════════════════════ */
const FilterInput = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="group relative">
    <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.38em] text-bronze/70">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-b border-white/15 bg-transparent py-2.5 text-sm font-medium text-white/80 outline-none placeholder:text-white/25 transition-colors duration-200 focus:border-bronze focus:text-white caret-bronze"
    />
    <div className="absolute bottom-0 left-0 h-px w-0 bg-bronze transition-all duration-300 group-focus-within:w-full" />
  </div>
);

/* ══════════════════════════════════════════
   Active filter chip
══════════════════════════════════════════ */
const Chip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1.5 rounded-full border border-bronze/25 bg-bronze/10 px-3 py-1 text-[10px] font-semibold text-bronze">
    {label}
    <button type="button" onClick={onRemove} className="text-bronze/50 hover:text-bronze transition">
      <X size={9} />
    </button>
  </span>
);

/* ════════════════════════════════════════════
   Main component
════════════════════════════════════════════ */
const PropertyFilters = ({ filters, onChange, onReset, categories, cities = [] }) => {
  const { t } = useTranslation();
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");
  const [activeDropdown, setActiveDropdown] = useState(null);

  /* City autocomplete */
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityInputRef   = useRef(null);
  const suggestionsRef = useRef(null);

  const suggestions = cities.filter(
    (c) =>
      c &&
      filters.city.length > 0 &&
      c.toLowerCase().includes(filters.city.toLowerCase()) &&
      c.toLowerCase() !== filters.city.toLowerCase()
  );

  useEffect(() => {
    const handler = (e) => {
      if (
        !cityInputRef.current?.contains(e.target) &&
        !suggestionsRef.current?.contains(e.target)
      ) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeOptions = [
    { value: "", label: t("filters.type_all") },
    ...(categories || []).map((c) => ({ value: c.slug, label: c.name })),
  ];

  const roomOptions = [
    { value: "", label: t("filters.rooms_all") },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" },
  ];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="overflow-hidden rounded-t-[28px]">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/50 to-transparent" />
      </div>

      <div className="grid gap-x-8 gap-y-6 p-5 sm:p-7 grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1fr_auto]">

        {/* ── Ville ── */}
        <div className="group relative col-span-2 md:col-span-1 xl:col-span-1">
          <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.38em] text-bronze/70">
            {t("filters.city")}
          </label>
          <div className="relative">
            <MapPin size={13} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-bronze/50" />
            <input
              ref={cityInputRef}
              className="w-full border-b border-white/15 bg-transparent py-2.5 pl-5 pr-7 text-sm font-medium text-white/80 outline-none placeholder:text-white/25 transition-colors duration-200 focus:border-bronze focus:text-white caret-bronze"
              placeholder={t("filters.city_placeholder")}
              value={filters.city}
              onChange={(e) => { onChange("city", e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              autoComplete="off"
            />
            {filters.city ? (
              <button
                type="button"
                onClick={() => { onChange("city", ""); setShowSuggestions(false); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
              >
                <X size={12} />
              </button>
            ) : (
              <Search size={12} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/20" />
            )}
          </div>
          <div className="absolute bottom-0 left-0 h-px w-0 bg-bronze transition-all duration-300 group-focus-within:w-full" />

          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-[calc(100%+10px)] z-[9999] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-[0_16px_48px_rgba(0,0,0,0.75)]"
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/40 to-transparent" />
              <div className="p-1">
                {suggestions.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => { onChange("city", city); setShowSuggestions(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-[13px] font-medium text-white/60 transition hover:bg-white/7 hover:text-white"
                  >
                    <MapPin size={11} className="flex-shrink-0 text-bronze/50" />
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Prix min ── */}
        <FilterInput label={t("filters.price_min")} type="number" placeholder="0"
          value={filters.minPrice} onChange={(v) => onChange("minPrice", v)} />

        {/* ── Prix max ── */}
        <FilterInput label={t("filters.price_max")} type="number" placeholder={t("filters.price_max_placeholder")}
          value={filters.maxPrice} onChange={(v) => onChange("maxPrice", v)} />

        {/* ── Surface min ── */}
        <FilterInput label={t("filters.surface_min")} type="number" placeholder="0 m²"
          value={filters.minSurface} onChange={(v) => onChange("minSurface", v)} />

        {/* ── Type de bien ── */}
        <CustomSelect
          label={t("filters.property_type")}
          value={filters.type}
          onChange={(v) => onChange("type", v)}
          options={typeOptions}
          openId="type"
          activeId={activeDropdown}
          setActiveId={setActiveDropdown}
        />

        {/* ── Pièces ── */}
        <CustomSelect
          label={t("filters.rooms")}
          value={filters.rooms}
          onChange={(v) => onChange("rooms", v)}
          options={roomOptions}
          openId="rooms"
          activeId={activeDropdown}
          setActiveId={setActiveDropdown}
        />

        {/* ── Réinitialiser ── */}
        <div className="flex items-end pb-0.5">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <RotateCcw size={12} className="transition-transform duration-300 group-hover:-rotate-45" />
              {t("filters.reset")}
            </button>
          ) : (
            <span className="block h-10" />
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-white/8 px-5 py-3 sm:px-7">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Filtres actifs :</span>
          {filters.city       && <Chip label={filters.city}                onRemove={() => onChange("city", "")} />}
          {filters.minPrice   && <Chip label={`≥ ${filters.minPrice} TND`}   onRemove={() => onChange("minPrice", "")} />}
          {filters.maxPrice   && <Chip label={`≤ ${filters.maxPrice} TND`}   onRemove={() => onChange("maxPrice", "")} />}
          {filters.minSurface && <Chip label={`≥ ${filters.minSurface} m²`}  onRemove={() => onChange("minSurface", "")} />}
          {filters.type       && <Chip label={filters.type}                onRemove={() => onChange("type", "")} />}
          {filters.rooms      && <Chip label={`${filters.rooms}+ pièces`}    onRemove={() => onChange("rooms", "")} />}
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
