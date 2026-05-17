import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const bronzeIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(price);

const PropertyMap = ({ properties }) => {
  const withCoords = properties.filter(
    (p) => p.latitude && p.longitude && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
  );

  // Centre de la carte : moyenne des coordonnées disponibles, sinon Tunis par défaut
  const center = withCoords.length
    ? [
        withCoords.reduce((sum, p) => sum + Number(p.latitude), 0) / withCoords.length,
        withCoords.reduce((sum, p) => sum + Number(p.longitude), 0) / withCoords.length
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
    <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-soft dark:border-slate-800" style={{ height: "600px" }}>
      <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((property) => (
          <Marker
            key={property.id}
            position={[Number(property.latitude), Number(property.longitude)]}
            icon={bronzeIcon}
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
  );
};

export default PropertyMap;
