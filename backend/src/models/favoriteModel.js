import { pool } from "../config/db.js";

export const favoriteModel = {
  async listByUser(userId) {
    const [rows] = await pool.query(
      `SELECT f.id, p.id AS property_id, p.title, p.city, p.price,
              (
                SELECT pi.image_url
                FROM property_images pi
                WHERE pi.property_id = p.id
                ORDER BY pi.is_cover DESC, pi.id ASC
                LIMIT 1
              ) AS cover_image
       FROM favorites f
       INNER JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async toggle(userId, propertyId) {
    const [existing] = await pool.query(
      "SELECT id FROM favorites WHERE user_id = ? AND property_id = ?",
      [userId, propertyId]
    );

    if (existing[0]) {
      await pool.query("DELETE FROM favorites WHERE id = ?", [existing[0].id]);
      return { favorite: false };
    }

    await pool.query("INSERT INTO favorites (user_id, property_id) VALUES (?, ?)", [userId, propertyId]);
    return { favorite: true };
  }
};
