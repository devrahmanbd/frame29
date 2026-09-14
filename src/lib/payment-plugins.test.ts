/**
 * Community plugin contract.
 *
 * A contributed rail is the easiest place for a money bug to hide: nobody at
 * Framique operates the gateway, so the only protection is that the plugin is
 * held to the same rules as a contracted rail. These tests are that contract.
 */
import { describe, expect, it } from "vitest";
import {
  COMMUNITY_PLUGINS,
  COMMUNITY_PLUGIN_IDS,
  communityPlugin,
  isCommunityPlugin,
  pluginNotice,
} from "./payment-plugins";
import {
  authenticateCallback,
  baseUrlFor,
  buildSessionRequest,
  credentialsComplete,
  credentialHints,
  isLiveProvider,
  parseSessionResponse,
  piprapayVerifyRequest,
  readCallback,
} from "./live-gateway";
import { COMMUNITY_METHOD_KEYS, PAYMENT_METHOD_CATALOG, isCommunityMethod } from "./payment-rails";
import { PROVIDER_CATALOG } from "./provider-gate";

const CREDS = { apiKey: "pp-live-key-1234", baseUrl: "https://pay.example.com" };

describe("community plugin registry", () => {
  it("marks every plugin unofficial and community-supported", () => {
    for (const id of COMMUNITY_PLUGIN_IDS) {
      const p = COMMUNITY_PLUGINS[id];
      expect(p.official).toBe(false);
      expect(p.support).toBe("community");
      expect(p.docsUrl).toMatch(/^https:\/\//);
      expect(p.vendor.length).toBeGreaterThan(0);
      // The disclaimer must exist in both languages, and say "not" something.
      expect(pluginNotice(id, "en")).toMatch(/not (operated|supported)/i);
      expect(pluginNotice(id, "bn")?.length ?? 0).toBeGreaterThan(20);
    }
  });

  it("keeps the rail catalogue and the plugin registry in step", () => {
    expect([...COMMUNITY_METHOD_KEYS]).toEqual([...COMMUNITY_PLUGIN_IDS]);
    for (const id of COMMUNITY_PLUGIN_IDS) {
      expect(isCommunityMethod(id)).toBe(true);
      expect(isCommunityPlugin(id)).toBe(true);
      expect(isLiveProvider(id)).toBe(true);
      expect(PAYMENT_METHOD_CATALOG[id].support).toBe("community");
      expect(PROVIDER_CATALOG[id].support).toBe("community");
      // Labelled unofficial/community in both languages, so no shopper or
      // merchant can mistake it for a rail Framique stands behind.
      expect(PROVIDER_CATALOG[id].label.toLowerCase()).toContain("community");
    }
    expect(isCommunityMethod("bkash")).toBe(false);
    expect(communityPlugin("bkash")).toBeNull();
  });
});

describe("piprapay plugin", () => {
  it("is not configured without an https origin of its own", () => {
    expect(credentialsComplete("piprapay", CREDS)).toBe(true);
    expect(credentialsComplete("piprapay", { apiKey: "k" })).toBe(false);
    expect(credentialsComplete("piprapay", { apiKey: "k", baseUrl: "http://pay.example.com" })).toBe(false);
    expect(credentialsComplete("piprapay", { baseUrl: "https://pay.example.com" })).toBe(false);
    // There is no shared default endpoint — the merchant's own origin wins.
    expect(baseUrlFor("piprapay", "live", null, CREDS)).toBe("https://pay.example.com");
    expect(baseUrlFor("piprapay", "live", null, {})).toBe("");
  });

  it("never echoes the API key back, only a hint", () => {
    const hints = credentialHints(CREDS);
    expect(hints["apiKey"]).toBe("••••34");
    expect(JSON.stringify(hints)).not.toContain("pp-live-key");
  });

  it("opens a charge on the merchant's own server with the intent in metadata", () => {
    const req = buildSessionRequest({
      provider: "piprapay",
      mode: "live",
      baseUrl: "https://pay.example.com",
      credentials: CREDS,
      intentId: "11111111-1111-4111-8111-111111111111",
      amountMinorInt: 149_900,
      currencyCode: "BDT",
      callbackUrl: "https://shop.example.com/api/public/payments/live/piprapay",
      returnUrl: "https://shop.example.com/api/public/payments/live/piprapay?redirect=1",
      cancelUrl: "https://shop.example.com/store/demo/checkout?payment=cancelled",
    });
    expect(req.url).toBe("https://pay.example.com/api/create-charge");
    expect(req.headers["mh-piprapay-api-key"]).toBe(CREDS.apiKey);
    const body = JSON.parse(req.body) as Record<string, unknown>;
    expect(body["amount"]).toBe("1499.00");
    expect((body["metadata"] as Record<string, string>)["intent_id"]).toBe(
      "11111111-1111-4111-8111-111111111111",
    );
    expect(body["webhook_url"]).toContain("/api/public/payments/live/piprapay");
  });

  it("reads a session answer without trusting its shape", () => {
    expect(parseSessionResponse("piprapay", { status: true, pp_url: "https://pay.example.com/c/9", pp_id: "9" }))
      .toEqual({ ok: true, redirectUrl: "https://pay.example.com/c/9", providerReference: "9" });
    expect(parseSessionResponse("piprapay", { status: false, message: "bad key" })).toEqual({
      ok: false,
      reason: "bad key",
    });
    expect(parseSessionResponse("piprapay", {})).toEqual({ ok: false, reason: "piprapay_session_rejected" });
  });

  it("matches a callback to the intent it names in metadata, never to the caller's word", () => {
    const verdict = readCallback("piprapay", {
      status: "completed",
      amount: "1499.00",
      pp_id: "9",
      metadata: { intent_id: "abc" },
    });
    expect(verdict).toEqual({
      intentId: "abc",
      status: "paid",
      providerReference: "9",
      amountMinorInt: 149_900,
    });
    expect(readCallback("piprapay", { status: "pending", metadata: {} }).status).toBe("pending");
    expect(readCallback("piprapay", { status: "cancelled", metadata: {} }).status).toBe("cancelled");
    expect(readCallback("piprapay", { status: "failed", metadata: {} }).status).toBe("failed");
    // No metadata at all is an unmatched callback, which the server half rejects.
    expect(readCallback("piprapay", { status: "completed" }).intentId).toBeNull();
  });

  it("drops a callback that does not carry the merchant's own API key", () => {
    expect(authenticateCallback("piprapay", { "mh-piprapay-api-key": CREDS.apiKey }, CREDS)).toBe(true);
    expect(authenticateCallback("piprapay", { "MH-PipraPay-API-Key": CREDS.apiKey }, CREDS)).toBe(true);
    expect(authenticateCallback("piprapay", { "mh-piprapay-api-key": "wrong-key-000000" }, CREDS)).toBe(false);
    expect(authenticateCallback("piprapay", {}, CREDS)).toBe(false);
    expect(authenticateCallback("piprapay", { "mh-piprapay-api-key": "" }, CREDS)).toBe(false);
    // A contracted rail is authenticated by re-validating with the provider.
    expect(authenticateCallback("sslcommerz", {}, { storeId: "s", storePassword: "p" })).toBe(true);
  });

  it("verifies a charge against the merchant's own server before settling", () => {
    const req = piprapayVerifyRequest("https://pay.example.com", CREDS, "9");
    expect(req.url).toBe("https://pay.example.com/api/verify-payments");
    expect(req.headers["mh-piprapay-api-key"]).toBe(CREDS.apiKey);
    expect(JSON.parse(req.body)).toEqual({ transaction_id: "9" });
  });
});
