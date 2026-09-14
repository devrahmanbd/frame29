/**
 * `/security` — TODO §10.2 band order: Hero · isolation diagram · CardGrid
 * (controls) · MatrixTable (permissions) · ZRow (incident process) · Faq ·
 * Cta, plus every remaining band from `docs/05-marketing/copy/09-security.md`.
 *
 * Integrity rule enforced throughout this file: we never render a
 * certification, audit or compliance badge the deck does not explicitly hold.
 * Roadmap items live only in `complianceRoadmap` and are always labelled
 * "Roadmap" in visible text, not by colour or border alone (deck a11y note).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { AnimatedIcon } from "@/components/public/AnimatedIcon";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import {
  Band,
  BandHeading,
  Chip,
  HeroBand,
  CardGrid,
  MatrixTable,
  ZRow,
  FaqBand,
  CtaBand,
  type MatrixColumn,
  type MatrixRow,
} from "@/components/public/bands";
import * as content from "@/lib/marketing/security.content";
import { MarketingPlaceholderImage } from "@/components/public/MarketingPlaceholderImage";

export const Route = createFileRoute("/security")({
  // Fail-soft: getSiteContext never throws, so a degraded origin just drops
  // the canonical/OG absolute URLs rather than failing the route.
  loader: async () => getSiteContext(),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "security", origin });
    // FAQ entries passed to JSON-LD are the exact strings FaqBand renders
    // below — a mismatch here is a spam signal to search engines.
    const graph = buildGraph({
      route: "security",
      origin,
      faq: content.faq.map((entry) => ({ question: entry.question, answer: entry.answer })),
    });
    return {
      meta: head.meta,
      links: head.links,
      scripts: graph ? [{ type: "application/ld+json", children: JSON.stringify(graph) }] : [],
    };
  },
  component: SecurityPage,
  errorComponent: () => (
    <PublicShell>
      <Band>
        <BandHeading title="Security" sub="This page could not be loaded. Please try again shortly." />
      </Band>
    </PublicShell>
  ),
  notFoundComponent: () => (
    <PublicShell>
      <Band>
        <BandHeading title="Page not found" sub="The security page you're looking for doesn't exist." />
      </Band>
    </PublicShell>
  ),
});

/** Bangla text wrapper: resets tracking to 0 and keeps the Noto Bangla stack. */
function Bn({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span lang="bn" className={`font-bangla-display block ${className}`}>
      {children}
    </span>
  );
}

/**
 * The request-path / tenant-isolation diagram (Band 2's image brief).
 *
 * Pure CSS/SVG, four labelled nodes and one connecting line, the policy node
 * highlighted — rebuildable at any density, no raster asset. Draw-in motion is
 * left to the browser's native `prefers-reduced-motion` handling by using only
 * an opacity transition, never a stroke-dashoffset animation that would need a
 * JS observer to disable.
 */
