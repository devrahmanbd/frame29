import { expect, type Page, type Response } from "@playwright/test";

/** Seeded demo tenant. Override per environment with E2E_STORE_SLUG. */
export const STORE_SLUG = process.env["E2E_STORE_SLUG"] ?? "frame19-demo";

/** Money must read as BDT with a decimal pair — a leaked float fails this. */
export const BDT_AMOUNT = /^[০-৯\d]{1,3}(,[০-৯\d]{3})*\.[০-৯\d]{2}$/;

export async function open(page: Page, path: string): Promise<Response | null> {
  return page.goto(path, { waitUntil: "domcontentloaded" });
}

/**
 * The auth gate on `/admin`, `/root` and `/dashboard` runs client-side
 * (`ssr:false`), so a cold compile can be slower than a single assertion
 * window. One reload retry inside 30s keeps a slow first paint from being
 * mistaken for a broken gate.
 */
export async function expectGated(page: Page, path: string) {
  await open(page, path);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.waitForURL(/\/auth(\?|$)/, { timeout: 30_000 });
      return;
    } catch (error) {
      if (attempt === 1) throw error;
      await page.reload({ waitUntil: "domcontentloaded" });
    }
  }
}

/** Server-shipped HTML, before hydration can add or remove anything. */
export async function serverHtml(page: Page, path: string, base = process.env["E2E_BASE_URL"] ?? "http://localhost:8080") {
  const res = await page.request.get(new URL(path, base).toString(), { maxRedirects: 0 });
  return { status: res.status(), body: res.status() < 400 ? await res.text() : "" };
}

export function expectNoLeak(html: string, needles: RegExp[]) {
  for (const needle of needles) expect(html, `leaked ${String(needle)}`).not.toMatch(needle);
}

/** Console errors a shopper would see. Ignore third-party/network noise. */
export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/favicon|net::ERR_|Failed to load resource|net::ERR_ABORTED/i.test(text)) return;
    errors.push(text);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}
