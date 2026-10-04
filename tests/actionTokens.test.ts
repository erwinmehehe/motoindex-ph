import { afterEach, describe, expect, it } from "vitest";
import { hashBearerToken, newBearerToken, priceAlertActionToken, verifyPriceAlertActionToken } from "../lib/actionTokens";

describe("action tokens",()=>{
  afterEach(()=>{delete process.env.PRICE_ALERT_TOKEN_SECRET;});
  it("stores bearer tokens by irreversible hash",()=>{
    const token=newBearerToken();
    expect(token.length).toBeGreaterThan(30);
    expect(hashBearerToken(token)).not.toBe(token);
    expect(hashBearerToken(token)).toHaveLength(64);
    expect(hashBearerToken(token)).toBe(hashBearerToken(token));
  });
  it("signs price-alert actions without database token storage",()=>{
    process.env.PRICE_ALERT_TOKEN_SECRET="test-secret-with-enough-entropy";
    const token=priceAlertActionToken("sub_123","Rider@Example.com","confirm");
    expect(verifyPriceAlertActionToken(token,"rider@example.com","confirm")).toBe("sub_123");
    expect(verifyPriceAlertActionToken(token,"other@example.com","confirm")).toBeNull();
    expect(verifyPriceAlertActionToken(token,"rider@example.com","unsubscribe")).toBeNull();
    expect(verifyPriceAlertActionToken(token+"x","rider@example.com","confirm")).toBeNull();
  });
});
