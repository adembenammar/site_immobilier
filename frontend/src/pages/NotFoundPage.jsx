import { ArrowLeft, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => (
  <div className="relative overflow-hidden">
    {/* Background décoration */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-bronze/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-forest/5 blur-3xl" />
    </div>

    <section className="section-shell relative flex min-h-[85vh] flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Grand 404 décoratif */}
        <div className="relative select-none">
          <p className="font-display text-[12rem] font-bold leading-none text-slate-100 dark:text-slate-800 sm:text-[16rem]">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1 w-32 rounded-full bg-bronze" />
          </div>
        </div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="-mt-8"
        >
          <p className="text-[11px] uppercase tracking-[0.38em] text-bronze">Erreur 404</p>
          <h1 className="mt-5 font-display text-4xl text-ink dark:text-white sm:text-5xl lg:text-6xl">
            Page introuvable
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-slate-500 dark:text-slate-400">
            La page que vous recherchez n'existe pas ou a été déplacée. Explorez nos annonces ou retournez à l'accueil.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary gap-2">
              <Home size={16} />
              Accueil
            </Link>
            <Link to="/properties" className="btn-secondary gap-2">
              <Search size={16} />
              Voir les biens
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Liens rapides */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 grid gap-6 sm:grid-cols-3"
      >
        {[
          { label: "Biens à l'achat",    href: "/properties?transactionType=sale", desc: "Villas, penthouses, appartements" },
          { label: "Biens à la location", href: "/properties?transactionType=rent", desc: "Locations longue durée et saisonnières" },
          { label: "À propos",            href: "/about",                           desc: "Notre histoire et notre équipe" },
        ].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group rounded-[20px] border border-slate-200 bg-white p-5 text-left shadow-soft transition hover:border-bronze dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-ink transition group-hover:text-bronze dark:text-white">{item.label}</p>
            <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
          </Link>
        ))}
      </motion.div>
    </section>
  </div>
);

export default NotFoundPage;
