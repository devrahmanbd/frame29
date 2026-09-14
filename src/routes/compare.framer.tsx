import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { useLang } from "@/lib/i18n";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Palette, ShoppingBag, Terminal } from "lucide-react";

export const Route = createFileRoute("/compare/framer")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "compare-framer", origin });
    const graph = buildGraph({
      route: "compare-framer",
      origin,
      faq: [
        {
          question: "Can I run an actual e-commerce store on Framer?",
          answer:
            "Framer is designed for static websites and portfolios. It lacks native inventory tracking, cart state, order management, and customer accounts, forcing you to embed third-party buy buttons.",
        },
        {
          question: "How does Framique compare to Framer for design flexibility?",
          answer:
            "Framique provides the same visual canvas freedom with Bento grids, OKLCH color palettes, and responsive viewports, but powers it with a full transactional PostgreSQL commerce engine.",
        },
        {
          question: "Does Framique require external apps for checkout?",
          answer:
            "No. Framique includes native single-step checkouts, tokenized bKash and Nagad payment options, and automated courier label generation out of the box with 0% platform fees.",
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
  component: CompareFramerPage,
});

function CompareFramerPage() {
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
          <span className="text-foreground font-medium">vs Framer</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Palette className="w-3.5 h-3.5" />
            {isBn ? "ভিজ্যুয়াল ক্যানভাস বনাম ট্রানজ্যাকশনাল ইঞ্জিন" : "Visual Canvas vs Transactional Engine"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-bangla-display">
            {isBn ? "FRAMIQUE বনাম Framer" : "FRAMIQUE vs Framer"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {isBn
              ? "ফ্রেমারের অসাধারণ ডিজাইন স্বাধীনতা, সাথে শপিফাই-এর শক্তিশালী কমার্স ইঞ্জিন ও ০% ফি।"
              : "The design layout freedom of Framer combined with the transactional power of a sovereign cloud commerce engine."}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "বিনামূল্যে স্টোর তৈরি করুন" : "Build Sovereign Store"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground hover:bg-muted/50 transition-all"
            >
              {isBn ? "ভিজ্যুয়াল বিল্ডার দেখুন" : "Explore Visual Studio"}
            </Link>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-12 overflow-hidden rounded-fq-xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-xl font-bold text-card-foreground">
              {isBn ? "ফিচার তুলনা: FRAMIQUE বনাম Framer" : "Feature Comparison: FRAMIQUE vs Framer"}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Capability</th>
                  <th className="px-6 py-4 text-primary font-bold">FRAMIQUE</th>
                  <th className="px-6 py-4">Framer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Native E-Commerce Backend</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Native Orders & Inventory
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> 3rd-Party Embeds Required
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Visual Canvas & Typography Control</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Bento Grid & OKLCH
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Full Freeform Canvas
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Single-Step Regional Checkout</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> bKash, Nagad & COD
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Not Supported
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Automated Courier Dispatch</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Pathao & Steadfast
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Not Supported
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Platform Transaction Fees</td>
                  <td className="px-6 py-4 text-primary font-semibold">0% Platform Fee</td>
                  <td className="px-6 py-4 text-muted-foreground">Varies by Embed Provider</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Multi-Tenant PostgreSQL Isolation</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Postgres Row-Level Security
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> No Database Layer
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Pillar Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "আসল কমার্স ইঞ্জিন" : "True Commerce Core"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "ফ্রেমারে কোনো অর্ডার ব্যাকএন্ড নেই। ফ্রামিক দেয় পূর্ণাঙ্গ স্টক ট্র্যাকিং, ডিসকাউন্ট ইঞ্জিন এবং কাস্টমার ড্যাশবোর্ড।"
                : "Framer requires clunky Buy Button popups. Framique delivers native cart states, dynamic inventory reduction, and automated invoice PDF generation."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Palette className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "ডিজাইনারদের পছন্দ" : "Designed for Creators"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "কোড ছাড়াই বেন্তো গ্রিড, টাইপোগ্রাফি আর কালার প্যালেট নিয়ন্ত্রণ করুন আপনার মতো করে।"
                : "Experience modern visual web design without being trapped in the static site box. Tailor your storefront down to the exact pixel."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Terminal className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "ডেভেলপার পাওয়ার" : "Open React Extensibility"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "প্রয়োজনে সম্পূর্ণ টাইপস্ক্রিপ্ট ও রিঅ্যাক্ট কম্পোনেন্ট এক্সপোর্ট বা কাস্টমাইজ করার স্বাধীনতা।"
                : "Build custom interactive components with TanStack Router, Nitro API handlers, and clean TypeScript SDKs."}
            </p>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 rounded-fq-xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-bangla-display">
            {isBn ? "ডিজাইন আর কমার্স একসাথেই সম্ভব" : "Visual aesthetics meet commerce power."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {isBn
              ? "ফ্রেমারের মতো স্টাইলিশ অথচ শপিফাই-এর মতো শক্তিশালী স্টোর বানিয়ে শুরু করুন আজই।"
              : "Launch your boutique storefront on Framique with 0% transaction fees and native local checkout."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "ফ্রি স্টোর শুরু করুন" : "Start Free Store"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
