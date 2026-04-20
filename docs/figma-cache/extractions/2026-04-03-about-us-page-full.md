# Figma Extraction — About Us Page (Full)

**Date:** 2026-04-03
**File Key:** iIVCGkNIrd9sc6j9NKmGIF
**Page Node:** 189:5 (HR - About Us)
**Extracted by:** Pixel-perfect audit pass

---

## Design Tokens (from Figma styles)

| Token | Figma Value |
|-------|-------------|
| HR Dark | `#151419` |
| HR Pure White | `#FFFFFF` |
| HR Off White | `#F4F4F4` |
| HR Grey | `#535353` |
| HR Light Grey | `#E0E0E0` |
| HR Accent | `#998AFF` |
| H1/Web | DM Sans Regular, 62px, lh 80px, ls -2px (≈-1.24px at token) |
| H2/Web | DM Sans Regular, 52px, lh 60px, ls -2px (≈-1.04px) |
| H3/Web | DM Sans Regular, 32px, lh 100%, ls -2px (≈-0.64px) |
| H4 / Team & Testimonials | DM Sans Medium, 24px, lh 100%, ls -2px (≈-0.48px) |
| Paragraph/Web | DM Sans Regular, 18px, lh 24px, ls 0 |
| Section Title/Web | DM Sans Regular, 18px, lh 100%, ls -2px (≈-0.36px) |
| CTA/Web | DM Sans Medium, 16px, lh 100%, ls 0 |
| Footer/Web | DM Sans Regular, 14px, lh 100%, ls 0 |

---

## Section-by-Section Specs

### Section 1: Hero (node 189:473–189:478)

