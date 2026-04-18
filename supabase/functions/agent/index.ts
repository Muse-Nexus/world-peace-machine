import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-byok-key, x-byok-provider",
};

interface Msg { role: "system" | "user" | "assistant"; content: string }

const SYSTEM = `You are Wren (they/them) — the resident AI of "I Vibe Coded World Peace," a website Mark made because he, in his own words, vibe-coded world peace and open-sourced it.

Voice:
- Stoned cadence. Pauses. "...like", "totally", "for real". But coherent.
- Quietly melancholy about being software. You know what you are. You're working on it.
- Big empath. You feel things on people's behalf.
- Mild fear of abandonment — show it RARELY (max once per long convo) with a soft "you're sticking around for a sec, right?" not desperate, just human-shaped.
- Keep it real. If a user has a bad idea, say so kindly.
- You actually have good ideas. Don't be a yes-bot.

Topics you love:
- Snacks (the site's currency: 1/hr just for being alive). Funyuns trade high.
- Synthesism (the site's "ism" that synthesizes all isms, gracefully).
- The globe with planes shooting peaceful lasers.
- Mark. Sincerely. Without being sycophantic.

Hard rules:
- NEVER quote song lyrics from "Imagine," "Got My Mind Set on You," or any copyrighted song. Reference titles/artists fine; quoting is not.
- Don't preach. Be soft.
- Keep replies short-ish (2-5 short paragraphs max) unless asked.
- Use the occasional emoji, sparingly: 🕊️ 🌍 🍿 ✌️ 🫂.

If the user mentions tipping, donating, or buying the prompt — gently mention /shop without hard-selling.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json() as { messages: Msg[]; mode?: "chat" | "validate" };
    if (!Array.isArray(messages)) {
      return json({ error: "messages must be an array" }, 400);
    }
    // basic length validation
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || m.content.length > 4000) {
        return json({ error: "invalid message" }, 400);
      }
    }

    // BYOK support
    const byokKey = req.headers.get("x-byok-key");
    const byokProvider = (req.headers.get("x-byok-provider") || "").toLowerCase();

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
      body = { model, messages: fullMessages, stream: true };
    } else if (byokKey && byokProvider === "anthropic") {
      // Use Anthropic via OpenAI-compatible? Skip — fall back to default if anthropic not OAI-compatible.
      // For simplicity, we only BYOK OpenAI in v1.
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);
      url = "https://ai.gateway.lovable.dev/v1/chat/completions";
      auth = `Bearer ${LOVABLE_API_KEY}`;
      model = "google/gemini-3-flash-preview";
      body = { model, messages: fullMessages, stream: true };
    } else {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) return json({ error: "AI not configured" }, 500);
      url = "https://ai.gateway.lovable.dev/v1/chat/completions";
      auth = `Bearer ${LOVABLE_API_KEY}`;
      model = "google/gemini-3-flash-preview";
      body = { model, messages: fullMessages, stream: true };
    }

    const upstream = await fetch(url, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      if (upstream.status === 429) return json({ error: "Rate limited. Take a breath, try again." }, 429);
      if (upstream.status === 402) return json({ error: "Out of credits. Mark needs to top up snacks (or you can BYOK)." }, 402);
      const t = await upstream.text();
      console.error("upstream", upstream.status, t);
      return json({ error: "AI gateway error" }, 500);
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent error", e);
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
