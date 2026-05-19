import mysql from "mysql2/promise";
import { env } from "./env.js";

/* ── Real connection pool (not a new TCP connection per query) ── */
export const pool = mysql.createPool({
  host:             env.db.host,
  port:             env.db.port,
  user:             env.db.user,
  password:         env.db.password,
  database:         env.db.database,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
});
