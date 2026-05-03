# Case Study — Content Brief for Nebojsa

The Figma redesign of the case-study detail page has 7 new sections that
the legacy site never had as structured data. The site components are
already built; we just need the actual content per case study.

Sections that already render fine from the migrated content (no action
needed): hero title, hero image, case overview, objective &
challenges, strategy pillars, journey timeline, proof data, conclusion.

Sections that need new content **per case study** (what this brief
collects): hero pills, numbers-that-matter, growth chart, before/after
comparison, plus a few smaller hero polish fields.

Fill in answers below the questions. Empty answers are OK — sections
gracefully collapse on the page when there's no data.

Reference Figma frame: <https://www.figma.com/design/LrfQdM6RTwf95gfkga3tJl/Heroic-Rankings---Website--Copy-?node-id=2255-878>
(the "Number Artist's Journey" case study showing the fully-populated
target).

---

## 1. Hero polish — applies to all 6 slugs

For each case study, three small fields:

### Hero — gradient title substring (`titleHighlighted`)

The title currently renders as plain text. Figma shows part of the
title in the brand purple gradient. **What substring of the title
should be gradient?**

Example from Figma:
> Title: "From Zero to Hero: Number Artist's Journey"
> Highlighted: "From Zero to Hero:"

Per slug:

- **affinda** — Title: "Affinda". Highlighted: ?
- **art-by-maudsch** — Title: "Art by Maudsch". Highlighted: ?
- **designrush** — Title: "DesignRush". Highlighted: ?
- **diy-craft-ecom-brand** — Title: "DIY Craft eCom Brand". Highlighted: ?
- **my-baskets** — Title: "My Baskets". Highlighted: ?
- **nagish** — Title: "Nagish". Highlighted: ?

### Hero — subtitle (`heroSubtitle`)

One-line summary that sits below the title in the hero. Figma's
example: *"Sustainable Organic Revenue Leader in 24 Months"*.

- **affinda** — ?
- **art-by-maudsch** — ?
- **designrush** — ?
- **diy-craft-ecom-brand** — ?
- **my-baskets** — ?
- **nagish** — ?

### Hero pills — 3 metric pills below subtitle (`heroPanel.metrics`)

Figma shows 3 large metric pills directly below the hero subtitle on
a light grey background, e.g.:

> [ 8.4 / Months ] [ $1.3M / Organic Revenue ] [ 63,500 / Monthly Visitors ]

Each pill has a number/value and a short label. Pick the **3 hero
metrics** that best summarise each case study at a glance.

Per slug, fill in 3 pills:

#### affinda
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

#### art-by-maudsch
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

#### designrush
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

#### diy-craft-ecom-brand
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

#### my-baskets
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

#### nagish
1. Value: ?  Label: ?
2. Value: ?  Label: ?
3. Value: ?  Label: ?

---

## 2. Numbers That Matter — 8-card metric grid (`numbersThatMatter.items`)

Figma shows a dark `#151419` panel with **8 metric cards** in a 4×2
grid, each with:
- Icon (small SVG/glyph)
- Big number (e.g., 54, 63.5K, $1.3M)
- Bold label (e.g., "Domain Rating", "Monthly Visitors")
- Optional sub-caption (e.g., "↑ From 0", "↑ From 1 to 54")

The legacy site's body prose contains the raw numbers — example from
legacy Number Artist case study:

> "Domain Rating from 70 to 90, organic traffic from 90,000 to
> 1,000,000, and traffic value from ~$30,000 to ~$3,200,000"

So the section heading is something like *"The Numbers That Matter"*
and the 8 cards summarise the most impressive metrics.

**Section heading:** `_____________` (e.g., "The Numbers That Matter")
**Section sub-body:** optional intro paragraph

For each slug, list **8 metric cards**. Pull from legacy prose where
possible.

#### affinda — 8 cards
1. Number: ?  Label: ?  Sub-caption: ?
2. ...
3. ...
4. ...
5. ...
6. ...
7. ...
8. ...

#### art-by-maudsch — 8 cards
1.  ... (same template)
... etc.

#### designrush — 8 cards
... etc.

#### diy-craft-ecom-brand — 8 cards
... etc.

#### my-baskets — 8 cards
... etc.

#### nagish — 8 cards
... etc.

