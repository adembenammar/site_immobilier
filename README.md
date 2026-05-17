# Tentation Immobiliere

Plateforme immobiliere fullstack construite avec `React + Tailwind CSS` cote frontend et `Node.js + Express + MySQL` cote backend. Le projet inclut un dashboard admin, la gestion des biens, categories, utilisateurs, favoris locaux, messages de contact, upload d'images et theme sombre/clair.

Note importante : le fichier `C:\Users\HP\Desktop\site_immobilier\cahier_des_charges_site_immobilier.pdf` n'etait pas present dans le workspace au moment de la generation. L'implementation a donc ete produite a partir du brief fourni, du logo transmis et de l'analyse visuelle du site d'inspiration BARNES.

## Positionnement

- Nom d'agence : `Tentation Immobiliere`
- Logo source : [tentation-logo.jpeg](/C:/Users/HP/Desktop/site_immobilier/frontend/src/assets/tentation-logo.jpeg)
- Authentification : admin uniquement
- Aucune inscription ni connexion cote client
- Favoris publics stockes en `localStorage`

## Stack

- Frontend : `React`, `Vite`, `Tailwind CSS`, `React Router`, `Axios`, `Framer Motion`
- Backend : `Node.js`, `Express`, `JWT`, `Multer`, `express-validator`
- Database : `MySQL`
- Architecture : monorepo simple avec workspaces `frontend` et `backend`

## Architecture

```text
site_immobilier/
|-- backend/
|   |-- database/
|   |   |-- schema.sql
|   |   `-- seed.sql
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       |-- routes/
|       |-- services/
|       |-- uploads/
|       |-- utils/
|       |-- app.js
|       `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- data/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   `-- styles/
|   `-- index.html
`-- package.json
```

## Main features

- Page d'accueil premium avec hero editorial et branding agence
- Catalogue de biens avec filtres `ville`, `prix`, `type`, `nombre de pieces`
- Page detail d'un bien avec galerie, caracteristiques et formulaire de contact
- Favoris sans compte client via stockage local
- Authentification JWT reservee a l'admin
- Dashboard admin :
  - ajout / edition / suppression des biens
  - gestion des categories
  - gestion basique des roles utilisateurs
  - consultation des messages entrants
- Upload d'images via `multer`
- Mode sombre / clair
- Structure REST API
- Validation et gestion d'erreurs
- Base de donnees avec donnees d'exemple

## REST API

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties

- `GET /api/properties`
- `GET /api/properties/featured`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Contacts

- `POST /api/contacts`
- `GET /api/contacts`

### Users

- `GET /api/users`
- `PUT /api/users/:id/role`

## Installation

### 1. Installer les dependances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Backend :

```bash
cp backend/.env.example backend/.env
```

Frontend :

```bash
cp frontend/.env.example frontend/.env
```

Mettre a jour :

- `JWT_SECRET`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `VITE_API_URL`
- `VITE_UPLOADS_URL`

### 3. Creer la base MySQL

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### 4. Lancer le projet

```bash
npm run dev
```

URLs locales :

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:5000`

## Compte admin de demonstration

- Email : `admin@tentation-immobiliere.com`
- Mot de passe : `password123`

## Base de donnees

Le schema complet est dans [schema.sql](/C:/Users/HP/Desktop/site_immobilier/backend/database/schema.sql).

Tables principales :

- `users`
- `categories`
- `properties`
- `property_images`
- `favorites`
- `contact_messages`

## Notes de production

- Les secrets passent par `.env`
- Les routes sensibles utilisent JWT et controle de role
- La connexion publique n'est pas exposee
- Les entrees critiques sont validees cote API
- Les uploads sont isoles dans `backend/src/uploads`

## Future improvements

- Stockage media externe type S3 ou Cloudinary
- Pagination, tri avance et recherche full-text
- Cartes interactives et geolocalisation
- Tests unitaires, integration et CI
- SEO dynamique par bien
- Prise de rendez-vous et espace agent dedie
