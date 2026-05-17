import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    // Migrations légères — ajout de colonnes manquantes sans casser l'existant
    await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending'`);
    await pool.query(`ALTER TABLE property_images ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0`);
    app.listen(env.port, () => {
      console.log(`Backend listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
