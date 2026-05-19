const SectionHeading = ({ eyebrow, title, description, align = "left", dark = false }) => (
  <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}>
    {eyebrow && (
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <div className="h-px w-8 flex-shrink-0 bg-bronze" />
        <p className={`text-[10px] font-semibold uppercase tracking-[0.42em] ${dark ? "text-bronze/80" : "text-bronze"}`}>
          {eyebrow}
        </p>
      </div>
    )}
    <h2
      className={`mt-5 font-display leading-[1.08] ${
        align === "center" ? "text-3xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-5xl lg:text-6xl"
      } ${dark ? "text-white" : "text-ink dark:text-white"}`}
    >
      {title}
    </h2>
    {description && (
      <p className={`mt-5 text-base leading-8 ${dark ? "text-white/50" : "text-slate-500 dark:text-slate-400"}`}>
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
