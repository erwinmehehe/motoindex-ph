import { afterEach, describe, expect, it, vi } from "vitest";
import { adsenseEnabled } from "../lib/adsense";

afterEach(() => vi.unstubAllEnvs());

describe("explicit advertising activation", () => {
  it("does not load advertising when the flag is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "");
    expect(adsenseEnabled()).toBe(false);
  });

  it("does not load advertising when the flag is false", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "false");
    expect(adsenseEnabled()).toBe(false);
  });

  it("enables configured advertising only with explicit true", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-1900865456140693");
    expect(adsenseEnabled()).toBe(true);
  });

  it("rejects malformed client IDs even when enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID", "ca-pub-invalid");
    expect(adsenseEnabled()).toBe(false);
  });
});
