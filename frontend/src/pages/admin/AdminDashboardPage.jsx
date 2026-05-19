import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../api/client";
import EmptyState from "../../components/common/EmptyState";
import LoadingState from "../../components/common/LoadingState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronLeft, ChevronRight, Building2, Users, FolderTree, Mail,
  Download, Eye, X, Star, StarOff, GripVertical
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import PropertyCard from "../../components/property/PropertyCard";

/* ─── helpers ─── */
const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

const STATUS_BADGE = {
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  reserved:  "bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300",
  sold:      "bg-rose-100   text-rose-700   dark:bg-rose-900/40   dark:text-rose-300",
};
const STATUS_LABELS = { pending: "En attente", read: "Lu", done: "Traité" };
const STATUS_COLORS = { pending: "bg-amber-100 text-amber-700", read: "bg-blue-100 text-blue-700", done: "bg-emerald-100 text-emerald-700" };
const CHART_COLORS  = ["#1a3a35", "#c9a96e", "#7fb7a0", "#e8d5b5", "#4a8c7a"];

/* ─── Export CSV ─── */
const exportCSV = (rows, filename) => {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(";"),
    ...rows.map((r) => headers.map((h) => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(";")),
  ];
  // ﻿ = UTF-8 BOM — required for Excel to open accented characters correctly
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ─── Visit Calendar ─── */
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function VisitCalendar({ messages }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const visitsByDay = useMemo(() => {
    const map = {};
    messages.forEach((m) => {
      if (!m.created_at) return;
      const d = new Date(m.created_at);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const k = d.getDate();
        if (!map[k]) map[k] = [];
        map[k].push(m);
      }
    });
    return map;
  }, [messages, year, month]);

  const firstDay   = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => (i < startOffset ? null : i - startOffset + 1));

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prev} aria-label="Mois précédent" className="rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft size={18} /></button>
        <p className="font-display text-xl text-ink dark:text-white">{MONTHS_FR[month]} {year}</p>
        <button type="button" onClick={next} aria-label="Mois suivant" className="rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => <p key={d} className="py-1 text-[10px] uppercase tracking-widest text-slate-400">{d}</p>)}
        {cells.map((day, i) => (
          <div key={day ?? `empty-${i}`} className={`relative min-h-[44px] rounded-xl p-1 text-xs ${
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              ? "bg-forest/10 font-bold text-forest" : day ? "hover:bg-slate-50 dark:hover:bg-slate-800" : ""
          }`}>
            {day && <span className="block text-right text-slate-500">{day}</span>}
            {day && visitsByDay[day]?.length > 0 && (
              <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                {visitsByDay[day].map((m) => (
                  <span key={m.id} title={`${m.full_name}${m.property_title ? ` — ${m.property_title}` : ""}`}
                    className="block h-1.5 w-1.5 rounded-full bg-bronze" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {Object.keys(visitsByDay).length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          {Object.entries(visitsByDay).sort(([a],[b]) => a - b).map(([day, msgs]) => (
            <div key={day} className="flex items-center gap-3 text-xs">
              <span className="w-6 text-right font-semibold text-bronze">{day}</span>
              <span className="text-slate-500">{msgs.map((m) => m.full_name).join(", ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Sortable image ─── */
function SortableImage({ img, editingId, onDelete, onSetCover }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="group relative" {...attributes}>
      <div {...listeners} className="absolute left-1 top-1 z-10 cursor-grab rounded-full bg-black/40 p-1 text-white opacity-0 transition group-hover:opacity-100">
        <GripVertical size={12} />
      </div>
      <img
        src={`${import.meta.env.VITE_UPLOADS_URL || ""}${img.image_url}`}
        alt={img.is_cover ? "Image de couverture" : "Image du bien"}
        className={`h-24 w-24 rounded-2xl object-cover border-2 transition ${img.is_cover ? "border-bronze" : "border-slate-200 dark:border-slate-700"}`}
      />
      {img.is_cover && (
        <span className="absolute top-1 right-1 rounded-full bg-bronze px-2 py-0.5 text-[9px] font-bold uppercase text-white">Cover</span>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-ink/60 opacity-0 transition group-hover:opacity-100">
        {!img.is_cover && (
          <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => onSetCover(img.id)}
            className="rounded-full bg-bronze px-2 py-1 text-[10px] font-semibold text-white">Cover</button>
        )}
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(img.id)}
          className="rounded-full bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white">Suppr.</button>
      </div>
    </div>
  );
}

/* ─── Preview modal ─── */
function PreviewModal({ form, categories, onClose }) {
  const cat = categories.find((c) => String(c.id) === String(form.categoryId));
  const mockProperty = {
    id: 0,
    title: form.title || "Titre du bien",
    city: form.city || "Ville",
    address: form.address || "",
    price: Number(form.price) || 0,
    surface: Number(form.surface) || 0,
    rooms: Number(form.rooms) || 0,
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    category_name: cat?.name || "",
    status: form.status || "available",
    cover_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    transaction_type: form.transactionType,
    is_featured: form.isFeatured,
    featured_badge: form.featuredBadge,
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <p className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Aperçu avant publication
          </p>
          <button type="button" aria-label="Fermer l'aperçu" onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X size={18} /></button>
        </div>
        <PropertyCard property={mockProperty} />
        <p className="mt-3 text-center text-xs text-white/50">Ceci est un aperçu — les images réelles seront affichées après publication.</p>
      </div>
    </div>
  );
}

/* ─── Form section separator ─── */
const FormSection = ({ label }) => (
  <div className="col-span-2 flex items-center gap-4 pt-2">
    <span className="text-[10px] uppercase tracking-[0.3em] text-bronze whitespace-nowrap">{label}</span>
    <hr className="flex-1 border-slate-200 dark:border-slate-700" />
  </div>
);

/* ─── emptyProperty ─── */
const emptyProperty = {
  title: "", slug: "", description: "", city: "", address: "", price: "", surface: "",
  rooms: "", bedrooms: "", bathrooms: "", transactionType: "sale", status: "available",
  featuredBadge: "", latitude: "", longitude: "", categoryId: "", isFeatured: true,
};

/* ═══════════════════════════════════════════════════════════ */
const AdminDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [users, setUsers]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages]     = useState([]);
  const [propertyForm, setPropertyForm]   = useState(emptyProperty);
  const [categoryForm, setCategoryForm]   = useState({ name: "", slug: "" });
  const [files, setFiles]           = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [confirmDelete, setConfirmDelete]   = useState(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const [propertySearch, setPropertySearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback]     = useState("");
  const [adminLoading, setAdminLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const toast = useToast();

  const loadAdminData = async () => {
    try {
      const [pRes, uRes, cRes, mRes] = await Promise.all([
        api.get("/properties"), api.get("/users"), api.get("/categories"), api.get("/contacts"),
      ]);
      setProperties(pRes.data);
      setUsers(uRes.data);
      setCategories(cRes.data);
      setMessages(mRes.data);
    } catch {
      setFeedback("Données inaccessibles. Vérifiez vos permissions.");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadAdminData();
  }, [user]);

  const resetForm = () => {
    setEditingId(null);
    setPropertyForm(emptyProperty);
    setFiles([]); setPreviews([]); setExistingImages([]);
  };

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemovePreview = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateOrUpdateProperty = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(propertyForm).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) formData.append(k, v);
      });
      files.forEach((f) => formData.append("images", f));
      if (editingId) await api.put(`/properties/${editingId}`, formData);
      else           await api.post("/properties", formData);
      resetForm();
      toast(editingId ? "Bien mis à jour avec succès." : "Bien créé avec succès.", "success");
      await loadAdminData();
    } catch (error) {
      const errs = error.response?.data?.errors;
      toast(errs?.length ? errs.map((e) => e.msg).join(" • ") : (error.response?.data?.message || "Enregistrement impossible."), "error");
    }
  };

  const handleEditProperty = async (property) => {
    try {
      const { data } = await api.get(`/properties/${property.id}`);
      setEditingId(data.id);
      setPropertyForm({
        title: data.title, slug: data.slug, description: data.description,
        city: data.city, address: data.address, price: data.price, surface: data.surface,
        rooms: data.rooms, bedrooms: data.bedrooms, bathrooms: data.bathrooms,
        transactionType: data.transaction_type, status: data.status,
        featuredBadge: data.featured_badge || "", latitude: data.latitude || "",
        longitude: data.longitude || "", categoryId: data.category_id || "",
        isFeatured: Boolean(data.is_featured),
      });
      setExistingImages(data.images || []);
      setFiles([]); setPreviews([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast("Impossible de charger ce bien.", "error");
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/properties/${editingId}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast("Suppression de l'image impossible.", "error");
    }
  };

  const handleSetCover = async (imageId) => {
    try {
      await api.put(`/properties/${editingId}/images/${imageId}/cover`);
      setExistingImages((prev) => prev.map((img) => ({ ...img, is_cover: img.id === imageId ? 1 : 0 })));
    } catch {
      toast("Mise à jour de la couverture impossible.", "error");
    }
  };

  const handleImageDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = existingImages.findIndex((i) => i.id === active.id);
    const newIndex = existingImages.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(existingImages, oldIndex, newIndex);
    setExistingImages(reordered); // optimistic update
    try {
      await api.put(`/properties/${editingId}/images/reorder`, { orderedIds: reordered.map((i) => i.id) });
    } catch {
      // Revert on failure
      setExistingImages(existingImages);
      toast("Réorganisation impossible.", "error");
    }
  };

  const handleMessageStatus = async (id, status) => {
    // Save previous status before optimistic update so we can revert correctly
    const previous = messages.find((m) => m.id === id)?.status;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    try {
      await api.patch(`/contacts/${id}/status`, { status });
    } catch {
      // Revert to the saved previous value
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: previous } : m)));
      toast("Mise à jour du statut impossible.", "error");
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      toast("Bien supprimé.", "success");
      setConfirmDelete(null);
      await loadAdminData();
    } catch {
      toast("Suppression impossible.", "error");
      setConfirmDelete(null);
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    try {
      await api.post("/categories", categoryForm);
      setCategoryForm({ name: "", slug: "" });
      toast("Catégorie créée.", "success");
      await loadAdminData();
    } catch (error) {
      toast(error.response?.data?.message || "Catégorie invalide.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast("Catégorie supprimée.", "success");
      setConfirmDeleteCategory(null);
      await loadAdminData();
    } catch {
      toast("Suppression de catégorie impossible.", "error");
      setConfirmDeleteCategory(null);
    }
  };

  const handleRoleUpdate = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast("Rôle mis à jour.", "success");
      await loadAdminData();
    } catch {
      toast("Mise à jour du rôle impossible.", "error");
    }
  };

  /* ─── Chart data ─── */
  const byCity = useMemo(() => {
    const map = {};
    properties.forEach((p) => { map[p.city] = (map[p.city] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 6);
  }, [properties]);

  const byStatus = useMemo(() => {
    const map = { available: 0, reserved: 0, sold: 0 };
    properties.forEach((p) => { if (p.status in map) map[p.status]++; });
    return [
      { name: "Disponible", value: map.available },
      { name: "Réservé",    value: map.reserved },
      { name: "Vendu",      value: map.sold },
    ].filter((d) => d.value > 0);
  }, [properties]);

  const byCategory = useMemo(() => {
    const map = {};
    properties.forEach((p) => { const k = p.category_name || "Autre"; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [properties]);

  const msgByWeek = useMemo(() => {
    const map = {};
    messages.forEach((m) => {
      if (!m.created_at) return;
      const d = new Date(m.created_at);
      const week = `S${Math.ceil(d.getDate() / 7)} ${d.toLocaleString("fr-FR", { month: "short" })}`;
      map[week] = (map[week] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [messages]);

  /* ─── Filtered properties ─── */
  const filteredProperties = properties.filter(
    (p) => !propertySearch || p.title?.toLowerCase().includes(propertySearch.toLowerCase()) || p.city?.toLowerCase().includes(propertySearch.toLowerCase())
  );

  // Auth guard — redirect unauthenticated users to login
  if (authLoading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;

  // Admin data loading
  if (adminLoading) return <LoadingState />;

  if (feedback && !properties.length && !categories.length) {
    return <section className="section-shell py-16"><EmptyState title="Dashboard restreint" description={feedback} /></section>;
  }

  return (
    <>
      {confirmDelete && (
        <ConfirmModal title="Supprimer ce bien ?"
          description={`"${confirmDelete.title}" sera définitivement supprimé.`}
          onConfirm={() => handleDeleteProperty(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)} />
      )}
      {confirmDeleteCategory && (
        <ConfirmModal title="Supprimer cette catégorie ?"
          description={`La catégorie "${confirmDeleteCategory.name}" sera définitivement supprimée.`}
          onConfirm={() => handleDeleteCategory(confirmDeleteCategory.id)}
          onCancel={() => setConfirmDeleteCategory(null)} />
      )}
      {showPreview && (
        <PreviewModal form={propertyForm} categories={categories} onClose={() => setShowPreview(false)} />
      )}

      {/* ── Dark hero header ── */}
      <section className="relative overflow-hidden bg-ink dark:bg-obsidian">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-bronze/6 via-transparent to-forest/5" />
        <div className="section-shell relative py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-bronze/60" />
                <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-bronze/80">Espace administration</p>
              </div>
              <h1 className="mt-4 font-display text-3xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
                Tableau de bord
              </h1>
              <p className="mt-3 text-sm text-white/35">
                <span className="font-display text-lg font-light text-bronze/80">{properties.length}</span>
                {" "}bien{properties.length !== 1 ? "s" : ""} publié{properties.length !== 1 ? "s" : ""}
                {" "}·{" "}
                {new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
              </p>
            </div>
            {/* Quick stats mini chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Biens",     value: properties.length },
                { label: "Messages",  value: messages.length },
                { label: "Membres",   value: users.length },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-2 backdrop-blur-sm">
                  <p className="font-display text-xl font-light text-white">{value}</p>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom fade */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/20 to-transparent" />
      </section>

      {/* Mobile anchor nav */}
      <div className="overflow-x-auto border-b border-ink/8 bg-white dark:border-white/6 dark:bg-carbon lg:hidden">
        <div className="flex min-w-max gap-1 px-4 py-2">
          {[
            { label: "Stats",        href: "#statistiques" },
            { label: "Biens",        href: "#biens" },
            { label: "Utilisateurs", href: "#utilisateurs" },
            { label: "Catégories",   href: "#categories" },
            { label: "Agenda",       href: "#agenda" },
            { label: "Messages",     href: "#messages" },
          ].map(({ label, href }) => (
            <a key={href} href={href}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-ink/55 transition hover:bg-bronze/8 hover:text-bronze dark:text-white/45 dark:hover:text-bronze whitespace-nowrap">
              {label}
            </a>
          ))}
        </div>
      </div>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block"><AdminSidebar /></div>

          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Biens publiés",  value: properties.length, icon: Building2, accent: "forest" },
                { label: "Utilisateurs",   value: users.length,      icon: Users,     accent: "bronze" },
                { label: "Catégories",     value: categories.length, icon: FolderTree,accent: "forest" },
                { label: "Messages reçus", value: messages.length,   icon: Mail,      accent: "bronze" },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-deep dark:border-slate-800 dark:bg-carbon">
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-bronze/0 to-bronze/0 transition-all duration-500 group-hover:from-bronze/3" />
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${accent === "bronze" ? "border-bronze/20 bg-bronze/10" : "border-forest/20 bg-forest/10"}`}>
                      <Icon size={17} className={accent === "bronze" ? "text-bronze" : "text-forest"} />
                    </div>
                  </div>
                  <p className="mt-4 font-display text-5xl font-light text-ink dark:text-white">{value}</p>
                  <div className="mt-2 h-px w-6 bg-bronze/30 transition-all duration-400 group-hover:w-10 group-hover:bg-bronze/60" />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Statistiques */}
            <div id="statistiques" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-3xl text-ink dark:text-white">Statistiques</h2>
                <button type="button" onClick={() => exportCSV(properties.map(({ id, title, city, price, status, category_name }) => ({ id, title, city, price, status, categorie: category_name })), "biens.csv")}
                  className="btn-secondary gap-2 text-xs">
                  <Download size={13} /> Export biens CSV
                </button>
              </div>
              <div className="mt-8 grid gap-8 xl:grid-cols-2">
                <div>
                  <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-bronze">Biens par ville</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={byCity}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1a3a35" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-bronze">Biens par catégorie</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {byCategory.map((entry, i) => <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-bronze">Biens par statut</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={byStatus} layout="vertical">
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#c9a96e" radius={[0,6,6,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-bronze">Messages reçus</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={msgByWeek}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7fb7a0" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Formulaire bien */}
            <div id="biens" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-bronze">{editingId ? "Modifier" : "Nouveau bien"}</p>
                  <h2 className="mt-1 font-display text-3xl text-ink dark:text-white">{editingId ? "Modifier un bien" : "Ajouter un bien"}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setShowPreview(true)}
                    className="btn-secondary gap-2 text-xs">
                    <Eye size={14} /> Aperçu
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="btn-secondary text-xs">
                      Annuler
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleCreateOrUpdateProperty} className="mt-8 grid gap-4 sm:grid-cols-2">
                {/* — Informations générales — */}
                <FormSection label="Informations générales" />
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Titre *</label>
                  <input className="input-ui" placeholder="Villa panoramique…" value={propertyForm.title}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Slug</label>
                  <input className="input-ui" placeholder="villa-panoramique" value={propertyForm.slug}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, slug: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Description</label>
                  <textarea className="input-ui min-h-28" placeholder="Description du bien…" value={propertyForm.description}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, description: e.target.value }))} />
                </div>

                {/* — Localisation — */}
                <FormSection label="Localisation" />
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Ville *</label>
                  <input className="input-ui" placeholder="Paris, Nice…" value={propertyForm.city}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, city: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Adresse</label>
                  <input className="input-ui" placeholder="12 avenue Foch" value={propertyForm.address}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Latitude</label>
                  <input className="input-ui" placeholder="48.8566" value={propertyForm.latitude}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, latitude: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Longitude</label>
                  <input className="input-ui" placeholder="2.3522" value={propertyForm.longitude}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, longitude: e.target.value }))} />
                </div>

                {/* — Caractéristiques — */}
                <FormSection label="Caractéristiques" />
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Prix (TND) *</label>
                  <input className="input-ui" type="number" placeholder="450 000" value={propertyForm.price}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, price: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Surface (m²)</label>
                  <input className="input-ui" type="number" placeholder="120" value={propertyForm.surface}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, surface: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Pièces</label>
                  <input className="input-ui" type="number" placeholder="4" value={propertyForm.rooms}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, rooms: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Chambres</label>
                  <input className="input-ui" type="number" placeholder="3" value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, bedrooms: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Salles de bain</label>
                  <input className="input-ui" type="number" placeholder="2" value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, bathrooms: e.target.value }))} />
                </div>

                {/* — Paramètres — */}
                <FormSection label="Paramètres" />
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Catégorie</label>
                  <select className="input-ui" value={propertyForm.categoryId}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, categoryId: e.target.value }))}>
                    <option value="">— Choisir —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Transaction</label>
                  <select className="input-ui" value={propertyForm.transactionType}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, transactionType: e.target.value }))}>
                    <option value="sale">Vente</option>
                    <option value="rent">Location</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Statut</label>
                  <select className="input-ui" value={propertyForm.status}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, status: e.target.value }))}>
                    <option value="available">Disponible</option>
                    <option value="reserved">Réservé</option>
                    <option value="sold">Vendu</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Badge (ex: Exclusivité)</label>
                  <input className="input-ui" placeholder="Exclusivité" value={propertyForm.featuredBadge}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, featuredBadge: e.target.value }))} />
                </div>
                {/* isFeatured toggle */}
                <div className="col-span-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPropertyForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                      propertyForm.isFeatured
                        ? "border-bronze bg-bronze/10 text-bronze"
                        : "border-slate-200 text-slate-500 hover:border-bronze"
                    }`}
                  >
                    {propertyForm.isFeatured ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
                    {propertyForm.isFeatured ? "Mis en avant (page d'accueil)" : "Non mis en avant"}
                  </button>
                </div>

                {/* — Images — */}
                <FormSection label="Images" />
                <div className="col-span-2 space-y-4">
                  {existingImages.length > 0 && (
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">Images actuelles — glisser pour réordonner</p>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleImageDragEnd}>
                        <SortableContext items={existingImages.map((i) => i.id)} strategy={rectSortingStrategy}>
                          <div className="flex flex-wrap gap-3">
                            {existingImages.map((img) => (
                              <SortableImage key={img.id} img={img} editingId={editingId}
                                onDelete={handleDeleteImage} onSetCover={handleSetCover} />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-slate-400">
                      {existingImages.length > 0 ? "Ajouter des images" : "Sélectionner des images"}
                    </p>
                    <input className="input-ui" type="file" multiple accept="image/*" onChange={handleFilesChange} />
                    {previews.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {previews.map((url, i) => (
                          <div key={i} className="group relative">
                            <img src={url} alt="" className="h-24 w-24 rounded-2xl object-cover border border-dashed border-bronze/50" />
                            <button type="button" onClick={() => handleRemovePreview(i)}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow hover:bg-rose-600">
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full sm:col-span-2">
                  {editingId ? "Enregistrer les modifications" : "Créer le bien"}
                </button>
              </form>
            </div>

            {/* Liste des biens */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-3xl text-ink dark:text-white">Biens publiés</h3>
                <div className="flex items-center gap-3">
                  <input className="input-ui max-w-xs" placeholder="Rechercher…"
                    value={propertySearch} onChange={(e) => setPropertySearch(e.target.value)} />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition duration-200 hover:border-bronze/20 hover:bg-white dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-bronze/15 dark:hover:bg-slate-800 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                        {property.cover_image ? (
                          <img
                            src={property.cover_image?.startsWith("/uploads") ? `${import.meta.env.VITE_UPLOADS_URL || ""}${property.cover_image}` : property.cover_image}
                            alt={property.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700">
                            <Building2 size={18} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink dark:text-white">{property.title}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${STATUS_BADGE[property.status] || STATUS_BADGE.available}`}>
                            {property.status === "available" ? "Disponible" : property.status === "reserved" ? "Réservé" : "Vendu"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {property.city}
                          {property.category_name ? <> · <span className="text-bronze/80">{property.category_name}</span></> : ""}
                        </p>
                        <p className="mt-0.5 font-display text-base font-light text-bronze">{fmt(property.price)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/properties/${property.id}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs gap-1.5 px-4 py-2">
                        <Eye size={12} /> Voir
                      </Link>
                      <button type="button" onClick={() => handleEditProperty(property)} className="btn-secondary text-xs px-4 py-2">
                        Modifier
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(property)} className="btn-danger text-xs px-4 py-2">
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                {filteredProperties.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">Aucun bien trouvé.</p>
                )}
              </div>
            </div>

            {/* Utilisateurs + Catégories */}
            <div className="grid gap-8 xl:grid-cols-2">
              <div id="utilisateurs" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-3xl text-ink dark:text-white">Utilisateurs</h3>
                  <button type="button"
                    onClick={() => exportCSV(users.map(({ id, first_name, last_name, email, role }) => ({ id, prenom: first_name, nom: last_name, email, role })), "utilisateurs.csv")}
                    className="btn-secondary gap-2 text-xs">
                    <Download size={12} /> CSV
                  </button>
                </div>
                <div className="mt-6 space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-bronze/15 text-sm font-bold text-bronze uppercase">
                          {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-ink dark:text-white">{user.first_name} {user.last_name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <select className="input-ui max-w-28 text-xs" value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}>
                        <option value="client">client</option>
                        <option value="agent">agent</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div id="categories" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-display text-3xl text-ink dark:text-white">Catégories</h3>
                <form onSubmit={handleCreateCategory} className="mt-6 grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Nom</label>
                    <input className="input-ui" placeholder="Villa" value={categoryForm.name}
                      onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-slate-400">Slug</label>
                    <input className="input-ui" placeholder="villa" value={categoryForm.slug}
                      onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary md:col-span-2">Ajouter</button>
                </form>
                <div className="mt-6 space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                      <div>
                        <p className="font-medium text-ink dark:text-white">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.slug}</p>
                      </div>
                      <button type="button" onClick={() => setConfirmDeleteCategory(category)} className="btn-danger text-xs px-3 py-2">
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div id="agenda" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-3xl text-ink dark:text-white">Agenda des visites</h3>
              <p className="mt-1 text-sm text-slate-400">Les points bronzés indiquent les jours avec des demandes de visite.</p>
              <div className="mt-6"><VisitCalendar messages={messages} /></div>
            </div>

            {/* Messages */}
            <div id="messages" className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl text-ink dark:text-white">Messages entrants</h3>
                <button type="button"
                  onClick={() => exportCSV(messages.map(({ id, full_name, email, phone, message, status, created_at, property_title }) => ({ id, nom: full_name, email, telephone: phone, message, statut: status, date: created_at, bien: property_title || "" })), "messages.csv")}
                  className="btn-secondary gap-2 text-xs">
                  <Download size={12} /> Export CSV
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {message.property_title && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-bronze">
                          Visite — {message.property_title}{message.property_city ? ` · ${message.property_city}` : ""}
                        </span>
                      )}
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[message.status] || STATUS_COLORS.pending}`}>
                        {STATUS_LABELS[message.status] || "En attente"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bronze/15 text-sm font-bold uppercase text-bronze">
                          {message.full_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-ink dark:text-white">{message.full_name}</p>
                          <p className="text-xs text-slate-500">{message.email}</p>
                          {message.phone && <p className="text-xs text-slate-500">{message.phone}</p>}
                        </div>
                      </div>
                      {message.created_at && (
                        <p className="flex-shrink-0 text-xs text-slate-400">
                          {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(message.created_at))}
                        </p>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message.message}</p>
                    <div className="mt-4 flex gap-2">
                      {["pending", "read", "done"].map((s) => (
                        <button key={s} type="button" onClick={() => handleMessageStatus(message.id, s)}
                          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                            (message.status || "pending") === s
                              ? STATUS_COLORS[s] + " ring-1 ring-current"
                              : "bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                          }`}>
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Aucun message reçu.</p>}
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
};

export default AdminDashboardPage;
