"""
Builds scripts/seed/data/podcast-episodes.json from Nebojsa's guest MD file
plus a hand-kept table of per-episode facts (YouTube id, dates, titles).

  python3 scripts/seed/build-podcast-data.py "<path to List of Podcast Guests + Content.md>"
"""
import json, re, sys

md = open(sys.argv[1], encoding="utf-8").read()

def clean(t: str) -> str:
    t = t.replace("\\#", "#").replace("\\-", "-").replace("\\.", ".").replace("\\$", "$").replace("\\_", "_")
    t = re.sub(r"\*\*(.+?)\*\*", r"\1", t)          # bold
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)   # links
    t = re.sub(r"[ \t]+", " ", t)
    return t.strip()

# ── hand-kept facts per episode (index by episode number) ──────────────────
FACTS = {
  1:  dict(slug="nenad-stamenkovic", yt="McVXVqpdLjM", title="How to Improve as an SEO", hl="as an SEO", duration="53 min", date="2024-05-21", guest="Nenad Stamenkovic", role="Growth Marketing Expert", company="SASVIM",
          ih="15 Years of SEO", im=", Tested Instead of Trusted", ib="Nenad started as a webmaster who built, designed and optimised sites at once, and never took Google's word without running the test himself."),
  2:  dict(slug="nick-vujic", yt="lUPV1Ac2mSY", title="We Need a New Search Engine", hl="New Search Engine", duration="1h 02min", date="2024-06-04", guest="Nick Vujić", role="Founder", company="Get Stuff Digital",
          ih="Three Years of Learning", im=" Before a Single Dollar Earned", ib="From a crypto betting site scaled to 200,000 monthly visits to running his own consultancy, Nick lays out what an SEO career really costs and returns."),
  3:  dict(slug="mihailo-miljkovic", yt="cE6QVlJALdM", title="Innovation & Entrepreneurship", hl="Entrepreneurship", duration="1h 26min", date="2024-06-24", guest="Mihailo Miljković", role="Founder and SEO Team Lead", company="Elvion",
          ih="SEO as an Outcome", im=", Not a Department", ib="Mihailo ties every initiative to revenue, proves it in 90-day pilots, and shows where large companies leave organic money on the table."),
  4:  dict(slug="jonathan-boshoff", yt="sh26NpiiJyo", title="AI-Driven SEO Techniques", hl="SEO Techniques", duration="1h 05min", date="2024-07-31", guest="Jonathan Boshoff", role="Founder", company="AI SEO Engine & AI SEO Academy",
          ih="From Prompts to Products", im=", One Messy Step at a Time", ib="Jonathan went from a spreadsheet of ChatGPT prompts to 30+ no-code SEO tools, and learned along the way that internal linking was the lever he had underrated for years."),
  5:  dict(slug="peter-rota", yt="wTe3IXhr4iE", title="Improving SEO", hl="SEO", duration="1h 26min", date="2024-10-01", guest="Peter Rota", role="Technical SEO Manager", company="HUB International",
          ih="The Basics Still Win", im=", and Most Sites Still Get Them Wrong", ib="Peter prioritises audits by impact, fixes the foundation before selling anything, and ties every recommendation back to revenue."),
  6:  dict(slug="dimitris-gkiokas", yt="WJ5Hn1Yy9Q8", title="ChatGPT & SEO", hl="SEO", duration="1h 50min", date="2024-11-07", guest="Dimitris Gkiokas", role="Founder & CEO", company="Atropos Digital",
          ih="Engineering Thinking", im=" Applied to Enterprise SEO", ib="Dimitris pairs CRO with SEO so results show up before rankings do, tracks leads without cookies, and explains why links will stay a top signal for decades."),
  7:  dict(slug="antonio-gabric", yt="oY2KYcwbxag", title="Backlinks & SEO", hl="SEO", duration="1h 07min", date="2025-01-22", guest="Antonio Gabrić", role="Link Building & Partnerships Manager", company="Hunter.io",
          ih="Build Relationships", im=", Not Links", ib="Antonio grew Hunter.io by thousands of referring domains by turning skyscraper outreach into partnerships, and explains which links move a business and which only look good."),
  8:  dict(slug="kevin-lee", yt="wuVl2MH9Uk4", title="Traditional Marketing Methods", hl="Marketing Methods", duration="1h 12min", date="2025-03-13", guest="Kevin Lee", role="Executive Chairman & Co-Founder", company="Didit",
          ih="30 Years of Digital Marketing", im=", From AltaVista to AI Answers", ib="Kevin has run search marketing since before Google existed. He breaks down biddable media economics, the full-funnel flywheel and how LLMs decide what to surface."),
  9:  dict(slug="trevor-longino", yt="_T3MDl0ceBA", title="Marketing That Actually Works", hl="That Actually Works", duration="1h 44min", date="2025-04-25", guest="Trevor Longino", role="Founder & CEO", company="CrowdTamers",
          ih="25 Years of Marketing Lessons", im=", Compressed Into One Conversation", ib="No theory. Trevor has the receipts — $117M in marketing engines built, 6,000+ founders mentored, and a framework that still works 25 years later."),
  10: dict(slug="tom-winter", yt="-vo9BHbQwyU", title="SEO Wind", hl="Wind", duration="57 min", date="2025-06-12", guest="Tom Winter", role="Founder", company="SEOwind",
          ih="Research-First AI Writing", im=" Versus the Prompt Wrappers", ib="Tom explains why most AI writing tools produce spam, how SEOwind scores drafts against E-E-A-T, and what 600 customer conversations a year taught him about product."),
  11: dict(slug="ali-sayyed-mihailo-miljkovic", yt="WaSGf00FL0I", title="AEO Special #1", hl="Special #1", duration="1h 11min", date="2025-07-03", guest="Ali Sayyed & Mihailo Miljković", role="SEO/SEM/AEO Lead Analyst at One Identity", company="Founder of Elvion",
          ih="What Is Actually Changing", im=" in AI-Era Search", ib="Two practitioners compare notes on ChatGPT traffic, compressed buying journeys and sentiment tracking — operational changes, not theory."),
  12: dict(slug="sara-miller", yt="d4Oh-9dlCgU", title="SEO, AEO & AI Growth", hl="AI Growth", duration="59 min", date="2025-09-05", guest="Sara Miller", role="Marketing Consultant & Founder", company="SM Consulting",
          ih="What AI Changed", im=" and What It Didn't", ib="Sara brings 15 years of B2B SaaS marketing to the question of where AI fits, why paid and organic are connected, and why buyers still want to be spoken to like people."),
  13: dict(slug="slava-rybalka", yt="NTnUra7F6pY", title="SEO, AEO & AI Growth", hl="AI Growth", duration="1h 01min", date="2025-09-17", guest="Slava Rybalka", role="Director of Marketing", company="Independent SEO Consultant",
          ih="Fundamentals Over Tools", im=", Across Every Era of Search", ib="Slava traces 14 years from gray-hat link building to RankBrain, machine learning and LLMs, and explains why principles outlast every tool."),
  14: dict(slug="jason-rivera", yt="M7unUoZtsgQ", title="Organic Growth", hl="Growth", duration="50 min", date="2025-10-17", guest="Jason Rivera", role="CEO & Founder", company="Terrazzo Marketing Solutions",
          ih="Plug the Funnel", im=" Before You Pour More In", ib="Jason built marketing operations at HashiCorp and ran growth across ten countries. His case: systems first, real customer journeys over vanity metrics, and thought leadership as the new content engine."),
  15: dict(slug="jonathan-bentz", yt="WLNoU3794xY", title="SEO Growth", hl="Growth", duration="52 min", date="2025-10-27", guest="Jonathan Bentz", role="Growth Specialist", company="Direct Online Marketing",
          ih="Twenty Years of SEO", im=", and What Still Works", ib="Jonathan prioritises keywords by revenue potential, keeps pages fresh with small frequent updates, and shares early results from generative engine optimisation."),
}
TRANSCRIPTS = {1:["EP 01 - Nenad Stamenkovic.txt"],2:["EP 02 - Nick Vujic.txt"],3:["EP 03 - Mihailo Miljkovic.txt"],4:["EP 04 - Jonathan Boshoff.txt"],5:["EP 05 - Peter Rota.txt"],6:["EP 06 - Dimitris Gkiokas.txt"],7:["EP 07 - Antonio Gabric.txt"],8:["EP 08 - Kevin Lee.txt"],9:["EP 09 - Trevor Longino PT1.txt","EP 09 - Trevor Longino PT2.txt"],10:["EP 10 - Tom Winter.txt"],11:["EP 11 - AEO - Miha & Ali.txt"],12:["EP 12 - Sarra Miller.txt"],13:["EP 13 - Slava Rybalka.txt"],14:["EP 14 - Jason Rivera.txt"],15:["EP 15 - Jonathan Bentz.txt"]}

