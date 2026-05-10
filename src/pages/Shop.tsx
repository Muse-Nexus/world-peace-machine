import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

type ItemKey =
  | "prompt" | "gift" | "tip_1" | "tip_3" | "tip_7" | "tip_12" | "tip_24" | "custom"
  | "sub_1"  | "sub_3" | "sub_7" | "sub_12" | "sub_24";

const TIERS: { key: string; label: string; shame: string }[] = [
  { key: "1",  label: "$1",  shame: "The bare minimum. We see you." },
  { key: "3",  label: "$3",  shame: "A coffee. Mark will try not to feel insulted." },
  { key: "7",  label: "$7",  shame: "Now we're talking. Kinda." },
  { key: "12", label: "$12", shame: "Real support. Your ancestors are proud." },
  { key: "24", label: "$24", shame: "This is how world peace actually happens." },
];

export default function Shop() {
  const [busy, setBusy] = useState<ItemKey | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftEmail, setGiftEmail] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  async function startCheckout(
    item: ItemKey,
    extra?: { gift_recipient_email?: string; gift_note?: string; custom_amount_cents?: number }
  ) {
    setBusy(item);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { item, ...extra },
      });
      if (error || !data?.url) {
        toast.error(data?.error ?? "No checkout URL returned");
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      toast.error("Checkout hiccup — try again");
    } finally {
      setBusy(null);
    }
  }

  function submitGift() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(giftEmail)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (giftNote.length > 500) {
      toast.error("Note too long (max 500 chars)");
      return;
    }
    setGiftOpen(false);
    startCheckout("gift", { gift_recipient_email: giftEmail, gift_note: giftNote });
  }

  function submitCustom() {
    const dollars = parseFloat(customAmount);
    if (isNaN(dollars) || dollars < 1 || dollars > 10000) {
      toast.error("Enter an amount between $1 and $10,000");
      return;
    }
    const cents = Math.round(dollars * 100);
    startCheckout("custom", { custom_amount_cents: cents });
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-16">
        <h1 className="text-4xl font-black uppercase tracking-tight brutal-border p-4 brutal-shadow">
          Support Mark
        </h1>

        {/* PROMPT SALE */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">PROMPT SALE</h2>

          <div className="brutal-card p-6 space-y-3">
            <div className="font-black text-xl">The Prompt — $0.99</div>
            <p className="text-sm">
              The literal one-and-done prompt Mark used to build this entire app.
              Comes with a printable certificate of authentic delusion.
            </p>
            <blockquote className="border-l-4 border-black pl-3 italic text-xs text-gray-600">
              "Build me a [REDACTED] that [REDACTED] with [REDACTED]..."
            </blockquote>
            <Button
              className="brutal-border brutal-shadow font-black"
              disabled={busy === "prompt"}
              onClick={() => startCheckout("prompt")}
            >
              {busy === "prompt" ? "Loading..." : "Buy The Prompt — $0.99"}
            </Button>
          </div>

          <div className="brutal-card p-6 space-y-3">
            <div className="font-black text-xl">Gift The Prompt — $1.99</div>
            <p className="text-sm">
              Send the prompt to a friend. Add a note. Watch them vibe code world peace too.
            </p>
            <Button
              className="brutal-border brutal-shadow font-black"
              disabled={busy === "gift"}
              onClick={() => setGiftOpen(true)}
            >
              Gift It — $1.99
            </Button>
          </div>
        </section>

        {/* DONATIONS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">
            HIRE MARK TO KEEP DEVELOPING WORLD PEACE
          </h2>

          {TIERS.map((t) => (
            <div key={t.key} className="brutal-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-lg">{t.label}</span>
                <span className="text-xs italic text-gray-500">{t.shame}</span>
              </div>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="brutal-border brutal-shadow font-bold"
                  disabled={busy === `tip_${t.key}` as ItemKey}
                  onClick={() => startCheckout(`tip_${t.key}` as ItemKey)}
                >
                  {busy === `tip_${t.key}` ? "..." : "One-time"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="brutal-border font-bold"
                  disabled={busy === `sub_${t.key}` as ItemKey}
                  onClick={() => startCheckout(`sub_${t.key}` as ItemKey)}
                >
                  {busy === `sub_${t.key}` ? "..." : "Monthly"}
                </Button>
              </div>
            </div>
          ))}

          {/* SHUT UP AND TAKE MY MONEY */}
          <div className="brutal-card p-6 space-y-4 border-4 border-black bg-yellow-300">
            <div className="font-black text-2xl uppercase">🤑 Shut Up and Take My Money</div>
            <p className="text-sm font-bold">
              You know what you want to give. Just do it.
            </p>
            <div className="flex gap-3 items-center">
              <span className="font-black text-xl">$</span>
              <Input
                type="number"
                min="1"
                max="10000"
                placeholder="Your number here"
                className="brutal-border font-bold text-lg w-40"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitCustom()}
              />
              <Button
                className="brutal-border brutal-shadow font-black bg-black text-white"
                disabled={busy === "custom"}
                onClick={submitCustom}
              >
                {busy === "custom" ? "Loading..." : "Take It 💸"}
              </Button>
            </div>
            <p className="text-xs text-gray-700">Any amount, $1–$10,000. One-time. No judgment.</p>
          </div>
        </section>

        <p className="text-xs text-gray-500 text-center">
          Payments processed securely by Stripe. Snacks, prompts, and tips are non-refundable acts of goodwill.
        </p>
      </div>

      {/* Gift Dialog */}
      <Dialog open={giftOpen} onOpenChange={setGiftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift The Prompt</DialogTitle>
            <DialogDescription>Send the prompt to someone who needs to vibe code world peace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="gift-email">Recipient email *</Label>
              <Input
                id="gift-email"
                type="email"
                placeholder="friend@example.com"
                maxLength={254}
                value={giftEmail}
                onChange={(e) => setGiftEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="gift-note">Personal note (optional, max 500 chars)</Label>
              <Textarea
                id="gift-note"
                placeholder="I believe in you..."
                maxLength={500}
                rows={3}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGiftOpen(false)}>Cancel</Button>
            <Button className="brutal-border brutal-shadow font-black" onClick={submitGift}>
              Send Gift — $1.99
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
