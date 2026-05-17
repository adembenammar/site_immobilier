USE elite_estates;

INSERT INTO categories (name, slug) VALUES
('Villa', 'villa'),
('Appartement', 'apartment'),
('Penthouse', 'penthouse'),
('Maison de ville', 'townhouse')
ON DUPLICATE KEY UPDATE name = VALUES(name);

DELETE FROM users WHERE email <> 'admin@tentation-immobiliere.com';

INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES
('Admin', 'Tentation', 'admin@tentation-immobiliere.com', '$2b$10$ruQMpb6IXTwYQriWsh809ujEhxNmlVwk.0RE7EeraRwHAQaegedjq', 'admin', '+33 6 00 00 00 00')
ON DUPLICATE KEY UPDATE
first_name = VALUES(first_name),
last_name = VALUES(last_name),
password = VALUES(password),
role = VALUES(role),
phone = VALUES(phone);

INSERT INTO properties (
  category_id, title, slug, description, city, address, price, surface, rooms, bedrooms, bathrooms,
  transaction_type, status, featured_badge, latitude, longitude, is_featured
) VALUES
(
  1,
  'Villa panoramique avec jardin mediterraneen',
  'villa-panoramique-jardin-mediterraneen',
  'Une propriete contemporaine pensee pour une clientele exigeante, avec de larges baies vitrees, terrasse plein sud, piscine et prestations premium.',
  'Nice',
  '12 promenade des Arts, Nice',
  2450000,
  280,
  7,
  4,
  3,
  'sale',
  'available',
  'Vue mer',
  43.7101728,
  7.2619532,
  1
),
(
  2,
  'Appartement signature au coeur de Paris',
  'appartement-signature-coeur-paris',
  'Appartement haut de gamme renove avec materiaux nobles, balcon filant, cuisine sur mesure et adresse recherchee.',
  'Paris',
  '48 avenue Kleber, Paris',
  1490000,
  135,
  5,
  3,
  2,
  'sale',
  'available',
  'Exclusivite',
  48.866667,
  2.333333,
  1
),
(
  3,
  'Penthouse lumineux avec rooftop prive',
  'penthouse-lumineux-rooftop-prive',
  'Dernier etage baigne de lumiere avec rooftop amenage, domotique complete et vue degagee sur la ville.',
  'Lyon',
  '5 quai Saint-Antoine, Lyon',
  980000,
  160,
  5,
  3,
  2,
  'sale',
  'available',
  'Nouveau',
  45.764043,
  4.835659,
  1
),
(
  4,
  'Maison de ville design pour location premium',
  'maison-ville-design-location-premium',
  'Maison meublee avec patio, bureau, suite parentale et finitions chaleureuses, ideale pour une location longue duree.',
  'Bordeaux',
  '18 rue Judaique, Bordeaux',
  4200,
  175,
  6,
  4,
  3,
  'rent',
  'available',
  'Location',
  44.837789,
  -0.57918,
  0
)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO property_images (property_id, image_url, is_cover) VALUES
(1, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 1),
(1, 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 0),
(2, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80', 1),
(3, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 1),
(4, 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80', 1);
