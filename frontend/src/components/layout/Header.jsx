import { Heart, Menu, Search, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
      className="rounded-full border border-current/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] transition hover:border-bronze hover:text-bronze"
    >
      {current === "fr"
        ? <><span className="text-bronze">FR</span><span className="opacity-30 mx-0.5">/</span><span>EN</span></>
        : <><span>FR</span><span className="opacity-30 mx-0.5">/</span><span className="text-bronze">EN</span></>
      }
    </button>
  );
};

/* ── Nav data ── */
const useNavigation = () => {
  const { t } = useTranslation();
  return [
    {
      label: t("nav.buy"), href: "/properties?transactionType=sale",
      featured: { eyebrow: "Destinations", title: "Penthouse — Nice", description: "Vue mer panoramique, 280 m², terrasse privée.", cta: t("nav.buy"), image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.buy_sections.individuals"),  links: t("nav.buy_sections.individuals_links",  { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.rent"), href: "/properties?transactionType=rent",
      featured: { eyebrow: "Sélection", title: "Villa — Cannes", description: "Piscine à débordement, jardin paysager, 5 chambres.", cta: t("nav.rent"), image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.rent_sections.rentals"),   links: t("nav.rent_sections.rentals_links",   { returnObjects: true }) },
        { title: t("nav.rent_sections.selection"), links: t("nav.rent_sections.selection_links", { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.about"), href: "/about",
      featured: { eyebrow: "Tentation Immobilière", title: "Notre histoire", description: "Depuis 2008, l'immobilier de prestige avec une approche éditoriale.", cta: "En savoir plus", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.about_sections.house"),    links: t("nav.about_sections.house_links",    { returnObjects: true }) },
        { title: t("nav.about_sections.presence"), links: t("nav.about_sections.presence_links", { returnObjects: true }) },
      ],
    },
    {
      label: t("nav.services"), href: "/services",
      featured: { eyebrow: "Art de vivre", title: "Conciergerie", description: "Un service sur mesure pour votre bien de prestige.", cta: "Nos services", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80" },
      sections: [
        { title: t("nav.services_sections.conseil"),   links: t("nav.services_sections.conseil_links",   { returnObjects: true }) },
        { title: t("nav.services_sections.lifestyle"), links: t("nav.services_sections.lifestyle_links", { returnObjects: true }) },
      ],
    },
  ];
};

/* ── Favorites dot badge ── */
const FavDot = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => {
      try {
        setCount(JSON.parse(localStorage.getItem("tentation-favorites") || "[]").length);
      } catch { setCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    /* also poll lightly so heart toggles on same tab update the dot */
    const id = setInterval(read, 1000);
    return () => { window.removeEventListener("storage", read); clearInterval(id); };
  }, []);
  if (!count) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-bronze text-[9px] font-bold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
};

/* ══════════════════════════════════════════════ */
const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen]             = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTimeout                 = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled]     = useState(false);
  const { user, logout }            = useAuth();
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const isAdminArea                 = location.pathname.startsWith("/admin");
  const mainNavigation              = useNavigation();

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => { setActiveMenu(null); setOpen(false); }, [location.pathname]);

  /* Mega-menu open/close with a short delay so the mouse can travel
     from a nav item to the mega-menu without the menu flickering shut. */
  const openMenu = (label) => {
    clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  };
  const scheduleClose = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/properties?city=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  /* Header bg logic:
     - On hero pages (home / properties): transparent at top → frosted on scroll
     - Admin / other: always frosted */
  const isHeroPage = location.pathname === "/";
  const frosted = scrolled || !isHeroPage || open;

  return (
    <>
      {/* Backdrop when mega-menu open — pointer-events-none so it never
          intercepts clicks on nav links or page content behind it */}
      {activeMenu && (
        <div className="pointer-events-none fixed inset-0 z-[998] bg-ink/20 backdrop-blur-[2px]" />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-[999] w-full overflow-visible transition-all duration-300 ${
          frosted
            ? "border-b border-ink/8 bg-white/95 backdrop-blur-xl shadow-soft dark:border-white/6 dark:bg-night/95"
            : "bg-transparent"
        }`}
      >
        {/* ── Top utility bar (desktop) ── */}
        <div className={`border-b transition-all duration-300 ${frosted ? "border-ink/6 dark:border-white/6" : "border-white/10"}`}>
          <div className="section-shell hidden items-center justify-between py-2.5 lg:flex">
            <div className={`flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.25em] transition-colors ${frosted ? "text-ink/40 dark:text-white/40" : "text-white/80"}`}>
              <LangToggle />
              <span>TND</span>
              <span>m²</span>
            </div>

            {/* Global search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  className={`w-64 rounded-full border px-4 py-1.5 text-xs outline-none transition caret-bronze ${
                    frosted
                      ? "border-ink/15 bg-ink/5 text-ink placeholder:text-ink/35 focus:border-bronze/50 dark:border-white/15 dark:bg-white/5 dark:text-white"
                      : "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:border-bronze/60"
                  }`}
                  placeholder={t("nav.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" aria-label="Rechercher" className="cursor-pointer text-bronze"><Search size={14} /></button>
                <button type="button" aria-label="Fermer la recherche" onClick={() => setSearchOpen(false)} className="cursor-pointer opacity-50 hover:opacity-100"><X size={14} /></button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`inline-flex cursor-pointer items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] transition hover:text-bronze ${frosted ? "text-ink/40 dark:text-white/40" : "text-white/60"}`}
              >
                <Search size={13} /> {t("nav.search_label")}
              </button>
            )}

            <div className="flex items-center gap-4">
              <ThemeToggle frosted={frosted} />
            </div>
          </div>
        </div>

        {/* ── Main nav ── */}
        <div className="section-shell flex items-center justify-between py-4">
          <BrandLogo frosted={frosted} />

          <nav className="hidden items-center gap-1 xl:flex">
            {mainNavigation.map((item) => (
              <div
                key={item.label}
                className="relative cursor-pointer"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <NavLink
                  to={item.href}
                  className={`relative rounded-xl px-4 py-2.5 text-[14px] font-medium tracking-wide transition-all duration-200 ${
                    activeMenu === item.label
                      ? frosted
                        ? "bg-ink/5 text-bronze dark:bg-white/5"
                        : "bg-white/10 text-bronze"
                      : frosted
                      ? "text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-white/70 dark:hover:text-white"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            {isAdminArea && user && (
              <button type="button" onClick={logout} className="btn-primary text-xs px-5 py-2.5">
                {t("nav.logout")}
              </button>
            )}
            {!isAdminArea && (
              <>
                {/* Favorites icon */}
                <Link
                  to="/favorites"
                  aria-label="Mes favoris"
                  className={`relative rounded-full border p-2.5 transition-all duration-200 ${
                    frosted
                      ? "border-ink/15 text-ink/60 hover:border-bronze hover:text-bronze dark:border-white/15 dark:text-white/60"
                      : "border-white/30 text-white/80 hover:border-white hover:text-white"
                  }`}
                >
                  <Heart size={16} />
                  {/* dot badge if localStorage has favorites */}
                  <FavDot />
                </Link>
                <Link to="/properties" className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  frosted
                    ? "border-ink/15 text-ink hover:border-bronze hover:text-bronze dark:border-white/15 dark:text-white"
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}>
                  Voir les biens
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5 xl:hidden">
            <LangToggle />
            <ThemeToggle frosted={frosted} />
            <button
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
              className={`cursor-pointer rounded-xl p-2 transition ${frosted ? "text-ink dark:text-white" : "text-white"}`}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mega-menu ── */}
        {mainNavigation.map((item) =>
          activeMenu === item.label ? (
            <div
              key={item.label}
              className="mega-menu-enter absolute left-0 right-0 top-full z-[999] border-b border-ink/8 bg-white shadow-[0_40px_80px_rgba(21,21,21,0.10)] dark:border-white/8 dark:bg-night"
              onMouseEnter={() => openMenu(item.label)}
              onMouseLeave={scheduleClose}
            >
              {/* Bronze accent line at top */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/40 to-transparent" />

              <div className="section-shell grid grid-cols-[1fr_320px] gap-16 py-12">
                {/* Links */}
                <div className="grid grid-cols-2 gap-x-20 gap-y-10">
                  {item.sections.map((section) => (
                    <div key={section.title}>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="h-px w-5 bg-bronze/50" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-bronze/80">{section.title}</p>
                      </div>
                      <div className="space-y-0.5">
                        {(Array.isArray(section.links) ? section.links : []).map((link) => (
                          <Link key={link} to={item.href} onClick={() => setActiveMenu(null)}
                            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink/60 transition-all duration-200 hover:bg-bronze/5 hover:text-ink dark:text-white/45 dark:hover:bg-white/5 dark:hover:text-white">
                            <span className="flex items-center gap-2.5">
                              <span className="h-1 w-1 rounded-full bg-bronze/35 transition-all duration-200 group-hover:w-3 group-hover:rounded-none group-hover:bg-bronze" />
                              {link}
                            </span>
                            <ArrowRight size={11} className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-bronze" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured card */}
                <div className="group overflow-hidden rounded-3xl shadow-deep">
                  <div className="relative h-full min-h-[280px] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]" style={{ backgroundImage: `url(${item.featured.image})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/5" />
                    {/* bronze accent bar */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-bronze/0 via-bronze/60 to-bronze/0" />
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/80">{item.featured.eyebrow}</p>
                      <h3 className="font-display text-2xl font-light leading-snug text-white">{item.featured.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/55">{item.featured.description}</p>
                      <Link to={item.href} onClick={() => setActiveMenu(null)}
                        className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:border-bronze hover:bg-bronze hover:text-white">
                        {item.featured.cta} <ArrowRight size={10} />
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
          <div className="border-t border-ink/8 bg-white/95 px-4 pb-6 pt-4 backdrop-blur-xl dark:border-white/6 dark:bg-night/95 xl:hidden">
            <div className="space-y-1">
              {mainNavigation.map((item) => (
                <NavLink key={item.label} to={item.href}
                  className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-ink/70 transition hover:bg-ink/5 hover:text-ink dark:text-white/60 dark:hover:text-white">
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/favorites"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-ink/70 transition hover:bg-ink/5 hover:text-ink dark:text-white/60 dark:hover:text-white"
              >
                <Heart size={15} className="text-bronze" />
                Mes favoris
              </NavLink>
            </div>
            {isAdminArea && user && (
              <button type="button" onClick={logout} className="btn-primary mt-4 w-full">{t("nav.logout")}</button>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
