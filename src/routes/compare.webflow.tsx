import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { useLang } from "@/lib/i18n";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Layers, Database, ArrowLeftRight } from "lucide-react";

export const Route = createFileRoute("/compare/webflow")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "compare-webflow", origin });
    const graph = buildGraph({
      route: "compare-webflow",
      origin,
      faq: [
        {
          question: "Why choose Framique over Webflow for e-commerce?",
          answer:
            "Webflow caps CMS items at 10,000 collections and lacks native local payment gateways like bKash and Nagad. Framique runs on PostgreSQL with Row-Level Security for unlimited catalog scaling, sub-45ms Edge SSR, and built-in courier automation.",
        },
        {
          question: "Can I customize storefront designs like Webflow in Framique?",
          answer:
            "Yes. Framique provides a visual Bento grid canvas with OKLCH theme token control, giving designers visual freedom while keeping full open React/TypeScript extensibility.",
        },
        {
          question: "Does Webflow support automated Cash on Delivery (COD) verification?",
          answer:
            "No. Webflow has no native COD or phone-first verification logic. Framique includes automated COD fraud scoring, SMS OTP confirmation, and Steadfast/Pathao courier booking out of the box.",
        },
      ],
    });
    return {
      meta: head.meta,
      links: head.links,
      scripts: [
        ...head.scripts,
        ...(graph ? [{ type: "application/ld+json", children: JSON.stringify(graph) }] : []),
      ],
    };
  },
  component: CompareWebflowPage,
});

function CompareWebflowPage() {
  const { lang } = useLang();
  const isBn = lang === "bn";

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/compare/shopify" className="hover:text-foreground">Compare</Link>
          <span>/</span>
          <span className="text-foreground font-medium">vs Webflow</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            {isBn ? "ডিজাইন স্বাধীনতা বনাম কমার্স স্কেল" : "Design Freedom vs Commerce Scale"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-bangla-display">
            {isBn ? "FRAMIQUE বনাম Webflow" : "FRAMIQUE vs Webflow"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {isBn
              ? "Webflow-এর ১০,০০০ আইটেম লিমিট ও পেমেন্ট সীমাবদ্ধতা ভুলে যান। আনলিমিটেড পোস্টগ্রেস ক্যাটালগ এবং সরাসরি বিকাশ-নগদ চেকআউট।"
              : "Break free from Webflow's 10,000 CMS item ceiling and missing local payment rails. Experience sovereign PostgreSQL e-commerce."}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "বিনামূল্যে স্টোর তৈরি করুন" : "Start Sovereign Store"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground hover:bg-muted/50 transition-all"
            >
              {isBn ? "প্ল্যান ও প্রাইসিং দেখুন" : "View Transparent Pricing"}
            </Link>
          </div>
        </div>

        {/* Comparison Feature Table */}
        <div className="mt-12 overflow-hidden rounded-fq-xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-xl font-bold text-card-foreground">
              {isBn ? "ফিচার তুলনা: FRAMIQUE বনাম Webflow E-Commerce" : "Feature Comparison: FRAMIQUE vs Webflow E-Commerce"}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Feature / Capability</th>
                  <th className="px-6 py-4 text-primary font-bold">FRAMIQUE</th>
                  <th className="px-6 py-4">Webflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Catalog Item Hard Limit</td>
                  <td className="px-6 py-4 text-primary font-semibold">Unlimited (Postgres RLS)</td>
                  <td className="px-6 py-4 text-muted-foreground">Capped at 10,000 Items</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Native bKash & Nagad Direct Checkout</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Native Built-in
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Not Supported
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Automated Steadfast & Pathao Courier</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Automated 1-Click
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Not Supported
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Visual Canvas & Layout Freedom</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Bento Grid Visual Studio
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Full Visual Designer
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Open React / TypeScript Extensibility</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Full TanStack & Nitro
                  </td>
                  <td className="px-6 py-4 text-amber-500 flex items-center gap-1.5">
                    Custom Embeds Only
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Global Edge SSR Speed (TTFB)</td>
                  <td className="px-6 py-4 text-primary font-semibold">&lt; 45ms Edge Global</td>
                  <td className="px-6 py-4 text-muted-foreground">150 - 350ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Core Architecture Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Database className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "কোনো আইটেম ক্যাপ নেই" : "No CMS Item Caps"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "Webflow সাইট ১০,০০০ আইটেমের পর আটকে যায়। ফ্রেমিকের পোস্টগ্রেস ডেটাবেস লাখ লাখ এসকেইউ অনায়াসে প্রসেস করে।"
                : "Webflow imposes hard CMS collection limits. Framique is engineered on high-performance PostgreSQL with Row-Level Security for millions of SKUs."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "নেটিভ লোকাল কমার্স" : "Built for Local Commerce"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "বিকাশ, নগদ, এবং স্টিডফাস্ট কুরিয়ার বুকিং সিস্টেমের ভেতরেই দেওয়া—কোনো বাড়তি প্লাগিন বা এপিআই ঝক্কি নেই।"
                : "Zero third-party middleware. Tokenized bKash/Nagad checkout and 1-click courier label generation are built directly into the core engine."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <ArrowLeftRight className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "সহজ ক্যাটালগ মাইগ্রেশন" : "Instant Catalog Export"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "Webflow থেকে CSV দিয়ে ৫ মিনিটে সব প্রোডাক্ট নিয়ে আসুন ফ্রমিকে। কোনো ডাউনটাইম নেই।"
                : "Import your Webflow CSV catalog in minutes without losing customer data, media assets, or SEO URL structure."}
            </p>
          </div>
        </div>

        {/* Bottom Conversion Band */}
        <div className="mt-16 rounded-fq-xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-bangla-display">
            {isBn ? "ডিজাইন আর কমার্স একসাথে উপভোগ করুন" : "Design visually. Scale transactionally."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {isBn
              ? "আজই শুরু করুন আপনার সম্পূর্ণ সার্বভৌম অনলাইন স্টোর।"
              : "Launch your custom branded storefront with 0% platform fees and native local rails."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "ফ্রি স্টোর শুরু করুন" : "Get Started Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
