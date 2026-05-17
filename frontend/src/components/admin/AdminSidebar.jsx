import { Building2, CalendarDays, FolderTree, LayoutDashboard, Mail, Users, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandLogo from "../common/BrandLogo";

const items = [
  { icon: LayoutDashboard, label: "Statistiques", href: "#statistiques" },
  { icon: Building2,       label: "Biens",        href: "#biens" },
  { icon: Users,           label: "Utilisateurs", href: "#utilisateurs" },
  { icon: FolderTree,      label: "Catégories",   href: "#categories" },
  { icon: CalendarDays,    label: "Agenda",       href: "#agenda" },
  { icon: Mail,            label: "Messages",     href: "#messages" },
];

const AdminSidebar = () => {
  const [active, setActive] = useState("statistiques");

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.href.slice(1))).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sticky top-28 self-start overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 bg-forest/5 px-6 py-5 dark:border-slate-800 dark:bg-forest/10">
        <p className="text-[10px] uppercase tracking-[0.32em] text-bronze">Espace</p>
        <p className="mt-1 font-display text-2xl text-ink dark:text-white">Administration</p>
      </div>

      {/* Nav */}
      <nav className="p-3">
        {items.map(({ icon: Icon, label, href }) => {
          const sectionId = href.slice(1);
          const isActive  = active === sectionId;
          return (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-forest text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-bronze dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={17} className={isActive ? "opacity-100" : "opacity-60"} />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-mist" />}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs text-slate-400 transition hover:bg-slate-50 hover:text-bronze dark:hover:bg-slate-800"
        >
          <ExternalLink size={13} />
          Voir le site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