function IsolationDiagram() {
  const nodes = ["Request", "Session", "Membership", "Policy", "Row"];
  return (
    <div className="fq-glass rounded-fq-lg p-6 sm:p-8">
      <p className="mb-6 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Request path
      </p>
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {nodes.map((node, index) => (
          <li key={node} className="flex items-center gap-2 sm:contents">
            <span
              className={
                node === "Policy"
                  ? "rounded-fq-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-fq-md border border-border px-3 py-2 text-sm text-muted-foreground"
              }
            >
              {node}
            </span>
            {index < nodes.length - 1 ? (
              <span aria-hidden="true" className="hidden text-muted-foreground sm:block">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">
        Every request walks this path, including our own staff tooling. The policy node is Postgres row-level
        security evaluating whether the caller may see the row at all — a check the application cannot bypass by
        forgetting a filter.
      </p>
    </div>
  );
}

/** Plain hairline list — used for the "documentation, not marketing" bands. */
function HairlineList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <li key={index} className="py-4 text-sm text-muted-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Converts the permission matrix's semantic cell values into accessible markup. */
function permissionCell(value: string): ReactNode {
  if (value === "granted") {
    return (
      <span aria-hidden="true" className="text-primary">
        ✓<span className="sr-only"> granted</span>
      </span>
    );
  }
  if (value === "not granted") {
    return (
      <span className="text-muted-foreground">
        —<span className="sr-only"> not granted</span>
      </span>
    );
  }
  // Nuanced grants ("masked", "limit-capped", "audited…") render as a caption
  // pill so the table reads honestly rather than as a binary yes/no.
  return <Chip className="fq-glass text-[11px] normal-case tracking-normal">{value}</Chip>;
}

function SecurityPage() {
  const { demoSlug } = Route.useLoaderData();

  const permissionColumns: MatrixColumn[] = content.permissions.columns;
  const permissionRows: MatrixRow[] = content.permissions.rows.map((row) => ({
    id: row.id,
    label: row.label,
    cells: Object.fromEntries(
      Object.entries(row.cells).map(([key, value]) => [key, permissionCell(value)]),
    ),
  }));

  return (
    <PublicShell demoSlug={demoSlug}>
      {/* Band 1 — Hero */}
      <HeroBand
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-primary" />
            </span>
            <span>{content.hero.eyebrow.en}</span>
          </span>
        }
        title={content.hero.title}
        titleBn={<Bn>{content.hero.titleBn}</Bn>}
        sub={content.hero.sub}
        subBn={<Bn className="fq-measure">{content.hero.subBn}</Bn>}
        actions={
          <>
            <a
              href={`#${content.isolation.id}`}
              className="w-full sm:w-auto min-h-[44px] rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all group"
            >
              <span>{content.hero.primaryCta}</span>
              <AnimatedIcon icon={ArrowRight} variant="magnetic" size="sm" />
            </a>
            <a
              href={content.hero.altCtaHref}
              className="w-full sm:w-auto min-h-[44px] rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground flex items-center justify-center hover:bg-muted/30 transition-all"
            >
              {content.hero.altCta}
            </a>
          </>
        }
        proof={<span className="font-mono text-xs">{content.hero.requestPath}</span>}
      />

      {/* Band 2 — tenancy isolation model, twice: owner then engineer */}
      <Band id={content.isolation.id} surface="canvas" labelledBy="isolation-title" divided>
        <BandHeading id="isolation-title" eyebrow={content.isolation.eyebrow} title={content.isolation.title} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="fq-glass rounded-fq-lg p-6 sm:p-8">
            <h3 className="fq-display text-lg">For a non-engineer</h3>
            <div className="fq-measure mt-4 space-y-4 text-sm text-muted-foreground">
              {content.isolation.ownerParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="rounded-fq-lg bg-card p-6 ring-1 ring-border sm:p-8 fq-card-glow">
            <h3 className="fq-display text-lg">For an engineer</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {content.isolation.engineerBullets.map((bullet, index) => (
                <li key={index} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-border" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {content.isolation.helperFunctions.map((fn) => (
                <Chip key={fn} className="font-mono text-[11px] normal-case tracking-normal fx-hologram">
                  {fn}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <IsolationDiagram />
        </div>

        <div className="mt-8 overflow-hidden rounded-fq-lg border border-border/80 bg-card">
          <MarketingPlaceholderImage
            alt="Prompt: 3D architectural render of a fortified digital cloud vault with glowing blue cryptographic data conduits, multi-tenant isolation barriers, zero-trust security perimeter, isometric perspective, dark glassmorphism aesthetic, 8k resolution, aspect ratio 16:9."
            aspect="16/9"
            badge="Tenant Isolation Perimeter"
            caption="Cryptographically verified tenant boundaries and zero-trust perimeter telemetry."
          />
        </div>

        <div className="mt-10">
          <MatrixTable
            caption={content.isolation.controlTable.caption}
            layout="cards"
            columns={content.isolation.controlTable.columns}
            rows={content.isolation.controlTable.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: { mechanism: row.mechanism, fails: row.fails },
            }))}
          />
        </div>
      </Band>

      {/* Band 3 — authentication and session handling */}
      <Band surface="canvas" labelledBy="auth-title" divided>
        <BandHeading id="auth-title" title={content.authentication.title} />
        <Bn className="mt-3 max-w-2xl text-sm text-muted-foreground">{content.authentication.bn}</Bn>
        <div className="mt-8">
          <HairlineList
            items={content.authentication.rows.map((row) => (
              <div key={row.id}>
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1">{row.body}</p>
              </div>
            ))}
          />
        </div>
      </Band>

      {/* Band 4 — CardGrid contract line + MatrixTable permission matrix */}
      <Band surface="canvas" labelledBy="permissions-title" divided>
        <BandHeading id="permissions-title" title={content.permissions.title} sub={content.permissions.intro} />
        <Bn className="mt-3 max-w-2xl text-xs text-muted-foreground">{content.permissions.bnRowLabels}</Bn>
        <div className="mt-8">
          <MatrixTable
            caption={content.permissions.title}
            layout="cards"
            columns={permissionColumns}
            rows={permissionRows}
          />
        </div>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {content.permissions.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </Band>

      {/* Band 5 — API key scoping and rotation (CardGrid, as instructed) */}
      <Band surface="canvas" labelledBy="keys-title" divided>
        <BandHeading id="keys-title" title={content.apiKeys.title} sub={content.apiKeys.intro} />
        <div className="mt-8">
          <CardGrid
            columns={3}
            cards={content.apiKeys.cards.map((card) => ({
              id: card.id,
              title: card.title,
              body: card.body,
              footer: <span className="font-mono text-xs text-muted-foreground">{card.proof}</span>,
            }))}
          />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{content.apiKeys.storageNote}</p>
      </Band>

      {/* Band 6 — secret handling, deliberately plain */}
      <Band surface="canvas" labelledBy="secrets-title" divided>
        <BandHeading id="secrets-title" title={content.secretHandling.title} sub={content.secretHandling.rule} />
        <Bn className="mt-3 max-w-2xl text-sm text-muted-foreground">{content.secretHandling.bn}</Bn>
        <div className="mt-8">
          <HairlineList
            items={content.secretHandling.never.map((line, index) => (
              <span key={index} className="font-mono text-xs">
                {line}
              </span>
            ))}
          />
        </div>
      </Band>

      {/* Band 7 — payment tokenisation boundary */}
      <ZRow
        direction="left"
        eyebrow="Payment data handling"
        title={content.paymentBoundary.title}
        body={content.paymentBoundary.intro}
        bullets={content.paymentBoundary.bullets}
        proof="No PCI attestation held today — see the roadmap band"
        visual={
          <div className="fq-glass flex flex-wrap items-center gap-3 rounded-fq-lg p-6 text-sm">
            {content.paymentBoundary.boundaryDiagram.map((node, index) => (
              <span key={node} className="flex items-center gap-3">
                <span
                  className={
                    node === "Processor-hosted flow"
                      ? "rounded-fq-md border border-dashed border-border px-3 py-2 text-muted-foreground"
                      : "rounded-fq-md border border-border px-3 py-2"
                  }
                >
                  {node}
                </span>
                {index < content.paymentBoundary.boundaryDiagram.length - 1 ? (
                  <span aria-hidden="true">→</span>
                ) : null}
              </span>
            ))}
          </div>
        }
      />
      <Band tight surface="canvas">
        <p className="fq-measure text-sm text-muted-foreground">
          <strong className="text-foreground">Roadmap:</strong> {content.paymentBoundary.roadmapNote}
        </p>
      </Band>

      {/* Band 8 — encryption in transit and at rest */}
      <Band surface="canvas" labelledBy="encryption-title" divided>
        <BandHeading id="encryption-title" title={content.encryption.title} />
        <div className="mt-8">
          <HairlineList
            items={content.encryption.rows.map((row) => (
              <div key={row.id}>
                <p className="font-medium text-foreground">{row.title}</p>
                <p className="mt-1">{row.body}</p>
              </div>
            ))}
          />
        </div>
      </Band>

      {/* Band 9 — backups, retention and restore testing */}
      <Band surface="canvas" labelledBy="backups-title" divided>
        <BandHeading id="backups-title" title={content.backups.title} sub={content.backups.intro} />
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {content.backups.timeline.map((step, index) => (
            <span key={step} className="flex items-center gap-2">
              <Chip>{step}</Chip>
              {index < content.backups.timeline.length - 1 ? <span aria-hidden="true">→</span> : null}
            </span>
          ))}
        </div>
        <div className="mt-8">
          <MatrixTable
            caption={content.backups.table.caption}
            layout="cards"
            columns={content.backups.table.columns}
            rows={content.backups.table.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: { frequency: row.frequency, drill: row.drill, deletion: row.deletion },
            }))}
          />
        </div>
      </Band>

      {/* Band 10 — observability and alerting contract */}
      <Band surface="canvas" labelledBy="observability-title" divided>
        <BandHeading id="observability-title" title={content.observability.title} sub={content.observability.intro} />
        <div className="mt-8">
          <MatrixTable
            caption={content.observability.table.caption}
            layout="cards"
            columns={content.observability.table.columns}
            rows={content.observability.table.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: { captures: row.captures, path: row.path, retention: row.retention },
            }))}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {content.observability.correlationChain.map((node, index) => (
            <span key={node} className="flex items-center gap-2">
              <Chip>{node}</Chip>
              {index < content.observability.correlationChain.length - 1 ? (
                <span aria-hidden="true" className="text-primary">
                  —
                </span>
              ) : null}
            </span>
          ))}
        </div>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {content.observability.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {content.observability.slos.map((slo) => (
            <Chip key={slo}>{slo}</Chip>
          ))}
        </div>
      </Band>

      {/* Band 11 — incident response runbook (ZRow, as instructed) */}
      <ZRow
        direction="right"
        eyebrow="Incident response"
        title={content.incidentResponse.title}
        body={content.incidentResponse.body}
        bullets={content.incidentResponse.commitments}
        proof="SEV-1: direct notification within 1 hour of confirmation"
        action={
          <Link to="/status" className="fq-tap text-sm font-semibold text-primary hover:underline">
            See live incident history on Status →
          </Link>
        }
        visual={
          <div className="fq-glass rounded-fq-lg p-6">
            <ol className="space-y-2 text-sm text-muted-foreground">
              {content.incidentResponse.sequence.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="fq-display text-xs text-muted-foreground">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        }
      />
      <Band tight surface="canvas">
        <Bn className="max-w-2xl text-sm text-muted-foreground">{content.incidentResponse.bn}</Bn>
        <div className="mt-8">
          <MatrixTable
            caption={content.incidentResponse.severityTable.caption}
            layout="cards"
            columns={content.incidentResponse.severityTable.columns}
            rows={content.incidentResponse.severityTable.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: {
                definition: row.definition,
                example: row.example,
                page: row.page,
                update: row.update,
              },
            }))}
          />
        </div>
      </Band>

      {/* Band 12 — vulnerability disclosure policy */}
      <Band surface="canvas" labelledBy="disclosure-title" divided>
        <BandHeading id="disclosure-title" title={content.disclosure.title} sub={content.disclosure.intro} />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ol className="space-y-3 text-sm text-muted-foreground">
            {content.disclosure.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="fq-display text-xs">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="fq-glass rounded-fq-lg p-6">
            <a
              href={`mailto:${content.disclosure.contactEmail}`}
              className="fq-tap font-mono text-sm text-primary hover:underline"
            >
              {content.disclosure.contactEmail}
            </a>
            <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">In scope</dt>
                <dd>{content.disclosure.scope.inScope}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Out of scope</dt>
                <dd>{content.disclosure.scope.outOfScope}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">{content.disclosure.bountyNote}</p>
          </div>
        </div>
      </Band>

      {/* Band 13 — dependency and supply-chain scanning */}
      <Band surface="canvas" labelledBy="supply-chain-title" divided>
        <BandHeading id="supply-chain-title" title={content.supplyChain.title} />
        <div className="mt-8">
          <HairlineList
            items={content.supplyChain.rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-3">
                <span>{row.body}</span>
                <Chip className="shrink-0 text-[11px] normal-case tracking-normal">{row.tag}</Chip>
              </div>
            ))}
          />
        </div>
      </Band>

      {/* Band 14 — self-hosting and data residency (CardGrid, 3-up) */}
      <Band surface="canvas" labelledBy="self-hosting-title" divided>
        <BandHeading id="self-hosting-title" title={content.selfHosting.title} sub={content.selfHosting.intro} />
        <Bn className="mt-3 max-w-2xl text-sm text-muted-foreground">{content.selfHosting.bn}</Bn>
        <div className="mt-8">
          <CardGrid
            columns={3}
            cards={content.selfHosting.options.map((option) => ({
              id: option.id,
              title: option.title,
              body: option.body,
              featured: option.featured,
            }))}
          />
        </div>
      </Band>

      {/* Band 15 — subprocessor transparency table (plain, on canvas) */}
      <Band surface="canvas" labelledBy="subprocessors-title" divided>
        <BandHeading id="subprocessors-title" title={content.subprocessors.title} sub={content.subprocessors.intro} />
        <div className="mt-8">
          <MatrixTable
            caption={content.subprocessors.table.caption}
            layout="cards"
            columns={content.subprocessors.table.columns}
            rows={content.subprocessors.table.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: { purpose: row.purpose, data: row.data, location: row.location },
            }))}
            note={
              <>
                Full, current subprocessor names live in our{" "}
                <Link to="/legal" className="text-primary hover:underline">
                  legal documents
                </Link>
                , the contractual source of truth.
              </>
            }
          />
        </div>
      </Band>

      {/* Band 16 — customer-side security checklist */}
      <Band surface="canvas" labelledBy="checklist-title" divided>
        <BandHeading id="checklist-title" title={content.checklist.title} sub={content.checklist.intro} />
        <Bn className="mt-3 text-sm text-muted-foreground">{content.checklist.titleBn}</Bn>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {content.checklist.items.map((item, index) => (
            <li key={index} className="flex gap-3 rounded-fq-lg bg-card p-4 text-sm text-muted-foreground ring-1 ring-border">
              <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Band>

      {/* Band 17 — compliance roadmap, visually distinct: dashed, labelled */}
      <Band surface="canvas" labelledBy="roadmap-title" divided>
        <BandHeading id="roadmap-title" title={content.complianceRoadmap.title} />
        <p className="fq-measure mt-4 text-sm font-medium text-muted-foreground">
          {content.complianceRoadmap.warning}
        </p>
        <div className="mt-6 overflow-hidden rounded-fq-lg border border-border/80 bg-card max-w-xl">
          <MarketingPlaceholderImage
            alt="Prompt: Conceptual 3D graphic of an official golden-bronze security seal embedded in a deep slate marble surface, symbolizing regulatory e-commerce compliance in Bangladesh, dramatic studio lighting, raytracing reflections, 8k resolution, aspect ratio 4:3."
            aspect="4/3"
            badge="Central Bank Standards"
            caption="Strict adherence to Bangladesh Bank Guidelines for Electronic Commerce Security."
          />
        </div>
        <div className="mt-8">
          <MatrixTable
            caption={content.complianceRoadmap.table.caption}
            layout="cards"
            columns={[
              { id: "status", label: "Status" },
              { id: "meaning", label: "What it means for merchants" },
            ]}
            rows={content.complianceRoadmap.table.rows.map((row) => ({
              id: row.id,
              label: row.label,
              cells: {
                status: <Chip className="text-[11px] normal-case tracking-normal text-muted-foreground">Roadmap</Chip>,
                meaning: row.meaning,
              },
            }))}
          />
        </div>
      </Band>

      {/* Band 18 — FAQ */}
      <Band surface="canvas" labelledBy="faq-title" divided>
        <BandHeading id="faq-title" title="Frequently asked" />
        <FaqBand
          entries={content.faq.map((entry) => ({ id: entry.id, question: entry.question, answer: entry.answer }))}
        />
      </Band>

      {/* Band 19 — final CTA */}
      <CtaBand
        title={
          <>
            {content.finalCta.title}
            <Bn className="mt-2 text-2xl text-muted-foreground opacity-90">{content.finalCta.titleBn}</Bn>
          </>
        }
        body={content.finalCta.body}
        primary={
          <a
            href={content.finalCta.primaryHref}
            className="w-full sm:w-auto min-h-[44px] rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-all"
          >
            {content.finalCta.primaryCta}
          </a>
        }
        secondary={
          <Link
            to="/legal"
            className="w-full sm:w-auto min-h-[44px] rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground flex items-center justify-center hover:bg-muted/30 transition-all"
          >
            {content.finalCta.altCta}
          </Link>
        }
      />
    </PublicShell>
  );
}
