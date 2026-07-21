# Feinix Haus — Website Proposal: Enhancement Notes

> A companion to `requirement.md`. This document captures what was built into the
> mockup (`index.html`), the reasoning behind each decision, and best-practice
> references so you and the client can review the proposal with full context.

---

## 1. What the client asked for ( distilled from `requirement.md` )

Kelly asked for **one main page** that serves as the front door to a "publishing
house" — not a coaching, wellness, or therapy site. The feeling she specified:

- Editorial, calm, Palm Springs hotel
- Sophisticated but approachable
- Hospitality over luxury
- Beautiful white space, strong typography
- Photography that feels **observed, never performed**
- **No beige, sage, yoga, esc references**
- Cancer only on the About page
- Flexible page templates (build 1, expand later)

Sections she requested on the homepage:

| Section | Status in mockup |
|---|---|
| Introduction to Feinix Haus | ✅ Hero |
| The philosophy | ✅ Philosophy with 3 pillars |
| Featured essay | ✅ Featured Essay hero card (single essay — "The Boat") |
| Introduction to The Haus Edit | ✅ Haus Edit **introduction** only (full detail page = EVENTUALLY) |
| Introduction to Pool Haus | ✅ Pool Haus with Free + $22/mo tier preview |
| Featured media (PEOPLE, podcasts, press) | ✅ Press & Media strip |
| Invitation to explore | ✅ Footer + newsletter |

> **Note on scope.** Earlier drafts over-built Home by placing the full Haus Edit
> detail grid, FAQ, application form, About teaser, and the 3-up essay archive
> directly on the homepage. Kelly's requirement marks Haus Edit, Pool Haus,
> From the Margins, and About as **separate EVENTUALLY pages**, each with their
> own content list. Home now contains only the seven sections she specified, in
> her specified order. The From the Margins teaser (two essay links) sits after
> Pool Haus as a soft pointer into the editorial work; the full searchable
> archive will live on its own page.

---

## 2. Voice & positioning decisions

The brand intelligence document was unambiguous: the **real** positioning is
*"You survived. Now actually live."* — for the post-treatment woman who is done
being treated as fragile. Direct, unapologetic, warm, aspirational.

I made the following calls to honor that:

1. **Hero headline uses Kelly's own positioning line** ("You survived. Now
   *actually* live.") instead of the generic placeholder. This is the single
   most important conversion lever on the page — it had to be her voice, not
   stock editorial copy.

2. **No cancer story on the homepage.** Per Kelly's explicit instruction, the
   About teaser references "the why is personal — the kind of personal that
   belongs on a dedicated page" and links out. The hint ("Not despite. Because
   of who I became after.") is the only callback — and it's her own framing
   from the brand brief.

3. **Editorial, not wellness, language.** Replaced soft/clinical verbs
   (healing, journey, processing) with editorial ones (observed, edited,
   curated, considered, manifest). The FAQ explicitly addresses the
   "is this coaching or therapy?" objection with Kelly's own logic.

