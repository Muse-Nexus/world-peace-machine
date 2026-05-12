# Readability Pass — "Yuyu Note"

## The note (taken seriously)
> "Bro I had seizures while trying to understand what's going on on that page. The block spacings are too tight and the condensed heading fonts and mono body didn't make things easier rather." — Yuyu Odukoyas

Translation: the brutalist vibe is fighting basic readability. Right now every paragraph is JetBrains Mono, every headline is Archivo Black UPPERCASE with `tracking-tighter`, and section/element padding is cramped. We keep the brand. We fix the legibility.

## What changes (scope: visual + tokens only, no feature changes)

### 1. Type system — body copy off mono
- **Body default**: switch `body` from `font-mono` to `font-sans` (Inter) globally in `src/index.css`. Inter at 16–18px reads dramatically better for paragraphs.
- **Mono stays for**: tag chips, captions, code blocks, kickers, footer fine-print, button micro-labels (`text-[10px] font-mono uppercase`). Anywhere it's a *texture*, not a *paragraph*.
- **Sweep pages** to replace `font-mono` on long-form `<p>` blocks with `font-sans` (Index, Manifesto, Snacks, Shop, OpenSource, Synthesism, Slacktivate, Neighbors, Blog, PledgeWalls, Validate, Chat). Leave 10–12px mono labels alone.

### 2. Type system — headlines breathe
- Keep Archivo Black as display (it's the brand) but:
  - Drop `tracking-tighter` → use default tracking, or `tracking-tight` only on the very largest hero H1.
  - Bump `leading-[0.9]` → `leading-[1.05]` on hero, `leading-tight` on section H2s.
  - Cap uppercase H2/H3 at sensible sizes; don't go bigger than `text-4xl md:text-5xl` for section headers (currently up to `text-7xl`).
- **Add a sub-display style** for long titles: Inter 800 weight, normal case, used when Archivo Black is overkill (e.g. card titles longer than 3 words).

### 3. Spacing system — make blocks breathe
Establish consistent rhythm tokens applied across all pages:
- Section vertical padding: `py-12 lg:py-20` → `py-20 lg:py-32`.
- Stack gaps inside hero/section: `space-y-6` → `space-y-8`.
- Paragraph `max-w` for long copy: cap at `max-w-prose` (~65ch) so lines don't run wall-to-wall.
- Paragraph leading: add `leading-relaxed` (1.625) to body `<p>`.
- Card interior padding: `p-6` → `p-8` on content-heavy cards (pillars, prompt card, tip tiers).
- Grid gaps: `gap-3`/`gap-6` → `gap-6`/`gap-8` on the doors grid and pillars.

### 4. Hero specifically
- H1 `text-5xl md:text-7xl tracking-tighter leading-[0.9]` → `text-5xl md:text-6xl tracking-normal leading-[1.05]`.
- Lead paragraph: `font-mono` → `font-sans text-lg md:text-xl leading-relaxed`.
- The badge row: keep mono micro-caps (they're working as texture).

### 5. Background grid
- The 32px grid lines on body add visual noise. Lighten from `0.04` opacity → `0.025`, or bump grid spacing to 48px so it sits further behind text.

## What does NOT change
- Color palette (UN blue / coral / mustard / cream).
- Brutalist borders, hard shadows, stamps, ticker.
- Globe, animations, voice, copy.
- Any feature, route, or backend behavior.

## Files touched
- `src/index.css` — body font, grid opacity, default heading tracking/leading.
- `tailwind.config.ts` — no change needed (Inter already loaded).
- All page files under `src/pages/*` — sweep `font-mono` on `<p>` long-form, loosen section padding.
- `src/components/PageShell.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx` — verify and adjust spacing.

## Verification
1. Visual check at desktop (1230px — current viewport) and mobile (375px) on `/`, `/manifesto`, `/shop`, `/snacks`.
2. Re-read a paragraph at arm's length — should not feel like reading a receipt.
3. Confirm brand still reads as brutalist-protest, not generic SaaS.

## Out of scope (call out for follow-up if desired)
- Replacing Archivo Black entirely (e.g. with "Space Grotesk" heavy, or "Bebas Neue") — bigger brand decision, ask first.
- Dark mode polish.
- Reducing the *number* of CTAs on the home page (Yuyu's "what's going on" might also be CTA-overload — separate fight).
