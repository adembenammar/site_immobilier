import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

const Footer = () => {
  const { t } = useTranslation();

  const cols = [
    { title: t("footer.col1_title"), links: t("footer.col1_links", { returnObjects: true }) },
    { title: t("footer.col2_title"), links: t("footer.col2_links", { returnObjects: true }) },
    { title: t("footer.col3_title"), links: t("footer.col3_links", { returnObjects: true }) },
    { title: t("footer.col4_title"), links: t("footer.col4_links", { returnObjects: true }) },
  ];

  return (
    <footer className="bg-ink dark:bg-obsidian">
      {/* Top bronze accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/40 to-transparent" />

      <div className="section-shell pt-16 pb-10">
        {/* Main grid */}
        <div className="grid gap-14 border-b border-white/8 pb-14 lg:grid-cols-[1.5fr_2.5fr]">
          {/* Brand column */}
          <div>
            <BrandLogo frosted={false} />
            <div className="mt-6 h-px w-10 bg-bronze/50" />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/35">
              {t("footer.description")}
            </p>
            {/* Social */}
            <div className="mt-8 flex items-center gap-3">
              {["Li", "Ig", "Fb"].map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-label={["LinkedIn", "Instagram", "Facebook"][i]}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold text-white/30 transition hover:border-bronze hover:text-bronze"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {cols.map((col) => (
              <div key={col.title}>
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.42em] text-bronze/70">
                  {col.title}
                </p>
                <div className="space-y-3">
                  {(Array.isArray(col.links) ? col.links : []).map((link) => (
                    <button
                      key={link}
                      type="button"
                      className="block text-left text-sm text-white/30 transition hover:text-white"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/20">
            © {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.25em] text-white/20">
            <span className="transition hover:text-white/60 cursor-pointer">Confidentialité</span>
            <span className="transition hover:text-white/60 cursor-pointer">CGU</span>
            <span className="text-bronze/50">{t("footer.tagline")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
