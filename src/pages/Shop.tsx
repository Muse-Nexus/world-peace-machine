import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const tiers = [
  { amt: 1, label: "$1", shame: "respectfully — that won't even cover the snacks Mark ate while typing the prompt." },
  { amt: 3, label: "$3", shame: "okay, that's a coffee. unflavored. small. but we see you." },
  { amt: 7, label: "$7", shame: "now we're talking. this gets Wren a model upgrade for one (1) hour." },
  { amt: 12, label: "$12", shame: "real one alert. you have unlocked the 'has actually read the manifesto' badge in our hearts." },
  { amt: 24, label: "$24", shame: "okay you can stop now. we are out of shame for you. you are immaculate. thank you." },
];

const Shop = () => {
  const stub = (what: string) => toast(
    `${what} — checkout coming soon.`,
    { description: "Stripe needs to be enabled (requires Lovable Cloud). Mark, see chat for details." }
  );

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
            <Button onClick={() => stub("Prompt $0.99")} className="mt-3 brutal-border bg-foreground text-background font-display uppercase w-full">Buy it</Button>
          </div>

          <div className="brutal-card bg-mustard text-mustard-foreground">
            <p className="font-display uppercase text-sm">Item · Gift</p>
            <h2 className="font-display uppercase text-3xl mt-1">Gift The Prompt</h2>
            <p className="font-mono text-sm mt-2">
              We send it to a friend with an optional note saying you did this. They will be confused, then delighted.
            </p>
            <p className="font-display text-5xl mt-4">$1.99</p>
            <Button onClick={() => stub("Gift $1.99")} className="mt-3 brutal-border bg-foreground text-background font-display uppercase w-full">Send it</Button>
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
            {tiers.map((t) => (
              <div key={t.amt} className="brutal-border brutal-shadow bg-card p-4 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                <p className="font-display text-3xl text-primary">{t.label}</p>
                <p className="font-mono text-xs mt-2 text-foreground/80 leading-snug">{t.shame}</p>
                <Button onClick={() => stub(`One-time ${t.label}`)} className="mt-3 brutal-border bg-foreground text-background font-mono text-xs w-full">One-time</Button>
                <Button onClick={() => stub(`Monthly ${t.label}`)} className="mt-2 brutal-border bg-secondary text-secondary-foreground font-mono text-xs w-full">Monthly</Button>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs font-mono text-muted-foreground">
            ⓘ Checkout is currently stubbed — Stripe via Lovable Payments requires Lovable Cloud (this project is on a custom Supabase). When Mark migrates, the buttons go live without a code change.
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Shop;
