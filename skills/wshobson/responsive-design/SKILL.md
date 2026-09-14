---
name: responsive-design
description: Implement modern responsive layouts using container queries, fluid typography, CSS Grid, and mobile-first breakpoint strategies. Use when building adaptive interfaces, implementing fluid layouts, or creating component-level responsive behavior.
---

# Responsive Design

Master modern responsive design techniques to create interfaces that adapt seamlessly across all screen sizes and device contexts.

## When to Use This Skill

- Implementing mobile-first responsive layouts
- Using container queries for component-based responsiveness
- Creating fluid typography and spacing scales
- Building complex layouts with CSS Grid and Flexbox
- Designing breakpoint strategies for design systems
- Implementing responsive images and media
- Creating adaptive navigation patterns
- Building responsive tables and data displays

## Core Capabilities

### 1. Container Queries
- Component-level responsiveness independent of viewport
- Container query units (cqi, cqw, cqh)
- Style queries for conditional styling
- Fallbacks for browser support

### 2. Fluid Typography & Spacing
- CSS clamp() for fluid scaling
- Viewport-relative units (vw, vh, dvh)
- Fluid type scales with min/max bounds
- Responsive spacing systems

### 3. Layout Patterns
- CSS Grid for 2D layouts
- Flexbox for 1D distribution
- Intrinsic layouts (content-based sizing)
- Subgrid for nested grid alignment

### 4. Breakpoint Strategy
- Mobile-first media queries
- Content-based breakpoints
- Design token integration
- Feature queries (@supports)

## Quick Reference

### Modern Breakpoint Scale

```css
/* Mobile-first breakpoints */
/* Base: Mobile (< 640px) */
@media (min-width: 640px) { /* sm: Landscape phones, small tablets */ }
@media (min-width: 768px) { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Laptops, small desktops */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large desktops */ }
```

## Key Patterns

### Pattern 1: Container Queries

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; }
  .card-image { aspect-ratio: 1; }
}

@container card (min-width: 600px) {
  .card { grid-template-columns: 250px 1fr; }
  .card-title { font-size: 1.5rem; }
}

.card-title {
  font-size: clamp(1rem, 5cqi, 2rem);
}
```

### Pattern 2: Fluid Typography

```css
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
p { font-size: var(--text-base); }
```

### Pattern 3: CSS Grid Responsive Layout

```css
/* Auto-fit grid - items wrap automatically */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}

/* Responsive grid with named areas */
.page-layout {
  display: grid;
  grid-template-areas:
    "header" "main" "sidebar" "footer";
  gap: 1rem;
}

@media (min-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr 300px;
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
  }
}
```

### Pattern 4: Responsive Navigation

```tsx
function ResponsiveNav({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="relative">
      <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-controls="nav-menu">
        <span className="sr-only">Toggle navigation</span>
        {isOpen ? <X /> : <Menu />}
      </button>
      <ul id="nav-menu" className={cn(
        "absolute top-full left-0 right-0 bg-background border-b",
        "flex flex-col",
        isOpen ? "flex" : "hidden",
        "lg:static lg:flex lg:flex-row lg:border-0 lg:bg-transparent",
      )}>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="block px-4 py-3 lg:px-3 lg:py-2 hover:bg-muted lg:hover:bg-transparent lg:hover:text-primary">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Pattern 5: Responsive Images

```tsx
function ResponsiveHero() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/hero-wide.webp" type="image/webp" />
      <source media="(min-width: 768px)" srcSet="/hero-medium.webp" type="image/webp" />
      <source srcSet="/hero-mobile.webp" type="image/webp" />
      <img src="/hero-mobile.jpg" alt="Hero image description" className="w-full h-auto" loading="eager" fetchpriority="high" />
    </picture>
  );
}
```

### Pattern 6: Responsive Tables

```tsx
function ResponsiveDataTable({ data, columns }) {
  return (
    <>
      <table className="hidden md:table w-full">{/* desktop */}</table>
      <div className="md:hidden space-y-4">
        {data.map((row, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between">
                <span className="font-medium text-muted-foreground">{col.label}</span>
                <span>{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
```

## Viewport Units

```css
.full-height { height: 100vh; }
.full-height-dynamic { height: 100dvh; }
.min-full-height { min-height: 100svh; }
.max-full-height { max-height: 100lvh; }
.hero-title { font-size: clamp(2rem, 5vw, 4rem); }
```

## Best Practices

1. **Mobile-First**: Start with mobile styles, enhance for larger screens
2. **Content Breakpoints**: Set breakpoints based on content, not devices
3. **Fluid Over Fixed**: Use fluid values for typography and spacing
4. **Container Queries**: Use for component-level responsiveness
5. **Test Real Devices**: Simulators don't catch all issues
6. **Performance**: Optimize images, lazy load off-screen content
7. **Touch Targets**: Maintain 44x44px minimum on mobile
8. **Logical Properties**: Use inline/block for internationalization

## Common Issues

- **Horizontal Overflow**: Content breaking out of viewport
- **Fixed Widths**: Using px instead of relative units
- **Viewport Height**: 100vh issues on mobile browsers
- **Font Size**: Text too small on mobile
- **Touch Targets**: Buttons too small to tap accurately
- **Aspect Ratio**: Images squishing or stretching