> If 8 is too many, list as many as we have real numbers for; we'll
> drop the empty slots in the layout. **Quality over quantity** — 4
> strong numbers beat 8 weak ones.

---

## 3. Growth Chart — line chart series (`growthChart`)

Figma shows a line chart with 3 series tracked over 11 months
(e.g. JAN24 → JAN26):
- Referring Domains
- Organic Traffic
- Domain Rating

For each case study, we need:

**Time range:** start month + end month (e.g., Jan 2024 – Jan 2026)
**Series 1 name:** ? (e.g., Referring Domains)
**Series 1 data:** monthly values, comma-separated
**Series 2 name:** ?
**Series 2 data:** monthly values
**Series 3 name:** ?
**Series 3 data:** monthly values

Per slug, fill in the table.

#### affinda
- Time range: ?
- Series 1: name = ?, values = ?
- Series 2: name = ?, values = ?
- Series 3: name = ?, values = ?

#### art-by-maudsch
... (same template)

#### designrush
... (same template)

#### diy-craft-ecom-brand
... (same template)

#### my-baskets
... (same template)

#### nagish
... (same template)

> If raw monthly data isn't available, pick **start, mid, end values**
> for each metric and we'll smooth between them. Or skip the section
> entirely — it gracefully collapses.

---

## 4. Before / After comparison (`beforeAfter`)

Figma shows a "Before vs After" comparison row, showing 4 metrics with
before-value and after-value side by side. Example:

> | Metric | Before | After |
> |---|---|---|
> | Domain Rating | 39 | 48 |
> | Organic Traffic | 11,000 | 28,000 |
> | Referring Domains | 124 | 597 |
> | Top-3 keywords | 12 | 800+ |

Per slug, list 3-4 before/after pairs.

#### affinda
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

#### art-by-maudsch
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

#### designrush
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

#### diy-craft-ecom-brand
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

#### my-baskets
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

#### nagish
| Metric | Before | After |
|---|---|---|
| ? | ? | ? |
| ? | ? | ? |
| ? | ? | ? |

---

## 5. Per-case CTA footer (`ctaFooter`)

Figma shows a per-case CTA at the bottom of each case study (different
from the global footer CTA). Example:

> Heading: "Ready to Write Your Own Story?"
> Body: "We've helped Number Artist scale from $30K to $3.2M in
>        traffic value. Let's do it for your brand."
> Button label: "Get Started"
> Button URL: "/contact"

Per slug:

#### affinda
- Heading: ?
- Body: ?
- Button label: ? (default: "Get Started")
- Button URL: ? (default: "/contact")

#### art-by-maudsch
... (same template)

#### designrush
... (same template)

#### diy-craft-ecom-brand
... (same template)

#### my-baskets
... (same template)

#### nagish
... (same template)

> If no per-case CTA copy is provided, the section collapses and the
> global footer CTA ("Ready to grow together") shows instead. That's
> probably fine for most slugs.

---

## 6. Optional polish — Proof Data screenshots (`proofData.items[].image`)

The Proof Data section (Ahrefs / Google Search Console screenshots)
already renders, but most cards have empty `image` slots. Figma shows
each card with an actual analytics screenshot.

**For each proof-data card across all 6 slugs**, ideally:
- A clean PNG screenshot from the source tool (Ahrefs, GSC, etc.)
- Cropped to the relevant chart/table
- Sized at minimum 1200px wide for clarity

This is the lowest-priority item — current cards still render the
title + description without the image, just less visually rich.

---

## How to send back

Three options:

1. **Paste answers inline** — fill in this markdown, send the
   filled-in copy back. We'll author into Sanity.
2. **Sanity Studio** — log in at <https://heroic-rankings-final.vercel.app/studio>,
   open each case study doc, and fill the fields directly. Faster
   feedback loop because Pavle can see the result immediately.
3. **Skip sections** — any section without answers stays collapsed.
   The page still works, just less rich.

Worth-it priority order if doing partial:
1. **Hero gradient highlight + subtitle** (very small lift, immediate
   visual win on every case study).
2. **Hero pills** — 3 numbers per case study, biggest visual
   impression on the hero.
3. **Numbers That Matter** — biggest screen real-estate, most
   "wow" content.
4. **Before/After + Growth chart** — supporting evidence.
5. **Per-case CTA** — least impactful, global CTA covers it.

Ping Pavle when ready and we'll author the answers into Sanity.
