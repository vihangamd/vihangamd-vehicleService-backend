import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "auto-service",
  password: process.env.DB_PASSWORD || "12341",
  port: process.env.DB_PORT || 5432,
});

export default pool;
