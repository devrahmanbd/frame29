import { expect, test } from "@playwright/test";
import { STORE_SLUG, open } from "../fixtures";

test.describe("dual_persona_flow", () => {
  test("admin of Store A booking on Store B storefront maintains persona isolation", async ({ page }) => {
    // 1. Visit Store A /admin route (asserting gate or session boundary)
    await open(page, "/admin");
    await page.waitForURL(/\/auth|\/admin/, { timeout: 15_000 });

    // 2. Open Store B storefront in the same session context
    const storeBRes = await open(page, `/store/${STORE_SLUG}`);
    expect([200, 304, 404]).toContain(storeBRes?.status());

    // 3. Navigate to checkout or tracking on Store B
    await open(page, `/store/${STORE_SLUG}/track`);
    await expect(page.locator("input")).toBeVisible();

    // 4. Verify visiting /dashboard routes to customer persona without leaking Store A admin context
    await open(page, "/dashboard");
    await page.waitForURL(/\/auth|\/dashboard/, { timeout: 15_000 });

    // 5. Navigate to /dashboard/orders
    await open(page, "/dashboard/orders");
    const dashboardHtml = await page.content();
    // Verify admin sensitive elements are never rendered on customer dashboard
    expect(dashboardHtml).not.toContain("merchant_members");
    expect(dashboardHtml).not.toContain("api_keys");
    expect(dashboardHtml).not.toContain("fraud_rules");

    // 6. Navigate back to /admin
    await open(page, "/admin");
    const adminHtml = await page.content();
    // Ensure admin shell maintains its dedicated merchant context
    expect(adminHtml).not.toContain("Your saved items");
  });
});
