import { expect, test } from "@playwright/test";
import { BDT_AMOUNT, STORE_SLUG, open, serverHtml } from "../fixtures";

const MONEY_SURFACES = ["/pricing", `/store/${STORE_SLUG}`, `/store/${STORE_SLUG}/search?q=saree`];

test.describe("currency_gate", () => {
  for (const path of MONEY_SURFACES) {
    test(`${path} renders BDT only`, async ({ page }) => {
      await open(page, path);
      const main = page.locator("main");
      await expect(main).toBeVisible();
      const text = (await main.innerText()).replace(/\u00a0/g, " ");
      expect(text, "a dollar mark reached a BDT surface").not.toMatch(/\$\s?\d|\bUSD\b/);
    });
  }

  test("every rendered price is a two-decimal integer-derived amount", async ({ page }) => {
    await open(page, `/store/${STORE_SLUG}`);
    const prices = page.locator("[data-money]");
    const count = await prices.count();
    if (count === 0) test.skip(true, "storefront exposes no data-money nodes");
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < Math.min(count, 20); index += 1) {
      const raw = ((await prices.nth(index).innerText()) || "").replace(/[৳\s,]/g, (match) => (match === "," ? "," : ""));
      const cleaned = raw.replace(/[৳]/g, "").trim();
      expect(cleaned, `price #${index} is not a BDT amount`).toMatch(BDT_AMOUNT);
    }
  });

  test("prices are typeset with tabular figures", async ({ page }) => {
    await open(page, "/pricing");
    const price = page.locator("[data-money]").first();
    if (!(await price.count())) test.skip(true, "pricing page exposes no data-money nodes");
    const variant = await price.evaluate((node) => getComputedStyle(node).fontVariantNumeric);
    expect(variant).toContain("tabular-nums");
  });

  test("minor-unit fields in the server payload stay integers", async ({ page }) => {
    const { body } = await serverHtml(page, `/store/${STORE_SLUG}`);
    const floats = body.match(/"[a-z_]*minor_int"\s*:\s*-?\d+\.\d+/g) ?? [];
    expect(floats, `float minor units: ${floats.join(", ")}`).toHaveLength(0);
  });
});
