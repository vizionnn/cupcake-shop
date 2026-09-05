import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Conexão com o PostgreSQL do Supabase via DATABASE_URL
// No Supabase: Project Settings -> Database -> Connection string -> URI
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "nuvem-de-acucar-super-secret-key-change-in-production-123456",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
});
