import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(price);

/* Listens to map move/zoom and updates the parent bounds state */
const BoundsTracker = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
    load:    (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
};

const PropertyMap = ({ properties }) => {
  const withCoords = properties.filter(
    (p) => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
  );

  const [bounds, setBounds] = useState(null);
  const [filterByView, setFilterByView] = useState(false);

  /* Properties currently visible in map bounds */
  const visible =
    filterByView && bounds
      ? withCoords.filter((p) =>
          bounds.contains([Number(p.latitude), Number(p.longitude)])
        )
      : withCoords;

  const center = withCoords.length
    ? [
        withCoords.reduce((s, p) => s + Number(p.latitude), 0) / withCoords.length,
        withCoords.reduce((s, p) => s + Number(p.longitude), 0) / withCoords.length,
      ]
    : [36.8065, 10.1815];

  if (!withCoords.length) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-400">Aucun bien avec coordonnées GPS disponibles.</p>
        <p className="mt-2 text-xs text-slate-400">Ajoutez des coordonnées latitude/longitude dans l'administration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-ink dark:text-white">{visible.length}</span>
          {" "}bien{visible.length !== 1 ? "s" : ""} affiché{visible.length !== 1 ? "s" : ""}
          {filterByView && bounds && withCoords.length !== visible.length && (
            <span className="ml-2 text-xs text-bronze">
              ({withCoords.length - visible.length} hors vue)
            </span>
          )}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="relative inline-flex h-5 w-9 items-center">
            <input
              type="checkbox"
              className="sr-only"
              checked={filterByView}
              onChange={(e) => setFilterByView(e.target.checked)}
            />
            <span className={`h-5 w-9 rounded-full transition-colors ${filterByView ? "bg-bronze" : "bg-slate-200 dark:bg-slate-700"}`} />
            <span className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${filterByView ? "translate-x-4" : ""}`} />
          </span>
          Filtrer par vue
        </label>
      </div>

      {/* Map */}
      <div
        className="overflow-hidden rounded-[28px] border border-slate-200 shadow-soft dark:border-slate-800"
        style={{ height: "clamp(320px, 60vh, 580px)" }}
      >
        <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsTracker onBoundsChange={setBounds} />
          {visible.map((property) => (
            <Marker
              key={property.id}
              position={[Number(property.latitude), Number(property.longitude)]}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{property.city}</p>
                  <p className="mt-1 font-semibold text-slate-800">{property.title}</p>
                  <p className="mt-1 text-sm font-bold text-green-800">{formatPrice(property.price)}</p>
                  <Link
                    to={`/properties/${property.id}`}
                    className="mt-3 block text-center text-xs font-semibold text-green-900 underline"
                  >
                    Voir le bien →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertyMap;
