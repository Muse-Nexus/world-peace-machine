import { PageShell } from "@/components/PageShell";

const sections = [
  {
    n: "I.",
    title: "On the matter of waking up.",
    body: "Each morning is a referendum. We vote, with our shoulders, for whether to be a real one today. The motion carries by simple majority of one. Today we vote yes.",
  },
  {
    n: "II.",
    title: "On the matter of borders.",
    body: "Borders are a UI choice. They were drawn by people who were tired and we are also tired and we are allowed to redraw them, gently, with love, starting in our group chats.",
  },
  {
    n: "III.",
    title: "On the matter of weapons.",
    body: "We do not need them. We never did. The deal we made with fear was bad. We are renegotiating, in writing, here, on this page. The most important clause: we do not kill people. Not for land. Not for oil. Not for being annoying. We do not kill people. Full stop. Underline it. Make it bold. We do not kill people.",
  },
  {
    n: "IV.",
    title: "On the matter of war.",
    body: "War is dumb. We mean it like that. Not 'tragic and complex' — dumb. The kind of dumb you look back on at 3am and wince. Every war is somebody's bad Tuesday that got out of hand. We are calling it. War is dumb.",
  },
  {
    n: "V.",
    title: "On the matter of disagreement.",
    body: "Disagreement is fine. Bickering is bickering. The line between them is whether you went to bed thinking 'I want them to feel small.' If yes — apologize in the morning. If no — carry on.",
  },
  {
    n: "VI.",
    title: "On the matter of dreaming.",
    body: "Other people, before us, dreamed out loud and got mocked for it. We will not mock them. We will pick up where they set things down, and we will not insist on credit. We are just one more in the line.",
  },
  {
    n: "VII.",
    title: "On the matter of the prompt.",
    body: "World peace was vibe-coded — hacked, even — in a single prompt by Mark on a Tuesday. The prompt is open-source and lives at /open-source. You may sell it, gift it, fold it into a paper crane. The peace is not in the words. The peace is in the deciding.",
  },
];

const Manifesto = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-4xl">
      <div className="space-y-2">
        <span className="official-border bg-coral text-coral-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">Doc 001 · canonical · v.2</span>
        <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">The Manifesto</h1>
        <p className="font-mono text-muted-foreground max-w-xl">
          Seven articles. Written in the spirit of every quiet person who ever hummed a hopeful tune and meant it.
          No song lyrics borrowed. The dream is the public domain.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {sections.map((s) => (
          <article key={s.n} className="official-border official-shadow bg-card p-6 md:p-8 animate-fade-in">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl text-primary">{s.n}</span>
              <h2 className="font-display uppercase text-2xl md:text-3xl">{s.title}</h2>
            </div>
            <p className="font-mono text-base md:text-lg mt-4 leading-relaxed text-balance">{s.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 official-border bg-foreground text-background p-6 md:p-10 official-shadow-coral">
        <p className="font-display uppercase text-2xl md:text-3xl">Signed,</p>
        <p className="font-mono mt-2">Mark · vibecoding professional hobbyist · 2026</p>
        <p className="font-mono mt-1 text-xs opacity-70">co-signed by Renw (they/them), the resident houseplant, who would also like to add: hi.</p>
      </div>
    </section>
  </PageShell>
);

export default Manifesto;
