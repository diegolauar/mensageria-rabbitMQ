import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql", // Adicione esta linha
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Mude de connectionString para url
  },
  // Opções adicionais recomendadas:
  verbose: true,
  strict: true,
} satisfies Config;