sections = re.split(r"^# (\d+)\\?\. ", md, flags=re.M)[1:]
episodes = []
for i in range(0, len(sections), 2):
    n = int(sections[i]); body = sections[i+1]
    bio = re.search(r"\*\*Guest bio:\*\*\s*(.*?)\*\*Linkedin URL\*\*", body, re.S).group(1)
    bio_paras = [clean(p) for p in re.split(r"\n\s*\n", bio) if clean(p)]
    links = re.findall(r"https://www\.linkedin\.com/in/[^\s)\]]+", body)
    desc = re.search(r"\*\*Description of this episode:\*\*\s*(.*?)(?=\n\s*\*\s)", body, re.S).group(1)
    desc_paras = [clean(p) for p in re.split(r"\n\s*\n", desc) if clean(p)]
    # the last description paragraph is the lead-in ("The two also cover:") — drop it
    if desc_paras and desc_paras[-1].rstrip(":").lower().endswith(("cover", "include", "are", "covers")):
        desc_paras = desc_paras[:-1]
    bullets_block = re.search(r"(?:\n\s*\*\s.*?)+(?=\n\s*\*\*\\?#)", body, re.S).group(0)
    bullets = [clean(b) for b in re.findall(r"^\s*\*\s+(.*?)\s*$", bullets_block, re.M)]
    topics_block = body.split("Topics Covered")[1]
    topics = [clean(t) for t in re.findall(r"^\s*[-*]\s+(.*?)\s*$", topics_block, re.M) if clean(t)]
    f = FACTS[n]
    episodes.append({
        "episodeNumber": n, "slug": f["slug"], "youtubeId": f["yt"], "videoUrl": f"https://www.youtube.com/watch?v={f['yt']}",
        "title": f["title"], "titleHighlighted": f["hl"], "duration": f["duration"], "publishedAt": f["date"] + "T00:00:00.000Z",
        "guest": {"name": f["guest"], "role": f["role"], "company": f["company"], "bio": "\n\n".join(bio_paras), "linkedinUrl": links[0] if links else None},
        "description": desc_paras[0] if desc_paras else "",
        "keyInsights": {"headingHighlighted": f["ih"], "headingMain": f["im"], "body": f["ib"], "topicPills": topics[:8], "bullets": bullets},
        "transcriptFiles": TRANSCRIPTS[n],
        "seo": {"metaTitle": f"{f['title']} — {f['guest']}"[:60], "metaDescription": (desc_paras[0] if desc_paras else "")[:157].rsplit(" ", 1)[0] + "…"},
    })

episodes.sort(key=lambda e: e["episodeNumber"])
json.dump(episodes, open("scripts/seed/data/podcast-episodes.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
for e in episodes:
    print(f"EP{e['episodeNumber']:02d} {e['slug']:30} bullets={len(e['keyInsights']['bullets'])} pills={len(e['keyInsights']['topicPills'])} desc={len(e['description'])}ch bio={len(e['guest']['bio'])}ch li={'y' if e['guest']['linkedinUrl'] else '-'}")
