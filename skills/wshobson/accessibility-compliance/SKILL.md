---
name: accessibility-compliance
description: Implement WCAG 2.2 compliant interfaces with mobile accessibility, inclusive design patterns, and assistive technology support. Use when auditing accessibility, implementing ARIA patterns, building for screen readers, or ensuring inclusive user experiences.
---

# Accessibility Compliance

Master accessibility implementation to create inclusive experiences that work for everyone, including users with disabilities.

## When to Use This Skill

- Implementing WCAG 2.2 Level AA or AAA compliance
- Building screen reader accessible interfaces
- Adding keyboard navigation to interactive components
- Implementing focus management and focus trapping
- Creating accessible forms with proper labeling
- Supporting reduced motion and high contrast preferences
- Building mobile accessibility features (iOS VoiceOver, Android TalkBack)
- Conducting accessibility audits and fixing violations

## Core Capabilities

### 1. WCAG 2.2 Principles (POUR)

- **Perceivable**: Text alternatives, time-based media, adaptable content, distinguishable
- **Operable**: Keyboard accessible, navigable, input modalities, enough time
- **Understandable**: Readable, predictable, input assistance
- **Robust**: Compatible with assistive technologies

### 2. ARIA Patterns

- Roles (button, dialog, navigation, listbox, tablist)
- States and properties (aria-expanded, aria-selected, aria-checked)
- Live regions (polite, assertive, log)
- Accessible name computation

### 3. Keyboard Navigation

- Logical focus order
- Visible focus indicators (3:1 minimum contrast)
- Focus trapping in modals
- Skip links and keyboard shortcuts
- Arrow key navigation in composite widgets

### 4. Screen Reader Support

- Semantic HTML as the foundation
- Alt text for images
- Heading hierarchy (one H1 per page)
- Table accessibility (headers, captions)
- Link text that makes sense out of context

### 5. Mobile Accessibility

- Touch target sizing (44x44px minimum per WCAG 2.2)
- iOS VoiceOver support
- Android TalkBack support
- Dynamic type / text scaling

## Key Patterns

### Pattern 1: Accessible Button

```tsx
// Bad: <div onClick={...} onKeyDown={...}>
// Good: native button with proper keyboard support
<button
  onClick={handleClick}
  disabled={isLoading}
  aria-disabled={isLoading}
  aria-busy={isLoading}
  aria-label={loading ? "Submitting form" : undefined}
>
  {isLoading ? "Submitting..." : "Submit"}
</button>
```

### Pattern 2: Modal Dialog

```tsx
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus the modal
    modalRef.current?.focus();

    // Trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose} aria-label="Close dialog">X</button>
    </div>
  );
};
```

### Pattern 3: Accessible Form

```tsx
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="email">Email address</label>
    <input
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      required
      aria-describedby={errors.email ? "email-error" : undefined}
      aria-invalid={!!errors.email}
    />
    {errors.email && (
      <span id="email-error" role="alert">
        {errors.email}
      </span>
    )}
  </div>
</form>
```

### Pattern 4: Skip Navigation Link

```tsx
// At the top of the page
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Main content area
<main id="main-content" tabIndex={-1}>
```

### Pattern 5: Live Region Announcements

```tsx
// For dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// For urgent announcements
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>
```

## Color Contrast Requirements

| Level | Normal Text | Large Text | UI Components |
|-------|-----------|------------|---------------|
| AA    | 4.5:1     | 3:1        | 3:1           |
| AAA   | 7:1       | 4.5:1      | 3:1           |
| Large Text | >= 18pt or >= 14pt bold | | |

## Accessibility Testing Checklist

- [ ] Keyboard navigation works without mouse
- [ ] Focus indicators are visible (3:1 contrast minimum)
- [ ] All images have alt text (or empty alt if decorative)
- [ ] Headings form a logical hierarchy
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Color is not the only means of conveying information
- [ ] Touch targets are at least 44x44px
- [ ] Page has a skip navigation link
- [ ] Reduced motion preference is respected
- [ ] High contrast mode is supported
- [ ] Page works with zoom up to 200%

## Common Issues

- Missing or incorrect ARIA labels
- Focus not managed in modals
- Non-semantic elements used for interactive content
- Insufficient color contrast
- Content that flashes more than 3 times per second
- Missing skip links
- Links with "click here" or "read more" text
- Form inputs without visible labels
- Images of text without text alternatives
- Auto-playing media without controls
