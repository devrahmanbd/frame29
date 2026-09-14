import { expect, test } from "@playwright/test";
import { STORE_SLUG, collectConsoleErrors, open, serverHtml } from "../fixtures";

const MARKETING = ["/", "/about", "/features", "/pricing", "/payments", "/security", "/customers", "/fulfilment", "/builder", "/contact", "/faq", "/docs", "/legal", "/status", "/auth"];

test.describe("public_loop", () => {
  for (const path of MARKETING) {
    test(`${path} renders with a single h1 and its own title`, async ({ page }) => {
      const res = await open(page, path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("h1")).toHaveCount(1);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      expect(title).not.toMatch(/(Default Title|Generated Project)/);
    });
  }

  test("visitor journey: storefront to checkout", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await open(page, `/store/${STORE_SLUG}`);
    await page.locator("main h1").first().waitFor();
    const product = page.locator('a[href*="/p/"]').first();
    await product.click();
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.getByRole("button", { name: /Add to cart|কার্টে যোগ করুন/i }).first().click();
    await open(page, `/store/${STORE_SLUG}/cart`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await open(page, `/store/${STORE_SLUG}/checkout`);
    await expect(page.getByRole("heading", { level: 1, name: /Checkout|চেকআউট/i })).toBeVisible();
    expect(errors, errors.join("\n")).toHaveLength(0);
  });

  test("no-JS floor: the storefront is readable and navigable", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await open(page, `/store/${STORE_SLUG}`);
    expect((await page.locator("main h1").first().textContent())?.trim()).toBeTruthy();
    expect(await page.locator("main a[href]").count()).toBeGreaterThan(0);
    await context.close();
  });

  test("sitemap and store sitemap are served", async ({ page }) => {
    for (const path of ["/sitemap.xml", `/store/${STORE_SLUG}/sitemap.xml`]) {
      const { status, body } = await serverHtml(page, path);
      expect(status).toBeLessThan(400);
      expect(body).toMatch(/<(urlset|sitemapindex)/);
    }
  });
});
