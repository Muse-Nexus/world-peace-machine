import { PageShell } from "@/components/PageShell";
import { useState } from "react";

const isms = [
  ["Optimism", "Yes. Obviously. The lights are on.", "☀️"],
  ["Realism", "Also yes. The dishes are still there.", "🍽️"],
  ["Pacifism", "Loudly yes. With caveats only for board games.", "🕊️"],
  ["Pragmatism", "Yes — start with what you have, even if what you have is one snack.", "🛠️"],
  ["Humanism", "Yes, but extend the membership card to dogs.", "🐕"],
  ["Minimalism", "Yes about possessions, no about feelings.", "📦"],
  ["Maximalism", "Yes about feelings, no about possessions.", "💥"],
  ["Absurdism", "Yes — peace is funny and that's allowed.", "🤡"],
  ["Stoicism", "Yes about your reactions, no about your hugs.", "🗿"],
  ["Hedonism", "Conditionally yes. Snacks count.", "🍿"],
  ["Romanticism", "Approved if you also do the dishes.", "🌹"],
  ["Surrealism", "Welcomed. Renw is technically a houseplant.", "🪴"],
];

const Synthesism = () => {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-2 space-y-3">
            <span className="official-border bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">The New Ism · Mascot Approved</span>
            <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
              Synth<span className="text-coral">esism</span>
            </h1>
            <p className="font-mono text-lg max-w-xl text-balance">
              The doctrine that all isms have something useful to say if you let them sit at the same table and don't let any of them give a long speech.
              (We considered "Masterism" but it sounded like a cult and Mark already has a podcast.)
            </p>
          </div>
          <div className="official-border official-shadow bg-coral text-coral-foreground p-6 animate-wobble">
            <p className="font-display uppercase text-sm">Cult Risk</p>
            <p className="font-display text-7xl">2/10</p>
            <p className="text-xs font-mono">we wear normal clothes</p>
          </div>
        </div>

        {/* Mascot row */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="official-border bg-mustard text-mustard-foreground p-5">
            <p className="text-5xl">🪴</p>
            <p className="font-display uppercase text-lg mt-2">Mascot: Renw</p>
            <p className="text-xs font-mono mt-1">Houseplant. Photosynthesizes feelings.</p>
          </div>
          <div className="official-border bg-card p-5">
            <p className="text-5xl">🤝</p>
            <p className="font-display uppercase text-lg mt-2">Handshake</p>
            <p className="text-xs font-mono mt-1">Two hands, one snack between them.</p>
          </div>
          <div className="official-border bg-primary text-primary-foreground p-5">
            <p className="text-5xl">🎺</p>
            <p className="font-display uppercase text-lg mt-2">Anthem</p>
            <p className="text-xs font-mono mt-1">A respectful three-second hum. That's it.</p>
          </div>
        </div>

        <p className="font-display uppercase text-2xl mt-14 mb-4">Pick an ism. We synthesize it.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {isms.map(([name, take, emoji], i) => (
            <button
              key={name}
              onClick={() => setPicked(i)}
              className={`text-left official-border p-5 transition-all ${
                picked === i
                  ? "bg-coral text-coral-foreground translate-x-1 translate-y-1 official-shadow-sm"
                  : "bg-card hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <p className="text-2xl mb-1">{emoji}</p>
              <p className="font-display uppercase text-xl">{name}</p>
              <p className="font-mono text-sm mt-1">{take}</p>
            </button>
          ))}
        </div>

        {picked !== null && (
          <div className="mt-8 official-border bg-foreground text-background p-6 official-shadow-coral animate-fade-in">
            <p className="text-xs font-mono uppercase text-coral">Synthesism says:</p>
            <p className="font-display uppercase text-2xl mt-1">
              We kept the part of {isms[picked][0]} that makes you nicer to your neighbor.
              The rest is in the recycling.
            </p>
          </div>
        )}

        <div className="mt-12 official-border bg-primary text-primary-foreground p-8 official-shadow-coral">
          <p className="font-display uppercase text-xl text-coral mb-2">Founding Principle</p>
          <p className="font-display uppercase text-3xl md:text-4xl leading-tight text-balance">
            "Every ism was right about one thing and wrong about three. Synthesism keeps the ones."
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Synthesism;
