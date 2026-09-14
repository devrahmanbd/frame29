import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Smartphone,
  Truck,
  ShieldCheck,
  Layers,
  ArrowRight,
  Check,
  Store,
  BarChart3,
  PackageCheck,
} from "lucide-react";
import {
  Band,
  BandHeading,
  BandSequence,
  CtaBand,
  FaqBand,
  HeroBand,
} from "@/components/public/bands";
import { fmtMinor } from "@/lib/money";
import { en } from "@/lib/i18n-dict";
import {
  FAQ_ROWS,
  planTeaser,
  type LandingData,
} from "@/lib/landing";
import {
  FINAL_CTA,
  HERO,
} from "@/lib/marketing/home.content";
import { TESTIMONIALS } from "@/lib/marketing/testimonials.content";
import { AnimatedIcon } from "@/components/public/AnimatedIcon";
import { EcosystemSlide } from "@/components/public/landing/EcosystemSlide";
import { MarketingFigure } from "@/components/public/MarketingFigure";
import themesImg from "@/assets/marketing/themes.jpg";
import courierImg from "@/assets/marketing/courier.jpg";
import dashboardImg from "@/assets/marketing/dashboard.jpg";
import mobileStoreImg from "@/assets/marketing/mobile-store.jpg";
import { cn } from "@/lib/utils";

const PRIMARY_CTA =
  "w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[0.98] hover:shadow-md";
const SECONDARY_CTA =
  "w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-foreground/40 hover:bg-card";

