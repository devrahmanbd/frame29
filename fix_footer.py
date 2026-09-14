import re

with open('src/components/public/PublicShell.tsx', 'r') as f:
    content = f.read()

footer_replacement = """<footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl mt-auto pb-8 pt-12">
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
      </footer>"""

new_content = re.sub(r'<footer.*?</footer>', footer_replacement, content, flags=re.DOTALL)

with open('src/components/public/PublicShell.tsx', 'w') as f:
    f.write(new_content)

try:
    with open('frame28/src/components/public/PublicShell.tsx', 'r') as f:
        content2 = f.read()
    new_content2 = re.sub(r'<footer.*?</footer>', footer_replacement, content2, flags=re.DOTALL)
    with open('frame28/src/components/public/PublicShell.tsx', 'w') as f:
        f.write(new_content2)
except Exception as e:
    pass
