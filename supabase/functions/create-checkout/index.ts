import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side price catalog. NEVER trust client amounts.
type ItemKey =
  | "prompt"
  | "gift"
  | "tip_1" | "tip_3" | "tip_7" | "tip_12" | "tip_24"
  | "sub_1" | "sub_3" | "sub_7" | "sub_12" | "sub_24";

const CATALOG: Record<ItemKey, { amount: number; mode: "payment" | "subscription"; name: string }> = {
  prompt: { amount: 99, mode: "payment", name: "The Prompt" },
  gift:   { amount: 199, mode: "payment", name: "Gift The Prompt" },
  tip_1:  { amount: 100, mode: "payment", name: "One-time tip $1" },
  tip_3:  { amount: 300, mode: "payment", name: "One-time tip $3" },
  tip_7:  { amount: 700, mode: "payment", name: "One-time tip $7" },
  tip_12: { amount: 1200, mode: "payment", name: "One-time tip $12" },
  tip_24: { amount: 2400, mode: "payment", name: "One-time tip $24" },
  sub_1:  { amount: 100, mode: "subscription", name: "Monthly $1" },
  sub_3:  { amount: 300, mode: "subscription", name: "Monthly $3" },
  sub_7:  { amount: 700, mode: "subscription", name: "Monthly $7" },
  sub_12: { amount: 1200, mode: "subscription", name: "Monthly $12" },
  sub_24: { amount: 2400, mode: "subscription", name: "Monthly $24" },
};

function isItemKey(x: unknown): x is ItemKey {
  return typeof x === "string" && x in CATALOG;
}

function isEmail(s: unknown): s is string {
  return typeof s === "string" && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Stripe not configured" }, 500);

    const body = await req.json().catch(() => ({}));
    const { item, gift_recipient_email, gift_note, customer_email } = body ?? {};

    if (!isItemKey(item)) return json({ error: "Unknown item" }, 400);
    if (item === "gift") {
      if (!isEmail(gift_recipient_email)) return json({ error: "Valid recipient email required" }, 400);
      if (gift_note && (typeof gift_note !== "string" || gift_note.length > 500)) {
        return json({ error: "Gift note too long (max 500 chars)" }, 400);
      }
    }
    if (customer_email && !isEmail(customer_email)) {
      return json({ error: "Invalid customer email" }, 400);
    }

    const entry = CATALOG[item];
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Optional: link to logged-in user via JWT
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const supabaseAuth = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
          { global: { headers: { Authorization: authHeader } } },
        );
        const { data } = await supabaseAuth.auth.getUser();
        userId = data.user?.id ?? null;
      } catch (_) { /* anonymous is fine */ }
    }

    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "https://ivibecodedworldpeace.com";

    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: { name: entry.name },
        unit_amount: entry.amount,
        ...(entry.mode === "subscription" ? { recurring: { interval: "month" as const } } : {}),
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      mode: entry.mode,
      line_items: lineItems,
      success_url: `${origin}/shop/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cancel`,
      ...(customer_email ? { customer_email } : {}),
      metadata: {
        item,
        ...(item === "gift" ? {
          gift_recipient_email: gift_recipient_email as string,
          gift_note: ((gift_note as string) ?? "").slice(0, 500),
        } : {}),
        ...(userId ? { user_id: userId } : {}),
      },
    });

    // Record pending order via service role
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    await admin.from("orders").insert({
      user_id: userId,
      item,
      amount_cents: entry.amount,
      mode: entry.mode,
      stripe_session_id: session.id,
      customer_email: customer_email ?? null,
      gift_recipient_email: item === "gift" ? gift_recipient_email : null,
      gift_note: item === "gift" ? ((gift_note as string) ?? "").slice(0, 500) : null,
      status: "pending",
    });

    return json({ url: session.url });
  } catch (e) {
    console.error("create-checkout error", e);
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
