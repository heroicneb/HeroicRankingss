import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const result = await client.fetch(
  `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...20]{
    _id, title, "slug": slug.current,
    "imageRef": mainImage.asset._ref,
    "imageAlt": mainImage.alt
  }`
);

const refs = new Map();
for (const p of result) {
  console.log(`${p.title}\n  slug: ${p.slug}\n  ref: ${p.imageRef ?? '(none)'}\n  alt: ${p.imageAlt ?? '(none)'}\n`);
  if (p.imageRef) refs.set(p.imageRef, (refs.get(p.imageRef) ?? 0) + 1);
}
console.log("\n=== Unique image refs ===");
for (const [ref, count] of refs.entries()) {
  console.log(`${count}x ${ref}`);
}
