import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { useLang } from "@/lib/i18n";
import { ArrowRight, Layers, ShieldCheck, Zap, Server, Palette, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/compare/")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "compare-index", origin });
    const graph = buildGraph({
      route: "compare-index",
      origin,
      faq: [
        {
          question: "How does Framique compare to other e-commerce platforms?",
          answer:
            "Framique combines the design flexibility of Framer, the transactional muscle of Shopify, and the zero-maintenance agility of modern cloud SaaS with 0% platform transaction fees and native local rails.",
        },
        {
          question: "Which platforms can I migrate from?",
          answer:
            "Framique provides native 1-click catalog, customer, and order CSV import tools for Shopify, WooCommerce, and Webflow.",
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
  component: CompareIndexPage,
});

function CompareIndexPage() {
  const { lang } = useLang();
  const isBn = lang === "bn";

  const comparisons = [
    {
      title: "Framique vs Shopify",
      path: "/compare/shopify",
      badge: "0% Fee Sovereignty",
      desc: isBn
        ? "শপিফাই-এর ২% ফি এবং অ্যাপ ট্যাক্স এড়িয়ে প্রতি বছর হাজার ডলার সাশ্রয় করুন।"
        : "Reclaim lost revenue from Shopify's 2% transaction fee and monthly app bloat.",
      icon: ShoppingBag,
    },
    {
      title: "Framique vs Webflow",
      path: "/compare/webflow",
      badge: "Scale & Local Rails",
      desc: isBn
        ? "১০,০০০ আইটেমের সীমাবদ্ধতা ছাড়িয়ে আনলিমিটেড পোস্টগ্রেস কমার্স ক্যাটালগ।"
        : "Break free from Webflow's 10k item ceiling with native bKash/Nagad and Steadfast dispatch.",
      icon: Layers,
    },
    {
      title: "Framique vs Framer",
      path: "/compare/framer",
      badge: "Design Freedom + Store",
      desc: isBn
        ? "ফ্রেমারের ভিজ্যুয়াল ক্যানভাস সাথে সম্পূর্ণ অর্ডারিং ও ইনভেন্টরি ট্র্যাকিং।"
        : "Combine freeform visual design canvas with an enterprise transactional commerce core.",
      icon: Palette,
    },
    {
      title: "Framique vs WooCommerce",
      path: "/compare/woocommerce",
      badge: "Zero Maintenance",
      desc: isBn
        ? "প্লাগিন ক্র্যাশ ও ম্যানুয়াল আপডেটের ঝামেলা শেষ করে আধুনিক এজ ক্লাউডে যোগ দিন।"
        : "Say goodbye to WordPress plugin conflicts, database crashes, and VPS hosting maintenance.",
      icon: Server,
    },
  ];

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            {isBn ? "প্ল্যাটফর্ম তুলনা ও সিদ্ধান্ত গাইড" : "Platform Comparison Hub"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-bangla-display">
            {isBn ? "প্ল্যাটফর্ম তুলনা: Framique বনাম অন্যান্য" : "E-Commerce CMS Platform Comparisons"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {isBn
              ? "দেখুন কীভাবে ফ্রামিক আধুনিক মার্চেন্টদের শপিফাই, ওয়েবফ্লো এবং ফ্রেমারের চেয়ে বেশি সুবিধা দেয়।"
              : "Discover why modern merchants and agencies are choosing Framique over legacy builders and rigid monolithic platforms."}
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {comparisons.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.path}
                className="group relative rounded-fq-xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Icon className="w-3.5 h-3.5" />
                    {c.badge}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground mb-3">{c.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{c.desc}</p>
                <Link
                  to={c.path}
                  className="inline-flex items-center font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {isBn ? "সম্পূর্ণ তুলনা পড়ুন" : "View Full Comparison"} &rarr;
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Conversion Band */}
        <div className="rounded-fq-xl border border-primary/20 bg-primary/5 p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-bangla-display">
            {isBn ? "সার্বভৌম কমার্স শুরু করতে প্রস্তুত?" : "Ready for sovereign cloud commerce?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {isBn
              ? "০% ট্রানজ্যাকশন ফি এবং নেটিভ লোকাল পেমেন্টের সাথে আজই স্টোর লাইভ করুন।"
              : "Experience high-conversion storefronts with 0% platform transaction fees and sub-45ms speed."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-fq-md bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {isBn ? "বিনামূল্যে স্টোর খুলুন" : "Start Free Store"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
