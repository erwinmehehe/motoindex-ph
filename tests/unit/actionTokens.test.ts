import { beforeEach, describe, expect, it } from "vitest";
import { actionLinkSecretConfigured, hashActionToken, newActionToken, signedUnsubscribeToken, verifySignedUnsubscribeToken } from "../../lib/actionTokens";

describe("action token security",()=>{
  beforeEach(()=>{process.env.ACTION_LINK_SECRET="test-secret-that-is-longer-than-thirty-two-characters";});

  it("creates high-entropy tokens and stores only stable hashes",()=>{
    const a=newActionToken();
    const b=newActionToken();
    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThan(30);
    expect(a.tokenHash).toBe(hashActionToken(a.token));
    expect(a.tokenHash).not.toContain(a.token);
  });

  it("signs unsubscribe links and rejects tampering",()=>{
    expect(actionLinkSecretConfigured()).toBe(true);
    const token=signedUnsubscribeToken("subscription_123");
    expect(verifySignedUnsubscribeToken(token)).toBe("subscription_123");
    expect(verifySignedUnsubscribeToken(token+"x")).toBeNull();
    expect(verifySignedUnsubscribeToken("subscription_456."+token.split(".")[1])).toBeNull();
  });

  it("fails closed without a sufficiently strong signing secret",()=>{
    process.env.ACTION_LINK_SECRET="short";
    expect(actionLinkSecretConfigured()).toBe(false);
  });
});
