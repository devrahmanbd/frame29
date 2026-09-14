#!/usr/bin/env node
/**
 * scripts/seed-blog-articles.mjs
 *
 * Ingests Markdown blog articles from `SEO/Blog/*.md` into the PostgreSQL `articles` table.
 *
 * Usage:
 *   node scripts/seed-blog-articles.mjs --dry-run
 *   node scripts/seed-blog-articles.mjs --live
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Native .env load if in Node without Bun
if (typeof process.loadEnvFile === "function" && existsSync(".env")) {
  try { process.loadEnvFile(); } catch {}
}

const DRY_RUN = !process.argv.includes("--live");
const BLOG_DIR = resolve(process.cwd(), "SEO/Blog");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function parseMarkdownArticle(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const fileName = basename(filePath);

  // Derive slug from filename: e.g. "01-framique-vs-shopify-webflow-framer.md" -> "framique-vs-shopify-webflow-framer"
  const slug = fileName
    .replace(/^\d+-/, "")
    .replace(/\.md$/, "")
    .toLowerCase();

  // Extract H1 title
  const h1Match = raw.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : slug.replace(/-/g, " ");

  // Extract meta description or blockquote excerpt
  const quoteMatch = raw.match(/^>\s+([^>].+)$/m);
  const excerpt = quoteMatch
    ? quoteMatch[1].replace(/\*\*/g, "").slice(0, 160).trim()
    : `Read the complete guide on ${title}.`;

  // Estimate reading minutes (approx 200 words per minute)
  const wordCount = raw.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    slug,
    title,
    title_en: title,
    excerpt,
    body: raw,
    status: "published",
    published_at: new Date().toISOString(),
    meta_title: title.slice(0, 60),
    meta_description: excerpt.slice(0, 154),
    reading_minutes: readingMinutes,
    cover_image_url: `/assets/marketing/blog-${slug}.jpg`,
    canonical: `https://framique.com/blog/${slug}`,
    robots: "index,follow",
    tags: ["ecommerce", "cms", "marketing", "sovereign-commerce"],
  };
}

async function main() {
  console.log(`[Seed Blog] Scanning Markdown articles in: ${BLOG_DIR}`);
  const files = readdirSync(BLOG_DIR).filter(
    (f) => f.endsWith(".md") && f !== "README.md"
  );

  console.log(`[Seed Blog] Found ${files.length} article(s). Mode: ${DRY_RUN ? "DRY-RUN" : "LIVE"}`);

  const parsedArticles = [];
  for (const file of files) {
    const fullPath = join(BLOG_DIR, file);
    if (statSync(fullPath).isFile()) {
      const parsed = parseMarkdownArticle(fullPath);
      parsedArticles.push(parsed);
      console.log(`  ✓ Parsed: "${parsed.title}" (slug: ${parsed.slug}, ~${parsed.reading_minutes} min read)`);
    }
  }

  if (DRY_RUN) {
    console.log(`\n[Seed Blog] DRY-RUN completed successfully. ${parsedArticles.length} article(s) validated.`);
    console.log(`To execute live database ingestion, run: node scripts/seed-blog-articles.mjs --live`);
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("[Seed Blog] Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env for --live mode.");
    process.exit(1);
  }

  console.log(`\n[Seed Blog] Connecting to Supabase at: ${SUPABASE_URL}`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  for (const article of parsedArticles) {
    console.log(`  ➔ Upserting article: ${article.slug}...`);
    const { error } = await supabase.from("articles").upsert(
      {
        slug: article.slug,
        title: article.title,
        title_en: article.title_en,
        excerpt: article.excerpt,
        body: article.body,
        status: article.status,
        published_at: article.published_at,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        reading_minutes: article.reading_minutes,
        cover_image_url: article.cover_image_url,
        canonical: article.canonical,
        robots: article.robots,
        tags: article.tags,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`    ✗ Failed to upsert ${article.slug}:`, error.message);
    } else {
      console.log(`    ✓ Upserted successfully.`);
    }
  }

  console.log(`\n[Seed Blog] Ingestion finished.`);
}

main().catch((err) => {
  console.error("[Seed Blog] Fatal error:", err);
  process.exit(1);
});
