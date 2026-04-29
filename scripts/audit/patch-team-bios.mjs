import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

// Manual splits for the 5 BCMS-migrated team members whose hobby
// bullet list was concatenated without separators by the legacy
// htmlToText (textContent strips <li> whitespace).
//
// Each entry: replace bioParagraphs[index] with the joined newlines.
const PATCHES = [
  {
    slug: "nebojsa-jankovic",
    index: 4,
    expected: "Spending time with my wife and sonTraveling the worldStaying up to date with the latest marketing trends",
    replacement: [
      "Spending time with my wife and son",
      "Traveling the world",
      "Staying up to date with the latest marketing trends",
    ].join("\n"),
  },
  {
    slug: "anastasija-jankovic",
    index: 7,
    expected: "Travel and explore new countries and culturesHanging out with my little family relaxes me even on my busiest daysCook dishes, preferably full of spices and meat",
    replacement: [
      "Travel and explore new countries and cultures",
      "Hanging out with my little family relaxes me even on my busiest days",
      "Cook dishes, preferably full of spices and meat",
    ].join("\n"),
  },
  {
    slug: "una-stanojevic",
    index: 7,
    expected: "Music production and other artistic pursuitsLearning new languages and immersing myself in new culturesHealth, wellness and personal growth",
    replacement: [
      "Music production and other artistic pursuits",
      "Learning new languages and immersing myself in new cultures",
      "Health, wellness and personal growth",
    ].join("\n"),
  },
  {
    slug: "slobodan-kacavenda",
    index: 7,
    expected: "Enjoying Movies and Video GamesCycling and SwimmingTravelling",
    replacement: [
      "Enjoying Movies and Video Games",
      "Cycling and Swimming",
      "Travelling",
    ].join("\n"),
  },
  {
    slug: "andjela-knezevic",
    index: 7,
    expected: "spending time with my friends and family, exploring new and interesting coffee shopsrelaxing at home while watching movies or playing games.",
    replacement: [
      "spending time with my friends and family, exploring new and interesting coffee shops",
      "relaxing at home while watching movies or playing games.",
    ].join("\n"),
  },
];

const dryRun = process.argv.includes("--dry-run");

for (const patch of PATCHES) {
  const doc = await client.fetch(
    `*[_type == "teamMember" && slug.current == $slug][0]{ _id, bioParagraphs }`,
    { slug: patch.slug },
  );
  if (!doc) {
    console.log(`SKIP ${patch.slug}: not found`);
    continue;
  }
  const current = doc.bioParagraphs?.[patch.index];
  if (current !== patch.expected) {
    console.log(`SKIP ${patch.slug}[${patch.index}]: content differs from expected`);
    console.log(`  expected: ${patch.expected.slice(0, 80)}…`);
    console.log(`  actual:   ${current?.slice(0, 80)}…`);
    continue;
  }
  if (dryRun) {
    console.log(`DRY-RUN ${patch.slug}[${patch.index}]: would replace`);
    continue;
  }
  const next = [...doc.bioParagraphs];
  next[patch.index] = patch.replacement;
  await client
    .patch(doc._id)
    .set({ bioParagraphs: next })
    .commit({ visibility: "async" });
  console.log(`PATCHED ${patch.slug}[${patch.index}]`);
}
