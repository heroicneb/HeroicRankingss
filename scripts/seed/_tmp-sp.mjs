import { readFileSync } from "node:fs";
import { createClient } from "next-sanity";
const c = createClient({ projectId: "y4pfm1uv", dataset: "production", apiVersion: "2025-01-01", useCdn: false, token: process.env.SANITY_API_WRITE_TOKEN });
const asset = await c.assets.upload("image", readFileSync("/private/tmp/claude-501/-Users-nebojsajankovic-Desktop-Claude-heroic-rankings-final/8e74694c-6650-4ee2-8da2-4df47eab8705/scratchpad/partner-logos/searchprofit.svg"), { filename: "searchprofit-logo.svg" });
await c.patch("partnershipPage").set({ 'scale.logos[_key=="lg-searchprofit"].image.asset._ref': asset._id }).commit();
console.log("replaced →", asset._id);
