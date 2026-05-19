import { pool } from "../config/db.js";
import { buildPropertyFilters } from "../utils/queryBuilder.js";

const toBoolean = (value) => value === true || value === "true" || value === 1 || value === "1";

const baseSelect = `
  SELECT
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    (
      SELECT pi.image_url
      FROM property_images pi
      WHERE pi.property_id = p.id
      ORDER BY pi.is_cover DESC, pi.sort_order ASC, pi.id ASC
      LIMIT 1
    ) AS cover_image
  FROM properties p
  LEFT JOIN categories c ON c.id = p.category_id
`;

export const propertyModel = {
  async list(query = {}) {
    const { whereClause, values } = buildPropertyFilters(query);
    const [rows] = await pool.query(
      `${baseSelect}
       ${whereClause}
       ORDER BY p.is_featured DESC, p.created_at DESC`,
      values
    );
    return rows;
  },

  async featured(limit = 6) {
    const [rows] = await pool.query(
      `${baseSelect}
       WHERE p.is_featured = 1
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(`${baseSelect} WHERE p.id = ?`, [id]);
    const property = rows[0];
    if (!property) return null;

    const [images] = await pool.query(
      "SELECT id, image_url, is_cover, sort_order FROM property_images WHERE property_id = ? ORDER BY sort_order ASC, is_cover DESC, id ASC",
      [id]
    );
    property.images = images;
    return property;
  },

  async create(payload) {
    const [result] = await pool.query(
      `INSERT INTO properties (
        title, slug, description, city, address, price, surface, rooms, bedrooms, bathrooms,
        transaction_type, status, featured_badge, latitude, longitude, category_id, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.title,
        payload.slug,
        payload.description,
        payload.city,
        payload.address,
        payload.price,
        payload.surface,
        payload.rooms,
        payload.bedrooms,
        payload.bathrooms,
        payload.transactionType,
        payload.status,
        payload.featuredBadge || null,
        payload.latitude    || null,
        payload.longitude   || null,
        payload.categoryId,
        toBoolean(payload.isFeatured) ? 1 : 0
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, payload) {
    await pool.query(
      `UPDATE properties
       SET title = ?, slug = ?, description = ?, city = ?, address = ?, price = ?, surface = ?, rooms = ?,
           bedrooms = ?, bathrooms = ?, transaction_type = ?, status = ?, featured_badge = ?, latitude = ?,
           longitude = ?, category_id = ?, is_featured = ?
       WHERE id = ?`,
      [
        payload.title,
        payload.slug,
        payload.description,
        payload.city,
        payload.address,
        payload.price,
        payload.surface,
        payload.rooms,
        payload.bedrooms,
        payload.bathrooms,
        payload.transactionType,
        payload.status,
        payload.featuredBadge || null,
        payload.latitude    || null,
        payload.longitude   || null,
        payload.categoryId,
        toBoolean(payload.isFeatured) ? 1 : 0,
        id
      ]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query("DELETE FROM properties WHERE id = ?", [id]);
  },

  /* ── Images ── */

  async addImage(propertyId, imageUrl, isCover = false, sortOrder = 0) {
    await pool.query(
      "INSERT INTO property_images (property_id, image_url, is_cover, sort_order) VALUES (?, ?, ?, ?)",
      [propertyId, imageUrl, isCover ? 1 : 0, sortOrder]
    );
  },

  async findImageById(imageId) {
    const [rows] = await pool.query(
      "SELECT id, property_id, image_url, is_cover, sort_order FROM property_images WHERE id = ?",
      [imageId]
    );
    return rows[0] || null;
  },

  async findImagesByPropertyId(propertyId) {
    const [rows] = await pool.query(
      "SELECT id, property_id, image_url, is_cover, sort_order FROM property_images WHERE property_id = ? ORDER BY sort_order ASC, id ASC",
      [propertyId]
    );
    return rows;
  },

  async removeImage(imageId) {
    await pool.query("DELETE FROM property_images WHERE id = ?", [imageId]);
  },

  async setCoverImage(propertyId, imageId) {
    await pool.query("UPDATE property_images SET is_cover = 0 WHERE property_id = ?", [propertyId]);
    await pool.query("UPDATE property_images SET is_cover = 1 WHERE id = ? AND property_id = ?", [imageId, propertyId]);
  },

  async updateImageOrder(imageId, sortOrder) {
    await pool.query("UPDATE property_images SET sort_order = ? WHERE id = ?", [sortOrder, imageId]);
  }
};
