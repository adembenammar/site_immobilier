import { Building2, CalendarDays, FolderTree, LayoutDashboard, Mail, Users, ExternalLink, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <aside className="sticky top-28 self-start overflow-hidden rounded-[28px] shadow-deep">
      {/* Dark header */}
      <div className="relative overflow-hidden bg-ink px-6 py-7 dark:bg-obsidian">
        {/* Subtle bronze gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bronze/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-bronze/30 bg-bronze/15">
            <Shield size={18} className="text-bronze" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-bronze/70">Espace</p>
          <p className="mt-1 font-display text-2xl font-light text-white">Administration</p>
          <div className="mt-3 h-px w-10 bg-gradient-to-r from-bronze/60 to-transparent" />
        </div>
      </div>

      {/* Nav */}
      <nav className="border border-t-0 border-ink/8 bg-white p-3 dark:border-white/6 dark:bg-carbon">
        {items.map(({ icon: Icon, label, href }) => {
          const sectionId = href.slice(1);
          const isActive  = active === sectionId;
          return (
            <a
              key={label}
              href={href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-forest text-white shadow-sm"
                  : "text-ink/55 hover:bg-bronze/6 hover:text-bronze dark:text-white/45 dark:hover:bg-white/6 dark:hover:text-bronze"
              }`}
            >
              <Icon size={16} className={isActive ? "opacity-100" : "opacity-50 transition group-hover:opacity-100"} />
              {label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border border-t-0 border-ink/8 bg-white p-3 dark:border-white/6 dark:bg-carbon">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-[12px] font-medium text-ink/40 transition-all duration-200 hover:bg-bronze/6 hover:text-bronze dark:text-white/30 dark:hover:bg-white/6 dark:hover:text-bronze"
        >
          <ExternalLink size={13} className="opacity-70" />
          Voir le site public
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
