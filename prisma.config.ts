
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  engine: "classic",
  datasource: {
    // Not env(): that throws when DATABASE_URL is unset, which breaks `prisma generate` during installs/builds.
    url: process.env.DATABASE_URL ?? "",
  },
});
