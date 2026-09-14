import { expect, test } from "@playwright/test";
import { STORE_SLUG, expectGated, expectNoLeak, serverHtml } from "../fixtures";

const FRAUD_ROUTES = ["/admin/fraud", "/admin/fraud/audit", "/admin/fraud/ad-defense", "/root/fraud"];

test.describe("fraud_loop", () => {
  for (const route of FRAUD_ROUTES) {
    test(`${route} is staff-only`, async ({ page }) => {
      await expectGated(page, route);
    });
  }

  test("no risk internals reach a public page", async ({ page }) => {
    for (const path of ["/", `/store/${STORE_SLUG}`, `/store/${STORE_SLUG}/checkout`]) {
      const { body } = await serverHtml(page, path);
      expectNoLeak(body, [
        /risk_score/,
        /fraud_rule/,
        /blacklist_kind/,
        /"threshold"\s*:/,
        /honeypot/i,
      ]);
    }
  });

  test("anonymous reads and writes on fraud tables are refused", async ({ page }) => {
    const url = process.env["VITE_SUPABASE_URL"];
    const key = process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    test.skip(!url || !key, "backend credentials absent");
    for (const table of ["fraud_cases", "fraud_rules", "fraud_blacklist", "fraud_audit"]) {
      const read = await page.request.get(`${url}/rest/v1/${table}?select=id&limit=1`, {
        headers: { apikey: key!, Accept: "application/json" },
        failOnStatusCode: false,
      });
      if (read.ok()) expect(await read.json()).toEqual([]);
      else expect([401, 403, 404]).toContain(read.status());
    }
    const write = await page.request.post(`${url}/rest/v1/fraud_blacklist`, {
      headers: { apikey: key!, "Content-Type": "application/json" },
      data: { kind: "phone", value: "+8801700000000" },
      failOnStatusCode: false,
    });
    expect(write.ok()).toBeFalsy();
  });
});
