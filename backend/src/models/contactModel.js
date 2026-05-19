import { pool } from "../config/db.js";

export const contactModel = {
  async create(payload) {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (property_id, full_name, email, phone, message)
       VALUES (?, ?, ?, ?, ?)`,
      [payload.propertyId || null, payload.fullName, payload.email, payload.phone || null, payload.message]
    );
    // Return the actual DB row (not the raw client payload)
    const [rows] = await pool.query("SELECT * FROM contact_messages WHERE id = ?", [result.insertId]);
    return rows[0];
  },

  async list() {
    const [rows] = await pool.query(
      `SELECT cm.*, p.title AS property_title, p.city AS property_city
       FROM contact_messages cm
       LEFT JOIN properties p ON p.id = cm.property_id
       ORDER BY cm.created_at DESC`
    );
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query("UPDATE contact_messages SET status = ? WHERE id = ?", [status, id]);
    const [rows] = await pool.query("SELECT * FROM contact_messages WHERE id = ?", [id]);
    return rows[0] || null;
  }
};
