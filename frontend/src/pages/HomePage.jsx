import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch";
import SectionHeading from "../components/common/SectionHeading";
import LoadingState from "../components/common/LoadingState";
import PropertyCard from "../components/property/PropertyCard";
import api from "../api/client";

const expertiseImages = [
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
];

const lifestyleImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
];

const newsImages = [
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
];

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: featured, loading } = useFetch("/properties/featured");
  const [contactForm, setContactForm] = useState({ fullName: "", email: "", phone: "", message: "" });
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState({ city: "", type: "", minPrice: "", rooms: "" });

  const heroProperties = useMemo(() => featured.slice(0, 3), [featured]);

  /* Translated content arrays */
  const expertises = [
    { title: t("nav.buy_sections.individuals_links.0") || "Immobilier de prestige", image: expertiseImages[0] },
    { title: t("nav.buy_sections.individuals_links.2") || "Propriétés & châteaux",  image: expertiseImages[1] },
    { title: t("nav.rent_sections.rentals_links.1") || "Locations saisonnières",    image: expertiseImages[2] },
    { title: t("nav.rent_sections.rentals_links.0") || "Locations longue durée",    image: expertiseImages[3] },
    { title: t("nav.buy_sections.individuals_links.1") || "Programmes neufs",       image: expertiseImages[4] },
    { title: t("nav.services_sections.conseil_links.0") || "Immobilier professionnel", image: expertiseImages[5] },
  ];

  const lifestyles = [
    { title: t("nav.services_sections.lifestyle_links.0"), image: lifestyleImages[0] },
    { title: t("nav.services_sections.lifestyle_links.1"), image: lifestyleImages[1] },
    { title: "Yachting",                                   image: lifestyleImages[2] },
    { title: t("nav.services_sections.lifestyle_links.2"), image: lifestyleImages[3] },
  ];

  const news = [
    { date: "Mercredi 06 mai 2026", category: t("home.featured_eyebrow"),    title: t("home.news_title"),                                            image: newsImages[0] },
    { date: "Mardi 21 avril 2026",  category: t("home.news_eyebrow"),        title: t("home.about_title").substring(0, 60) + "…",                   image: newsImages[1] },
    { date: "Lundi 08 mars 2026",   category: t("nav.services_sections.lifestyle"), title: t("home.sell_title").substring(0, 60) + "…",             image: newsImages[2] },
  ];

  const handleContact = async (event) => {
    event.preventDefault();
    try {
      await api.post("/contacts", contactForm);
      setFeedback(t("home.form_success"));
      setContactForm({ fullName: "", email: "", phone: "", message: "" });
    } catch (error) {
      const errs = error.response?.data?.errors;
      setFeedback(errs?.length ? errs.map((e) => e.msg).join(" • ") : t("home.form_error"));
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-primary dark:bg-night">
      <section className="section-shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(18,42,39,0.72),rgba(18,42,39,0.88)),url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-8 text-white sm:p-12">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.38em] text-mist">{t("home.hero_eyebrow")}</p>
              <h1 className="mt-6 font-display text-5xl leading-tight sm:text-6xl">
                {t("home.hero_title")}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
                {t("home.hero_description")}
              </p>
            </motion.div>

            <form onSubmit={handleSearch} className="mt-10 rounded-[30px] bg-white p-4 text-slate-800 shadow-soft">
              <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
                <input className="input-ui border-none bg-slate-50" placeholder={t("home.search_city")} value={search.city} onChange={(e) => setSearch((prev) => ({ ...prev, city: e.target.value }))} />
                <select className="input-ui border-none bg-slate-50" value={search.type} onChange={(e) => setSearch((prev) => ({ ...prev, type: e.target.value }))}>
                  <option value="">{t("home.search_type")}</option>
                  <option value="villa">{t("home.type_villa")}</option>
                  <option value="apartment">{t("home.type_apartment")}</option>
                  <option value="penthouse">{t("home.type_penthouse")}</option>
                  <option value="townhouse">{t("home.type_townhouse")}</option>
                </select>
                <input className="input-ui border-none bg-slate-50" type="number" placeholder={t("home.search_price_min")} value={search.minPrice} onChange={(e) => setSearch((prev) => ({ ...prev, minPrice: e.target.value }))} />
                <select className="input-ui border-none bg-slate-50" value={search.rooms} onChange={(e) => setSearch((prev) => ({ ...prev, rooms: e.target.value }))}>
                  <option value="">{t("home.search_rooms")}</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
                <button type="submit" className="btn-primary h-full gap-2 px-7">
                  <Search size={16} />
                  {t("home.search_button")}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-5">
            {heroProperties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="group overflow-hidden rounded-[28px] bg-white shadow-soft dark:bg-slate-900"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={property.cover_image} alt={property.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/75">{property.city}</p>
                    <p className="mt-2 font-display text-2xl text-white">{property.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="section-shell py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-bronze">{t("home.about_eyebrow")}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
              {t("home.about_title")}
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
            <p>{t("home.about_p1")}</p>
            <p>{t("home.about_p2")}</p>
            <Link to="/properties" className="btn-secondary gap-2">
              {t("home.about_cta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section-shell py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeading
          eyebrow={t("home.featured_eyebrow")}
          title={t("home.featured_title")}
          description={t("home.featured_description")}
        />
        <div className="mt-12">
          {loading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {featured.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        className="section-shell py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeading
          eyebrow={t("home.expertises_eyebrow")}
          title={t("home.expertises_title")}
          description={t("home.expertises_description")}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {expertises.map((item, i) => (
            <motion.article
              key={item.image}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="group overflow-hidden rounded-[28px] bg-white shadow-soft dark:bg-slate-900"
            >
              <div className="relative h-72">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-6 bottom-6">
                  <h3 className="font-display text-3xl text-white">{item.title}</h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="section-shell py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="rounded-[32px] bg-white px-8 py-12 shadow-soft dark:bg-slate-900 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-bronze">{t("home.sell_eyebrow")}</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
                {t("home.sell_title")}
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
                {t("home.sell_description")}
              </p>
              <a href="#contact" className="btn-primary mt-8">
                {t("home.sell_cta")}
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {lifestyles.map((item) => (
                <article key={item.image} className="overflow-hidden rounded-[24px] bg-primary dark:bg-night">
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-display text-2xl text-ink dark:text-white">{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section-shell py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeading
          eyebrow={t("home.news_eyebrow")}
          title={t("home.news_title")}
          description={t("home.news_description")}
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {news.map((item, i) => (
            <motion.article
              key={item.image}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="overflow-hidden rounded-[28px] bg-white shadow-soft dark:bg-slate-900"
            >
              <img src={item.image} alt={item.title} className="h-72 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-bronze">{item.date} · {item.category}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-ink dark:text-white">{item.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="section-shell py-16"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-bronze">{t("home.newsletter_eyebrow")}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
              {t("home.newsletter_title")}
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
              {t("home.newsletter_description")}
            </p>
          </div>

          <form onSubmit={handleContact} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-ui" placeholder={t("home.form_name")} value={contactForm.fullName} onChange={(e) => setContactForm((prev) => ({ ...prev, fullName: e.target.value }))} />
              <input className="input-ui" placeholder={t("home.form_email")} type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} />
              <input className="input-ui" placeholder={t("home.form_phone")} value={contactForm.phone} onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))} />
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {t("home.form_response")}
              </div>
            </div>
            <textarea className="input-ui mt-4 min-h-36" placeholder={t("home.form_project")} value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} />
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">{feedback}</span>
              <button type="submit" className="btn-primary">{t("home.form_send")}</button>
            </div>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
