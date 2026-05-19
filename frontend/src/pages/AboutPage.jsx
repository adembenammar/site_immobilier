import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Award, Eye, ShieldCheck } from "lucide-react";

/* ── Animated counter ── */
const AnimatedCounter = ({ value, duration = 1.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const raw = String(value);
    const num = parseInt(raw.replace(/\D/g, ""), 10);
    const suffix = raw.replace(/[0-9]/g, "");
    if (isNaN(num)) { setDisplay(raw); return; }
    const steps = 60;
    const ms = (duration * 1000) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += num / steps;
      if (current >= num) { setDisplay(`${num}${suffix}`); clearInterval(timer); }
      else setDisplay(`${Math.floor(current)}${suffix}`);
    }, ms);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
};

const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Chaque bien présenté répond à des critères rigoureux de qualité, d'emplacement et de prestige. Nous n'acceptons que ce qui correspond à nos standards éditoriaux les plus exigeants."
  },
  {
    icon: ShieldCheck,
    title: "Discrétion",
    description: "La confidentialité est au cœur de notre relation client. Vos projets, vos transactions et votre patrimoine sont traités avec la plus totale discrétion."
  },
  {
    icon: Eye,
    title: "Expertise",
    description: "Une connaissance approfondie des marchés locaux et internationaux, enrichie par plus de 15 ans d'expérience dans l'immobilier de prestige."
  }
];

const AboutPage = () => (
  <div>
    <Helmet>
      <title>À propos — Tentation Immobilière</title>
      <meta name="description" content="Découvrez Tentation Immobilière : une agence de prestige fondée sur l'excellence, la discrétion et l'expertise dans l'immobilier haut de gamme." />
    </Helmet>

    {/* ── Hero ── */}
    <section className="bg-ink py-24 dark:bg-obsidian">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-8 bg-bronze/60" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">Notre maison</p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-5 font-display text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:max-w-3xl lg:text-7xl"
        >
          À propos de nous
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base leading-8 text-white/40"
        >
          Une agence immobilière de référence, fondée sur l'exigence et la passion de l'immobilier d'exception.
        </motion.p>
      </div>
    </section>

    {/* ── Notre histoire ── */}
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="section-shell py-20"
    >
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div variants={fadeUp}>
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Notre histoire</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
            Quinze ans au service de l'immobilier d'exception
          </h2>
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
          <p>
            Fondée en 2008, Tentation Immobilière est née de la conviction qu'un bien d'exception mérite une présentation d'exception. Dès ses débuts, l'agence a adopté une approche résolument éditoriale, s'inspirant des codes des grandes maisons internationales pour mettre en valeur chaque propriété.
          </p>
          <p>
            Aujourd'hui, notre réseau couvre les destinations les plus prisées et notre équipe de conseillers accompagne une clientèle exigeante dans tous ses projets — de la résidence principale à l'investissement patrimonial de prestige.
          </p>
        </motion.div>
      </div>
    </motion.section>

    {/* ── Nos valeurs ── */}
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Nos valeurs</p>
          <h2 className="mt-4 font-display text-4xl text-ink dark:text-white">Ce qui nous guide</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-[28px] border border-ink/6 bg-white p-8 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-bronze/30 hover:shadow-deep dark:border-white/6 dark:bg-carbon"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-bronze/0 to-bronze/0 transition-all duration-500 group-hover:from-bronze/5 group-hover:to-transparent" />
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-bronze/20 bg-bronze/8 transition group-hover:border-bronze/40 group-hover:bg-bronze/15">
                <item.icon size={19} className="text-bronze" />
              </span>
              <div className="mt-5 h-px w-6 bg-bronze/30 transition-all duration-400 group-hover:w-10 group-hover:bg-bronze/60" />
              <p className="mt-4 font-display text-2xl text-ink dark:text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Chiffres clés ── */}
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="section-shell py-20"
    >
      <div className="grid gap-8 rounded-[32px] bg-ink px-10 py-16 text-white sm:grid-cols-3 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bronze/5 via-transparent to-transparent" />
        {[
          { value: "15+",  label: "Années d'expérience" },
          { value: "98%",  label: "Clients satisfaits" },
          { value: "500+", label: "Transactions réalisées" },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <p className="font-display text-5xl font-light text-bronze">
              <AnimatedCounter value={s.value} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/60">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* ── CTA ── */}
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="bg-white pb-24 dark:bg-slate-900"
    >
      <div className="section-shell text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Travailler ensemble</p>
        <h2 className="mt-4 font-display text-4xl text-ink dark:text-white sm:text-5xl">Démarrez votre projet</h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">
          Nos conseillers sont disponibles pour répondre à vos questions et vous accompagner dans chaque étape de votre projet immobilier.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/properties" className="btn-primary gap-2">Voir les biens</Link>
          <Link to="/services" className="btn-secondary gap-2">Nos services</Link>
        </div>
      </div>
    </motion.section>
  </div>
);

export default AboutPage;
