import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { getPublicPlans } from "@/lib/site.functions";
import { buildMarketingHead } from "@/lib/marketing-seo";
import { motion } from "motion/react";
import { Check, Sparkles, Zap, ArrowRight, Minus } from "lucide-react";
import { fmtMinor } from "@/lib/money";

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const [site, plans] = await Promise.all([getSiteContext(), getPublicPlans()]);
    return { origin: site.origin, plans };
  },
  head: ({ loaderData }) => {
    const head = buildMarketingHead({ route: "pricing", origin: loaderData?.origin ?? null });
    return { meta: head.meta, links: head.links };
  },
  component: PricingPage,
});

function PricingPage() {
  const { plans } = Route.useLoaderData();
  const sortedPlans = [...plans].sort((a, b) => (a.priceMinorInt ?? 0) - (b.priceMinorInt ?? 0));

  return (
    <PublicShell>
      <div className="w-full bg-background text-foreground overflow-hidden">
        
        {/* 1. HERO - Container-free full bleed */}
        <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6 ring-1 ring-inset ring-primary/20">
              <Zap className="mr-2 h-4 w-4" />
              Transparent Pricing
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Pay a flat fee.<br />
              Keep <span className="text-primary">100% of your sales.</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Marketplaces take up to 15% of your revenue. Framique charges a flat monthly platform fee and zero commissions on your sales.
            </p>
          </motion.div>
        </section>

        {/* 2. Taka Savings Calculator - Container-free visual */}
        <section className="px-6 lg:px-20 max-w-[1440px] mx-auto pb-32">
          <TakaSavingsCalculator />
        </section>

        {/* 3. Pricing Plans Grid */}
        <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto border-t border-border/50">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold tracking-tight">Choose your engine</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
             {sortedPlans.map((plan, i) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 viewport={{ once: true }}
                 key={plan.id}
                 className={`flex flex-col p-10 rounded-[2.5rem] bg-card border ${plan.id.includes('pro') ? 'border-white/20 dark:border-white/10 bg-card/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-black/5 dark:ring-white/5 scale-105 z-20' : 'border-border shadow-sm'}`}
               >
                 {plan.id.includes('pro') && (
                   <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full w-max mb-6">MOST POPULAR</span>
                 )}
                 <h3 className="text-2xl font-bold text-foreground mb-2">{plan.titleEn}</h3>
                 <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">{plan.descriptionEn}</p>
                 <div className="mb-8">
                   <span className="text-5xl font-extrabold tracking-tight">
                     {plan.priceMinorInt !== null ? fmtMinor(plan.priceMinorInt, plan.currencyCode) : "Custom"}
                   </span>
                   {plan.priceMinorInt !== null && <span className="text-muted-foreground">/mo</span>}
                   <p className="text-xs text-emerald-500 dark:text-emerald-400 font-bold tracking-wide uppercase mt-4">0% transaction fees</p>
                 </div>
                 
                 <ul className="space-y-4 mb-10 flex-grow">
                   <li className="flex gap-3 text-sm font-medium">
                     <Check className="size-5 text-primary shrink-0" />
                     Full storefront access
                   </li>
                   <li className="flex gap-3 text-sm font-medium">
                     <Check className="size-5 text-primary shrink-0" />
                     bKash & Nagad integration
                   </li>
                   <li className="flex gap-3 text-sm font-medium">
                     <Check className="size-5 text-primary shrink-0" />
                     Courier API dispatch
                   </li>
                   {plan.id.includes('pro') && (
                     <li className="flex gap-3 text-sm font-medium">
                       <Check className="size-5 text-primary shrink-0" />
                       Advanced fraud defense scoring
                     </li>
                   )}
                 </ul>

                 <Link 
                   to="/auth" 
                   search={{ mode: "signup" }} 
                   className={`w-full min-h-[48px] rounded-full flex items-center justify-center font-semibold transition-all ${plan.id.includes('pro') ? 'fq-cta-primary' : 'fq-cta-secondary'}`}
                 >Get started</Link>
               </motion.div>
             ))}
          </div>
        </section>

      </div>
    </PublicShell>
  );
}

function TakaSavingsCalculator() {
  const [salesVolume, setSalesVolume] = useState<number>(250000);
  const marketplaceCommissionRate = 0.15;
  const marketplaceCut = Math.round(salesVolume * marketplaceCommissionRate);
  const framiqueCost = 1990;
  const monthlySavings = Math.max(0, marketplaceCut - framiqueCost);
  const annualSavings = monthlySavings * 12;

  const presets = [50000, 150000, 250000, 500000, 1000000];

  return (
    <div className="rounded-[2rem] bg-accent/30 p-10 lg:p-16 border border-accent-foreground/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] mix-blend-multiply" />
      
      <div className="lg:w-1/2 relative z-10 space-y-6">
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
          See the math.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
           Toggle your estimated monthly sales volume to see exactly how much profit you lose to marketplace commissions compared to Framique's flat fee.
        </p>
        
        <div className="pt-6 space-y-4">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Monthly GMV (Gross Sales)
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => setSalesVolume(val)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                  salesVolume === val 
                    ? "bg-primary border-primary text-white" 
                    : "bg-card border-border text-foreground hover:border-primary/50"
                }`}
              >
                ৳{(val / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 relative z-10 w-full space-y-6">
         <div className="bg-card rounded-[2rem] p-8 border border-border shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
               <span className="text-muted-foreground font-medium">Marketplace Cut (15%)</span>
               <span className="text-xl font-bold text-danger">৳{marketplaceCut.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
               <span className="text-muted-foreground font-medium">Framique Flat Fee</span>
               <span className="text-xl font-bold text-success">৳{framiqueCost.toLocaleString()}</span>
            </div>
            <div className="pt-4 bg-accent/20 rounded-2xl p-6 flex justify-between items-center border border-accent-foreground/10">
               <span className="text-foreground font-bold">Annual Savings</span>
               <span className="text-4xl font-extrabold text-primary">৳{annualSavings.toLocaleString()}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
