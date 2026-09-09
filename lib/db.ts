/**
 * Legacy database compatibility shim.
 *
 * MotoIndex's public research site does not require a database. Prisma was
 * removed from the Cloudflare Workers build to keep the deployment small and
 * free-tier friendly. Existing optional database-backed modules can still
 * import this file, but they fail closed until they are migrated to a
 * Workers-native persistence layer such as Supabase.
 */

export function databaseConfigured() {
  return false;
}

function unavailable(operation: string): never {
  throw new Error(
    `Database operation "${operation}" is unavailable in the Cloudflare build. This feature has not been migrated to Supabase yet.`
  );
}

function createUnavailableProxy(path = "prisma"): any {
  return new Proxy(
    function () {},
    {
      get(_target, property) {
        if (property === "then") return undefined;
        return createUnavailableProxy(`${path}.${String(property)}`);
      },
      apply() {
        return unavailable(path);
      }
    }
  );
}

// Temporary compatibility export so optional legacy modules continue to
// typecheck while their persistence is migrated away from Prisma.
export const prisma: any = createUnavailableProxy();
