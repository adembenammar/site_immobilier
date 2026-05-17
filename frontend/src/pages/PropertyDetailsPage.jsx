import { useRef, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Bath, BedDouble, CalendarCheck, Check, Copy, Expand, LayoutGrid, Mail, MapPin, Printer, Ruler, Share2 } from "lucide-react";
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
        className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300">
        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        {copied ? t("property_detail.copied") : t("property_detail.copy_link")}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"
        className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300">
        <Share2 size={13} /> {t("property_detail.whatsapp")}
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`}
        className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300">
        <Mail size={13} /> {t("property_detail.email")}
      </a>
    </div>
  );
};

/* ── Main page ── */
const PropertyDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: property, loading } = useFetch(`/properties/${id}`);
  const { data: allProperties } = useFetch("/properties");

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
  const [contactForm, setContactForm] = useState({ fullName: "", email: "", phone: "", message: "", propertyId: Number(id) });
  const formRef = useRef(null);

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

  return (
    <div>
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
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-night">
        <div className="section-shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-slate-500">
              <Link to="/" className="hover:text-bronze">{t("property_detail.home")}</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-bronze">{t("property_detail.properties")}</Link>
              <span>/</span>
              <span className="text-bronze">{property.city}</span>
            </div>
            {/* Actions */}
            <div className="no-print flex items-center gap-3">
              <ShareButtons title={property.title} price={property.price} />
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-bronze hover:text-bronze dark:border-slate-700 dark:text-slate-300"
              >
                <Printer size={13} /> {t("property_detail.print")}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-bronze">{property.category_name}</p>
              <h1 className="mt-4 font-display text-5xl leading-tight text-ink dark:text-white sm:text-6xl">{property.title}</h1>
              <p className="mt-6 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <MapPin size={15} /> {property.address}, {property.city}
              </p>
            </div>
            <div className="flex flex-col gap-5 rounded-[28px] bg-primary p-6 dark:bg-slate-900">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{t("property_detail.price_label")}</p>
                  <p className="mt-3 text-4xl font-semibold text-forest dark:text-mist">{fmt(property.price)}</p>
                </div>
                <button type="button" onClick={handleRequestVisit} className="btn-primary flex items-center gap-2">
                  <CalendarCheck size={16} /> {t("property_detail.request_visit")}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: BedDouble, label: `${property.bedrooms} ${t("property_card.bedrooms")}` },
                  { icon: Bath,      label: `${property.bathrooms} ${t("property_card.bathrooms")}` },
                  { icon: Ruler,     label: `${property.surface} ${t("property_card.surface")}` },
                  { icon: LayoutGrid,label: `${property.rooms} ${t("property_card.rooms")}` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl bg-white px-4 py-4 dark:bg-night">
                    <div className="flex items-center gap-2 text-sm"><Icon size={16} /> {label}</div>
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
            <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
              {gallery.map((image, index) => (
                <button key={image.id} type="button"
                  onClick={() => { setSelectedImage(index); setLightboxOpen(true); }}
                  className={`overflow-hidden rounded-[20px] border ${selectedImage === index ? "border-bronze" : "border-transparent"}`}>
                  <img src={resolveImage(image.image_url)} alt="" className="h-28 w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="mt-12 grid gap-12 border-t border-slate-200 pt-10 dark:border-slate-800 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t("property_detail.presentation_eyebrow")}</p>
                <h2 className="mt-4 font-display text-4xl text-ink dark:text-white">{t("property_detail.presentation_title")}</h2>
              </div>
              <div className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-300">
                <p>{property.description}</p>
                <p>{t("property_detail.presentation_p2")}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            {/* Map if coordinates available */}
            {property.latitude && property.longitude && (
              <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800">
                <p className="px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-bronze">{t("property_detail.location_label")}</p>
                <MapContainer
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

            <form ref={formRef} onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t("property_detail.contact_eyebrow")}</p>
              <h3 className="mt-4 font-display text-4xl text-ink dark:text-white">{t("property_detail.contact_title")}</h3>
              <div className="mt-8 space-y-4">
                <input className="input-ui" placeholder={t("property_detail.form_name")} value={contactForm.fullName} onChange={(e) => setContactForm((p) => ({ ...p, fullName: e.target.value }))} />
                <input className="input-ui" type="email" placeholder={t("property_detail.form_email")} value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} />
                <input className="input-ui" placeholder={t("property_detail.form_phone")} value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} />
                <textarea className="input-ui min-h-36" placeholder={t("property_detail.form_message")} value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn-primary mt-6 w-full">{t("property_detail.form_send")}</button>
            </form>

            <div className="rounded-[32px] bg-primary p-8 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">{t("property_detail.agency_eyebrow")}</p>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                {t("property_detail.agency_text")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-night">
          <div className="section-shell">
            <p className="text-[11px] uppercase tracking-[0.32em] text-bronze">{t("property_detail.similar_eyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl text-ink dark:text-white">{t("property_detail.similar_title")}</h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
