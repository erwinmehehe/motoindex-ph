import "server-only";
import { connection } from "next/server";
import { headers } from "next/headers";
import { adsenseEnabled } from "@/lib/adsense";

/**
 * Public motorcycle pages keep their existing static rendering when ads are
 * disabled. In an approved AdSense build, require a fresh HTML document nonce
 * before rendering the Google bootstrap or any manual ad placement.
 *
 * RSC/prefetch navigations and non-ad query URLs have no nonce and fail closed.
 */
export async function motorcycleAdNonce(): Promise<string | undefined> {
  if (!adsenseEnabled()) return undefined;
  await connection();
  return (await headers()).get("x-nonce") || undefined;
}
