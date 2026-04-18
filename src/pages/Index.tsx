import { Link } from "react-router-dom";
import { Globe3D } from "@/components/Globe3D";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="container grid lg:grid-cols-2 gap-8 py-12 lg:py-20 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="brutal-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase">v1.0 · Tuesday Build</span>
              <span className="brutal-border bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-mono uppercase">Open-Sourced</span>
              <span className="brutal-border bg-accent text-accent-foreground px-2 py-1 text-[10px] font-mono uppercase">No Nukes</span>
            </div>

            <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tighter text-balance">
              I vibe coded
              <br />
              <span className="text-primary">world peace.</span>
            </h1>

            <p className="text-lg md:text-xl font-mono text-foreground/80 max-w-xl text-balance">
              Hi. I'm Mark. I went ahead and open-sourced global harmony in a single prompt.
              You're welcome. The site you're on is both the announcement of the thing and the thing.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/manifesto">
                <Button size="lg" className="brutal-border brutal-shadow bg-primary text-primary-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display uppercase tracking-wider">
                  Read the Manifesto <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="brutal-border brutal-shadow bg-mustard text-mustard-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display uppercase tracking-wider">
                  Tip Mark in Snacks
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="ghost" className="brutal-border bg-card font-mono uppercase">
                  <Sparkles className="mr-2 h-4 w-4" /> Talk to Wren
                </Button>
              </Link>
            </div>

            <p className="text-xs font-mono text-muted-foreground pt-4 border-t-2 border-foreground/10">
              ⓘ Endorsed by: nobody yet. Pending verification by literally everyone.
            </p>
          </div>

          <div className="relative h-[500px] lg:h-[600px] brutal-border brutal-shadow-orange bg-foreground overflow-hidden animate-stamp">
            <Globe3D />
          </div>
        </div>

        {/* Marquee */}
        <div className="brutal-border border-x-0 bg-secondary text-secondary-foreground py-3 overflow-hidden">
          <div className="ticker whitespace-nowrap font-display uppercase tracking-wider text-xl flex">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="px-8">
                🍿 SNACKS ECONOMY LIVE · 🕊️ NO NUKES · 🫂 NO BICKERING · ✌️ THE VIBES ARE IMMACULATE · 🌍 WE ARE SO BACK · 🥨 FUNYUNS TRADING HIGH ·
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="container py-16 lg:py-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-7xl text-mustard">01</span>
          <h2 className="font-display uppercase text-3xl md:text-5xl">Three pillars. Real ones.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Synthesism",
              tag: "the new ism",
              body: "It synthesizes all the other isms gracefully. Less creepy than Masterism. Doesn't ask you to wear anything weird.",
              to: "/synthesism",
              color: "bg-primary text-primary-foreground",
            },
            {
              title: "Snacks",
              tag: "the new currency",
              body: "1 snack/hour just for being alive. +1/hr if you have a job. Trade for haircuts. Funyuns are trading high right now.",
              to: "/snacks",
              color: "bg-mustard text-mustard-foreground",
            },
            {
              title: "Slacktivism",
              tag: "actually fine",
              body: "Don't want to give? Cool. Pet the globe. Post a pledge. Send peace to a friend. The bar is on the floor.",
              to: "/slacktivate",
              color: "bg-accent text-accent-foreground",
            },
          ].map((p) => (
            <Link key={p.title} to={p.to} className="group">
              <article className={`brutal-border brutal-shadow ${p.color} p-6 h-full transition-all group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-none`}>
                <p className="text-[10px] font-mono uppercase opacity-80">{p.tag}</p>
                <h3 className="font-display uppercase text-3xl mt-1">{p.title}</h3>
                <p className="font-mono text-sm mt-4 leading-relaxed">{p.body}</p>
                <p className="text-xs font-mono uppercase mt-6 underline">enter →</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* MANIFESTO TEASER */}
      <section className="bg-foreground text-background py-16 lg:py-24 brutal-border border-x-0">
        <div className="container grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="brutal-border border-background bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">Manifesto · excerpt</span>
            <p className="font-display uppercase text-3xl md:text-5xl leading-tight text-balance">
              "We did not ask permission. We did not form a committee. We just decided, on a Tuesday, to be cool to each other. Forever."
            </p>
            <p className="text-sm font-mono opacity-70">— inspired by the spirit of every dreamer who ever picked up a guitar and a hopeful chord.</p>
          </div>
          <Link to="/manifesto">
            <Button size="lg" className="brutal-border border-background bg-mustard text-mustard-foreground font-display uppercase tracking-wider w-full">
              Read it all →
            </Button>
          </Link>
        </div>
      </section>

      {/* DOORS */}
      <section className="container py-16 lg:py-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-7xl text-mustard">02</span>
          <h2 className="font-display uppercase text-3xl md:text-5xl">Don't want to give? Check the doors.</h2>
        </div>
        <p className="font-mono text-muted-foreground mb-8 max-w-2xl">
          We built a bunch of pages. Most of them are super relevant. One of them is just here.
          It's okay. They all count toward something.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/no-nukes", label: "No Nukes", emoji: "🚫" },
            { to: "/no-bickering", label: "No Bickering", emoji: "🤐" },
            { to: "/validate", label: "Validate Me", emoji: "🫶" },
            { to: "/chat", label: "Talk to Wren", emoji: "🕊️" },
            { to: "/snacks", label: "Snacks Market", emoji: "🍿" },
            { to: "/synthesism", label: "Synthesism", emoji: "🌐" },
            { to: "/open-source", label: "The Prompt", emoji: "📜" },
            { to: "/shop", label: "Tip Jar", emoji: "💚" },
          ].map((d) => (
            <Link key={d.to} to={d.to} className="brutal-border bg-card p-4 hover:bg-mustard hover:text-mustard-foreground transition-colors group">
              <p className="text-3xl mb-2 group-hover:animate-wobble">{d.emoji}</p>
              <p className="font-display uppercase text-sm">{d.label}</p>
              <p className="text-[10px] font-mono opacity-60 mt-1">{d.to}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
