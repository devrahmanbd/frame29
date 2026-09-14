import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead } from "@/lib/marketing-seo";
import { motion } from "motion/react";
import { Zap, Code, Terminal, Sparkles, Building2, Store } from "lucide-react";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const site = await getSiteContext();
    return { origin: site.origin };
  },
  head: ({ loaderData }) => {
    const head = buildMarketingHead({ route: "about", origin: loaderData?.origin ?? null });
    return { meta: head.meta, links: head.links };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicShell>
      <div className="w-full bg-background text-foreground overflow-hidden">
        
        {/* HERO - Asymmetrical Layout */}
        <section className="relative pt-32 pb-20 px-6 max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
             <div className="lg:w-1/2 space-y-8">
               <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20">
                 <Building2 className="mr-2 h-4 w-4" />
                 Our Story
               </div>
               <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
                 We are building the <span className="text-primary">commerce OS</span> for Bangladesh.
               </h1>
               <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                 Foreign platforms were never built for COD, bKash, or local logistics. We are engineering the infrastructure to fix that.
               </p>
             </div>
             
             {/* Abstract Visual Placeholder */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="lg:w-1/2 w-full aspect-square rounded-[3rem] bg-accent border border-accent-foreground/5 relative overflow-hidden flex items-center justify-center shadow-2xl"
             >
                <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full mix-blend-multiply" />
                <Store className="size-32 text-primary/50 relative z-10" />
             </motion.div>
          </div>
        </section>

        {/* BENTO GRID - Engineering Principles */}
        <section className="py-24 px-6 lg:px-20 max-w-[1440px] mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Engineering over marketing.</h2>
            <p className="text-lg text-muted-foreground">We believe in fast load times, accessible code, and transparent pricing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[250px]">
             <div className="md:col-span-2 rounded-[2rem] bg-card p-10 border border-border shadow-sm flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Terminal className="size-32 text-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Zero Vendor Lock-in</h3>
                <p className="text-muted-foreground max-w-md">Our architecture is designed to be fully self-hostable. If you outgrow us, you can take your data and run it on your own servers.</p>
             </div>

             <div className="md:col-span-1 rounded-[2rem] bg-card p-10 border border-border shadow-sm flex flex-col justify-end">
                <Zap className="size-10 text-warning-foreground mb-auto" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Sub-second</h3>
                <p className="text-muted-foreground">Every API is optimized for sub-second responses on mobile data.</p>
             </div>

             <div className="md:col-span-1 rounded-[2rem] bg-card p-10 border border-border shadow-sm flex flex-col justify-end">
                <Code className="size-10 text-info mb-auto" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Developer First</h3>
                <p className="text-muted-foreground">Built with React, TanStack, and standard APIs.</p>
             </div>

             <div className="md:col-span-2 rounded-[2rem] bg-muted/50 p-10 border border-border/50 shadow-sm flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute top-10 right-10 bg-primary/20 w-48 h-48 rounded-full blur-3xl" />
                <h3 className="text-2xl font-bold text-foreground mb-2 relative z-10">Transparent Culture</h3>
                <p className="text-muted-foreground max-w-md relative z-10">No hidden fees, no surprise pricing tiers. We win only when your business scales.</p>
             </div>
          </div>
        </section>

      </div>
    </PublicShell>
  );
}
