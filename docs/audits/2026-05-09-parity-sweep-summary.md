# Heroic Rankings — Parity Sweep 2026-05-09

- old: https://heroicrankings.com
- new: https://heroic-rankings-final.vercel.app
- paths checked: 102
- avg latency old: 1365ms · new: 487ms

## Status

| Metric | Count |
|---|---:|
| old returns 200 | 101 |
| new returns 200 | 102 |
| **CRITICAL** old 200 → new 404 | 0 |
| pages with legacy-style hrefs in new HTML | 0 |
| total legacy-style hrefs across all new pages | 0 |
| pages with noindex on new (expected pre-cutover) | 102 |

## Drift

| Metric | Count |
|---|---:|
| title differs (content choice) | 22 |
| h1 differs | 17 |
| pages with new wordCount < 70% of old (potential content loss) | 6 |

## Cutover gate

- legacy hrefs in rendered HTML: **PASS (0)**
- new 404 vs old 200: **PASS (0)**

Per-URL data: `docs/audits/2026-05-09-parity-sweep.csv`
