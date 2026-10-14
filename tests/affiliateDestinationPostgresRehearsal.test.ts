import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Run the actual Prisma migration against a throwaway PostgreSQL database
 * inside a GitHub Actions Ubuntu runner. Never use the supplied DATABASE_URL.
 * Local development skips this test; no service or sudo changes are made.
 */
const hostedRunner =
  process.env.GITHUB_ACTIONS === "true" &&
  process.env.RUNNER_OS === "Linux" &&
  process.platform === "linux";

type CmdOptions = { env?: NodeJS.ProcessEnv; timeout?: number };

function run(bin: string, args: string[], options: CmdOptions = {}) {
  try {
    return execFileSync(bin, args, {
      cwd: process.cwd(),
      env: options.env ?? process.env,
      timeout: options.timeout ?? 90_000,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    const thrown = error as Error & { stdout?: string; stderr?: string };
    const detail = String(thrown.stderr || thrown.stdout || thrown.message);
    throw new Error(path.basename(bin) + " failed: " + detail.slice(-2200));
  }
}

describe("PostgreSQL affiliate destination migration (runner-local only)", () => {
  it.skipIf(!hostedRunner)(
    "preserves legacy rows when the nullable destination is deployed",
    () => {
      const stamp = randomBytes(5).toString("hex");
      const role = "motoindex_ci_" + stamp;
      const db = "motoindex_affiliate_ci_" + stamp;
      const password = "disposable_" + stamp;
      const localUrl = "postgresql://" + role + ":" + password +
        "@127.0.0.1:5432/" + db + "?schema=public";
      const target = new URL(localUrl);
      expect(target.hostname).toBe("127.0.0.1");
      expect(target.pathname).toBe("/" + db);
      expect(db).toMatch(/^motoindex_affiliate_ci_[a-f0-9]{10}$/);

      const workspace = mkdtempSync(path.join(tmpdir(), "motoindex-affiliate-migrate-"));
      const schemaFile = path.join(workspace, "schema.prisma");
      const latest = "20261009120000_add_affiliate_exact_destination";
      const migrationsDir = path.join(workspace, "migrations");
      const cli = path.join(process.cwd(), "node_modules", ".bin", "prisma");
      let roleCreated = false;
      let dbCreated = false;

      const admin = (statement: string) =>
        run("sudo", [
          "-u", "postgres", "psql", "-X", "-v", "ON_ERROR_STOP=1",
          "-h", "/var/run/postgresql", "-d", "postgres", "-c", statement
        ], { env: { PATH: process.env.PATH, HOME: "/tmp", NODE_ENV: "test" } });
      const localEnv = {
        ...process.env,
        DATABASE_URL: localUrl,
        PGHOST: "127.0.0.1",
        PGPORT: "5432",
        PGUSER: role,
        PGPASSWORD: password,
        PGDATABASE: db
      };
      const prisma = (...args: string[]) =>
        run(cli, args, { env: localEnv, timeout: 120_000 });

      try {
        if (!existsSync(cli)) throw new Error("Prisma CLI not installed.");
        run("sudo", ["systemctl", "start", "postgresql.service"], {
          env: { PATH: process.env.PATH, HOME: "/tmp", NODE_ENV: "test" },
          timeout: 30_000
        });
        admin('CREATE ROLE "' + role + '" LOGIN PASSWORD ' + "'" + password + "'");
        roleCreated = true;
        admin('CREATE DATABASE "' + db + '" OWNER "' + role + '"');
        dbCreated = true;

        // Apply every historical migration but exclude this PR's new column.
        copyFileSync(path.join("prisma", "schema.prisma"), schemaFile);
        cpSync(path.join("prisma", "migrations"), migrationsDir, { recursive: true });
        rmSync(path.join(migrationsDir, latest), { recursive: true, force: true });
        expect(existsSync(path.join(migrationsDir, latest))).toBe(false);
        prisma("migrate", "deploy", "--schema", schemaFile);

        // Test an existing record with the real pre-migration PostgreSQL table.
        prisma(
          "db", "execute",
          "--file", path.resolve("scripts/sql/affiliate-destination-pre-migration.sql"),
          "--schema", schemaFile
        );

        // Apply the checked-in migration and execute real SQL assertions.
        cpSync(path.join("prisma", "migrations", latest),
          path.join(migrationsDir, latest), { recursive: true });
        prisma("migrate", "deploy", "--schema", schemaFile);
        prisma(
          "db", "execute",
          "--file", path.resolve("scripts/sql/affiliate-destination-post-migration.sql"),
          "--schema", schemaFile
        );

        // Redeploying must be idempotent.
        const repeat = prisma("migrate", "deploy", "--schema", schemaFile);
        expect(repeat).toMatch(/No pending migrations/i);
        const status = prisma("migrate", "status", "--schema", schemaFile);
        expect(status).toMatch(/up to date/i);
      } finally {
        // Only the random, runner-local resources created by this test.
        if (dbCreated) {
          try { admin('DROP DATABASE IF EXISTS "' + db + '" WITH (FORCE)'); }
          catch { /* runner teardown removes the throwaway database */ }
        }
        if (roleCreated) {
          try { admin('DROP ROLE IF EXISTS "' + role + '"'); }
          catch { /* runner teardown removes the throwaway role */ }
        }
        rmSync(workspace, { recursive: true, force: true });
      }
    },
    240_000
  );
});
