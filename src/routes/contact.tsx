import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { ContactForm } from "@/components/public/ContactForm";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead } from "@/lib/marketing-seo";
import { ORG_NAP, napAddressLine } from "@/lib/legal";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AnimatedIcon } from "@/components/public/AnimatedIcon";
import {
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Headphones,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { MarketingFigure } from "@/components/public/MarketingFigure";
import supportTeamImg from "@/assets/marketing/support-team.jpg";

export const Route = createFileRoute("/contact")({
  loader: async () => getSiteContext(),
  // LocalBusiness + ContactPage + breadcrumbs come from the registry; the NAP
  // inside them is the same constant this page prints below, so the schema and
  // the visible address can never disagree.
  head: ({ loaderData }) => buildMarketingHead({ route: "contact", origin: loaderData?.origin ?? null }),
  component: ContactPage,
});

function ContactPage() {
  const { tk, lang } = useLang();
  const { demoSlug } = Route.useLoaderData();

  return (
    <PublicShell demoSlug={demoSlug}>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3" /> {lang === "bn" ? "সরাসরি যোগাযোগ" : "Direct Dhaka Desk"}
            </span>
            <h1 className="font-bangla-display text-3xl sm:text-4xl font-bold mt-3 text-foreground">
              {tk("contact.title")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              {tk("contact.subtitle")}
            </p>
          </div>

          {/* Live Desk Status Indicator */}
          <div className="flex items-center gap-3 rounded-fq-md border border-primary/30 bg-primary/10 px-4 py-2.5 shrink-0">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {lang === "bn" ? "ঢাকা ডেস্ক সক্রিয়" : "Dhaka Support Active"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {lang === "bn" ? "গড় প্রতিক্রিয়া: ১৪ মিনিটের নিচে" : "Avg response: under 14 mins"}
              </p>
            </div>
          </div>
        </div>

        {/* 16px gap responsive layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <dl className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {/* Direct WhatsApp Fast-Track */}
            <div className="rounded-fq-lg border border-primary/40 bg-primary/10 p-5 transition-all hover:border-primary/60">
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-fq-sm bg-primary text-primary-foreground">
                  <AnimatedIcon icon={MessageSquare} variant="ping" size="sm" />
                </span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {lang === "bn" ? "দ্রুততম উত্তর" : "Fast Track"}
                </span>
              </div>
              <dt className="text-sm font-bold text-foreground mt-3">
                {lang === "bn" ? "হোয়াটসঅ্যাপ মার্চেন্ট হটলাইন" : "WhatsApp Merchant Desk"}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground">
                <a
                  className="fq-tap text-primary font-semibold underline underline-offset-2 hover:opacity-80"
                  href={`tel:${ORG_NAP.e164Phone}`}
                >
                  {ORG_NAP.phone}
                </a>
                <span className="block mt-1 text-[11px]">
                  {lang === "bn"
                    ? "অনবোর্ডিং বা টেকনিক্যাল আলোচনার জন্য সরাসরি মেসেজ দিন।"
                    : "Direct chat with an onboarding specialist in Dhaka."}
                </span>
              </dd>
            </div>

            {/* Sales Card */}
            <div className="rounded-fq-lg border border-border/80 bg-card p-5 transition-all hover:border-border">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-fq-sm bg-muted text-muted-foreground">
                  <AnimatedIcon icon={Mail} variant="draw" size="sm" />
                </span>
                <dt className="text-sm font-semibold text-foreground">{tk("contact.sales")}</dt>
              </div>
              <dd className="mt-2 text-sm text-muted-foreground">
                <a className="fq-tap hover:text-foreground underline underline-offset-2 text-primary" href={`mailto:${ORG_NAP.salesEmail}`}>
                  {ORG_NAP.salesEmail}
                </a>
              </dd>
            </div>

            {/* Support Card */}
            <div className="rounded-fq-lg border border-border/80 bg-card p-5 transition-all hover:border-border">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-fq-sm bg-muted text-muted-foreground">
                  <AnimatedIcon icon={Headphones} variant="sparkle" size="sm" />
                </span>
                <dt className="text-sm font-semibold text-foreground">{tk("contact.support")}</dt>
              </div>
              <dd className="mt-2 text-sm text-muted-foreground">
                <a className="fq-tap hover:text-foreground underline underline-offset-2 text-primary" href={`mailto:${ORG_NAP.supportEmail}`}>
                  {ORG_NAP.supportEmail}
                </a>
              </dd>
            </div>

            {/* Office & NAP Address (Contractually preserved for JSON-LD parity) */}
            <div className="rounded-fq-lg border border-border/80 bg-card p-5 transition-all hover:border-border">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-fq-sm bg-muted text-muted-foreground">
                  <AnimatedIcon icon={MapPin} variant="float" size="sm" />
                </span>
                <dt className="text-sm font-semibold text-foreground">{tk("contact.office")}</dt>
              </div>
              <dd className="mt-2 text-sm text-muted-foreground">
                {/* Printed from the same constant the LocalBusiness JSON-LD reads. */}
                <address className="not-italic">
                  <span className="block font-medium text-foreground">{ORG_NAP.legalName}</span>
                  <span className="block mt-0.5">{napAddressLine()}</span>
                  <a className="fq-tap hover:text-foreground mt-1 inline-block" href={`tel:${ORG_NAP.e164Phone}`}>
                    {ORG_NAP.phone}
                  </a>
                  <a className="mt-2 block text-primary underline underline-offset-2" href={ORG_NAP.mapUrl} target="_blank" rel="noreferrer">
                    {tk("contact.map")}
                  </a>
                </address>
              </dd>
            </div>

            {/* Migration Concierge */}
            <div className="rounded-fq-lg border border-border/80 bg-card p-5 transition-all hover:border-border">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-fq-sm bg-muted text-muted-foreground">
                  <AnimatedIcon icon={ArrowRight} variant="lift" size="sm" />
                </span>
                <dt className="text-sm font-semibold text-foreground">{tk("contact.migration")}</dt>
              </div>
              <dd className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {tk("contact.migration_body")} {tk("contact.response.migration")}
              </dd>
            </div>

            {/* Operating Hours */}
            <div className="rounded-fq-lg border border-border/80 bg-card p-5 transition-all hover:border-border">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-fq-sm bg-muted text-muted-foreground">
                  <AnimatedIcon icon={Clock} variant="lift" size="sm" />
                </span>
                <dt className="text-sm font-semibold text-foreground">{tk("contact.hours")}</dt>
              </div>
              <dd className="mt-2 text-xs text-muted-foreground">{tk("contact.hours_body")}</dd>
            </div>

            {/* Dhaka Support Desk Visual Figure */}
            <div className="sm:col-span-2 lg:col-span-1 pt-2">
              <MarketingFigure
                src={supportTeamImg}
                alt="Prompt: Warm welcoming entrance of a tech studio office in Gulshan 1 Dhaka, wooden reception desk with Framique logo, modern brass pendant lighting, lush indoor fiddle-leaf fig plants, shot on Leica Q3, 8k resolution, aspect ratio 16:9."
                caption={lang === "bn" ? "গুলশান ১, ঢাকায় অবস্থিত আমাদের সরাসরি মার্চেন্ট অনবোর্ডিং ও সাপোর্ট স্টুডিও।" : "Direct merchant onboarding and support studio in Gulshan 1, Dhaka."}
              />
            </div>
          </dl>

          {/* Contact Intake Form with 16px internal padding & rhythm */}
          <div className="rounded-fq-lg border border-border/80 bg-card/90 p-6 sm:p-8 fq-glass fq-halo shadow-lift-lg">
            <h2 className="font-bangla-display text-2xl font-bold text-foreground">{tk("contact.form_title")}</h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{tk("contact.form_intro")}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
