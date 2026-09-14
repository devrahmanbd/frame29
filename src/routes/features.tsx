import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Store, 
  Smartphone, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Layers,
  LineChart
} from "lucide-react";

export const Route = createFileRoute("/features")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const head = buildMarketingHead({ route: "features", origin: loaderData?.origin ?? null });
    return {
      meta: head.meta,
      links: head.links,
    };
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <PublicShell>
      <div className="w-full bg-background text-foreground overflow-hidden">
        
        {/* 1. HERO - Centered */}
        <section className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6 ring-1 ring-inset ring-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Everything you need, built-in.
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Stop stitching plugins. <br/>
              Start selling.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Framique gives you a storefront, POS, local courier integrations, and bKash/Nagad checkout without requiring a single third-party plugin.
            </p>
          </motion.div>
        </section>

        {/* Image Break */}
        <section className="px-6 lg:px-20 max-w-[1440px] mx-auto pb-32">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="w-full h-[400px] lg:h-[600px] rounded-[2rem] bg-accent flex items-center justify-center relative overflow-hidden border border-border"
           >
              <div className="absolute inset-0 bg-primary/5 backdrop-blur-3xl" />
              {/* Abstract dashboard placeholder representation */}
              <div className="w-[80%] h-[80%] bg-card rounded-2xl shadow-2xl border border-border flex items-center justify-center relative z-10 overflow-hidden">
                 <div className="absolute top-0 w-full h-12 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                    <div className="size-3 rounded-full bg-danger/50" />
                    <div className="size-3 rounded-full bg-warning/50" />
                    <div className="size-3 rounded-full bg-success/50" />
                 </div>
                 <div className="text-muted-foreground/40 font-semibold text-2xl flex flex-col items-center">
                   <Store className="size-16 mb-4" />
                   Unified Dashboard View
                 </div>
              </div>
           </motion.div>
        </section>

        {/* 2. Z-Pattern Feature Breakdowns */}
        <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto space-y-32">
          
          {/* F-Pattern Storefront */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 space-y-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-info-soft text-info">
                <Smartphone className="size-6" />
              </span>
              <h2 className="text-4xl font-bold text-foreground">Mobile-first Storefronts.</h2>
              <p className="text-lg text-muted-foreground">
                Over 80% of your customers browse on mobile data. Our storefronts are aggressively cached and optimized for mobile screens, delivering sub-second page loads.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Visual Theme Builder</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Custom domains with free SSL</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Multi-language (Bangla/English)</li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full h-[400px] bg-muted rounded-[2rem] border border-border flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Storefront Visual Placeholder</span>
            </div>
          </div>

          {/* Checkout & Payments */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 space-y-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-success-soft text-success">
                <CreditCard className="size-6" />
              </span>
              <h2 className="text-4xl font-bold text-foreground">Native MFS Checkout.</h2>
              <p className="text-lg text-muted-foreground">
                Accept bKash, Nagad, Rocket, and Cards without writing code. Funds settle directly into your merchant account, not a marketplace wallet.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Zero sales commission</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Direct API settlement</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Advanced COD tracking</li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full h-[400px] bg-muted rounded-[2rem] border border-border flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Payment Flow Placeholder</span>
            </div>
          </div>

          {/* Logistics */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 space-y-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-warning-soft text-warning-foreground">
                <Truck className="size-6" />
              </span>
              <h2 className="text-4xl font-bold text-foreground">Automated Dispatch.</h2>
              <p className="text-lg text-muted-foreground">
                Stop copy-pasting addresses. Send orders to Steadfast, Pathao, or RedX with one click. Generate thermal barcodes instantly.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Bulk airway bill printing</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Live rider tracking</li>
                <li className="flex items-center gap-3"><ArrowRight className="size-4 text-primary" /> Automated returns handling</li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full h-[400px] bg-muted rounded-[2rem] border border-border flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Logistics Visual Placeholder</span>
            </div>
          </div>

        </section>

        {/* 3. Deep-Dive Bento Grid */}
        <section className="py-24 bg-accent/20 px-6 lg:px-20 border-t border-border/50">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">
                Built for scale.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="rounded-[2rem] bg-card p-8 border border-border">
                 <Layers className="size-8 text-primary mb-6" />
                 <h3 className="text-xl font-bold mb-2">Multi-channel Sync</h3>
                 <p className="text-muted-foreground">Keep your online store, Instagram DMs, and retail POS perfectly synced in real-time.</p>
              </div>
              <div className="rounded-[2rem] bg-card p-8 border border-border">
                 <ShieldCheck className="size-8 text-primary mb-6" />
                 <h3 className="text-xl font-bold mb-2">Fraud Defense</h3>
                 <p className="text-muted-foreground">Automated customer verification scores help you reject risky COD orders before shipping.</p>
              </div>
              <div className="rounded-[2rem] bg-card p-8 border border-border">
                 <LineChart className="size-8 text-primary mb-6" />
                 <h3 className="text-xl font-bold mb-2">Margin Analytics</h3>
                 <p className="text-muted-foreground">Track true profitability per item, factoring in courier returns, packaging, and payment fees.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicShell>
  );
}
