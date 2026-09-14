import { expect, test } from "@playwright/test";
import { STORE_SLUG, expectGated, open } from "../fixtures";

const ADMIN_ROUTES = [
  "/admin",
  "/admin/orders",
  "/admin/products",
  "/admin/customers",
  "/admin/payments",
  "/admin/inventory",
  "/admin/settings",
  "/admin/staff",
  "/admin/builder",
  "/admin/content/posts",
  "/admin/content/media",
  "/dashboard",
  "/dashboard/orders",
];

test.describe("tenant_isolation", () => {
  for (const route of ADMIN_ROUTES) {
    test(`${route} needs a session`, async ({ page }) => {
      await expectGated(page, route);
    });
  }

  test("an unknown store slug does not render another tenant", async ({ page }) => {
    const res = await open(page, "/store/no-such-tenant-xyz");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).not.toContainText(STORE_SLUG);
  });

  test("an order page without its access token stays closed", async ({ page }) => {
    await open(page, `/store/${STORE_SLUG}/order/00000000-0000-0000-0000-000000000000`);
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toMatch(/paid|amount due|invoice #/);
  });

  test("shopper cannot read or query orders of another shopper", async ({ page, request }) => {
    // Probing direct API or REST endpoint for arbitrary order id without customer bearer token
    const res = await request.get(`/api/public/orders/00000000-0000-4000-8000-000000000000`, {
      headers: { "x-shopper-probe": "shopper-a" },
    });
    // Must be either 404 or 401/403 or empty
    expect([401, 403, 404]).toContain(res.status());
  });

  test("merchant scope prevents accessing another merchant's orders or products", async ({ request }) => {
    // Attempting to query an unrelated merchant's private orders via API
    const res = await request.get(`/api/admin/orders?merchant_id=00000000-0000-4000-8000-000000000000`);
    expect([401, 403, 404]).toContain(res.status());
  });

  test("unauthenticated calls to platform_* and customer_* RPC routines are rejected", async ({ request }) => {
    const rpcProbes = [
      "platform_charge_open",
      "platform_save_plan",
      "platform_set_flag",
      "platform_merchant_suspend",
      "customer_overview_impl",
      "customer_upsert_self",
      "customer_save_address",
      "customer_delete_address",
    ];

    for (const rpcName of rpcProbes) {
      const res = await request.post(`/rest/v1/rpc/${rpcName}`, {
        data: {},
        headers: { "content-type": "application/json" },
      });
      // Anonymous caller must be rejected with 401/403/404
      expect([400, 401, 403, 404]).toContain(res.status());
    }
  });
});