export function HomePage({ data }: { data: LandingData }) {
  const { demoSlug, plans } = data;
  const teaser = planTeaser(plans);
  const [activeTourTab, setActiveTourTab] = useState<0 | 1 | 2>(0);

  return (
    <BandSequence route="/">
      {/* 1. HERO SECTION */}
      <HeroBand
        title="Sell online and in-store. Take bKash, cards, and COD on one ledger."
        titleBn="অনলাইন স্টোর, বিকাশ পেমেন্ট আর কুরিয়ার বুকিং — সবই এক প্ল্যাটফর্মে।"
        sub="Take orders on your custom website, collect payments via direct bKash and Nagad settlement, and book Steadfast or Pathao riders in one click. Zero sales commission, zero hidden cuts."
        subBn="সহজ অনলাইন স্টোর, ওয়ান-ক্লিক বিকাশ-নগদ পেমেন্ট এবং স্বয়ংক্রিয় কুরিয়ার বুকিং — সবই এক প্ল্যাটফর্মে।"
        proof={
          <span className="text-xs text-muted-foreground">
            Zero setup fee · Onboard in 3 minutes · Direct merchant payouts
          </span>
        }
        visual={<img src={dashboardImg} alt="Dashboard" className="w-full h-auto rounded-xl shadow-2xl border border-border" />}
        actions={
          <>
            <Link to="/auth" search={{ mode: "signup" }} className={cn(PRIMARY_CTA, "group gap-2")}>
              <span>{HERO.ctaPrimary}</span>
              <AnimatedIcon icon={ArrowRight} variant="magnetic" size="sm" />
            </Link>
            {demoSlug ? (
              <Link to="/store/$slug" params={{ slug: demoSlug }} className={SECONDARY_CTA}>
                {HERO.ctaSecondary}
              </Link>
            ) : (
              <Link to="/features" className={SECONDARY_CTA}>
                Explore features
              </Link>
            )}
          </>
        }
      />

      {/* 2. ECOSYSTEM ANIMATED SLIDE */}
      <Band tight>
        <EcosystemSlide />
      </Band>

      {/* 3. BENTO GRID - VALUE PROPOSITION */}
      <Band surface="glass" divided labelledBy="platform-title">
        <BandHeading
          id="platform-title"
          eyebrow="Bangladesh Retail Infrastructure"
          title="Built for how commerce actually works in Bangladesh."
          sub="Foreign platforms force you to stitch together fragile plugins for bKash, deal with delayed payouts, and copy-paste addresses into courier portals. Framique handles your storefront, local payment gateways, courier dispatch, and multi-channel inventory out of the box."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Bento Card 1: 1-Tap Mobile Checkout (Spans 2 cols on md and lg) */}
          <div className="fq-glass fq-halo rounded-fq-lg border border-border/70 p-7 md:col-span-2 lg:col-span-2 transition-all hover:border-border flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-fq-md bg-primary/10 text-primary">
                  <AnimatedIcon icon={Smartphone} variant="bounce" size="lg" />
                </span>
                <span className="rounded-fq-sm bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Mobile-First
                </span>
              </div>
              <h3 className="fq-display mt-5 text-xl font-bold text-foreground">
                1-Tap Mobile Checkout (400ms TTFB)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Over 78% of Bangladeshi shoppers order on mobile data. Our checkout eliminates multi-step friction, resolves Bangladeshi districts and thanas automatically, and completes bKash or Nagad transactions without frustrating redirect stalls.
              </p>
            </div>

            {/* Live Mobile Checkout Simulation & Visual Preview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="rounded-fq-md border border-border/70 bg-card/60 p-4 space-y-3 fx-spotlight">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Smartphone className="size-3.5 text-primary" /> 1-Tap Checkout UI
                  </span>
                  <span className="text-muted-foreground font-mono">400ms Response</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5">
                    <p className="text-[11px] text-muted-foreground">Delivery Destination</p>
                    <p className="font-semibold text-foreground mt-0.5">House 42, Road 7, Dhanmondi</p>
                    <p className="text-[11px] text-primary mt-0.5">Thana & District auto-resolved</p>
                  </div>
                  <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5">
                    <p className="text-[11px] text-muted-foreground">Selected Payment Rail</p>
                    <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                      <span className="size-2 rounded-full bg-primary inline-block" /> bKash Direct Settlement
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-fq-sm bg-primary/10 border border-primary/20 px-3 py-2 text-xs">
                  <span className="text-foreground font-medium">Cart Total: ৳3,450</span>
                  <span className="font-semibold text-primary">0.3s Confirmed</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-fq-md border border-border shadow-lift">
                <img
                  src={mobileStoreImg}
                  alt="Customer shopping on mobile storefront"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/50 text-xs">
              <div>
                <p className="font-semibold text-foreground">0.4s Load</p>
                <p className="text-muted-foreground">99 Mobile PageSpeed</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">+34% Conversion</p>
                <p className="text-muted-foreground">Zero drop-off rate</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Native MFS</p>
                <p className="text-muted-foreground">bKash & Nagad API</p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Automated Courier Dispatch */}
          <div className="fq-glass fq-halo rounded-fq-lg border border-border/70 p-7 transition-all hover:border-border flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-fq-md bg-primary/10 text-primary">
                  <AnimatedIcon icon={Truck} variant="tilt" size="lg" />
                </span>
                <span className="rounded-fq-sm bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Fulfilment
                </span>
              </div>
              <h3 className="fq-display mt-5 text-xl font-bold text-foreground">
                Automated Courier Dispatch
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Steadfast, Pathao, and RedX connect directly to your order drawer. Book pickups, generate barcodes, and print bulk airway bills with zero copy-pasting.
              </p>
            </div>

            {/* Live Thermal Courier Label Simulation */}
            <div className="mt-6 rounded-fq-md border border-border/70 bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                <span className="font-semibold text-foreground">Steadfast Logistics Sync</span>
                <span className="rounded-fq-sm bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Rider Assigned</span>
              </div>
              <div className="rounded-fq-sm border border-dashed border-border/70 bg-muted/20 p-2.5 text-center">
                <div className="font-mono text-sm tracking-[0.3em] text-foreground select-none font-bold">
                  ||| | |||| || ||||| ||| ||||
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">Consignment: SF-8891402BD</p>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-medium text-foreground">Dhanmondi, Dhaka</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal Label:</span>
                  <span className="font-medium text-primary">1-Click 4x6 AWB Print</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Bulk AWB Generation</span>
              <span className="font-medium text-foreground">Live tracking sync</span>
            </div>
          </div>

          {/* Bento Card 3: COD Return & Fraud Shield */}
          <div className="fq-glass fq-halo rounded-fq-lg border border-border/70 p-7 transition-all hover:border-border flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-fq-md bg-primary/10 text-primary">
                  <AnimatedIcon icon={ShieldCheck} variant="pulse" size="lg" />
                </span>
                <span className="rounded-fq-sm bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Loss Protection
                </span>
              </div>
              <h3 className="fq-display mt-5 text-xl font-bold text-foreground">
                COD Return & Fraud Shield
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Returns on cash-on-delivery cost merchants over ৳150 per parcel in wasted freight. Our fraud shield checks buyer order history and flags risky addresses before you ship.
              </p>
            </div>

            {/* Live Buyer Risk Scoring Simulation */}
            <div className="mt-6 rounded-fq-md border border-border/70 bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                <span className="font-semibold text-foreground">Courier Risk Verification</span>
                <span className="rounded-fq-sm bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Safe to Ship</span>
              </div>
              <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Buyer Phone:</span>
                  <span className="font-mono font-medium text-foreground">+880 1819-***421</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Courier Success:</span>
                  <span className="font-semibold text-primary">96% (14 of 14 delivered)</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/40 pt-1.5">
                  <span className="text-muted-foreground">COD Return Loss Saved:</span>
                  <span className="font-semibold text-foreground">৳150 freight fee</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Flags serial returners and fake orders before rider dispatch.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Return Loss Shield</span>
              <span className="font-medium text-foreground">Up to 42% saved</span>
            </div>
          </div>

          {/* Bento Card 4: Multi-Channel Ledger (Spans 2 cols on md and lg) */}
          <div className="fq-glass fq-halo rounded-fq-lg border border-border/70 p-7 md:col-span-2 lg:col-span-2 transition-all hover:border-border flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-fq-md bg-primary/10 text-primary">
                  <AnimatedIcon icon={Layers} variant="lift" size="lg" />
                </span>
                <span className="rounded-fq-sm bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Unified Data
                </span>
              </div>
              <h3 className="fq-display mt-5 text-xl font-bold text-foreground">
                Multi-Channel Ledger & Real-Time Sync
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Sell on your online store, Facebook and Instagram DM orders, and retail showroom POS without stock clashes. Inventory, revenue, and delivery statuses sync to one real-time ledger.
              </p>
            </div>

            {/* Live Multi-Channel Inventory Ledger */}
            <div className="mt-6 rounded-fq-md border border-border/70 bg-card/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" /> Central Stock Lock: Artisan Jamdani Tunic (M)
                </span>
                <span className="text-primary font-medium">Real-Time Sync</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-center">
                <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5">
                  <p className="text-muted-foreground">Online Storefront</p>
                  <p className="font-semibold text-foreground mt-1 tabular-nums">42 in stock</p>
                  <p className="text-[10px] text-primary mt-0.5">Live catalog lock</p>
                </div>
                <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5">
                  <p className="text-muted-foreground">Social Commerce DM</p>
                  <p className="font-semibold text-foreground mt-1 tabular-nums">42 in stock</p>
                  <p className="text-[10px] text-primary mt-0.5">Order link checkout</p>
                </div>
                <div className="rounded-fq-sm border border-border/50 bg-muted/20 p-2.5">
                  <p className="text-muted-foreground">Showroom POS</p>
                  <p className="font-semibold text-foreground mt-1 tabular-nums">42 in stock</p>
                  <p className="text-[10px] text-primary mt-0.5">Barcode scanner sync</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                A sale at the counter locks web stock immediately — zero customer apologies for out-of-stock items.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/50 text-xs">
              <div>
                <p className="font-semibold text-foreground">Central Inventory</p>
                <p className="text-muted-foreground">Instant stock lock</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Social Commerce</p>
                <p className="text-muted-foreground">Direct order links</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Retail POS</p>
                <p className="text-muted-foreground">Barcode & thermal print</p>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* 4. PRODUCT SHOWCASE / TOUR */}
      <Band labelledBy="tour-title">
        <BandHeading
          id="tour-title"
          eyebrow="Product Architecture"
          title="The complete retail engine in one login."
          sub="Storefront, checkout, fulfilment, catalogue, POS and reporting — one clean system moving together."
        />

        <div className="mt-12">
          {/* Tab Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border/60 pb-4">
            {[
              { id: 0, label: "Storefront & Themes", icon: Store },
              { id: 1, label: "Orders & Fulfilment", icon: PackageCheck },
              { id: 2, label: "Analytics & Retention", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTourTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTourTab(tab.id as 0 | 1 | 2)}
                  className={cn(
                    "min-h-[44px] flex items-center gap-2 rounded-fq-md px-4 py-2.5 text-sm font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  <AnimatedIcon icon={Icon} variant={isActive ? "pulse" : "lift"} size="sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="mt-8 rounded-fq-lg border border-border/70 bg-card/60 p-8 shadow-lift">
            {activeTourTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                <div className="space-y-4">
                  <span className="text-xs uppercase font-semibold tracking-wider text-primary">
                    Speed & Conversion
                  </span>
                  <h3 className="fq-display text-2xl font-bold text-foreground">
                    Storefronts crafted to turn visitors into buyers.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Customise your layout, typography, and colour accents without coding. Every template is engineered with sub-second page loads, instant cart drawers, and responsive image compression.
                  </p>
                  <ul className="space-y-2.5 pt-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Custom domain support with automated SSL (yourbrand.com)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Built-in product variants, color swatches, and size guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Automatic SEO, OpenGraph previews, and structured schema tags</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <MarketingFigure
                    src={themesImg}
                    alt="Prompt: Photorealistic smartphone mockup held in hands in a Dhaka coffee shop, displaying a clean 1-tap mobile checkout screen in Bengali and English, showing bKash payment confirmation and instant order success badge, cinematic natural lighting, shallow depth of field, 8k resolution, aspect ratio 16:9."
                    caption="Sub-second mobile page loads with zero-code visual layout customisation and live Bangla/English rendering."
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {activeTourTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                <div className="space-y-4">
                  <span className="text-xs uppercase font-semibold tracking-wider text-primary">
                    Logistics Automation
                  </span>
                  <h3 className="fq-display text-2xl font-bold text-foreground">
                    Ship 100 orders in the time it used to take for ten.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Say goodbye to manual courier exports and endless WhatsApp coordinate confirmations. Automated courier assignment selects the best carrier by district, books pickup, and notifies the buyer.
                  </p>
                  <ul className="space-y-2.5 pt-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Instant consignment creation for Steadfast, Pathao, and RedX</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Bulk thermal shipping label and invoice printing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Automated delivery tracking SMS with merchant brand name</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <MarketingFigure
                    src={courierImg}
                    alt="Prompt: Clean commercial photograph of a delivery courier in Dhaka handing an eco-friendly parcel with a Framique thermal barcode to a smiling customer at doorstep, golden hour warm lighting, authentic Dhaka urban residential backdrop, shot on 85mm lens f/1.8, 8k resolution, aspect ratio 16:9."
                    caption="Automated Steadfast and Pathao rider booking with 1-click 4x6 thermal barcode waybills."
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {activeTourTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-300">
                <div className="space-y-4">
                  <span className="text-xs uppercase font-semibold tracking-wider text-primary">
                    Financial Clarity
                  </span>
                  <h3 className="fq-display text-2xl font-bold text-foreground">
                    Know your true profit after shipping and gateway fees.
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Most merchants calculate gross sales while ignoring returned COD shipping costs and gateway cuts. Framique gives you true net margin per product, per channel, and per month.
                  </p>
                  <ul className="space-y-2.5 pt-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Automated gross margin and courier cost breakdown</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Abandoned cart recovery automation via SMS and WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Customer lifetime value and repeat purchase analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <MarketingFigure
                    src={dashboardImg}
                    alt="Prompt: A high-resolution 3D UI render of a modern e-commerce dashboard for a Bangladeshi merchant, displaying bKash, Nagad, and Card live settlement graphs, clean typography, dark obsidian glassmorphism cards with soft rose pink accents, isometric angle, photorealistic studio lighting, soft ambient glow, Figma design aesthetic, 8k resolution, aspect ratio 16:10."
                    caption="True net margin accounting after returned COD freight and gateway fees. Zero surprise deductions."
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Band>

      {/* 5. TRANSPARENT PRICING */}
      <Band surface="glass" divided labelledBy="pricing-title">
        <BandHeading
          id="pricing-title"
          eyebrow="Transparent Pricing"
          title="Simple, predictable plans. Zero hidden fees."
          sub="No percentage cuts from your sales. You keep 100% of your top-line revenue."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.slice(0, 3).map((plan) => {
            const isFeatured = plan.plan === "growth" || plan.plan === teaser.entry?.plan;
            return (
              <div
                key={plan.plan}
                className={cn(
                  "relative rounded-fq-lg border p-8 flex flex-col justify-between transition-all",
                  isFeatured
                    ? "border-primary bg-card/90 shadow-lift-lg ring-1 ring-primary/40"
                    : "border-border/70 bg-card/50 hover:border-border",
                )}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="fq-display text-xl font-bold text-foreground">{plan.titleEn}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {plan.plan === "starter" && "Perfect for new merchants launching their first online store."}
                    {plan.plan === "growth" && "For fast-growing brands scaling orders and multi-staff teams."}
                    {plan.plan === "scale" && "For established retailers needing multi-location POS and custom APIs."}
                  </p>

                  <div className="mt-6 border-t border-border/50 pt-6">
                    <p className="flex items-baseline gap-1">
                      <span className="fq-display text-4xl font-extrabold tabular-nums text-foreground">
                        {typeof plan.priceMinorInt === "number"
                          ? fmtMinor(plan.priceMinorInt, plan.currencyCode)
                          : "Contact"}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </p>
                    <p className="text-[11px] text-primary font-medium mt-1">0% transaction fees</p>
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary shrink-0" />
                      <span>{plan.productsLimit} products catalogue</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary shrink-0" />
                      <span>{plan.staffLimit} staff seats</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary shrink-0" />
                      <span>bKash & Nagad instant settlement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary shrink-0" />
                      <span>Automated courier booking & labels</span>
                    </li>
                    {plan.plan !== "starter" && (
                      <li className="flex items-center gap-2">
                        <Check className="size-3.5 text-primary shrink-0" />
                        <span>Custom domain & COD Fraud Shield</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40">
                  <Link
                    to="/auth"
                    search={{ mode: "signup" }}
                    className={cn(
                      "w-full inline-flex items-center justify-center rounded-fq-md py-2.5 text-xs font-semibold transition-all",
                      isFeatured
                        ? "bg-primary text-primary-foreground shadow-sm hover:scale-[0.98]"
                        : "border border-border text-foreground hover:bg-muted/40",
                    )}
                  >
                    Start 14-day free trial
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Compare all plan features & limits <ArrowRight className="size-3" />
          </Link>
        </div>
      </Band>

      {/* 6. MERCHANT STORIES / TESTIMONIALS */}
      <Band labelledBy="cases-title">
        <BandHeading
          id="cases-title"
          eyebrow={TESTIMONIALS.eyebrow}
          title="Built for the merchants shaping Bangladesh retail."
          sub="Real businesses seeing real results with Framique's native commerce platform."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.cases.map((item) => (
            <div
              key={item.id}
              className="rounded-fq-lg border border-border/70 bg-card/60 p-7 flex flex-col justify-between shadow-lift"
            >
              <div>
                {/* Authentic Merchant Header */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-border/50">
                  <div className="grid size-11 shrink-0 place-items-center rounded-fq-md border border-primary/30 bg-primary/10 text-primary font-bold text-sm tracking-wider shadow-sm">
                    {item.mark}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-fq-sm bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {item.sector} · {item.city}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-medium text-primary">
                        <Check className="size-2.5 mr-0.5" /> Verified
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground truncate mt-0.5">{item.merchant}</h3>
                  </div>
                </div>

                <p className="text-sm italic text-foreground leading-relaxed">
                  “{item.quote}”
                </p>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">{item.attribution}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border/50">
                <dl className="space-y-1.5 text-xs">
                  {item.results.map((res) => (
                    <div key={res.label} className="flex justify-between items-center">
                      <dt className="text-muted-foreground">{res.label}:</dt>
                      <dd className="font-semibold text-primary tabular-nums">{res.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* 7. FAQ ACCORDION (Matches structured data verbatim) */}
      <Band divided labelledBy="faq-title">
        <BandHeading
          id="faq-title"
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know before joining."
          sub="Clear answers to common questions about payouts, setup, and courier connections."
        />
        <FaqBand
          entries={FAQ_ROWS.map((row) => ({
            id: row.id,
            question: en(row.questionKey),
            answer: en(row.answerKey),
          }))}
        />
      </Band>

      {/* 8. FINAL HIGH-CONVERTING CTA */}
      <CtaBand
        id="final-cta-title"
        title="Start growing your ecommerce business today."
        body="Join hundreds of modern Bangladeshi merchants who trust Framique for their storefront, payments, and logistics."
        note="14-day free trial · No credit card required · Full feature access"
        primary={
          <Link to="/auth" search={{ mode: "signup" }} className={cn(PRIMARY_CTA, "group gap-2")}>
            <span>{FINAL_CTA.ctaPrimary}</span>
            <AnimatedIcon icon={ArrowRight} variant="magnetic" size="sm" />
          </Link>
        }
        secondary={
          <Link to="/contact" className={SECONDARY_CTA}>
            {FINAL_CTA.ctaSecondary}
          </Link>
        }
      />
    </BandSequence>
  );
}

