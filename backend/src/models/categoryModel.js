import { pool } from "../config/db.js";

export const categoryModel = {
  async list() {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
    return rows;
  },

  async create({ name, slug }) {
    const [result] = await pool.query("INSERT INTO categories (name, slug) VALUES (?, ?)", [name, slug]);
    return { id: result.insertId, name, slug };
  },

  async update(id, { name, slug }) {
    await pool.query("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [name, slug, id]);
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async remove(id) {
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  }
};
