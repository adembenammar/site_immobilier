import { Menu, Search, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";
import BrandLogo from "../common/BrandLogo";

/* ── Language toggle ── */
const LangToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "fr";
  const toggle = () => i18n.changeLanguage(current === "fr" ? "en" : "fr");
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 transition hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-400"
      aria-label="Switch language"
    >
      {current === "fr" ? (
        <><span className="text-bronze">FR</span><span className="opacity-40">/</span><span>EN</span></>
      ) : (
        <><span>FR</span><span className="opacity-40">/</span><span className="text-bronze">EN</span></>
      )}
    </button>
  );
};

/* ── Navigation data (translated) ── */
const useNavigation = () => {
  const { t } = useTranslation();
  return [
    {
      label: t("nav.buy"),
      href: "/properties?transactionType=sale",
      featured: { eyebrow: t("nav.buy_sections.destinations"), title: "Penthouse — Nice", description: "Vue mer panoramique, 280 m², terrasse privée.", cta: t("nav.buy"), image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.buy_sections.individuals"),  links: t("nav.buy_sections.individuals_links",  { returnObjects: true }) },
        { title: t("nav.buy_sections.destinations"), links: t("nav.buy_sections.destinations_links", { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.rent"),
      href: "/properties?transactionType=rent",
      featured: { eyebrow: t("nav.rent_sections.selection"), title: "Villa — Cannes", description: "Piscine à débordement, jardin paysager, 5 chambres.", cta: t("nav.rent"), image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.rent_sections.rentals"),   links: t("nav.rent_sections.rentals_links",   { returnObjects: true }) },
        { title: t("nav.rent_sections.selection"), links: t("nav.rent_sections.selection_links", { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.about"),
      href: "/about",
      featured: { eyebrow: "Tentation Immobilière", title: "Notre histoire", description: "Depuis 2008, l'immobilier de prestige avec une approche éditoriale.", cta: "En savoir plus", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.about_sections.house"),    links: t("nav.about_sections.house_links",    { returnObjects: true }) },
        { title: t("nav.about_sections.presence"), links: t("nav.about_sections.presence_links", { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.services"),
      href: "/services",
      featured: { eyebrow: t("nav.services_sections.lifestyle"), title: "Conciergerie", description: "Un service sur mesure pour votre bien de prestige.", cta: "Nos services", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.services_sections.conseil"),   links: t("nav.services_sections.conseil_links",   { returnObjects: true }) },
        { title: t("nav.services_sections.lifestyle"), links: t("nav.services_sections.lifestyle_links", { returnObjects: true }) },
      ],
    },
  ];
};

/* ── Header ── */
const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen]           = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout }          = useAuth();
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const isAdminArea               = location.pathname.startsWith("/admin");
  const mainNavigation            = useNavigation();

  // Close mega-menu on route change
  useEffect(() => { setActiveMenu(null); setOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/properties?city=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Backdrop overlay when mega-menu open */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-30 bg-ink/25 backdrop-blur-[2px]"
          onMouseEnter={() => setActiveMenu(null)}
        />
      )}

      <header className="relative sticky top-0 z-40 overflow-visible bg-primary/95 backdrop-blur-xl dark:bg-night/95">
        {/* Top bar */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="section-shell hidden items-center justify-between py-3 text-[11px] uppercase tracking-[0.28em] text-slate-500 lg:flex">
            <div className="flex items-center gap-4">
              <LangToggle />
              <span>TND</span>
              <span>m²</span>
            </div>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  className="w-56 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs text-slate-700 outline-none focus:border-bronze dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder={t("nav.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="text-bronze hover:text-bronze/80"><Search size={14} /></button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </form>
            ) : (
              <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex items-center gap-2 text-slate-600 transition hover:text-bronze dark:text-slate-300">
                <Search size={14} /> {t("nav.search_label")}
              </button>
            )}
            <div className="flex items-center gap-6"><ThemeToggle /></div>
          </div>
        </div>

        {/* Main nav bar */}
        <div className="section-shell flex items-center justify-between py-5">
          <BrandLogo />

          <nav className="hidden items-center gap-10 xl:flex">
            {mainNavigation.map((item) => (
              <div
                key={item.label}
                className="relative py-2"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <NavLink
                  to={item.href}
                  className={`border-b-2 pb-1 text-[15px] tracking-[0.08em] transition ${
                    activeMenu === item.label
                      ? "border-bronze text-bronze"
                      : "border-transparent text-slate-700 hover:border-bronze hover:text-bronze dark:text-slate-100"
                  }`}
                >
                  {item.label}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            {isAdminArea && user && (
              <button type="button" onClick={logout} className="btn-primary">{t("nav.logout")}</button>
            )}
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <LangToggle />
            <ThemeToggle />
            <button type="button" onClick={() => setOpen((v) => !v)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* ── Mega-menu panel (desktop only) ── */}
        {mainNavigation.map((item) =>
          activeMenu === item.label ? (
            <div
              key={item.label}
              className="mega-menu-enter absolute left-0 right-0 top-full z-40 border-b border-slate-200/60 bg-white shadow-[0_40px_80px_rgba(21,21,21,0.12)] dark:border-slate-800/60 dark:bg-night"
              onMouseEnter={() => setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="section-shell grid grid-cols-[1fr_300px] gap-16 py-12">
                {/* Left — sections */}
                <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                  {item.sections.map((section) => (
                    <div key={section.title}>
                      <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-bronze">{section.title}</p>
                      <div className="space-y-3">
                        {(Array.isArray(section.links) ? section.links : []).map((link) => (
                          <Link
                            key={link}
                            to={item.href}
                            onClick={() => setActiveMenu(null)}
                            className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-bronze dark:text-slate-300"
                          >
                            <span className="inline-block w-0 overflow-hidden text-bronze opacity-0 transition-all duration-200 group-hover:w-4 group-hover:opacity-100">→</span>
                            {link}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right — featured card */}
                <div className="overflow-hidden rounded-[24px]">
                  <div
                    className="relative h-full min-h-[220px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.featured.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-mist">{item.featured.eyebrow}</p>
                      <h3 className="mt-2 font-display text-2xl text-white">{item.featured.title}</h3>
                      <p className="mt-1 text-sm text-white/70">{item.featured.description}</p>
                      <Link
                        to={item.href}
                        onClick={() => setActiveMenu(null)}
                        className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                      >
                        {item.featured.cta} <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}

        {/* ── Mobile menu ── */}
        {open && (
          <div className="section-shell space-y-6 border-t border-slate-200 pb-5 pt-4 dark:border-slate-800 xl:hidden">
            {mainNavigation.map((item) => (
              <div key={item.label}>
                <NavLink to={item.href} className="block text-sm uppercase tracking-[0.22em] text-slate-700 dark:text-slate-200">
                  {item.label}
                </NavLink>
                <div className="mt-3 space-y-2 pl-3">
                  {item.sections.flatMap((s) => Array.isArray(s.links) ? s.links : []).map((link) => (
                    <p key={link} className="text-sm text-slate-500 dark:text-slate-400">{link}</p>
                  ))}
                </div>
              </div>
            ))}
            {isAdminArea && user && (
              <button type="button" onClick={logout} className="btn-primary">{t("nav.logout")}</button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
