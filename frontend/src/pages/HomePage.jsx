import { motion } from "framer-motion";
import { ArrowRight, Search, MapPin, Bed, Maximize2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import SectionHeading from "../components/common/SectionHeading";
import LoadingState from "../components/common/LoadingState";
import PropertyCard from "../components/property/PropertyCard";
import api from "../api/client";

/* ── Fade helpers ── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const expertiseImages = [
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
];

const newsItems = [
  { date: "06 mai 2026", category: "Découverte", title: "Où investir dans une résidence secondaire en 2026", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80" },
  { date: "21 avril 2026", category: "Actualité",  title: "Les quartiers les plus demandés par notre clientèle", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80" },
  { date: "08 mars 2026", category: "Art de vivre", title: "L'importance de l'intérieur dans la valorisation d'un bien", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
];

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: featured, loading } = useFetch("/properties/featured", []);
  const [search, setSearch] = useState({ city: "", type: "", transactionType: "" });
  const [contactForm, setContactForm] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [feedback, setFeedback]       = useState("");
  const [feedbackOk, setFeedbackOk]   = useState(false);

  const heroProperties = useMemo(() => featured.slice(0, 3), [featured]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contacts", contactForm);
      setFeedback(t("home.form_success"));
      setFeedbackOk(true);
      setContactForm({ fullName: "", email: "", phone: "", message: "" });
    } catch (error) {
      const errs = error.response?.data?.errors;
      setFeedback(errs?.length ? errs.map((e) => e.msg).join(" • ") : t("home.form_error"));
      setFeedbackOk(false);
    }
  };

  return (
    <div className="bg-primary dark:bg-night">

      {/* ══════════════════════════════════════════
          HERO — Full-screen
      ══════════════════════════════════════════ */}
      {/* Hero pulled up behind the sticky header so the transparent navbar
          overlays the dark hero image instead of the white page background.
          Negative margins match the header height: ~72px mobile / ~117px desktop. */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury property"
            className="h-full w-full object-cover"
          />
          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
          {/* Top darkening so white nav text is readable over the hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full pb-16 pt-32">
          <div className="section-shell">
            <div className="max-w-4xl">
              <motion.div
                initial="hidden"
                animate="show"
                variants={stagger}
              >
                <motion.p variants={fadeUp} className="eyebrow mb-4 text-white/60">
                  {t("home.hero_eyebrow")}
                </motion.p>
                <motion.h1
                  variants={fadeUp}
                  className="font-display text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[5.5rem] xl:text-[7rem]"
                >
                  {t("home.hero_title_line1")}<br />
                  <span className="italic text-bronze">{t("home.hero_title_italic")}</span><br />
                  {t("home.hero_title_line3")}
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-7 text-white/55">
                  {t("home.hero_description")}
                </motion.p>

                {/* ── Search bar ── */}
                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSearch}
                  className="mt-10 flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/12 bg-white/10 p-3 backdrop-blur-xl sm:flex-row"
                >
                  {/* City */}
                  <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5">
                    <MapPin size={15} className="flex-shrink-0 text-bronze" />
                    <input
                      className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/45 outline-none"
                      placeholder={t("home.search_city_placeholder")}
                      value={search.city}
                      onChange={(e) => setSearch((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  {/* Type */}
                  <select
                    className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 outline-none"
                    value={search.transactionType}
                    onChange={(e) => setSearch((p) => ({ ...p, transactionType: e.target.value }))}
                  >
                    <option value="" className="text-ink">{t("home.search_transaction")}</option>
                    <option value="sale" className="text-ink">{t("home.search_sale")}</option>
                    <option value="rent" className="text-ink">{t("home.search_rent")}</option>
                  </select>
                  <select
                    className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 outline-none"
                    value={search.type}
                    onChange={(e) => setSearch((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="" className="text-ink">{t("home.search_type")}</option>
                    <option value="villa" className="text-ink">{t("home.type_villa")}</option>
                    <option value="apartment" className="text-ink">{t("home.type_apartment")}</option>
                    <option value="penthouse" className="text-ink">{t("home.type_penthouse")}</option>
                  </select>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-bronze px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-bronze/90">
                    <Search size={15} /> {t("home.search_button")}
                  </button>
                </motion.form>

                {/* Stats */}
                <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {[
                    { value: `${featured.length}+`, label: t("home.stats_active") },
                    { value: "98%",                  label: t("home.stats_satisfied") },
                    { value: "15+",                  label: t("home.stats_years") },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-4">
                      {i > 0 && <div className="hidden h-8 w-px bg-white/12 sm:block" />}
                      <div>
                        <p className="font-display text-3xl font-light text-white sm:text-4xl">{s.value}</p>
                        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/35">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          FEATURED PROPERTIES
      ══════════════════════════════════════════ */}
      <motion.section
        className="py-24 bg-sand dark:bg-carbon"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-shell">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t("home.featured_eyebrow")}
            title={t("home.featured_title")}
            description=""
          />
          <Link to="/properties" className="btn-secondary hidden gap-2 sm:inline-flex">
            Tout voir <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10">
          {loading ? <LoadingState /> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          ABOUT BAND
      ══════════════════════════════════════════ */}
      <motion.section
        className="overflow-hidden rounded-none bg-ink py-24 dark:bg-obsidian"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-bronze/70">Tentation Immobilière</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl">
              {t("home.about_title")}
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-base leading-8 text-white/55">{t("home.about_p1")}</p>
            <p className="text-base leading-8 text-white/55">{t("home.about_p2")}</p>
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-bronze hover:text-bronze/80 transition">
              {t("home.about_cta")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          EXPERTISES GRID
      ══════════════════════════════════════════ */}
      <motion.section
        className="section-shell py-24"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading
          eyebrow={t("home.expertises_eyebrow")}
          title={t("home.expertises_title")}
          description={t("home.expertises_description")}
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {["Immobilier de prestige", "Propriétés & châteaux", "Locations saisonnières", "Locations longue durée", "Programmes neufs", "Conciergerie"].map((title, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "col-span-2 md:col-span-1 row-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-full min-h-[340px]" : "h-52"}`}>
                <img src={expertiseImages[i]} alt={title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-display text-2xl font-light text-white">{title}</h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          SELL BAND
      ══════════════════════════════════════════ */}
      <motion.section
        className="section-shell py-24"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-forest to-forest/80 p-px dark:from-carbon dark:to-carbon/80">
          <div className="rounded-[calc(2rem-1px)] bg-gradient-to-br from-ink/50 to-transparent p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="eyebrow text-bronze/70">{t("home.sell_eyebrow")}</p>
                <h2 className="mt-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl">
                  {t("home.sell_title")}
                </h2>
                <p className="mt-5 text-base leading-7 text-white/55">{t("home.sell_description")}</p>
                <a href="#contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-bronze px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-bronze/90">
                  {t("home.sell_cta")} <ArrowRight size={14} />
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Bed,       label: "Résidentiel" },
                  { icon: Maximize2, label: "Espaces XXL" },
                  { icon: MapPin,    label: "Emplacements premium" },
                  { icon: Search,    label: "Matching acquereurs" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-bronze/15">
                      <Icon size={16} className="text-bronze" />
                    </div>
                    <p className="text-sm font-medium text-white/80">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          NEWS
      ══════════════════════════════════════════ */}
      <motion.section
        className="section-shell py-24"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow={t("home.news_eyebrow")} title={t("home.news_title")} description={t("home.news_description")} />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {newsItems.map((item, i) => (
            <motion.article key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-deep ring-1 ring-white/5"
              style={{ height: "360px" }}
            >
              <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/8" />
              <div className="absolute inset-0 bg-bronze/0 transition-colors duration-500 group-hover:bg-bronze/6" />
              <div className="absolute inset-x-6 bottom-6">
                <div className="mb-3 h-px w-8 bg-bronze/60 transition-all duration-500 group-hover:w-14 group-hover:bg-bronze" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.38em] text-white/40">{item.date} · {item.category}</p>
                <h3 className="mt-2 font-display text-2xl font-light leading-snug text-white">{item.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <motion.section id="contact"
        className="bg-ink pb-0 pt-0 dark:bg-obsidian"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />
        <div className="section-shell py-24">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-bronze/60" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">{t("home.newsletter_eyebrow")}</p>
              </div>
              <h2 className="mt-6 font-display text-5xl font-light leading-[1.08] text-white sm:text-6xl">
                {t("home.newsletter_title")}
              </h2>
              <p className="mt-6 text-base leading-8 text-white/35">
                {t("home.newsletter_description")}
              </p>
              <div className="mt-10 space-y-4 text-sm text-white/25">
                {["Réponse sous 24h ouvrées", "Consultation confidentielle", "Aucun engagement"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-px w-4 bg-bronze/40" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleContact} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20 caret-bronze"
                  placeholder={t("home.form_name")}
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm((p) => ({ ...p, fullName: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20 caret-bronze"
                  type="email"
                  placeholder={t("home.form_email")}
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20 caret-bronze"
                  placeholder={t("home.form_phone")}
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <div className="flex items-center rounded-2xl border border-bronze/20 bg-bronze/8 px-4 py-3.5 text-sm text-bronze/60">
                  {t("home.form_response")}
                </div>
              </div>
              <textarea
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20 caret-bronze min-h-32"
                placeholder={t("home.form_project")}
                value={contactForm.message}
                onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
              />
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                {feedback && <span className={`text-sm ${feedbackOk ? "text-emerald-400" : "text-red-400"}`}>{feedback}</span>}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-bronze px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-bronze/90 sm:w-auto"
                >
                  {t("home.form_send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
