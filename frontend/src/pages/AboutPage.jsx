// Contenu à remplir — remplacer les textes entre /* CONTENU */ par l'historique réel de l'agence

const AboutPage = () => (
  <div>
    {/* Hero */}
    <section className="border-b border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-night">
      <div className="section-shell">
        <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Notre maison</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink dark:text-white sm:text-6xl lg:max-w-3xl">
          À propos de nous
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 dark:text-slate-400">
          {/* CONTENU — phrase d'accroche de l'agence */}
          Une agence immobilière de référence, fondée sur l'exigence et la passion de l'immobilier d'exception.
        </p>
      </div>
    </section>

    {/* Histoire */}
    <section className="section-shell py-20">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Notre histoire</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
            {/* CONTENU — titre de la section histoire */}
            Une histoire à compléter
          </h2>
        </div>
        <div className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
          {/* CONTENU — paragraphes de l'historique de l'agence */}
          <p>
            L'historique de l'agence sera affiché ici. Merci de fournir le contenu.
          </p>
        </div>
      </div>
    </section>

    {/* Valeurs */}
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="section-shell">
        <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">Nos valeurs</p>
        <h2 className="mt-4 font-display text-4xl text-ink dark:text-white">Ce qui nous guide</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Excellence", description: "/* CONTENU */" },
            { title: "Discrétion", description: "/* CONTENU */" },
            { title: "Expertise", description: "/* CONTENU */" }
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-slate-200 p-8 dark:border-slate-800">
              <p className="font-display text-2xl text-ink dark:text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
