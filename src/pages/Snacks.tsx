import { PageShell } from "@/components/PageShell";

const market = [
  { item: "Funyuns (1 bag)", price: "8 🍿", trend: "▲ +24%", note: "trading HIGH" },
  { item: "Haircut", price: "1 🍿 + tip", trend: "→", note: "tip your barber, real ones" },
  { item: "Hand-written letter", price: "3 🍿", trend: "▲ +12%", note: "rare goods" },
  { item: "Listening for 20 min", price: "5 🍿", trend: "▲ +40%", note: "scarce" },
  { item: "An apology", price: "4 🍿", trend: "▼ -3%", note: "should be free, but market" },
  { item: "Touching grass (1 session)", price: "0 🍿", trend: "→", note: "subsidized" },
  { item: "A solid recommendation", price: "2 🍿", trend: "▲", note: "bull run" },
  { item: "One (1) compliment", price: "1 🍿", trend: "→", note: "always in stock" },
];

const Snacks = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-8 items-end">
        <div className="space-y-3">
          <span className="brutal-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">The New Currency</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            Snacks<span className="text-primary">.</span>
          </h1>
          <p className="font-mono text-lg max-w-xl text-balance">
            Crypto was rejected on grounds of vibes. We picked Snacks instead.
            Snacks are non-fungible (unless you're hungry). They are not investment vehicles. They are vehicles for being nice.
          </p>
        </div>

        <div className="brutal-border brutal-shadow-orange bg-card p-6">
          <p className="font-display uppercase text-sm text-muted-foreground">Earnings Schedule</p>
          <ul className="mt-3 space-y-2 font-mono text-sm">
            <li>🫁 <b>Being alive</b> — 1 snack / hour</li>
            <li>💼 <b>Having a job</b> — +1 snack / hour</li>
            <li>🎓 <b>Doing training</b> — +0.5 snack / hour</li>
            <li>🫂 <b>Helping someone</b> — bonus snacks (variable)</li>
            <li>👶 <b>Raising a kid</b> — +2 snacks / hour, retroactive</li>
          </ul>
        </div>
      </div>

      {/* MARKET TICKER */}
      <div className="mt-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display uppercase text-3xl">Market Open</h2>
          <p className="font-mono text-xs text-muted-foreground">delayed 0 min · vibes-based pricing</p>
        </div>
        <div className="brutal-border brutal-shadow bg-foreground text-background overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead className="brutal-border border-x-0 border-t-0 border-background">
              <tr className="text-left">
                <th className="p-3 font-display uppercase text-mustard">Item</th>
                <th className="p-3 font-display uppercase text-mustard">Price</th>
                <th className="p-3 font-display uppercase text-mustard">Trend</th>
                <th className="p-3 font-display uppercase text-mustard">Note</th>
              </tr>
            </thead>
            <tbody>
              {market.map((m) => (
                <tr key={m.item} className="border-b border-background/20 hover:bg-primary/20">
                  <td className="p-3">{m.item}</td>
                  <td className="p-3 font-display">{m.price}</td>
                  <td className={`p-3 font-display ${m.trend.includes("▲") ? "text-mustard" : m.trend.includes("▼") ? "text-primary" : "opacity-60"}`}>{m.trend}</td>
                  <td className="p-3 text-xs opacity-80">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 brutal-border bg-secondary text-secondary-foreground p-6">
        <p className="font-display uppercase text-xl">Disclaimer.</p>
        <p className="font-mono text-sm mt-2">
          Snacks are not legal tender, securities, food, or feelings. Past kindness does not guarantee future kindness. Trade at your own table.
        </p>
      </div>
    </section>
  </PageShell>
);

export default Snacks;
