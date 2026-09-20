import { adsensePublisherId } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export async function GET() {
  const publisherId = adsensePublisherId();

  if (!publisherId) {
    return new Response("ads.txt is not configured.\n", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}
