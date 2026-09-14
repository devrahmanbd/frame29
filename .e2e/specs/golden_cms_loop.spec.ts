import { expect, test } from "@playwright/test";
import { STORE_SLUG, open } from "../fixtures";

/** The CMS surfaces a merchant edits: blog, pages, search, collections. */
test.describe("golden_cms_loop", () => {
  test("platform blog index lists articles", async ({ page }) => {
    await open(page, "/blog");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator('main a[href^="/blog/"]').count()).toBeGreaterThan(0);
  });

  test("an article reads with a title and body", async ({ page }) => {
    await open(page, "/blog");
    const first = page.locator('main a[href^="/blog/"]').first();
    const href = await first.getAttribute("href");
    expect(href).toBeTruthy();
    const res = await open(page, href!);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect((await page.locator("main").innerText()).length).toBeGreaterThan(200);
  });

  test("storefront page, collection and search render in the active theme", async ({ page }) => {
    for (const path of [
      `/store/${STORE_SLUG}/pages/about`,
      `/store/${STORE_SLUG}/c/new-arrivals`,
      `/store/${STORE_SLUG}/search?q=saree`,
    ]) {
      const res = await open(page, path);
      expect(res?.status(), path).toBeLessThan(400);
      await expect(page.locator("main h1").first()).toBeVisible();
      await expect(page.locator("header").first()).toBeVisible();
      await expect(page.locator("footer").first()).toBeVisible();
    }
  });

  test("track and account surfaces answer", async ({ page }) => {
    for (const path of [`/store/${STORE_SLUG}/track`, `/store/${STORE_SLUG}/account`]) {
      const res = await open(page, path);
      expect(res?.status(), path).toBeLessThan(400);
    }
  });
});
