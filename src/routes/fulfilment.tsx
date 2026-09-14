/**
 * `/fulfilment` — courier booking, order lifecycle, returns and remittance.
 *
 * Content is a pure data module (`fulfilment.content.ts`); this file only
 * composes it onto the shared band kit and wires SEO. Courier *names* come
 * from the product's own courier registry (`CARRIER_PROFILES`, a `.server.ts`
 * export) rather than being retyped here — that module is imported only
 * inside the loader, which runs server-side, so no server-only code reaches
 * the client bundle.
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { getLanding } from "@/lib/landing.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { cn } from "@/lib/utils";
import { Truck, CheckCircle2, Sparkles, MapPin, RefreshCw, ArrowRight } from "lucide-react";
import { AnimatedIcon } from "@/components/public/AnimatedIcon";
import {
  Band,
  BandHeading,
  Chip,
  HeroBand,
  MarqueeBand,
  ZRow,
  CardGrid,
  MatrixTable,
  StatBand,
  SpotlightBand,
  FaqBand,
  CtaBand,
  type MatrixColumn,
  type MatrixRow,
  type FaqEntry,
} from "@/components/public/bands";
import { MarketingFigure } from "@/components/public/MarketingFigure";
import packingStationImg from "@/assets/marketing/packing-station.jpg";
import courierImg from "@/assets/marketing/courier.jpg";
import * as content from "@/lib/marketing/fulfilment.content";

/* -------------------------------------------------------------------------- */
/* Loader                                                                     */
/* -------------------------------------------------------------------------- */

/** Courier name shape the page needs, sourced from the product registry. */
type CourierName = { code: string; name: string; nameBn: string };

export const Route = createFileRoute("/fulfilment")({
  loader: async () => {
    // Fail-soft on every remote call: a marketing page never 500s because a
    // stat query or the courier registry hiccupped, it just drops that band.
    const [site, landing, couriers] = await Promise.all([
      getSiteContext().catch(() => null),
      getLanding().catch(() => null),
      loadCourierNames().catch(() => [] as CourierName[]),
    ]);
    return {
      demoSlug: site?.demoSlug ?? null,
      origin: site?.origin ?? null,
      stats: landing?.stats ?? null,
      couriers,
    };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "fulfilment", origin });
    // The FAQ passed to structured data is the exact array `FaqBand` renders
    // below — same ids, same English strings — so JSON-LD never claims an
    // answer the page doesn't actually show.
    const graph = buildGraph({
      route: "fulfilment",
      origin,
      faq: content.faqEntries.map((entry) => ({ question: entry.question.en, answer: entry.answer.en })),
    });
    return {
      meta: head.meta,
      links: head.links,
      scripts: graph ? [{ type: "application/ld+json", children: JSON.stringify(graph) }] : [],
    };
  },
  component: FulfilmentPage,
  errorComponent: () => (
    <PublicShell>
      <Band>
        <BandHeading title="Fulfilment is temporarily unavailable." level={2} id="fulfilment-error" />
      </Band>
    </PublicShell>
  ),
  notFoundComponent: () => (
    <PublicShell>
      <Band>
        <BandHeading title="Page not found." level={2} id="fulfilment-404" />
      </Band>
    </PublicShell>
  ),
});

