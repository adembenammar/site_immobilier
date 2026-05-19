CREATE DATABASE IF NOT EXISTS elite_estates CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE elite_estates;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(190) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin', 'agent', 'client') NOT NULL DEFAULT 'client',
  phone      VARCHAR(30) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  slug       VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  category_id      INT NULL,
  title            VARCHAR(200) NOT NULL,
  slug             VARCHAR(220) NOT NULL UNIQUE,
  description      TEXT NOT NULL,
  city             VARCHAR(120) NOT NULL,
  address          VARCHAR(255) NOT NULL,
  price            DECIMAL(12, 2) NOT NULL,
  surface          INT NOT NULL,
  rooms            INT NOT NULL,
  bedrooms         INT NOT NULL,
  bathrooms        INT NOT NULL,
  transaction_type ENUM('sale', 'rent') NOT NULL DEFAULT 'sale',
  status           ENUM('available', 'reserved', 'sold') NOT NULL DEFAULT 'available',
  featured_badge   VARCHAR(80) NULL,
  latitude         DECIMAL(10, 7) NULL,
  longitude        DECIMAL(10, 7) NULL,
  is_featured      TINYINT(1) NOT NULL DEFAULT 0,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_properties_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_city             (city),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_status           (status),
  INDEX idx_is_featured      (is_featured)
);

CREATE TABLE IF NOT EXISTS property_images (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  is_cover    TINYINT(1) NOT NULL DEFAULT 0,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_images_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_images_property (property_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  property_id INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, property_id),
  CONSTRAINT fk_favorites_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_favorites_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NULL,
  full_name   VARCHAR(160) NOT NULL,
  email       VARCHAR(190) NOT NULL,
  phone       VARCHAR(30) NULL,
  message     TEXT NOT NULL,
  status      ENUM('pending', 'read', 'done') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contact_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_contact_status     (status),
  INDEX idx_contact_created_at (created_at)
);
