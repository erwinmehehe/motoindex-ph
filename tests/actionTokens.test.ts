import { describe, expect, it } from "vitest";
import { actionToken, hashActionToken, validActionToken } from "../lib/actionTokens";

describe("action tokens",()=>{
  it("generates high-entropy URL-safe tokens",()=>{
    const a=actionToken();
    const b=actionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(40);
    expect(validActionToken(a)).toBe(true);
  });

  it("stores only deterministic one-way hashes",()=>{
    const token=actionToken();
    const hash=hashActionToken(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(token);
    expect(hashActionToken(token)).toBe(hash);
  });
});
