import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

async function sendGiftEmail(opts: {
  to: string;
  note: string | null;
  buyerEmail?: string | null;
  sessionId: string;
}) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn("Supabase env missing — skipping gift email");
    return;
  }
  const r = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      templateName: "gift_prompt",
      to: opts.to,
      idempotencyKey: `gift:${opts.sessionId}`,
      purpose: "transactional",
      templateData: {
        buyerEmail: opts.buyerEmail ?? null,
        note: opts.note,
      },
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    console.error("send-transactional-email failed", r.status, t);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) return new Response("Stripe not configured", { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured — refusing to process webhook");
    return new Response("Webhook secret not configured", { status: 500 });
  }
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (err) {
    console.error("webhook signature verification failed", err);
    return new Response("Bad signature", { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const item = session.metadata?.item;
      const giftEmail = session.metadata?.gift_recipient_email;
      const giftNote = session.metadata?.gift_note ?? null;

      await admin.from("orders").update({
        status: "paid",
        stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
        customer_email: session.customer_details?.email ?? null,
      }).eq("stripe_session_id", session.id);

      if (item === "gift" && giftEmail) {
        await sendGiftEmail({
          to: giftEmail,
          note: giftNote,
          buyerEmail: session.customer_details?.email,
          sessionId: session.id,
        });
      }
    }
  } catch (e) {
    console.error("webhook handler error", e);
    return new Response("handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
