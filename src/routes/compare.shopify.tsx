import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { useLang } from "@/lib/i18n";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, DollarSign, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/compare/shopify")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "compare-shopify", origin });
    const graph = buildGraph({
      route: "compare-shopify",
      origin,
      faq: [
        {
          question: "How does Framique compare to Shopify for local merchants?",
          answer:
            "Unlike Shopify, which charges $39-$399/mo plus an extra 2.0% transaction fee on third-party payment gateways, Framique charges 0% platform transaction fees and includes native bKash/Nagad checkout and automated Steadfast/Pathao courier dispatch.",
        },
        {
          question: "Can I migrate my products and customers from Shopify to Framique?",
          answer:
            "Yes. Framique provides one-click CSV catalog and customer import tools, letting you migrate your store data in under five minutes without downtime.",
        },
        {
          question: "Does Framique require external apps for invoice printing or SMS notifications?",
          answer:
            "No. Barcoded packing slips, PDF invoices, customer SMS tracking notifications, and courier label printing are native core features in Framique with zero extra app fees.",
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
  component: CompareShopifyPage,
});

function CompareShopifyPage() {
  const { lang } = useLang();
  const isBn = lang === "bn";

  const [monthlyGmv, setMonthlyGmv] = useState<number>(10000);

  // Financial calculations
  const shopifyFeeMonthly = monthlyGmv * 0.02; // 2% penalty
  const shopifyAppsMonthly = 150; // Invoicing, MFS, Courier, COD
  const shopifySubMonthly = 39;
  const shopifyTotalMonthly = shopifySubMonthly + shopifyFeeMonthly + shopifyAppsMonthly;

  const framiqueSubMonthly = 29;
  const framiqueTotalMonthly = framiqueSubMonthly; // 0% fee, 0 apps

  const annualSavings = Math.round((shopifyTotalMonthly - framiqueTotalMonthly) * 12);
  const threeYearSavings = annualSavings * 3;

  return (
    <PublicShell>
      <div className="w-full bg-background text-foreground">
        {/* HERO SECTION */}
        <section className="relative px-6 lg:px-20 max-w-[1440px] mx-auto pt-24 pb-16">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
              <Zap className="size-4" />
              {isBn ? "সার্বভৌম কমার্স প্ল্যাটফর্ম" : "The Sovereign Commerce Alternative"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {isBn ? (
                <>
                  Shopify-এর বিকল্প: <span className="text-primary">০% ট্রানজ্যাকশন ফি</span> এবং দেশীয় অটোমেশন।
                </>
              ) : (
                <>
                  The Shopify Alternative with <span className="text-primary">0% Platform Fees</span> and Native Rails.
                </>
              )}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {isBn
                ? "আমদানি করা সফটওয়্যার কেন প্রতি বিক্রয়ে ২% কমিশন নেবে? সরাসরি বিকাশ ও নগদ পেমেন্ট, ১-ক্লিকে কুরিয়ার পার্সেল বুকিং এবং সাব-৪৫মি.সে. এজ স্পিড সহ নিজের ব্র্যান্ড চালান সম্পূর্ণ স্বাধীনভাবে।"
                : "Why pay a 2% penalty on every sale? Framique gives you Framer-grade visual design freedom, native tokenized bKash & Nagad checkout, automated courier dispatch, and zero platform transaction fees."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-95 transition-all shadow-md"
              >
                {isBn ? "বিনামূল্যে স্টোর শুরু করুন" : "Start Free Trial"}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-muted border border-border text-foreground font-medium hover:bg-muted/80 transition-all"
              >
                {isBn ? "প্ল্যান ও প্রাইসিং দেখুন" : "View Pricing"}
              </Link>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TCO CALCULATOR */}
        <section className="px-6 lg:px-20 max-w-[1440px] mx-auto py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-primary">
                  {isBn ? "মার্জিন ক্যালকুলেটর" : "Interactive Margin Calculator"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {isBn ? "Shopify ছেড়ে Framique-এ আপনার সাশ্রয় হিসাব করুন" : "Calculate Your True Savings by Leaving Shopify"}
                </h2>
                <p className="text-muted-foreground text-sm max-w-xl">
                  {isBn
                    ? "Shopify-এর ২% পেমেন্ট পেনাল্টি এবং অতিরিক্ত অ্যাপ খরচ মুছে ফেলুন।"
                    : "Eliminate Shopify's 2% third-party gateway penalty and recurring app fees."}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                  ${threeYearSavings.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {isBn ? "৩ বছরে আনুমানিক সাশ্রয়" : "Estimated 3-Year Savings"}
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>{isBn ? "মাসিক অনলাইন বিক্রয় (USD):" : "Monthly Online Sales (USD):"}</span>
                <span className="text-lg font-bold text-primary">${monthlyGmv.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min={2000}
                max={100000}
                step={1000}
                value={monthlyGmv}
                onChange={(e) => setMonthlyGmv(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$2,000/mo</span>
                <span>$50,000/mo</span>
                <span>$100,000/mo</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-destructive">Shopify Cumulative Cost</span>
                  <span className="text-xl font-bold">${Math.round(shopifyTotalMonthly).toLocaleString()}/mo</span>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Base Subscription (Basic):</span>
                    <span>${shopifySubMonthly}/mo</span>
                  </li>
                  <li className="flex justify-between font-medium text-foreground">
                    <span>2.0% External Gateway Penalty:</span>
                    <span className="text-destructive">+${Math.round(shopifyFeeMonthly).toLocaleString()}/mo</span>
                  </li>
                  <li className="flex justify-between font-medium text-foreground">
                    <span>Essential Apps (Invoices, MFS, Logistics):</span>
                    <span className="text-destructive">+${shopifyAppsMonthly}/mo</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">Framique Sovereign Cost</span>
                  <span className="text-xl font-bold text-primary">${framiqueTotalMonthly}/mo</span>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Flat Platform Hosting:</span>
                    <span>${framiqueSubMonthly}/mo</span>
                  </li>
                  <li className="flex justify-between font-medium text-primary">
                    <span>Platform Transaction Fee:</span>
                    <span>$0.00 (0%)</span>
                  </li>
                  <li className="flex justify-between font-medium text-primary">
                    <span>Built-in Invoices, MFS & Courier APIs:</span>
                    <span>Included Free</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED HEAD-TO-HEAD MATRIX */}
        <section className="px-6 lg:px-20 max-w-[1440px] mx-auto py-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              {isBn ? "ফিচার তুলনা: Framique বনাম Shopify" : "Feature-by-Feature Engineering Breakdown"}
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="py-4 px-6">Feature Capability</th>
                    <th className="py-4 px-6 text-primary font-bold">FRAMIQUE</th>
                    <th className="py-4 px-6">Shopify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-6 font-medium">Platform Transaction Fee</td>
                    <td className="py-4 px-6 text-primary font-bold flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500" /> 0.0% (Zero)
                    </td>
                    <td className="py-4 px-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="size-4 text-destructive" /> 0.5% – 2.0% on 3rd-party rails
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Visual Drag-and-Drop Canvas</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      <CheckCircle2 className="size-4 text-emerald-500 inline mr-2" />
                      Framer-grade Bento Grids & Tokens
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      Rigid Liquid template sections
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Native Tokenized bKash & Nagad</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      <CheckCircle2 className="size-4 text-emerald-500 inline mr-2" />
                      Built-in (Instant Verification)
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      Third-party apps with extra fees
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Automated Courier Dispatch (Steadfast/Pathao)</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      <CheckCircle2 className="size-4 text-emerald-500 inline mr-2" />
                      1-Click Label & Tracking Sync
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      Manual copy-paste or expensive plugins
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Server TTFB (South Asia & Regional)</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      <CheckCircle2 className="size-4 text-emerald-500 inline mr-2" />
                      &lt; 45ms (TanStack Start Edge SSR)
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      400ms – 900ms (Origin US/EU)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Custom Domain SSL Provisioning</td>
                    <td className="py-4 px-6 text-primary font-bold">
                      <CheckCircle2 className="size-4 text-emerald-500 inline mr-2" />
                      Automated ACME Challenge Edge SSL
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      Standard Cloudflare SSL
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA BOTTOM BAND */}
        <section className="px-6 lg:px-20 max-w-[1440px] mx-auto py-16">
          <div className="p-10 sm:p-16 rounded-3xl bg-primary text-primary-foreground text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isBn ? "আজই আপনার স্টোর ফ্রামিকে নিয়ে আসুন" : "Ready to Reclaim Your Margins?"}
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 text-base sm:text-lg">
              {isBn
                ? "Shopify থেকে পণ্য ও গ্রাহক ডেটা ৫ মিনিটে ইমপোর্ট করুন। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই।"
                : "Import your Shopify catalog in five minutes. Start your 14-day free trial with zero platform fees."}
            </p>
            <div className="pt-2">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-background text-foreground font-semibold hover:bg-background/90 transition-all shadow-lg"
              >
                {isBn ? "এখনই শুরু করুন" : "Launch Store on Framique"}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
