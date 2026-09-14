import { expect, test } from "@playwright/test";
import { STORE_SLUG, collectConsoleErrors, expectGated, expectNoLeak, open, serverHtml } from "../fixtures";

test.describe("ai_support_loop", () => {
  for (const route of ["/admin/ai/assistant", "/root/ai"]) {
    test(`${route} is staff-only`, async ({ page }) => {
      await expectGated(page, route);
    });
  }

  test("no model key or system prompt is shipped to the browser", async ({ page }) => {
    for (const path of ["/", `/store/${STORE_SLUG}`, "/docs"]) {
      const { body } = await serverHtml(page, path);
      expectNoLeak(body, [
        /sk-[A-Za-z0-9]{16,}/,
        /AI_GATEWAY_API_KEY/,
        /system_prompt/,
        /"role"\s*:\s*"system"/,
      ]);
    }
  });

  test("storefront stays console-clean and transcript-free without a session", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await open(page, `/store/${STORE_SLUG}`);
    await page.waitForLoadState("networkidle");
    expect(errors, errors.join("\n")).toHaveLength(0);
    await expect(page.locator("[data-ai-transcript]")).toHaveCount(0);
  });
});