/** Server-side-only read of the courier registry. Never imported by client code. */
const loadCourierNames = createServerFn({ method: "GET" }).handler(async (): Promise<CourierName[]> => {
  const { CARRIER_PROFILES } = await import("@/lib/courier-adapters.server");
  return CARRIER_PROFILES.map((p) => ({ code: p.code, name: p.name, nameBn: p.nameBn }));
});

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function FulfilmentPage() {
  const { demoSlug, stats, couriers } = Route.useLoaderData();

  // The deck's four named couriers, in the registry's own sort order, plus
  // the deck's fifth "Manual / own rider" tile which has no registry row.
  const deckCodes = ["steadfast", "pathao", "redx", "paperfly"] as const;
  const wallCouriers = deckCodes
    .map((code) => couriers.find((c) => c.code === code))
    .filter((c): c is (typeof couriers)[number] => Boolean(c));

  const slaColumns: MatrixColumn[] = [
    { id: "insideDhaka", label: "Inside-Dhaka coverage" },
    { id: "outsideDhaka", label: "Outside-Dhaka coverage" },
    { id: "cutoff", label: "Typical pickup cut-off" },
    { id: "remittance", label: "Typical COD remittance cycle" },
    { id: "returnWindow", label: "Return window" },
  ];
  const slaRows: MatrixRow[] = content.courierSlaRows.map((row) => {
    const registryName = couriers.find((c) => c.code === row.code)?.name;
    const label = row.code === "manual" ? content.manualCourier.name : registryName ?? row.code;
    return {
      id: row.code,
      label,
      cells: {
        insideDhaka: row.insideDhaka,
        outsideDhaka: row.outsideDhaka,
        cutoff: row.cutoff,
        remittance: row.remittance,
        returnWindow: row.returnWindow,
      },
    };
  });

  const notificationColumns: MatrixColumn[] = [
    { id: "channel", label: "Channel" },
    { id: "en", label: "English copy" },
    { id: "bn", label: "বাংলা copy" },
  ];
  const notificationRows: MatrixRow[] = content.notificationRows.map((row) => ({
    id: row.id,
    label: row.trigger,
    cells: {
      channel: row.channel,
      en: row.en,
      bn: (
        <span lang="bn" className="font-bangla-display">
          {row.bn}
        </span>
      ),
    },
  }));

  const stockColumns: MatrixColumn[] = [
    { id: "when", label: "When it applies" },
    { id: "available", label: "Available to sell?" },
  ];
  const stockRows: MatrixRow[] = content.stockStateRows.map((row) => ({
    id: row.id,
    label: row.state,
    cells: { when: row.when, available: row.countedAsAvailable },
  }));

  const ledgerColumns: MatrixColumn[] = [{ id: "meaning", label: "Meaning" }];
  const ledgerRows: MatrixRow[] = content.remittanceLedgerRows.map((row) => ({
    id: row.id,
    label: row.state,
    cells: { meaning: row.meaning },
  }));

  const comparisonColumns: MatrixColumn[] = [
    { id: "spreadsheet", label: "Spreadsheet + courier panels" },
    { id: "framique", label: "Framique", highlight: true },
  ];
  const comparisonRows: MatrixRow[] = content.comparisonRows.map((row) => ({
    id: row.id,
    label: row.task,
    cells: { spreadsheet: row.spreadsheet, framique: row.framique },
  }));

  const faqRows: FaqEntry[] = content.faqEntries.map((entry) => ({
    id: entry.id,
    question: entry.question.en,
    answer: entry.answer.en,
  }));

  // Live, DB-sourced numbers only — the same stats `/` and `/pricing` read
  // from `getLanding`. Fulfilment-specific figures (return rate, RTO %) are
  // not tracked platform-wide, so they are never fabricated for this band.
  const shownStats = stats
    ? [
        { id: "merchants", label: "Active, verified merchants", value: stats.merchants },
        { id: "products", label: "Published products across the platform", value: stats.products },
        { id: "paymentRails", label: "Payment rails wired end to end", value: stats.paymentRails },
      ]
    : [];

  return (
    <PublicShell demoSlug={demoSlug}>
      <HeroBand
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        titleBn={content.hero.titleBn}
        sub={content.hero.sub}
        subBn={content.hero.subBn}
        actions={
          <>
            <Link
              to="/contact"
              className="w-full sm:w-auto min-h-[44px] rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all group"
            >
              <span>{content.hero.primaryCta}</span>
              <AnimatedIcon icon={ArrowRight} variant="magnetic" size="sm" />
            </Link>
            <a
              href="#couriers"
              className="w-full sm:w-auto min-h-[44px] rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground flex items-center justify-center hover:bg-muted/30 transition-all"
            >
              {content.hero.altCta}
            </a>
          </>
        }
      />

      {/* §2 Courier wall */}
      <Band id="couriers" labelledBy="couriers-title" divided>
        <BandHeading id="couriers-title" title="Four couriers, one drawer" sub={content.courierWallNote} />
        <div className="mt-8">
          <MarqueeBand
            label="Supported couriers"
            kicker="Enter a credential once in Settings → Couriers"
            note={content.courierWallNote}
            marks={[
              ...wallCouriers.map((c) => ({ id: c.code, content: c.name, label: c.name })),
              { id: "manual", content: content.manualCourier.name, label: content.manualCourier.name },
            ]}
          />
        </div>
      </Band>

      {/* §3 Lifecycle state machine — local timeline visual inside a Band. */}
      <Band labelledBy="lifecycle-title" divided>
        <BandHeading
          id="lifecycle-title"
          eyebrow="Order tracking for online store"
          title="The order lifecycle: a state machine, not a status label"
          sub="Every order occupies exactly one state at a time. Every transition writes an order event with an actor and a timestamp — the same log staff, couriers and a customer's public tracking page all read from."
        />
        <LifecycleTimeline />
        <div className="mt-10">
          <MatrixTable
            caption="What happens automatically at each lifecycle state"
            layout="cards"
            columns={[
              { id: "trigger", label: "Trigger" },
              { id: "automatic", label: "Automatic actions" },
              { id: "visibleTo", label: "Who can see it" },
            ]}
            rows={content.lifecycleRows.map((row) => ({
              id: row.id,
              label: row.state,
              cells: { trigger: row.trigger, automatic: row.automatic, visibleTo: row.visibleTo },
            }))}
            note={content.lifecycleCaption}
          />
        </div>
      </Band>

      {/* §5.2 Courier SLA reference table */}
      <Band labelledBy="sla-title" divided>
        <BandHeading
          id="sla-title"
          eyebrow="Steadfast, Pathao, RedX, Paperfly API"
          title="Courier coverage, cut-off and remittance, side by side"
          sub={content.decisionFramework.sub}
        />
        <MarketingFigure
          className="mt-8"
          src={courierImg}
          alt="Prompt: Clean commercial photograph of a delivery courier in Dhaka handing an eco-friendly parcel with a Framique thermal barcode to a smiling customer at doorstep, golden hour warm lighting, authentic Dhaka urban residential backdrop, shot on 85mm lens f/1.8, 8k resolution, aspect ratio 16:9."
          caption="One-click consignment assignment across Steadfast, Pathao, and RedX riders directly from the order drawer."
        />
        <div className="mt-8">
          <CardGrid columns={4} cards={content.decisionFramework.cards.map((c) => ({ id: c.id, title: c.title, body: c.body }))} />
        </div>
        <div className="mt-10">
          <MatrixTable
            caption="Courier coverage, cut-off and remittance comparison"
            layout="cards"
            columns={slaColumns}
            rows={slaRows}
            note={content.courierSlaNote}
          />
        </div>
      </Band>

      {/* §4 Multi-courier booking inside the order drawer */}
      <Band divided>
        <ZRow
          direction="left"
          level={2}
          id="drawer-title"
          eyebrow={content.drawerZRow.eyebrow}
          title={content.drawerZRow.title}
          body={content.drawerZRow.body}
          bullets={[...content.drawerZRow.bullets]}
          proof={
            <>
              {content.drawerZRow.proof}
              <span lang="bn" className="font-bangla-display ml-2 text-muted-foreground">
                {content.drawerZRow.proofBn}
              </span>
            </>
          }
          visual={<DrawerMock />}
        />
      </Band>

      {/* §6 Returns & RTO reduction, with the worked margin example */}
      <Band labelledBy="returns-title" divided>
        <ZRow
          direction="right"
          level={2}
          id="returns-title"
          eyebrow={content.returnsZRow.eyebrow}
          title={content.returnsZRow.title}
          body={content.returnsZRow.body}
          bullets={[...content.returnsZRow.bullets]}
          proof="Reduce cash on delivery return rate"
          visual={<RtoWorkedExampleCard />}
        />
        <div className="mt-10">
          <h3 className="fq-display text-xl">RTO reduction checklist</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {content.rtoChecklist.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-border" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* §7 Address quality and phone verification */}
      <Band divided>
        <ZRow
          direction="left"
          eyebrow={content.verificationZRow.eyebrow}
          title={content.verificationZRow.title}
          body={content.verificationZRow.body}
          bullets={[...content.verificationZRow.bullets]}
          visual={
            <div className="fq-glass rounded-fq-lg p-6 text-sm text-muted-foreground">
              <p lang="bn" className="font-bangla-display">
                {content.verificationZRow.otpPromptBn}
              </p>
            </div>
          }
        />
      </Band>

      {/* §8 Packing and pick-list workflow */}
      <Band labelledBy="packing-title" divided>
        <BandHeading id="packing-title" title="Packing and pick-list workflow for a small warehouse" />
        <MarketingFigure
          className="mt-8"
          src={packingStationImg}
          alt="Prompt: A sleek 3D isometric illustration of thermal shipping labels printing from a modern thermal printer, labeled with Steadfast and Pathao courier barcodes, parcel boxes on a minimalist wooden studio table, soft warm lighting, hyper-detailed, clean modern aesthetics, 8k resolution, aspect ratio 16:9."
          caption="High-speed packing station with 1-click batch thermal label and invoice printing."
        />
        <div className="mt-8">
          <CardGrid columns={3} cards={content.packingSteps.map((s, i) => ({ id: s.id, title: `${i + 1}. ${s.title}`, body: s.body }))} />
        </div>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {content.packingChecklist.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-muted-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-border" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* §9 Inventory reservation and oversell prevention */}
      <Band labelledBy="inventory-title" divided>
        <BandHeading id="inventory-title" title="Inventory reservation and oversell prevention" sub={content.oversellCaption} />
        <div className="mt-8">
          <MatrixTable
            caption="Stock states and availability"
            layout="cards"
            columns={stockColumns}
            rows={stockRows}
          />
        </div>
      </Band>

      {/* §10 Delivery-status webhooks and Bangla notifications */}
      <Band labelledBy="notifications-title" divided>
        <BandHeading id="notifications-title" title="Delivery-status webhooks and Bangla customer notifications" sub={content.notificationCaption} />
        <div className="mt-8">
          <MatrixTable
            caption="Notification rules and Bangla copy"
            layout="cards"
            columns={notificationColumns}
            rows={notificationRows}
          />
        </div>
      </Band>

      {/* §11 Exceptions queue and SLA breach handling */}
      <Band labelledBy="exceptions-title" divided>
        <BandHeading id="exceptions-title" title="Exceptions queue and SLA breach handling" sub={content.exceptionsCaption} />
        <div className="mt-8">
          <CardGrid columns={4} cards={content.exceptionCards.map((c) => ({ id: c.id, title: c.title, body: c.body }))} />
        </div>
      </Band>

      {/* §12 Remittance reconciliation */}
      <Band labelledBy="remittance-title" divided>
        <BandHeading id="remittance-title" title="Remittance reconciliation with the courier" sub={content.remittanceWorkedCheck} />
        <div className="mt-8">
          <MatrixTable
            caption="Remittance ledger states"
            layout="cards"
            columns={ledgerColumns}
            rows={ledgerRows}
          />
        </div>
      </Band>

      {/* §13 Peak-season capacity checklist */}
      <Band labelledBy="peak-title" divided>
        <BandHeading id="peak-title" title={content.peakSeason.title} sub={content.peakSeason.sub} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {content.peakSeason.items.map((item) => (
            <li key={item} className="fq-glass flex gap-3 rounded-fq-lg p-4 text-sm text-muted-foreground">
              <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* §14 Comparison: Framique vs spreadsheet + courier panels */}
      <Band labelledBy="comparison-title" divided>
        <BandHeading id="comparison-title" title="Framique vs spreadsheet + courier panels" sub={content.comparisonCaption} />
        <div className="mt-8">
          <MatrixTable
            caption="Framique compared to a spreadsheet and courier panels"
            layout="cards"
            columns={comparisonColumns}
            rows={comparisonRows}
          />
        </div>
      </Band>

      {/* Live stats — DB-sourced only, never fulfilment-specific numbers we don't measure platform-wide. */}
      {shownStats.length > 0 ? (
        <Band divided>
          <StatBand stats={shownStats} columns={3} />
        </Band>
      ) : null}

      {/* §15 FAQ */}
      <Band labelledBy="faq-title" divided>
        <BandHeading id="faq-title" title="Fulfilment questions, answered" />
        <FaqBand entries={faqRows} />
      </Band>

      {/* §16 Final CTA */}
      <CtaBand
        title={
          <>
            {content.finalCta.title}
            <span lang="bn" className="font-bangla-display mt-2 block text-2xl opacity-90">
              {content.finalCta.titleBn}
            </span>
          </>
        }
        body={content.finalCta.body}
        primary={
          <Link
            to="/contact"
            className="w-full sm:w-auto min-h-[44px] rounded-fq-md bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold flex items-center justify-center shadow-sm hover:bg-primary/90 transition-all"
          >
            {content.finalCta.primaryCta}
          </Link>
        }
        secondary={
          <Link
            to="/auth"
            search={{ mode: "signup", accountType: "merchant" }}
            className="w-full sm:w-auto min-h-[44px] rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground flex items-center justify-center hover:bg-muted/30 transition-all"
          >
            {content.finalCta.altCta}
          </Link>
        }
      />
    </PublicShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Small page-local visuals                                                   */
/* -------------------------------------------------------------------------- */

/** §3 — the seven-node rail with the two exit branches, per the deck's motion spec. */
function LifecycleTimeline() {
  return (
    <div className="rounded-fq-lg border border-border/70 bg-card p-6 mt-10">
      <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" aria-label="Order lifecycle states">
        {content.lifecycleStates.map((state, index) => (
          <li key={state} className="rounded-fq-md border border-border/60 bg-muted/20 p-3 flex flex-col items-center text-center justify-between">
            <span
              className={
                index === content.lifecycleStates.length - 1
                  ? "flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-primary/40"
                  : "flex size-7 items-center justify-center rounded-full border border-border text-xs font-semibold text-foreground"
              }
            >
              {index + 1}
            </span>
            <span className="text-xs font-medium text-foreground mt-2">{state}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-dashed border-border pt-4">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Exits from In transit</span>
        {content.lifecycleExitBranches.map((branch) => (
          <Chip key={branch}>{branch}</Chip>
        ))}
      </div>
    </div>
  );
}

type CourierKey = "steadfast" | "pathao" | "redx" | "paperfly";

interface CourierDetail {
  id: CourierKey;
  name: string;
  insideDhakaRate: number;
  outsideDhakaRate: number;
  sla: string;
  trackingPrefix: string;
}

const COURIER_CONFIGS: Record<CourierKey, CourierDetail> = {
  steadfast: {
    id: "steadfast",
    name: "SteadFast Courier",
    insideDhakaRate: 60,
    outsideDhakaRate: 120,
    sla: "Next Day Delivery (Inside Dhaka)",
    trackingPrefix: "SF-DHK-92817",
  },
  pathao: {
    id: "pathao",
    name: "Pathao Logistics",
    insideDhakaRate: 65,
    outsideDhakaRate: 125,
    sla: "On-demand Bike & Van Dispatch",
    trackingPrefix: "PTH-99214-BD",
  },
  redx: {
    id: "redx",
    name: "RedX Delivery",
    insideDhakaRate: 60,
    outsideDhakaRate: 115,
    sla: "Wide Upazila Hub Network",
    trackingPrefix: "RDX-88219-EXP",
  },
  paperfly: {
    id: "paperfly",
    name: "Paperfly Wings",
    insideDhakaRate: 55,
    outsideDhakaRate: 110,
    sla: "Deep 64-District Doorstep Coverage",
    trackingPrefix: "PFLY-77312-BD",
  },
};

/** §4 — an interactive simulation of the order drawer's courier picker and 4x6 thermal airway bill. */
function DrawerMock() {
  const [selectedCourier, setSelectedCourier] = useState<CourierKey>("steadfast");
  const [destination, setDestination] = useState<"inside" | "outside">("inside");
  const [status, setStatus] = useState<"idle" | "booking" | "booked">("idle");

  const current = COURIER_CONFIGS[selectedCourier];
  const rate = destination === "inside" ? current.insideDhakaRate : current.outsideDhakaRate;

  const handleBooking = () => {
    setStatus("booking");
    setTimeout(() => {
      setStatus("booked");
    }, 450);
  };

  const handleReset = () => {
    setStatus("idle");
  };

  return (
    <div className="fq-glass fq-halo rounded-fq-lg border border-border/80 bg-card/90 p-5 sm:p-6 shadow-lift-lg">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-fq-sm bg-primary/10 text-primary">
            <Truck className="size-3.5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
            Order Dispatcher
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
          <Sparkles className="size-2.5" /> Live Sandbox
        </span>
      </div>

      {/* Courier Selector Tabs with 16px rhythm */}
      <div className="mt-4">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Select Courier Rail
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["steadfast", "pathao", "redx", "paperfly"] as const).map((code) => {
            const active = selectedCourier === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setSelectedCourier(code);
                  if (status === "booked") setStatus("idle");
                }}
                className={cn(
                  "min-h-[44px] rounded-fq-sm px-3 py-2 text-xs font-semibold inline-flex items-center justify-center transition-all text-center border",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                {code === "steadfast" ? "SteadFast" : code === "pathao" ? "Pathao" : code === "redx" ? "RedX" : "Paperfly"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Destination Selector & Quoted Rate */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-fq-md border border-border/70 bg-muted/20 p-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary shrink-0" />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDestination("inside")}
              className={cn(
                "min-h-[44px] rounded-fq-sm px-3.5 py-2 text-xs font-semibold inline-flex items-center justify-center transition-colors",
                destination === "inside" ? "bg-primary text-primary-foreground shadow-sm" : "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              Inside Dhaka
            </button>
            <button
              type="button"
              onClick={() => setDestination("outside")}
              className={cn(
                "min-h-[44px] rounded-fq-sm px-3.5 py-2 text-xs font-semibold inline-flex items-center justify-center transition-colors",
                destination === "outside" ? "bg-primary text-primary-foreground shadow-sm" : "border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              Outside Dhaka
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-muted-foreground text-[11px]">Quoted Rate: </span>
          <span className="font-bold text-foreground tabular-nums">৳{rate} BDT</span>
        </div>
      </div>

      {/* 4x6 Thermal Airway Bill (Replacing the empty dashed box!) */}
      <div className="mt-4 rounded-fq-md border border-border/80 bg-background/90 p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-border/60 pb-2 text-[11px]">
          <span className="font-bold text-foreground uppercase tracking-wider">{current.name}</span>
          <span className="text-[10px] text-muted-foreground">STANDARD COD 4X6</span>
        </div>

        {/* Consignee & Details Grid (16px gap) */}
        <div className="grid grid-cols-2 gap-4 py-2.5 border-b border-border/40 text-[11px]">
          <div>
            <span className="text-muted-foreground block text-[10px]">CONSIGNEE:</span>
            <span className="text-foreground font-semibold block">Nusrat Jahan</span>
            <span className="text-muted-foreground text-[10px] block leading-tight">
              {destination === "inside" ? "Rd 11, Banani, Dhaka" : "Chashara, Narayanganj"}
            </span>
            <span className="text-muted-foreground text-[10px] block">+880 1712-***892</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block text-[10px]">PARCEL WEIGHT:</span>
            <span className="text-foreground font-semibold block">0.85 kg</span>
            <span className="text-muted-foreground block text-[10px] mt-1">COLLECT COD:</span>
            <span className="text-primary font-bold text-sm block tabular-nums">৳2,850</span>
          </div>
        </div>

        {/* Barcode Visual */}
        <div className="pt-2 text-center">
          <div className="inline-flex items-center gap-[2px] h-9 py-1 px-3 bg-muted/40 rounded fx-scanner">
            {[4, 2, 6, 1, 3, 5, 2, 4, 1, 7, 3, 2, 5, 1, 4, 6, 2, 3, 5, 1, 4, 2, 6, 3].map((height, idx) => (
              <span
                key={idx}
                className="inline-block bg-foreground/80 w-[2px]"
                style={{ height: `${height * 3.5}px` }}
              />
            ))}
          </div>
          <p className="text-[10px] tracking-widest text-muted-foreground mt-1 font-mono">
            *{current.trackingPrefix}*
          </p>
        </div>
      </div>

      {/* Booking Feedback or Button */}
      {status === "booked" ? (
        <div className="mt-4 rounded-fq-md border border-primary/40 bg-primary/10 p-3 text-center transition-all">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
            <AnimatedIcon icon={CheckCircle2} variant="sparkle" size="sm" /> Consignment Booked & Assigned
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Rider notified. SMS tracking sent to customer with live GPS link.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 text-[11px] text-primary underline underline-offset-2 hover:opacity-80"
          >
            Reset Simulator
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleBooking}
          disabled={status === "booking"}
          className="mt-4 w-full min-h-[44px] rounded-fq-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === "booking" ? (
            <>
              <AnimatedIcon icon={RefreshCw} variant="spin-slow" size="sm" />
              <span>Dispatching Rider...</span>
            </>
          ) : (
            <>
              <span>Dispatch Consignment ({rate} BDT)</span>
              <AnimatedIcon icon={ArrowRight} variant="magnetic" size="sm" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

/** §6.1 — the worked RTO-improvement margin example, as a spotlight tile. */
function RtoWorkedExampleCard() {
  return (
    <SpotlightBand
      level={3}
      id="rto-worked-example"
      title={content.rtoWorkedExample.title}
      body={content.rtoWorkedExample.assumptions}
      aside={
        <div className="space-y-2 text-sm">
          <p className="opacity-85">{content.rtoWorkedExample.before}</p>
          <p className="opacity-85">{content.rtoWorkedExample.after}</p>
          <p className="fq-display text-3xl">Save {content.rtoWorkedExample.monthlySaving}/mo</p>
          <p className="opacity-70">Annualized: {content.rtoWorkedExample.annualizedSaving}</p>
          <p className="text-xs opacity-70">{content.rtoWorkedExample.caption}</p>
        </div>
      }
    />
  );
}
