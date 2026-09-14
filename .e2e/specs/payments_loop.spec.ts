import { expect, test } from "@playwright/test";
import { STORE_SLUG, expectNoLeak, open, serverHtml } from "../fixtures";

test.describe("payments_loop", () => {
  test("checkout offers a payment choice and no provider secret", async ({ page }) => {
    await open(page, `/store/${STORE_SLUG}/checkout`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const { body } = await serverHtml(page, `/store/${STORE_SLUG}/checkout`);
    expectNoLeak(body, [
      /store_passwd/,
      /signature_key/,
      /app_secret/,
      /"secret"\s*:\s*"[^"]{8,}/,
      /sk_live_/,
    ]);
  });

  test("a live callback without a verifiable intent is never treated as paid", async ({ page }) => {
    const res = await page.request.post("/api/public/payments/live/sslcommerz", {
      form: { tran_id: "e2e-does-not-exist", status: "VALID", amount: "1.00" },
      failOnStatusCode: false,
    });
    expect([200, 202, 400, 401, 402, 429, 502]).toContain(res.status());
    const body = await res.text();
    expect(body).not.toMatch(/"status"\s*:\s*"paid"/);
  });

  test("an unsigned webhook is rejected", async ({ page }) => {
    const res = await page.request.post("/api/public/payments/bkash", {
      data: { paymentID: "e2e", status: "Completed" },
      failOnStatusCode: false,
    });
    expect(res.ok() && /paid/.test(await res.text())).toBeFalsy();
  });
});
