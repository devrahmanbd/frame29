import { expect, test } from "@playwright/test";
import { STORE_SLUG, open } from "../fixtures";

test.describe("failure_loop", () => {
  test("an unknown page answers 404 with a way back", async ({ page }) => {
    const res = await open(page, "/nonexistent-page-xyz");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("link").first()).toBeVisible();
  });

  test("a legacy numeric product link is not-found, never a crash", async ({ page }) => {
    const res = await open(page, "/products/1");
    expect(res?.status(), "a bad id must not 500").not.toBe(500);
    expect(await page.locator("body").innerText()).not.toMatch(/invalid_string|ZodError|Internal Server Error/i);
  });

  test("an unknown product slug inside a real store is not-found", async ({ page }) => {
    const res = await open(page, `/store/${STORE_SLUG}/p/no-such-product-xyz`);
    expect(res?.status()).toBe(404);
  });

  test("a broken image never blanks the product grid", async ({ page }) => {
    await open(page, `/store/${STORE_SLUG}`);
    const images = page.locator("main img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    await page.waitForTimeout(1500);
    const broken = await images.evaluateAll((nodes) =>
      nodes.filter((node) => {
        const img = node as HTMLImageElement;
        return img.complete && img.naturalWidth === 0;
      }).length,
    );
    expect(broken, "images resolved to nothing").toBe(0);
  });
});
