import { spawnSync } from "node:child_process";

const env = { ...process.env };
if (!env.DATABASE_URL) {
  // Prisma CLI validates the datasource URL even though the research launch does not use persistence.
  // This value is validation-only; no connection is attempted by `prisma validate`.
  env.DATABASE_URL = "postgresql://validation:validation@127.0.0.1:5432/motoindex_validation";
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", "validate"], { stdio: "inherit", env });
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
