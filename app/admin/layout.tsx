import type { ReactNode } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess";

export const dynamic = "force-dynamic";

/**
 * Defense in depth: do not render private administrative Server Components
 * unless the production Access identity is independently verified. This
 * prevents data exposure if a rewrite accidentally skips Next middleware.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const denied = await requirePrivilegedApiAccess(
    new Request("https://motoindexph.com/admin", { headers: requestHeaders })
  );
  if (denied) notFound();
  return <>{children}</>;
}
