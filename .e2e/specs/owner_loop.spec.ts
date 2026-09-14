import { expect, test } from "@playwright/test";
import { expectGated, expectNoLeak, open, serverHtml } from "../fixtures";

const OWNER_ROUTES = [
  "/root",
  "/root/plans",
  "/root/revenue",
  "/root/money",
  "/root/tenants",
  "/root/users",
  "/root/access",
  "/root/audit",
  "/root/gateway",
  "/root/settings",
  "/root/observability",
  "/root/ops",
  "/root/ai",
  "/root/fraud",
  "/root/marketing",
  "/root/coupons",
  "/root/trial",
  "/root/tenancy",
  "/root/status",
];

test.describe("owner_loop", () => {
  for (const route of OWNER_ROUTES) {
    test(`${route} redirects an anonymous visitor to /auth`, async ({ page }) => {
      await expectGated(page, route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("owner console ships no platform data in server HTML", async ({ page }) => {
    for (const route of ["/root", "/root/revenue", "/root/tenants"]) {
      const { body } = await serverHtml(page, route);
      expectNoLeak(body, [
        /amount_minor_int/,
        /service_role/,
        /SUPABASE_SERVICE_ROLE/,
        /sb_secret_/,
        /"merchants"\s*:\s*\[/,
      ]);
    }
  });

  test("robots.txt disallows the owner console", async ({ page }) => {
    const { body } = await serverHtml(page, "/robots.txt");
    expect(body).toMatch(/Disallow:\s*\/root/);
  });

  test("metrics scrape refuses an anonymous caller and echoes no metric name", async ({ page }) => {
    const res = await page.request.get("/api/public/metrics", { failOnStatusCode: false });
    expect([401, 403, 404]).toContain(res.status());
    const body = await res.text();
    expect(body).not.toMatch(/framique_|_total\b|# HELP/);
  });
});