4. **Palm Springs hotel feel, executed.** Terracotta (#C26A4A) signature
   accent against warm cream (#FCFAF7) and sand panels, deep ink type
   (#1F1B16), and a deep pool teal (#2E5E5A) as a secondary accent — used
   literally for the Pool Haus section so the room *feels* like the deep end
   of a pool. This is intentional color semantics.

---

## 3. Best practices & inspiration integrated

Researched current editorial and publishing-house web design. Pulled from:

- **Magazine-style structured grids** (thin lines, bordered cells, hairline
  dividers) — the Haus Edit 2×2 detail grid uses a Tufte-style shared border
  treatment, an editorial layout pattern trending in 2026.
- **Editorial typography pairs** — Playfair Display (italic-capable serif, for
  editorial weight) + Inter (modern grotesque for UI/labels). Italic accents
  in the headlines echo print-magazine pull-quote treatment.
- **Hero split with framed imagery** — adapted from boutique hotel sites
  (L'Horizon, Limón Palm Springs) where the hero image gets an interior hairline
  frame and a caption card, reinforcing "observed, not performed."
- **Reveal-on-scroll with reduced-motion fallback** — Intersection Observer
  for performance; `prefers-reduced-motion` respected for accessibility.
- **Mobile slide-in panel** (instead of full-screen overlay) — keeps the
  editorial feel intact on mobile and is the pattern favored by high-end
  publishing and hospitality sites in 2026.
- **FAQ as accordion, in-page** — Kelly explicitly asked for the Haus Edit FAQ
  to be built in. Accordion keeps the editorial whitespace while surfacing
  the objection-handling (coaching vs. therapy, price, cohort size).
- **Sticky CTA in nav ("Join")** — small but important: every scroll position
  has a clear next step into the Pool Haus funnel, which is where the brand's
  $22/mo Skool membership lives.

---

## 4. Imagery strategy

All images are Unsplash placeholders chosen to feel **observed, not performed** —
quiet interiors, a boat at golden hour, a desk with a notebook, soft window
light. When Kelly supplies real photography, swap these:

| Slot in mockup | Recommended real shot |
|---|---|
| Hero | Kelly's home or a Palm Springs interior — empty chair, morning light |
| Featured essay ("The Boat") | A real boat/water shot from Kelly's archive |
| Volume I feature | Kelly's actual desk/workspace |
| About portrait | Kelly, editorial portrait (window light, no studio) |
| Essay archive cards | One image per published essay |

The captions and frames are designed so the imagery reads as editorial
photography rather than stock — frame, caption card, slight grayscale lift
on hover.

---

## 5. Flexible template structure (per Kelly's request)

She asked: *"Can we build flexible page templates instead of unique layouts
wherever possible?"* The mockup is built around reusable patterns:

- **`.section-label` + `.section-heading` + `.section-text`** — every section
  header uses this trio.
- **`.edit-detail-grid`** — the 2×2 cell grid used for Haus Edit can be reused
  for any "what / who / how / when" content (Pool Haus detail page, About
  page sections, etc.).
- **`.archive-grid`** — the 3-up card grid for From the Margins is the same
  pattern that will power topic-filtered essay pages, the Residency, Events,
  and Travel Guides when those ship.
- **`.tier-card`** — the Pool Haus tier cards are a reusable pricing/feature
  card for any future paid surface (Studio, Inner Circle, Private Study).
- **`.panel-sand` / `.panel-ink` / `.panel-cream`** — surface tokens for
  alternating section backgrounds.

When Kelly is ready for Page 2 (the dedicated Haus Edit page, or About), these
patterns compose directly — no new design system needed.

---

## 6. Conversion & funnel hooks

The brand intelligence doc describes a clear funnel (Free Challenge → Tripwire
→ Skool membership → high-ticket Private Study). The homepage threads these
without becoming salesy:

- **Primary CTAs** point to Pool Haus (free + $22/mo), since Skool handles
  checkout natively and that's the lowest-friction entry.
- **Haus Edit** uses "Apply" (not "Buy") — keeps the editorial/bespake
  positioning and matches the application-only high-ticket model.
- **Newsletter** ("the editor's letter, occasionally") is framed as editorial
  subscription, not lead magnet — fits the publishing-house frame and still
  feeds the GHL list.
- **Press strip** ("As Seen In" — PEOPLE, C-Heads, The Sunday Edit, podcast)
  gives social proof without a single testimonial card, which would have
  broken the editorial tone.

---

## 7. What's intentionally NOT on this page

Per the requirement and brand brief:

- ❌ No cancer narrative (lives on About page only)
- ❌ No "survivor" / "healing journey" / "support group" language
- ❌ No sage, beige, yoga, or wellness-retreat iconography
- ❌ No testimonials grid (would cheapen the editorial feel)
- ❌ No tripwire or countdown timers (the homepage is the front door, not
  the funnel — those live on the GHL landing pages)
- ❌ No pricing on Haus Edit (kept private per application model)

---

## 8. Future pages the structure supports

Kelly marked these as TBD. The mockup's component patterns are ready for them:

- **The Residency** → reuse `.volume-feature` panel
- **Shop** → reuse `.archive-grid` cards
- **Travel Guides** → reuse `.archive-grid` + `.essay-feature-card`
- **Events** → reuse `.edit-detail-grid` for event detail
- **About (full)** → reuse `.about-grid` + `.philosophy-grid`
- **Pool Haus (dedicated)** → already prototyped inline; split out when ready
- **From the Margins (CMS)** → `.archive-grid` is the listing pattern

---

## 9. Open questions for the client

A few things worth confirming before this becomes production:

1. **Haus Edit pricing** — kept off-page by design. Confirm the
   application-only model is the long-term plan.
2. **Press logos** — currently placeholders (PEOPLE, C-Heads, Sunday Edit,
   podcast). Send real logos and any pull-quotes for the About/press page.
3. **Real photography** — when can Kelly supply hero, portrait, and essay
   images? The mockup is designed around it.
4. **Newsletter destination** — confirm the editor's letter goes to the GHL
   list (so it can be tagged and nurtured) vs. a separate platform.
5. **"Join" CTA destination** — currently points to Pool Haus section. Should
   it ever point directly to the Skool checkout?
