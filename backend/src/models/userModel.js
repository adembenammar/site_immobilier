import { pool } from "../config/db.js";

export const userModel = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, role, phone, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(payload) {
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.password,
        payload.role || "client",
        payload.phone || null
      ]
    );

    return this.findById(result.insertId);
  },

  async list() {
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, email, role, phone, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },

  async updateRole(id, role) {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    return this.findById(id);
  }
};
