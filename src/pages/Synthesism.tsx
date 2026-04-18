import { PageShell } from "@/components/PageShell";

const isms = [
  ["Optimism", "Yes. Obviously. The lights are on."],
  ["Realism", "Also yes. The dishes are still there."],
  ["Pacifism", "Loudly yes. With caveats only for board games."],
  ["Pragmatism", "Yes — start with what you have, even if what you have is one snack."],
  ["Humanism", "Yes, but extend the membership card to dogs."],
  ["Minimalism", "Yes about possessions, no about feelings."],
  ["Maximalism", "Yes about feelings, no about possessions."],
  ["Absurdism", "Yes — peace is funny and that's allowed."],
  ["Stoicism", "Yes about your reactions, no about your hugs."],
  ["Hedonism", "Conditionally yes. Snacks count."],
];

const Synthesism = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-5xl">
      <div className="grid md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-2 space-y-3">
          <span className="brutal-border bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">The New Ism</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            Synth<span className="text-primary">esism</span>
          </h1>
          <p className="font-mono text-lg max-w-xl text-balance">
            The doctrine that all isms have something useful to say if you let them sit at the same table and don't let any of them give a long speech.
            (We considered "Masterism" but it sounded too much like a cult and Mark already has a podcast.)
          </p>
        </div>
        <div className="brutal-border brutal-shadow bg-mustard text-mustard-foreground p-6 animate-wobble">
          <p className="font-display uppercase text-sm">Cult Risk</p>
          <p className="font-display text-7xl">2/10</p>
          <p className="text-xs font-mono">we wear normal clothes</p>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-3">
        {isms.map(([name, take]) => (
          <div key={name} className="brutal-border bg-card p-5 hover:bg-accent hover:text-accent-foreground transition-colors">
            <p className="font-display uppercase text-xl">{name}</p>
            <p className="font-mono text-sm mt-1">{take}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 brutal-border bg-foreground text-background p-8 brutal-shadow-orange">
        <p className="font-display uppercase text-xl text-mustard mb-2">Founding Principle</p>
        <p className="font-display uppercase text-3xl md:text-4xl leading-tight text-balance">
          "Every ism was right about one thing and wrong about three. Synthesism keeps the ones."
        </p>
      </div>
    </section>
  </PageShell>
);

export default Synthesism;
