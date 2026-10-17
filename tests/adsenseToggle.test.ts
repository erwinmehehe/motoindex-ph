import { afterEach, describe, expect, it, vi } from "vitest";
import { adsenseClientId, adsenseEnabled, adsensePublisherId } from "../lib/adsense";
import { GET as adsTxt } from "../app/ads.txt/route";

afterEach(() => vi.unstubAllEnvs());

describe("explicit advertising activation", () => {
  it("never uses a hardcoded publisher or client fallback", () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "");
    expect(adsenseClientId()).toBeNull();
    expect(adsensePublisherId()).toBeNull();
    expect(adsenseEnabled()).toBe(false);
  });
  it("does not enable advertising on false, unset, or misspelled flags", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-0000000000000000");
    for (const value of ["", "false", "TRUE", "yes"]) {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", value);
      expect(adsenseEnabled()).toBe(false);
    }
  });
  it("enables only with an explicit true and a valid configured client", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-0000000000000000");
    expect(adsenseEnabled()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-invalid");
    expect(adsenseEnabled()).toBe(false);
  });
  it("returns 404 ads.txt until the authorized publisher is configured", async () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "");
    const res = await adsTxt();
    expect(res.status).toBe(404);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
  it("refuses malformed or missing publisher IDs without publishing an ads.txt seller record", async () => {
    for (const bad of ["", "ca-pub-0000000000000000", "pub-abc", "pub-00000000000000001"]) {
      vi.stubEnv("ADSENSE_PUBLISHER_ID", bad);
      expect(adsensePublisherId()).toBeNull();
      const res = await adsTxt();
      expect(res.status).toBe(404);
      expect(res.headers.get("cache-control")).toBe("no-store");
      expect(await res.text()).not.toContain("DIRECT");
    }
  });
  it("publishes the explicitly configured ads.txt account only", async () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "pub-0000000000000000");
    const res = await adsTxt();
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("google.com, pub-0000000000000000, DIRECT");
  });
});
