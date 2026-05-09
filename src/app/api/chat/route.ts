/**
 * Vercel server proxy for the podcast chatbot.
 *
 * Browser → this route (same-origin) → chatbot.heroicrankings.com/api/chat
 *
 * Bearer secret lives only here on the server. Never ships to the browser.
 * Per docs/CHATBOT_INTEGRATION.md §5–§6.
 *
 * Runs on Node.js runtime — `runtime: "edge"` is incompatible with
 * Next 16's experimental.useCache flag in next.config.ts.
 */

const CHATBOT_API_URL = process.env.CHATBOT_API_URL;
const CHATBOT_SERVER_SECRET = process.env.CHATBOT_SERVER_SECRET;

export async function POST(req: Request): Promise<Response> {
  if (!CHATBOT_API_URL || !CHATBOT_SERVER_SECRET) {
    return new Response("Chat backend env not configured", { status: 503 });
  }

  const upstream = await fetch(`${CHATBOT_API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHATBOT_SERVER_SECRET}`,
    },
    body: await req.text(),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
