import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type ItemKey =
  | "prompt" | "gift"
  | "tip_1" | "tip_3" | "tip_7" | "tip_12" | "tip_24"
  | "sub_1" | "sub_3" | "sub_7" | "sub_12" | "sub_24";

const tiers: { amt: 1 | 3 | 7 | 12 | 24; label: string; shame: string }[] = [
  { amt: 1, label: "$1", shame: "respectfully — that won't even cover the snacks Mark ate while typing the prompt." },
  { amt: 3, label: "$3", shame: "okay, that's a coffee. unflavored. small. but we see you." },
  { amt: 7, label: "$7", shame: "now we're talking. this gets Spike a model upgrade for one (1) hour." },
  { amt: 12, label: "$12", shame: "real one alert. you have unlocked the 'has actually read the manifesto' badge in our hearts." },
  { amt: 24, label: "$24", shame: "okay you can stop now. we are out of shame for you. you are immaculate. thank you." },
];

const Shop = () => {
  const [busy, setBusy] = useState<ItemKey | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftEmail, setGiftEmail] = useState("");
  const [giftNote, setGiftNote] = useState("");

  async function startCheckout(item: ItemKey, extra?: { gift_recipient_email?: string; gift_note?: string }) {
    try {
      setBusy(item);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { item, ...extra },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      toast.error("Checkout hiccup", {
        description: e instanceof Error ? e.message : "Try again in a sec.",
      });
      setBusy(null);
    }
  }

  function submitGift(e: React.FormEvent) {
    e.preventDefault();
    const email = giftEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("That email looks sus");
      return;
    }
    if (giftNote.length > 500) {
      toast.error("Note too long (max 500)");
      return;
    }
    setGiftOpen(false);
    startCheckout("gift", { gift_recipient_email: email, gift_note: giftNote.trim() || undefined });
  }

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-5xl">
        <div className="space-y-2">
          <span className="brutal-border bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">tip jar · prompt market</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            Support Mark<span className="text-primary">.</span>
          </h1>
          <p className="font-mono text-lg max-w-2xl">
            World peace was free for you. It was not free for Mark (snacks aren't free).
          </p>
        </div>

        {/* PROMPT SALE */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="brutal-card brutal-shadow-orange">
            <p className="font-display uppercase text-sm text-muted-foreground">Item · One (1)</p>
            <h2 className="font-display uppercase text-3xl mt-1">The Prompt</h2>
            <p className="font-mono text-sm mt-2">
              The literal one-and-done prompt Mark used to vibe-code this whole apparatus.
              Open-sourced and visible at <Link to="/open-source" className="underline">/open-source</Link> — but if you want to support, you can buy a copy with a printable certificate.
            </p>
            <p className="font-display text-5xl text-primary mt-4">$0.99</p>
            <Button
              onClick={() => startCheckout("prompt")}
              disabled={busy !== null}
              className="mt-3 brutal-border bg-foreground text-background font-display uppercase w-full"
            >
              {busy === "prompt" ? "Sending you to Stripe…" : "Buy it"}
            </Button>
          </div>

          <div className="brutal-card bg-mustard text-mustard-foreground">
            <p className="font-display uppercase text-sm">Item · Gift</p>
            <h2 className="font-display uppercase text-3xl mt-1">Gift The Prompt</h2>
            <p className="font-mono text-sm mt-2">
              We send it to a friend with an optional note saying you did this. They will be confused, then delighted.
            </p>
            <p className="font-display text-5xl mt-4">$1.99</p>
            <Button
              onClick={() => setGiftOpen(true)}
              disabled={busy !== null}
              className="mt-3 brutal-border bg-foreground text-background font-display uppercase w-full"
            >
              {busy === "gift" ? "Sending you to Stripe…" : "Send it"}
            </Button>
          </div>
        </div>

        {/* DONATIONS */}
        <div className="mt-16">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-5xl text-mustard">03</span>
            <h2 className="font-display uppercase text-3xl">Hire Mark to keep developing World Peace</h2>
          </div>
          <p className="font-mono max-w-2xl">
            Like world peace? Heard. Mark's keeping it going. Donations cover tokens and snacks.
            Each tier is, lovingly, slightly more shame-y until $24 — at which point we run out of shame.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {tiers.map((t) => {
              const oneTimeKey = `tip_${t.amt}` as ItemKey;
              const monthlyKey = `sub_${t.amt}` as ItemKey;
              return (
                <div key={t.amt} className="brutal-border brutal-shadow bg-card p-4 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                  <p className="font-display text-3xl text-primary">{t.label}</p>
                  <p className="font-mono text-xs mt-2 text-foreground/80 leading-snug">{t.shame}</p>
                  <Button
                    onClick={() => startCheckout(oneTimeKey)}
                    disabled={busy !== null}
                    className="mt-3 brutal-border bg-foreground text-background font-mono text-xs w-full"
                  >
                    {busy === oneTimeKey ? "…" : "One-time"}
                  </Button>
                  <Button
                    onClick={() => startCheckout(monthlyKey)}
                    disabled={busy !== null}
                    className="mt-2 brutal-border bg-secondary text-secondary-foreground font-mono text-xs w-full"
                  >
                    {busy === monthlyKey ? "…" : "Monthly"}
                  </Button>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs font-mono text-muted-foreground">
            ⓘ Payments processed by Stripe. Currently in test mode — use card 4242 4242 4242 4242, any future date, any CVC.
          </p>
        </div>
      </section>

      <Dialog open={giftOpen} onOpenChange={setGiftOpen}>
        <DialogContent className="brutal-border">
          <DialogHeader>
            <DialogTitle className="font-display uppercase text-2xl">Gift The Prompt</DialogTitle>
            <DialogDescription className="font-mono">
              Where should we send this small chaos?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitGift} className="space-y-3">
            <div>
              <Label htmlFor="giftEmail" className="font-mono text-xs uppercase">Friend's email</Label>
              <Input
                id="giftEmail"
                type="email"
                required
                maxLength={254}
                value={giftEmail}
                onChange={(e) => setGiftEmail(e.target.value)}
                placeholder="someone@earth.org"
                className="brutal-border font-mono mt-1"
              />
            </div>
            <div>
              <Label htmlFor="giftNote" className="font-mono text-xs uppercase">Note (optional, max 500)</Label>
              <Textarea
                id="giftNote"
                maxLength={500}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="thinking of you. also world peace."
                className="brutal-border font-mono mt-1"
              />
              <p className="text-xs font-mono text-muted-foreground mt-1">{giftNote.length}/500</p>
            </div>
            <Button type="submit" className="brutal-border bg-foreground text-background font-display uppercase w-full">
              Continue to checkout · $1.99
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Shop;
