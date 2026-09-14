import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Youtube, Twitter, Instagram, Facebook, ArrowRight } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/lib/i18n";
import { PUBLIC_BANGLA_ENABLED } from "@/lib/public-locale";
import { LEGAL_DOCS, ORG_NAP, napAddressLine } from "@/lib/legal";
import { NewsletterBlock } from "@/components/public/NewsletterForm";
import { BrandLogo } from "@/components/public/BrandLogo";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { marketingRoute, type MarketingRouteId } from "@/lib/marketing-seo";

const NAV = [
  { to: "/features", key: "site.nav.features" },
  { to: "/pricing", key: "site.nav.pricing" },
  { to: "/about", key: "site.nav.about" },
  { to: "/faq", key: "site.nav.faq" },
  { to: "/docs", key: "site.nav.docs" },
  { to: "/contact", key: "site.nav.contact" },
] as const;

/**
 * Phase 10.2 — the deep-dive pages are reachable from the shared footer of
 * every public page, so no registered marketing route is an orphan and the
 * crawl depth from `/` stays at one click. Labels come from the SEO registry
 * so nav copy and breadcrumb copy can never drift apart.
 */
const FOOTER_PRODUCT: readonly MarketingRouteId[] = [
  "features",
  "builder",
  "payments",
  "fulfilment",
  "pricing",
];
const FOOTER_COMPANY: readonly MarketingRouteId[] = [
  "customers",
  "about",
  "security",
  "faq",
  "blog",
  "status",
];

/** Rails printed in the footer trust strip — settlement rails only, no logos. */
const FOOTER_RAILS = ["bKash", "Nagad", "Rocket", "Bank transfer", "Cash on delivery"] as const;

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title} className="min-w-0">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-1">{children}</ul>
    </nav>
  );
}

function FooterLink({ children, ...rest }: { children: ReactNode } & Record<string, unknown>) {
  return (
    <li>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Link
        {...(rest as any)}
        className="inline-flex min-h-9 items-center text-sm text-foreground/80 transition-colors hover:text-primary"
      >
        {children}
      </Link>
    </li>
  );
}

/** Shared chrome for every public marketing page. */

const SOCIAL_LINKS = [
  { name: "YouTube", icon: Youtube, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
];

export function PublicShell({
  children,
  demoSlug,
}: {
  children: ReactNode;
  demoSlug?: string | null;
}) {
  const { tk, lang, setLang } = useLang();
  const year = new Date().getFullYear();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close the phone menu on navigation, otherwise the panel covers the page
  // the visitor just asked for.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // The public site is English-only until Bangla is switched on from the admin
  // dashboard. A stored `bn` preference from a storefront visit would otherwise
  // leave marketing chrome in Bangla with no toggle to undo it.
  useEffect(() => {
    if (!PUBLIC_BANGLA_ENABLED && lang !== "en") setLang("en");
  }, [lang, setLang]);

  return (
    <div className="fq-site fq-marketing flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all">
        <div className="fq-band-inner flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2.5 group">
            <BrandLogo size={32} className="group-hover:scale-105" />
            <span className="flex flex-col leading-none">
              <span className="fq-display text-base font-bold tracking-tight text-foreground">Framique</span>
              <span className="mt-0.5 hidden text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Modern Commerce
              </span>
            </span>
          </Link>
          <nav className="hidden items-center justify-center gap-1 text-sm md:flex" aria-label={tk("site.nav.label")}>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground after:scale-x-100" }}
                className="relative inline-flex min-h-11 items-center px-3 py-2 text-muted-foreground transition-colors after:absolute after:inset-x-3 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
              >
                {tk(item.key)}
              </Link>
            ))}
            {demoSlug && (
              <Link
                to="/store/$slug"
                params={{ slug: demoSlug }}
                className="inline-flex min-h-11 items-center px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {tk("site.nav.demo")}
              </Link>
            )}
          </nav>
          {/* At 320px the English labels (`Sign in` + `Start free trial`) are
              17px wider than the viewport, which pushed the whole document
              sideways on every marketing route. The sign-in link folds away
              below `sm` — it is still reachable from the footer and from the
              trial page — and the pill tightens rather than overflowing. */}
          <div className="flex min-w-0 shrink items-center justify-end gap-1 sm:gap-2">
            {PUBLIC_BANGLA_ENABLED ? <LanguageToggle /> : null}
            <ThemeToggle />
            <Link
              to="/auth"
              className="hidden min-h-10 items-center rounded-fq-md px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              {tk("site.nav.sign_in")}
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex min-h-10 shrink-0 items-center rounded-fq-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] sm:px-4"
            >
              <span className="sm:hidden">{tk("site.cta.trial_short")}</span>
              <span className="hidden sm:inline">{tk("site.cta.trial")}</span>
            </Link>
            {/* Below `md` the centre nav is hidden, which left every marketing
                page unreachable from the header on a phone. A plain disclosure
                panel — no overlay library, no scroll lock — restores it and
                keeps the 44px touch target policy. */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="public-mobile-nav"
              aria-label={tk("site.nav.label")}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-fq-md border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="public-mobile-nav"
            aria-label={tk("site.nav.label")}
            className="border-t border-border bg-background md:hidden"
          >
            <ul className="fq-band-inner grid gap-0.5 py-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeProps={{ className: "text-foreground" }}
                    className="flex min-h-11 items-center rounded-fq-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {tk(item.key)}
                  </Link>
                </li>
              ))}
              {demoSlug && (
                <li>
                  <Link
                    to="/store/$slug"
                    params={{ slug: demoSlug }}
                    className="flex min-h-11 items-center rounded-fq-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {tk("site.nav.demo")}
                  </Link>
                </li>
              )}
              <li className="mt-1 border-t border-border pt-1">
                <Link
                  to="/auth"
                  className="flex min-h-11 items-center rounded-fq-md px-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {tk("site.nav.sign_in")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      
      
            <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl mt-auto pb-8 pt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Brand & Newsletter */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground">
                <BrandLogo size={28} />
                {ORG_NAP.brand}
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Future-ready commerce tools for teams moving at the speed of innovation.
              </p>
              <form className="flex w-full max-w-md border border-border/50 bg-background/50 rounded-fq-full overflow-hidden focus-within:border-primary transition-colors" onSubmit={(e) => e.preventDefault()}>
                <input type="email" required placeholder="name@email.com" className="w-full bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground px-5 py-3 focus:ring-0 focus:outline-none" />
                <button type="submit" className="shrink-0 bg-primary/10 px-6 text-xs font-semibold tracking-wider text-primary hover:bg-primary/20 transition-colors">
                  SUBSCRIBE
                </button>
              </form>
            </div>
            
            {/* Legal Links */}
            <div className="md:ml-auto space-y-6">
              <h3 className="font-semibold text-foreground uppercase tracking-widest text-xs">
                {tk("site.footer.legal_group")}
              </h3>
              <div className="flex flex-col gap-3">
                {LEGAL_DOCS.map((doc) => (
                  <Link key={doc.slug} to={"/legal/$doc"} params={{ doc: doc.slug }} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                    {doc.title[lang]}
                  </Link>
                ))}
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                  {tk("site.nav.contact")}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bottom row */}
          <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              © {new Date().getFullYear()} {ORG_NAP.legalName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(s => (
                <a key={s.name} href={s.href} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={s.name}>
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
