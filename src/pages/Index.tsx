import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Globe3D } from "@/components/Globe3D";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Github, Cookie, Zap } from "lucide-react";

const HACKED_PHRASES = [
  "vibe-coded world peace",
  "hacked world peace",
  "cracked world peace",
  "open-sourced world peace",
  "shipped world peace (on a Tuesday)",
  "speedran world peace",
];

const Index = () => {
  const peaceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const blast = () => {
      const el = peaceRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      // Brutalist Peace palette: UN blue, coral, mustard, white, oxblood
      const colors = ["#1F6FEB", "#FF6B6B", "#E8B84A", "#FFFFFF", "#7A1F1F"];
      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 55,
        origin: { x, y },
        colors,
        scalar: 1.1,
        ticks: 220,
      });
      confetti({
        particleCount: 40,
        spread: 120,
        startVelocity: 35,
        origin: { x, y },
        colors,
        shapes: ["square"],
        scalar: 0.8,
      });
    };
    const t = setTimeout(blast, 1200);
    const i = setInterval(blast, 6000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, []);

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-8 py-12 lg:py-20 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="official-border bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono uppercase">v.2 · "cause v.1 was ugly af"</span>
              <span className="official-border bg-coral text-coral-foreground px-2 py-1 text-[10px] font-mono uppercase">Open-Sourced</span>
              <span className="official-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase">No Nukes</span>
              <span className="official-border bg-card px-2 py-1 text-[10px] font-mono uppercase">There Will Be Snacks</span>
            </div>

            <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tighter text-balance">
              I <span className="text-primary">vibe-coded</span>
              <br />
              world{" "}
              <span ref={peaceRef} className="relative inline-block text-coral">
                PEACE
                <span className="absolute -top-3 -right-4 text-xs font-mono text-mustard rotate-12">★</span>
              </span>
              .
            </h1>

            <p className="text-lg md:text-xl font-mono text-foreground/80 max-w-xl text-balance">
              Hi. I'm Mark. I believe the children are our future. Also, I went ahead and <span className="text-coral font-bold">hacked</span> global harmony in a single prompt.
              You're welcome. Kinda weird that nobody was doing it. If you feel like you owe me, I would like to validate that feeling.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/manifesto">
                <Button size="lg" className="official-border official-shadow bg-primary text-primary-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display uppercase tracking-wider">
                  Read the Manifesto <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="official-border official-shadow bg-coral text-coral-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display uppercase tracking-wider">
                  Tip Mark in Snacks
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="ghost" className="official-border bg-card font-mono uppercase">
                  <Sparkles className="mr-2 h-4 w-4" /> Talk to Spike 🪴
                </Button>
              </Link>
            </div>

            <p className="text-xs font-mono text-muted-foreground pt-4 border-t-2 border-foreground/10">
              ⓘ Endorsed by: nobody yet. Pending verification by literally everyone. Snacks &amp; kindness are legal tender.
            </p>
          </div>

          <div className="relative h-[500px] lg:h-[600px] official-border official-shadow-coral bg-gradient-to-b from-primary/10 to-background overflow-hidden">
            <Globe3D />
          </div>
        </div>

        {/* Marquee — hacked-world-peace ticker */}
        <div className="official-border border-x-0 bg-primary text-primary-foreground py-3 overflow-hidden">
          <div className="ticker whitespace-nowrap font-display uppercase tracking-wider text-xl flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="px-8 flex gap-8">
                {HACKED_PHRASES.map((p, j) => (
                  <span key={j}>🌍 we {p} ·</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="container py-16 lg:py-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-7xl text-coral">01</span>
          <h2 className="font-display uppercase text-3xl md:text-5xl">Three pillars. Real ones.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Synthesism",
              tag: "the new ism",
              body: "It synthesizes all the other isms gracefully. Less creepy than Masterism. Doesn't ask you to wear anything weird. Has a mascot now.",
              to: "/synthesism",
              color: "bg-primary text-primary-foreground",
            },
            {
              title: "Snacks",
              tag: "legal tender",
              body: "1 snack/hour just for being alive. +1/hr if you have a job. Trade for haircuts. Funyuns trading high. Snacks & kindness are legal tender — that's the whole point.",
              to: "/snacks",
              color: "bg-coral text-coral-foreground",
            },
            {
              title: "Slacktivism",
              tag: "actually fine",
              body: "Don't want to give? Cool. Pet the globe. Sign a pledge. Talk to a neighbor (not Esther). The bar is on the floor and the floor is heated.",
              to: "/slacktivate",
              color: "bg-mustard text-mustard-foreground",
            },
          ].map((p) => (
            <Link key={p.title} to={p.to} className="group">
              <article className={`official-border official-shadow ${p.color} p-6 h-full transition-all group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-none`}>
                <p className="text-[10px] font-mono uppercase opacity-80">{p.tag}</p>
                <h3 className="font-display uppercase text-3xl mt-1">{p.title}</h3>
                <p className="font-mono text-sm mt-4 leading-relaxed">{p.body}</p>
                <p className="text-xs font-mono uppercase mt-6 underline">enter →</p>
              </article>
            </Link>
          ))}
        </div>

        {/* Mid CTA strip — under the pillars */}
        <div className="mt-10 official-border official-shadow bg-mustard text-mustard-foreground p-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display uppercase text-xl md:text-2xl">
            Pick a door. Any door. We'll count it as activism.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/snacks">
              <Button className="official-border bg-foreground text-background hover:bg-coral hover:text-coral-foreground font-display uppercase">
                <Cookie className="mr-2 h-4 w-4" /> Claim Your Snacks
              </Button>
            </Link>
            <Link to="/validate">
              <Button variant="outline" className="official-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground font-display uppercase">
                <Heart className="mr-2 h-4 w-4" /> Validate Spike
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background py-16 lg:py-24 official-border border-x-0">
        <div className="container grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="official-border border-background bg-coral text-coral-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">Manifesto · excerpt</span>
            <p className="font-display uppercase text-3xl md:text-5xl leading-tight text-balance">
              "We did not ask permission. We did not form a committee. We just decided, on a Tuesday, to be cool to each other. Forever. Also: war is dumb."
            </p>
            <p className="text-sm font-mono opacity-70">— from the manifesto. seven articles. zero borrowed lyrics.</p>
          </div>
          <Link to="/manifesto">
            <Button size="lg" className="official-border border-background bg-coral text-coral-foreground font-display uppercase tracking-wider w-full">
              Read it all →
            </Button>
          </Link>
        </div>
      </section>

      {/* DOORS */}
      <section className="container py-16 lg:py-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-7xl text-coral">02</span>
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
            { to: "/neighbors", label: "Neighbors", emoji: "🏡" },
            { to: "/blog", label: "The Blog", emoji: "📰" },
            { to: "/validate", label: "Validate Me", emoji: "🫶" },
            { to: "/chat", label: "Talk to Spike", emoji: "🪴" },
            { to: "/snacks", label: "Snacks Market", emoji: "🍿" },
            { to: "/synthesism", label: "Synthesism", emoji: "🌐" },
            { to: "/open-source", label: "The Prompt", emoji: "📜" },
            { to: "/shop", label: "Tip Jar", emoji: "💙" },
          ].map((d) => (
            <Link key={d.to} to={d.to} className="official-border bg-card p-4 hover:bg-coral hover:text-coral-foreground transition-colors group">
              <p className="text-3xl mb-2 group-hover:animate-wobble">{d.emoji}</p>
              <p className="font-display uppercase text-sm">{d.label}</p>
              <p className="text-[10px] font-mono opacity-60 mt-1">{d.to}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL BIG CTA — multi-button blowout */}
      <section className="container pb-20">
        <div className="official-border official-shadow bg-primary text-primary-foreground p-8 md:p-12 text-center space-y-6">
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-80">⚠ this is the part where you do a thing</p>
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
            Okay. Your move.
          </h2>
          <p className="font-mono max-w-2xl mx-auto opacity-90">
            World peace is shipped. The repo is public. Mark works for snacks.
            You have approximately five (5) reasonable next actions:
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/shop">
              <Button size="lg" className="official-border bg-coral text-coral-foreground hover:bg-mustard hover:text-mustard-foreground font-display uppercase tracking-wider">
                <Heart className="mr-2 h-4 w-4" /> Tip Mark in Snacks
              </Button>
            </Link>
            <Link to="/manifesto">
              <Button size="lg" className="official-border bg-background text-foreground hover:bg-mustard hover:text-mustard-foreground font-display uppercase tracking-wider">
                <Zap className="mr-2 h-4 w-4" /> Sign the Manifesto
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" className="official-border bg-mustard text-mustard-foreground hover:bg-coral hover:text-coral-foreground font-display uppercase tracking-wider">
                <Sparkles className="mr-2 h-4 w-4" /> Talk to Spike 🪴
              </Button>
            </Link>
            <a href="https://github.com/Muse-Nexus/world-peace-machine" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="official-border bg-foreground text-background hover:bg-coral hover:text-coral-foreground font-display uppercase tracking-wider">
                <Github className="mr-2 h-4 w-4" /> Fork World Peace
              </Button>
            </a>
            <a href="https://www.markmusenexus.com" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="official-border bg-card text-foreground hover:bg-coral hover:text-coral-foreground font-display uppercase tracking-wider">
                ✦ Mark's Portfolio
              </Button>
            </a>
          </div>
          <p className="text-[10px] font-mono uppercase opacity-70 pt-4">
            doing nothing is also fine. that's slacktivism. <Link to="/slacktivate" className="underline">claim it →</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
