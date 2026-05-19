import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Building2, FileCheck, Home, Key, LayoutDashboard, Users } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const services = [
  {
    icon: Home,
    title: "Vente immobilière",
    description: "Nous accompagnons nos clients dans la vente de leurs biens avec une stratégie de commercialisation sur mesure, une diffusion internationale et un suivi personnalisé jusqu'à la signature."
  },
  {
    icon: Key,
    title: "Location & gestion locative",
    description: "De la recherche du locataire idéal à la gestion quotidienne de votre bien, nous prenons en charge l'intégralité de votre investissement locatif avec rigueur et transparence."
  },
  {
    icon: Building2,
    title: "Estimation immobilière",
    description: "Notre expertise du marché local et notre connaissance des tendances nous permettent de vous offrir une estimation précise et réaliste de la valeur de votre bien."
  },
  {
    icon: Users,
    title: "Conseil & accompagnement",
    description: "Acheteurs, vendeurs ou investisseurs — nous vous conseillons à chaque étape de votre projet immobilier pour prendre les meilleures décisions."
  },
  {
    icon: FileCheck,
    title: "Suivi administratif & juridique",
    description: "Nous vous guidons dans toutes les démarches administratives et juridiques liées à votre transaction, en collaboration avec nos partenaires notaires et experts."
  },
  {
    icon: LayoutDashboard,
    title: "Gestion de patrimoine",
    description: "Valorisation, diversification et optimisation de votre patrimoine immobilier. Nos conseillers élaborent avec vous une stratégie adaptée à vos objectifs."
  }
];

const ServicesPage = () => (
  <div>
    <Helmet>
      <title>Nos services — Tentation Immobilière</title>
      <meta name="description" content="Vente, location, estimation, conseil juridique et gestion de patrimoine. Découvrez l'accompagnement complet de Tentation Immobilière." />
    </Helmet>

    {/* ── Hero ── */}
    <section className="bg-ink py-24 dark:bg-obsidian">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-8 bg-bronze/60" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">Ce que nous faisons</p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-5 font-display text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:max-w-3xl lg:text-7xl"
        >
          Nos services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-8 text-white/40"
        >
          Un accompagnement complet et sur mesure pour tous vos projets immobiliers — achat, vente, location et gestion de patrimoine.
        </motion.p>
      </div>
    </section>

    {/* ── Grille de services ── */}
    <section className="section-shell py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-[28px] border border-ink/6 bg-white p-8 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-bronze/30 hover:shadow-deep dark:border-white/6 dark:bg-carbon"
          >
            {/* Subtle bronze glow on hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bronze/0 to-bronze/0 transition-all duration-500 group-hover:from-bronze/5 group-hover:to-transparent rounded-[28px]" />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-bronze/20 bg-bronze/8 transition group-hover:border-bronze/40 group-hover:bg-bronze/15">
              <service.icon size={20} className="text-bronze" />
            </span>
            <div className="mt-5 h-px w-6 bg-bronze/30 transition-all duration-400 group-hover:w-10 group-hover:bg-bronze/60" />
            <h3 className="mt-4 font-display text-2xl text-ink dark:text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{service.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ── CTA contact ── */}
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="bg-white py-20 dark:bg-slate-900"
    >
      <div className="section-shell">
        <div className="rounded-[32px] bg-forest px-10 py-14 text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Parlons de votre projet</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Un projet ? Contactez-nous.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans vos démarches.
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold transition hover:border-bronze hover:text-bronze">
            Nous contacter
          </Link>
        </div>
      </div>
    </motion.section>
  </div>
);

export default ServicesPage;
