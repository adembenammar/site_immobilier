import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Bath, BedDouble, CalendarCheck, Check, Copy, Expand, LayoutGrid, Mail, MapPin, Phone, Printer, Ruler, Share2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useFetch } from "../hooks/useFetch";
import LoadingState from "../components/common/LoadingState";
import PropertyCard from "../components/property/PropertyCard";
import Lightbox from "../components/common/Lightbox";
import BookingModal from "../components/property/BookingModal";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

// Fix Leaflet default icon with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const imageBaseUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
const resolveImage = (src) => (src?.startsWith("/uploads") ? `${imageBaseUrl}${src}` : src);

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);

/* ── Share buttons ── */
const ShareButtons = ({ title, price }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const text = `${title} — ${fmt(price)} — ${url}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copyLink} type="button"
        className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-bronze hover:text-bronze">
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        {copied ? t("property_detail.copied") : t("property_detail.copy_link")}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"
        className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-emerald-500 hover:text-emerald-400">
        <Share2 size={13} /> {t("property_detail.whatsapp")}
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`}
        className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-bronze hover:text-bronze">
        <Mail size={13} /> {t("property_detail.email")}
      </a>
    </div>
  );
};

/* ── Main page ── */
const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: property, loading } = useFetch(`/properties/${id}`, null);
  const { data: allProperties }     = useFetch("/properties", []);

  const similar = useMemo(() => {
    if (!property || !allProperties?.length) return [];
    return allProperties
      .filter((p) => p.id !== property.id && (p.city === property.city || p.category_id === property.category_id))
      .slice(0, 3);
  }, [property, allProperties]);

  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ fullName: "", email: "", phone: "", message: "", propertyId: parseInt(id, 10) || null });

  const handleRequestVisit = () => {
    setBookingOpen(true);
  };

  const gallery = useMemo(() => {
    if (!property?.images?.length) {
      return property?.cover_image ? [{ image_url: property.cover_image, id: "cover" }] : [];
    }
    return property.images;
  }, [property]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/contacts", contactForm);
      toast(t("property_detail.send_success"), "success");
      setContactForm((p) => ({ ...p, fullName: "", email: "", phone: "", message: "" }));
    } catch (error) {
      const errs = error.response?.data?.errors;
      toast(errs?.length ? errs.map((e) => e.msg).join(" • ") : t("property_detail.send_error"), "error");
    }
  };

  // Lightbox images array
  const lightboxImages = useMemo(
    () => gallery.map((img) => ({ src: resolveImage(img.image_url), alt: property?.title })),
    [gallery, property]
  );

  if (loading) return <LoadingState />;
  if (!property || !property.id) return <div className="section-shell py-32 text-center text-slate-500">Bien introuvable.</div>;

  return (
    <div className="pb-20 lg:pb-0">
      {/* Booking modal */}
      {bookingOpen && property && (
        <BookingModal property={property} onClose={() => setBookingOpen(false)} />
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          current={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setSelectedImage((i) => (i - 1 + gallery.length) % gallery.length)}
          onNext={() => setSelectedImage((i) => (i + 1) % gallery.length)}
          onGoTo={(i) => setSelectedImage(i)}
        />
      )}

      {/* SEO */}
      <Helmet>
        <title>{property.title} — {property.city} | Tentation Immobilière</title>
        <meta name="description" content={`${property.title} à ${property.city}. ${property.rooms} pièces, ${property.surface} m². ${fmt(property.price)}. ${property.description?.slice(0, 120)}...`} />
        <meta property="og:title" content={`${property.title} — ${fmt(property.price)}`} />
        <meta property="og:description" content={`${property.rooms} pièces · ${property.surface} m² · ${property.city}`} />
        {property.cover_image && <meta property="og:image" content={resolveImage(property.cover_image)} />}
      </Helmet>

      {/* Hero */}
      <section className="bg-ink py-14 dark:bg-obsidian">
        <div className="section-shell">
          {/* Breadcrumb + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30">
              <Link to="/" className="transition hover:text-bronze">{t("property_detail.home")}</Link>
              <span className="text-white/15">—</span>
              <Link to="/properties" className="transition hover:text-bronze">{t("property_detail.properties")}</Link>
              <span className="text-white/15">—</span>
              <span className="text-bronze/70">{property.city}</span>
            </div>
            <div className="no-print flex flex-wrap items-center gap-2">
              <ShareButtons title={property.title} price={property.price} />
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-bronze hover:text-bronze"
              >
                <Printer size={13} /> {t("property_detail.print")}
              </button>
            </div>
          </div>

          {/* Title + Price panel */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              {/* Bronze ornament */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-bronze/60" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">
                  {property.category_name}
                </p>
              </div>
              <h1 className="font-display text-3xl font-light leading-[1.05] text-white sm:text-5xl lg:text-7xl">
                {property.title}
              </h1>
              <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/30">
                <MapPin size={13} className="text-bronze/60" />
                {property.address}, {property.city}
              </p>
            </div>

            {/* Price card */}
            <div className="rounded-[28px] border border-white/8 bg-white/5 p-7 backdrop-blur-sm">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/30">
                    {t("property_detail.price_label")}
                  </p>
                  <p className="mt-3 font-display text-3xl font-light text-bronze sm:text-4xl">
                    {fmt(property.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRequestVisit}
                  className="flex items-center gap-2 rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-white transition hover:bg-bronze/90"
                >
                  <CalendarCheck size={15} /> {t("property_detail.request_visit")}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { icon: BedDouble, label: `${property.bedrooms} ${t("property_card.bedrooms")}` },
                  { icon: Bath,      label: `${property.bathrooms} ${t("property_card.bathrooms")}` },
                  { icon: Ruler,     label: `${property.surface} ${t("property_card.surface")}` },
                  { icon: LayoutGrid,label: `${property.rooms} ${t("property_card.rooms")}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Icon size={13} className="text-bronze/70" /> {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            {/* Main image — click to open lightbox */}
            <div
              className="group relative cursor-zoom-in overflow-hidden rounded-[32px]"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={resolveImage(gallery[selectedImage]?.image_url)}
                alt={property.title}
                className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[420px] lg:h-[620px]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-ink opacity-0 transition group-hover:opacity-100">
                  <Expand size={14} /> {t("property_detail.fullscreen")}
                </span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-1.5 sm:gap-4">
              {gallery.map((image, index) => (
                <button key={image.id} type="button"
                  onClick={() => { setSelectedImage(index); setLightboxOpen(true); }}
                  className={`overflow-hidden rounded-[20px] border ${selectedImage === index ? "border-bronze" : "border-transparent"}`}>
                  <img src={resolveImage(image.image_url)} alt="" className="h-28 w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="mt-14 grid gap-8 border-t border-ink/8 pt-12 dark:border-white/8 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-bronze/60" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze">{t("property_detail.presentation_eyebrow")}</p>
                </div>
                <h2 className="mt-5 font-display text-4xl font-light leading-tight text-ink dark:text-white sm:text-5xl">{t("property_detail.presentation_title")}</h2>
              </div>
              <div className="space-y-6 text-base leading-9 text-slate-500 dark:text-slate-400">
                <p>{property.description}</p>
                <p>{t("property_detail.presentation_p2")}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            {/* Map if coordinates available */}
            {property.latitude && property.longitude && (
              <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800">
                <p className="px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-bronze">{t("property_detail.location_label")}</p>
                <MapContainer
                  key={property.id}
                  center={[Number(property.latitude), Number(property.longitude)]}
                  zoom={15}
                  style={{ height: "240px", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker position={[Number(property.latitude), Number(property.longitude)]}>
                    <Popup>{property.title}<br />{property.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/8 bg-ink p-8 dark:border-white/5 dark:bg-obsidian">
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-bronze/60" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-bronze/80">{t("property_detail.contact_eyebrow")}</p>
              </div>
              <h3 className="mt-5 font-display text-4xl font-light text-white">{t("property_detail.contact_title")}</h3>
              <div className="mt-7 space-y-3">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/15 caret-bronze [color-scheme:dark]"
                  placeholder={t("property_detail.form_name")}
                  value={contactForm.fullName}
                  onChange={(e) => setContactForm((p) => ({ ...p, fullName: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/15 caret-bronze [color-scheme:dark]"
                  type="email"
                  placeholder={t("property_detail.form_email")}
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/15 caret-bronze [color-scheme:dark]"
                  placeholder={t("property_detail.form_phone")}
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/15 caret-bronze [color-scheme:dark] min-h-36"
                  placeholder={t("property_detail.form_message")}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-bronze py-3.5 text-sm font-semibold text-white transition hover:bg-bronze/90"
              >
                {t("property_detail.form_send")}
              </button>
            </form>

            <div className="rounded-[32px] border border-white/8 bg-ink p-8 dark:border-white/5 dark:bg-obsidian">
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-bronze/60" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-bronze/80">{t("property_detail.agency_eyebrow")}</p>
              </div>
              <p className="mt-5 text-sm leading-8 text-white/40">
                {t("property_detail.agency_text")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-night/95 lg:hidden">
        <div className="section-shell flex gap-3 py-3">
          <button
            type="button"
            onClick={handleRequestVisit}
            className="btn-primary flex flex-1 items-center justify-center gap-2"
          >
            <CalendarCheck size={15} /> {t("property_detail.request_visit")}
          </button>
          <a
            href="tel:+21600000000"
            className="btn-secondary flex items-center gap-2"
          >
            <Phone size={15} />
            <span className="hidden sm:inline">Appeler</span>
          </a>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="bg-ink py-20 dark:bg-obsidian">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-bronze/25 to-transparent mb-0" />
          <div className="section-shell pt-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-bronze/60" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-bronze/80">{t("property_detail.similar_eyebrow")}</p>
            </div>
            <h2 className="mt-4 font-display text-4xl font-light text-white sm:text-5xl">{t("property_detail.similar_title")}</h2>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
