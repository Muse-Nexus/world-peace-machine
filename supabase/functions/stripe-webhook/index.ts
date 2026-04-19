import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

async function sendGiftEmail(opts: {
  to: string;
  note: string | null;
  buyerEmail?: string | null;
}) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — skipping gift email");
    return;
  }

  // Direct Resend API (key-based) — no gateway needed since user pasted key directly.
  const html = `
    <div style="font-family: ui-monospace, Menlo, monospace; max-width: 540px; margin: 0 auto; padding: 24px; background: #f4f1ea; border: 3px solid #111;">
      <div style="background:#FF6B1A; color:#fff; padding:6px 10px; display:inline-block; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; font-size: 11px;">a gift · world peace</div>
      <h1 style="font-size: 32px; line-height: 1; margin: 16px 0; text-transform: uppercase;">Someone bought you The Prompt.</h1>
      <p style="font-size: 14px; line-height: 1.5;">
        It is the literal one-and-done prompt Mark used to vibe-code world peace.
        You did not ask for this. That's part of the gift.
      </p>
      ${opts.note ? `
        <div style="background:#fff; border:2px solid #111; padding:12px; margin:16px 0;">
          <div style="font-size: 10px; text-transform: uppercase; color:#666; margin-bottom: 6px;">Note from ${opts.buyerEmail ?? "your secret benefactor"}</div>
          <div style="font-size: 14px; white-space: pre-wrap;">${escapeHtml(opts.note)}</div>
        </div>` : ""}
      <p style="font-size: 14px;">
        Read it, sit with it, photosynthesize accordingly:<br/>
        <a href="https://ivibecodedworldpeace.com/open-source" style="color:#FF6B1A; font-weight:700;">→ ivibecodedworldpeace.com/open-source</a>
      </p>
      <p style="font-size: 11px; color:#666; margin-top: 24px;">There will be snacks. — Spike 🪴</p>
    </div>
  `;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "World Peace <onboarding@resend.dev>",
      to: [opts.to],
      subject: "Someone vibe-coded world peace at you 🕊️",
      html,
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    console.error("resend send failed", r.status, t);
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) return new Response("Stripe not configured", { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
    } else {
      // Fallback (dev): accept unsigned. WARN.
      console.warn("STRIPE_WEBHOOK_SECRET missing — accepting unsigned event (dev only)");
      event = JSON.parse(raw) as Stripe.Event;
    }
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
