import { Building2, FileCheck, Home, Key, LayoutDashboard, Users } from "lucide-react";
import { Link } from "react-router-dom";

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
    {/* Hero */}
    <section className="border-b border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-night">
      <div className="section-shell">
        <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Ce que nous faisons</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink dark:text-white sm:text-6xl lg:max-w-3xl">
          Nos services
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400">
          Un accompagnement complet et sur mesure pour tous vos projets immobiliers — achat, vente, location et gestion de patrimoine.
        </p>
      </div>
    </section>

    {/* Grille de services */}
    <section className="section-shell py-20">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="group rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft transition hover:border-bronze dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/10">
              <service.icon size={22} className="text-forest dark:text-emerald-400" />
            </span>
            <h3 className="mt-6 font-display text-2xl text-ink dark:text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{service.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA contact */}
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="section-shell">
        <div className="rounded-[32px] bg-forest px-10 py-14 text-center text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Parlons de votre projet</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Un projet ? Contactez-nous.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans vos démarches.
          </p>
          <Link to="/#contact" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold transition hover:border-bronze hover:text-bronze">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default ServicesPage;
