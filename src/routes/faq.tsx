/**
 * `/faq` — the long-form answer page. Sections mirror the buying sequence
 * (start → money → COD → price → data → support) and the `FAQPage` JSON-LD is
 * built from the exact strings rendered below.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public/PublicShell";
import { getSiteContext } from "@/lib/site-seo.functions";
import { buildMarketingHead, buildGraph } from "@/lib/marketing-seo";
import { Band, BandHeading, HeroBand, FaqBand, CtaBand } from "@/components/public/bands";
import { FAQ_ALL, FAQ_CTA, FAQ_HERO, FAQ_SECTIONS } from "@/lib/marketing/faq.content";

export const Route = createFileRoute("/faq")({
  loader: async () => getSiteContext(),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? null;
    const head = buildMarketingHead({ route: "faq", origin });
    const graph = buildGraph({
      route: "faq",
      origin,
      faq: FAQ_ALL.map((row) => ({ question: row.question, answer: row.answer })),
    });
    return {
      meta: head.meta,
      links: head.links,
      scripts: graph ? [{ type: "application/ld+json", children: JSON.stringify(graph) }] : [],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  return (
    <PublicShell>
      <HeroBand
        eyebrow={FAQ_HERO.eyebrow}
        title={FAQ_HERO.title}
        sub={FAQ_HERO.sub}
        actions={
          <>
            <Link
              to="/auth"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              {FAQ_HERO.ctaPrimary}
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-all"
            >
              {FAQ_HERO.ctaSecondary}
            </Link>
          </>
        }
      />

      <Band labelledBy="faq-index-title">
        <BandHeading id="faq-index-title" eyebrow="Contents" title="Jump to a topic" />
        <ul className="mt-8 flex flex-wrap gap-2">
          {FAQ_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="fq-tap inline-flex min-h-9 items-center rounded-fq-md border border-border px-3 text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </Band>

      {FAQ_SECTIONS.map((section) => (
        <Band key={section.id} divided labelledBy={`${section.id}-title`}>
          <div id={section.id} className="scroll-mt-24">
            <BandHeading id={`${section.id}-title`} eyebrow="FAQ" title={section.title} sub={section.blurb} />
            <FaqBand
              entries={section.rows.map((row) => ({
                id: row.id,
                question: row.question,
                answer: row.answer,
              }))}
            />
          </div>
        </Band>
      ))}

      <CtaBand
        title={FAQ_CTA.title}
        body={FAQ_CTA.sub}
        primary={
          <Link
            to="/contact"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
          >
            {FAQ_CTA.ctaPrimary}
          </Link>
        }
        secondary={
          <Link
            to="/pricing"
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-fq-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-all"
          >
            {FAQ_CTA.ctaSecondary}
          </Link>
        }
        note={FAQ_CTA.note}
      />
    </PublicShell>
  );
}
