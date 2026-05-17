const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
  <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}>
    {eyebrow && <p className="text-xs uppercase tracking-[0.38em] text-bronze">{eyebrow}</p>}
    <h2 className="mt-4 font-display text-4xl leading-tight text-ink dark:text-white sm:text-5xl">{title}</h2>
    {description && <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p>}
  </div>
);

export default SectionHeading;
