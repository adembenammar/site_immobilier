import { useTranslation } from "react-i18next";
import BrandLogo from "../common/BrandLogo";

const Footer = () => {
  const { t } = useTranslation();

  const footerColumns = [
    { title: t("footer.col1_title"), links: t("footer.col1_links", { returnObjects: true }) },
    { title: t("footer.col2_title"), links: t("footer.col2_links", { returnObjects: true }) },
    { title: t("footer.col3_title"), links: t("footer.col3_links", { returnObjects: true }) },
    { title: t("footer.col4_title"), links: t("footer.col4_links", { returnObjects: true }) },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-night">
      <div className="section-shell">
        <div className="grid gap-10 border-b border-slate-200 pb-12 dark:border-slate-800 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo />
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t("footer.description")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm uppercase tracking-[0.28em] text-bronze">{column.title}</p>
                <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {(Array.isArray(column.links) ? column.links : []).map((link) => (
                    <p key={link}>{link}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs uppercase tracking-[0.25em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
