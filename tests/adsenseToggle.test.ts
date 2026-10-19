import { afterEach, describe, expect, it, vi } from "vitest";
import { adsenseClientId, adsenseEnabled, adsensePublisherId } from "../lib/adsense";
import { GET as adsTxt } from "../app/ads.txt/route";

afterEach(() => vi.unstubAllEnvs());

describe("existing AdSense publisher, explicit activation", () => {
  it("keeps the pinned site publisher but disables script loading without explicit owner opt-in", () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "");
    expect(adsensePublisherId()).toBe("pub-1900865456140693");
    expect(adsenseClientId()).toBe("ca-pub-1900865456140693");
    expect(adsenseEnabled()).toBe(false);
  });

  it("does not load ads on false, unset, or misspelled activation flags", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-0000000000000000");
    for (const value of ["", "false", "TRUE", "yes"]) {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", value);
      expect(adsenseEnabled()).toBe(false);
    }
  });

  it("requires BOTH operator opt-ins and a valid current client ID", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-0000000000000000");
    expect(adsenseEnabled()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-invalid");
    expect(adsenseEnabled()).toBe(false);
  });

  it("fails closed if someone enables AdSense before release gates are approved", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-1900865456140693");
    for (const value of ["", "false", "TRUE", "yes"]) {
      vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", value);
      expect(adsenseEnabled()).toBe(false);
    }
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED", "true");
    expect(adsenseEnabled()).toBe(true);
  });

  it("rejects explicitly malformed publisher identifiers rather than publishing them", async () => {
    for (const bad of ["ca-pub-0000000000000000", "pub-abc", "pub-00000000000000001"]) {
      vi.stubEnv("ADSENSE_PUBLISHER_ID", bad);
      expect(adsensePublisherId()).toBeNull();
      const response = await adsTxt();
      expect(response.status).toBe(404);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(await response.text()).not.toContain("DIRECT");
    }
  });

  it("retains existing root ads.txt seller record on an unset override", async () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "");
    const response = await adsTxt();
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("google.com, pub-1900865456140693, DIRECT");
  });

  it("supports an explicitly configured replacement account after independent approval", async () => {
    vi.stubEnv("ADSENSE_PUBLISHER_ID", "pub-0000000000000000");
    const response = await adsTxt();
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("google.com, pub-0000000000000000, DIRECT");
  });
});
