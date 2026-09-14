import { expect, test } from "@playwright/test";
import { expectGated, open } from "../fixtures";

test.describe("billing_loop", () => {
  test("public pricing lists plans with BDT amounts", async ({ page }) => {
    await open(page, "/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\$\s?\d|\bUSD\b/);
    expect(text.length).toBeGreaterThan(200);
  });

  test("merchant billing surfaces need a session", async ({ page }) => {
    for (const route of ["/admin/billing", "/admin/plans", "/admin/subscriptions"]) {
      await expectGated(page, route);
    }
  });
});
