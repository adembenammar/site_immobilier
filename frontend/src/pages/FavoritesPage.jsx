import { useEffect, useState } from "react";
import PropertyCard from "../components/property/PropertyCard";
import SectionHeading from "../components/common/SectionHeading";
import EmptyState from "../components/common/EmptyState";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("tentation-favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  return (
    <section className="section-shell py-16">
      <SectionHeading
        eyebrow="Favoris"
        title="Vos biens sauvegardes"
        description="Les favoris sont conserves localement sur cet appareil, sans compte client."
      />
      <div className="mt-10">
        {favorites.length ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState title="Aucun favori" description="Ajoutez des biens a votre selection pour les retrouver ici." />
        )}
      </div>
    </section>
  );
};

export default FavoritesPage;
