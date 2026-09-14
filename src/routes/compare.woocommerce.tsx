import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { useLang } from "@/lib/i18n";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Server, Lock, Clock } from "lucide-react";

export const Route = createFileRoute("/compare/woocommerce")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "compare-woocommerce", origin });
    const graph = buildGraph({
      route: "compare-woocommerce",
      origin,
      faq: [
        {
          question: "Why should I switch from WooCommerce to Framique?",
          answer:
            "WooCommerce requires constant WordPress plugin updates, expensive VPS hosting for sub-second TTFB, and manual security maintenance. Framique is a fully managed cloud CMS with 0% platform fees, automated backups, and sub-45ms Edge SSR.",
        },
        {
          question: "Does WooCommerce have native bKash and Pathao integrations?",
          answer:
            "No. WooCommerce requires community plugins that frequently break on WordPress updates. Framique includes native tokenized bKash/Nagad checkout and automated Steadfast/Pathao courier booking out of the box.",
        },
        {
          question: "Can I migrate my WooCommerce catalog to Framique?",
          answer:
            "Yes. Framique provides a 1-click WooCommerce product and customer CSV import tool that maps SKUs, variants, prices, and images seamlessly in under five minutes.",
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
  component: CompareWooCommercePage,
});

function CompareWooCommercePage() {
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
          <span className="text-foreground font-medium">vs WooCommerce</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Server className="w-3.5 h-3.5" />
            {isBn ? "প্লাগিন কনফ্লিক্ট বনাম ক্লাউড এজ এসএসআর" : "Plugin Hell vs Managed Edge Cloud"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-bangla-display">
            {isBn ? "FRAMIQUE বনাম WooCommerce" : "FRAMIQUE vs WooCommerce"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {isBn
              ? "প্লাগিন ক্র্যাশ, স্লো সার্ভার আর সিকিউরিটি আপডেটের ঝামেলা চিরতরে শেষ করুন। সম্পূর্ণ ক্লাউড ম্যানেজড এজের শক্তি।"
              : "Eliminate WordPress plugin crashes, slow VPS hosting, and midnight maintenance. Experience zero-maintenance cloud commerce."}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "বিনামূল্যে স্টোর তৈরি করুন" : "Migrate from WooCommerce"}
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

        {/* Comparison Table */}
        <div className="mt-12 overflow-hidden rounded-fq-xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="text-xl font-bold text-card-foreground">
              {isBn ? "ফিচার তুলনা: FRAMIQUE বনাম WooCommerce" : "Feature Comparison: FRAMIQUE vs WooCommerce"}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/20 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Capability</th>
                  <th className="px-6 py-4 text-primary font-bold">FRAMIQUE</th>
                  <th className="px-6 py-4">WooCommerce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Maintenance & Updates</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 100% Zero Maintenance
                  </td>
                  <td className="px-6 py-4 text-rose-500 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Constant Plugin Updates
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Global Edge Speed (TTFB)</td>
                  <td className="px-6 py-4 text-primary font-semibold">&lt; 45ms Edge Global</td>
                  <td className="px-6 py-4 text-muted-foreground">400 - 1200ms (PHP/MySQL)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Native bKash, Nagad & Logistics</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Native Core Engine
                  </td>
                  <td className="px-6 py-4 text-amber-500 flex items-center gap-1.5">
                    Requires 3rd-Party Plugins
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Platform Transaction Fees</td>
                  <td className="px-6 py-4 text-primary font-semibold">0% Platform Fee</td>
                  <td className="px-6 py-4 text-foreground font-semibold">0% (Hosting extra)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Database Security Isolation</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Postgres Row-Level Security
                  </td>
                  <td className="px-6 py-4 text-amber-500 flex items-center gap-1.5">
                    Shared MySQL (SQLi Risk)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-foreground">Automated TLS Edge Custom Domains</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Automated Let's Encrypt
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">Manual Server Config</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Value Proposition Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "সময় বাঁচান প্রতি সপ্তাহে" : "Reclaim 15 hrs/month"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "প্লাগিন আপডেট ও ডেটাবেস ক্যাশিং ঠিক করার সময় বাঁচিয়ে ব্যবসার বিক্রির দিকে মনোযোগ দিন।"
                : "Stop babysitting WordPress updates, PHP version conflicts, and fatal database errors. Framique handles scaling and security automatically."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Lock className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "নিরাপদ ক্লাউড আর্কিটেকচার" : "Bank-Grade Security"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "ওয়ার্ডপ্রেসের মতো প্লাগিনের দুর্বলতা নেই। প্রতিটি মার্চেন্টের জন্য রয়েছে পোস্টগ্রেস রো-লেভেল সিকিউরিটি।"
                : "No arbitrary plugin vulnerabilities. Your catalog and financial data are secured by PostgreSQL kernel-level Row-Level Security (RLS)."}
            </p>
          </div>

          <div className="rounded-fq-lg border border-border bg-card p-6 shadow-sm">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {isBn ? "সাব-৪৫মি.সে. আল্ট্রা স্পিড" : "Sub-45ms Edge Speed"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? "ভারী পিএইচপি বা অ্যাপাচি সার্ভার ছাড়াই মোবাইল ইউজারদের জন্য সুপারফাস্ট লোডিং টাইম।"
                : "Serve edge-rendered static HTML and hydrated micro-islands in under 45ms directly to cellular shoppers in Dhaka and beyond."}
            </p>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 rounded-fq-xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-bangla-display">
            {isBn ? "প্লাগিনের ঝামেলা এড়িয়ে আধুনিক ক্লাউডে যোগ দিন" : "Upgrade to sovereign edge commerce today."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {isBn
              ? "৫ মিনিটে উকমার্স থেকে মাইগ্রেট করুন এবং সম্পূর্ণ মানসিক শান্তিতে স্টোর পরিচালনা করুন।"
              : "Import your WooCommerce store in 5 minutes and run your business without server crashes."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "ফ্রি স্টোর শুরু করুন" : "Start Sovereign Store"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
