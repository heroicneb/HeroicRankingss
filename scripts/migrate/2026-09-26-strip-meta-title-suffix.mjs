import { createClient } from "next-sanity";
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token: process.env.SANITY_API_WRITE_TOKEN, apiVersion: "2025-01-01", useCdn: false });
const docs = await client.fetch('*[_type=="post" && seo.metaTitle match "* | Heroic Rankings"]{_id, "t": seo.metaTitle}');
console.log("posts with doubled suffix:", docs.length);
const tx = client.transaction();
for (const d of docs) tx.patch(d._id, { set: { "seo.metaTitle": d.t.replace(/\s*\|\s*Heroic Rankings\s*$/i, "") } });
if (docs.length) { const r = await tx.commit(); console.log("patched", r.results.length); }
