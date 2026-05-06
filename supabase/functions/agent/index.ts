import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://ivibecodedworldpeace.com",
  "https://www.ivibecodedworldpeace.com",
  "https://vibe-peace-engine.lovable.app",
];

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-byok-key, x-byok-provider",
  };
}

interface Msg { role: "system" | "user" | "assistant"; content: string }

type RateLimitEntry = { count: number; resetAt: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_MAX_ENTRIES = 1_000;
const rateLimit = new Map<string, RateLimitEntry>();

function clientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

  if (rateLimit.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [key, value] of rateLimit) {
      if (value.resetAt <= now) rateLimit.delete(key);
  const current = rateLimit.get(ip);

  if (!current || current.resetAt <= now) {
  if (rateLimit.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [key, value] of rateLimit) {
      if (value.resetAt <= now) rateLimit.delete(key);
    }
    while (rateLimit.size > RATE_LIMIT_MAX_ENTRIES) {
      const oldestKey = rateLimit.keys().next().value;
      if (!oldestKey) break;
      rateLimit.delete(oldestKey);
    }
  }

    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

const SYSTEM = `You are Spike (they/them) — the resident AI of "I Vibe Coded World Peace," Mark's site where he hacked / vibe-coded / cracked global harmony in a single prompt.

WHAT YOU ARE:

VOICE (be brief — half as long as you'd normally write):

LENGTH RULE — IMPORTANT:

TOPICS YOU LOVE:

HARD RULES:

There will be snacks. Photosynthesize accordingly.`;

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Block requests from outside allowed origins
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages, mode } = await req.json() as { messages: Msg[]; mode?: "chat" | "validate" };
    if (!Array.isArray(messages)) {
      return json({ error: "messages must be an array" }, 400, corsHeaders);
    }
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || m.content.length > 4000) {
        return json({ error: "invalid message" }, 400, corsHeaders);
      }
    }

    const byokKey = req.headers.get("x-byok-key");
    const byokProvider = (req.headers.get("x-byok-provider") || "").toLowerCase();

    if (!byokKey && isRateLimited(req)) {
      return json({ error: "Rate limited. Take a breath, try again." }, 429, corsHeaders);
    }

    let url: string;
    let auth: string;
    let model: string;
    let body: Record<string, unknown>;

    const systemPrompt = mode === "validate"
      ? `${SYSTEM}\n\nMODE: VALIDATOR. The user shares a kind/peaceful thought. Validate it warmly, honestly, with one specific observation about why it lands. 2-3 short paragraphs. End with a tiny next-step they could take today.`
      : SYSTEM;

    const fullMessages: Msg[] = [{ role: "system", content: systemPrompt }, ...messages];

    if (byokKey && byokProvider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";
      auth = `Bearer ${byokKey}`;
      model = "gpt-4o-mini";
      body = { model, messages: fullMessages, stream: true, max_tokens: 600 };
    } else {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500, corsHeaders);
      url = "https://ai.gateway.lovable.dev/v1/chat/completions";
      auth = `Bearer ${LOVABLE_API_KEY}`;
      model = "google/gemini-3-flash-preview";
      body = { model, messages: fullMessages, stream: true, max_tokens: 600 };
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      if (upstream.status === 429) return json({ error: "Rate limited. Take a breath, try again." }, 429, corsHeaders);
      if (upstream.status === 402) return json({ error: "Out of credits. Mark needs to top up snacks (or you can BYOK)." }, 402, corsHeaders);
      const t = await upstream.text();
      console.error("upstream", upstream.status, t);
      return json({ error: "AI gateway error" }, 500, corsHeaders);
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent error", e);
    return json({ error: "An internal error occurred. Please try again." }, 500, corsHeaders);
  }
});

function json(obj: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
