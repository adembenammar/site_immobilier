import mysql from "mysql2/promise";
import { env } from "./env.js";

const connectionConfig = {
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  namedPlaceholders: true
};

export const pool = {
  async query(sql, params) {
    const connection = await mysql.createConnection(connectionConfig);

    try {
      return await connection.query(sql, params);
    } finally {
      await connection.end();
    }
  }
};