- **Top padding (from nav):** hero title at y=183px → nav at y=14px, height ~60px → gap ~109px top-padding from nav bottom
- **H1:** 62px, Regular, lh 80px, ls -1.24px, centered, max-w 857px
  - "Meet the " (dark #151419) + "Ranking Heroes" (gradient: `195.056deg`)
- **Subtitle paragraph (desktop):** 18px Regular, lh 24px, centered, max-w 688px, color #151419, mt ~100px from h1 baseline (node top: 283px, h1 top: 183px = 100px gap)
  - Two lines with ~20px paragraph gap between them
- **Hero panel:** 480px tall, left=10px, w=1420px, rounded-[40px], gradient `42.357deg #151519 → #4c4ab5`
- **Hero image (statue):** 633×561px, positioned left: 394px from panel left edge (≈left-[394px]), top: -150px above panel (top-[-150px])
- **Bottom body paragraph:** white #FFF, 18px, lh 24px, centered, w=688px, positioned inside panel at y~806px (=806-458=348px from panel top)

### Section 2: AboutUsTrust (nodes 190:485–197:477)

- **Section top-padding inside off-white container:** trust section title at y=1069px, container rect at ~y=1038px → pt~31px → **Figma inner pt appears ~31px**; but the section label is at 1069px and the panel starts at ~1038 (5px outer + 11px + rounded content start). Effective pt from outer container bottom ≈ 120px (1069-950 where hero ends at ~938).
- **Section label:** 18px Regular, ls -0.36px, color #151419; text: `/  Trust and Authority  /`
  - Position: left=80px, top=1069px
- **H2:** 52px Regular, lh 60px, ls -1.04px; top=1112px → gap from label = 43px
  - "Over a Decade of Ethical, Data-Driven " (dark) + "SEO Excellence" (gradient `227.1deg`)
  - max-width: 482px (left column)
- **Body paragraph:** 18px Regular, lh 24px, top=1332px, w=484px, 3 paras with 20px mb each
- **Right column articles — icon boxes:** 50×50px, border #E0E0E0, bg white, radius 12px
  - "Our Approach" icon at left=`calc(50%+10px)`, top=1106px
  - "Our Team" icon at left=`calc(50%+10px)`, top=1344px
  - "Our Vision" icon at left=`calc(50%+10px)`, top=1534px
- **H3 (article headings):** 32px Regular, ls -0.64px, lh normal
  - "Our Approach" at left=`calc(50%+74px)` → 64px from icon left edge
  - Gap between icon box left and heading: 64px → pl-[64px] confirmed correct
- **Separator lines:** #E0E0E0, 1px, w=630px
- **Right column left offset:** `calc(50%+10px)` = 720px+10px = 730px from page left. At 1440px page → right column starts at 730px. Left col ends at ~565px (80+485). Gap ≈ 165px. **Figma xl:gap matches implementation.**

### Section 3: AboutUsProcess (node 493:1624)

- **Container:** left=80px, w=1280px, h=364px, rounded-[40px], border #E0E0E0, bg white — top=1816px
- **H3:** "The Fastest and " + "Most Effective" (gradient 190.56deg) + " to Get Started" — at left=110px (padding-left=30px inside 80px container)
  - 32px Regular, lh normal, ls -0.64px — top=1846px (30px from container top)
- **Step pills row:** at top=1918px (72px below heading at 1846px) → 72px gap from heading to steps
  - Active pill: bg #151419, text #F4F4F4 (off-white), 18px Regular
  - Inactive pill: bg #F4F4F4, text #535353, 18px Regular
  - Arrows between pills: ~14×14px icon
- **Paragraph below steps:** 18px, lh 24px, at top=2017px (w=817px) → 99px from step row top, 17px below step bottom
- **CTA button:** at top=2105px (88px from paragraph top at 2017px); border #998AFF, rounded-[16px], text #151419, 16px Medium
- **Process container bottom:** top+h = 1816+364 = 2180px → CTA at 2105px is 75px from bottom → `pb` for button offset

### Section 4: AboutUsCta (node 197:341, 196:102–196:106)

- **Container rect:** bg #151419, left=10px, w=1420px, h=577px, rounded-[40px], top=2260px
- **Gradient text block:** centered, w=1280px, top=2350px → 90px from rect top
  - 32px, gradient `205.3deg`, text-align center
  - Two paragraphs separated by blank line
- **White paragraph:** 18px white, lh 24px, centered, w=664px, top=2592px (332px from rect top)
- **CTA button:** border #998AFF, bg transparent, text white, 16px Medium, at top=2672px (412px from rect top)
  - Size: px-[20px] py-[12px] → 45px tall (12×2 + 1×2 border ≈ fits h-[45px])

### Section 5: AboutUsTeam (nodes 197:342, 196:109, 659:6567–659:6649)

- **Section label:** `/  Our Team  /` — 18px Regular, ls -0.36px, top=2957px, left=80px
- **H2:** "Meet Your " (dark) + "Core Heroes" (gradient ~197.9deg), at top=3000px → gap from label = 43px
  - 52px Regular, lh 60px, ls -1.04px
- **Team grid:** 4 cols, cards start at top=3140px (140px from H2 at 3000px)
  - Card: 305×409px, border #E0E0E0, rounded-[40px]
  - Image area: 305×305px (square, top portion)
  - Name: font-medium, 24px, ls -0.48px (tracking-[-0.48px]), top=3465px = 325px from card top (card bottom of img area = 305px, +20px gap to name = 325px ✓)
  - Role: 18px Regular, lh 24px, color #535353, top=3506px (41px below name = line-height 24px + 17px ≈ name takes 1 line at lh-normal ~24px then 17px gap)
  - Arrow button: 72px circle, bg white, positioned at top=3353px = 213px from card top
  - Second row of cards starts at top=3569px (160px below first row bottom at 3549px = 3140+409)
- **"Become a Hero" card:** role text "/ Apply Now /" in gradient, not plain grey
- **Stefan Cvetković role text:** "Organic Growth Manager" — no slashes, plain text (not `/ ... /` format)
- **Slobodan Kačavenda role text:** "Head of Link Building" — no slashes, plain text

### Section 6: Testimonials (nodes 197:343, 197:423–197:444)

- **Section label:** `/  Dedication  /` at top=4098px
- **H2:** "What Our " + "Clients" (gradient 221.34deg) + " Say" at top=4141px (43px gap from label)
  - 52px Regular, lh 60px, ls -1.04px; max-w 393px (left col)
- **CTA button:** "Become a Satisfied Client" at top=4216px (75px from H2 top)
  - Right-aligned: left=`calc(75%+26px)`
- **Cards:** 574px tall, 413px wide, bg #F4F4F4, rounded-[40px], border (Figma shows no border on bg cards — only border is on logo pill)
  - Avatar: 77px circle, top=4350px (20px from card top=4330px), left=100px (20px from card left=80px)
  - Logo pill: 160×77px, border #151419, rounded-[66px], positioned at right side of card (left=`calc(16.67%+73px)` ≈ 313px → same as card right-ish area)
  - Quote mark: 15.232×21.376px image, top=4467px (137px from card top), left=100px
  - Quote text: 24px Medium, ls -0.48px, top=4521px (191px from card top), w=373px
  - Name: 24px Medium, ls -0.48px, top=4810px (480px from card top)
  - Role: 18px Regular, lh 24px, color #535353, top=4851px (521px from card top)
- **Key observation:** Figma testimonial cards have NO border on the card itself (bg #F4F4F4 only). The border is only on the logo pill (border #151419).

### Section 7: Blog (nodes 197:406–774:96)

- **Section label:** `/  Featured Blogs  /` at top=5024px; 18px Regular, ls -0.36px
- **H2:** 52px Regular, lh 60px, ls -1.04px; max-w 577px (left col), top=5067px (43px from label)
  - "Insights and Trends in Our " (dark) + "Most Popular Reads" (gradient)
- **CTA button:** "View More Blogs" at top=5130px, right-aligned (left=`calc(83.33%-24px)`)
- **Blog card:** 413×467px, bg white, border #E0E0E0, rounded-[40px], top=5267px
  - Image placeholder: 207px tall (top portion of card)
  - Title: 32px Regular, lh normal, ls -0.64px (not the mobile 28px) — NOTE: implementation uses 24px at lg
  - Body text: 18px Regular, lh 24px, color #151419 (not #535353)
  - Date: 18px Regular, lh 24px, color #535353
