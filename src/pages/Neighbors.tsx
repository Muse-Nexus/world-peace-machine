import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Heart } from "lucide-react";

interface Neighbor {
  id: string;
  name: string;
  vibe: string;
  notes: string;
  avoid: boolean;
}

const Neighbors = () => {
  const [list, setList] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("neighbors")
      .select("*")
      .order("avoid", { ascending: true })
      .then(({ data }) => {
        if (data) setList(data as Neighbor[]);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-5xl">
        <div className="space-y-2">
          <span className="official-border bg-coral text-coral-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">Field Report · vetted</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">
            You Got <span className="text-primary">Neighbors</span>.
          </h1>
          <p className="font-mono text-lg max-w-2xl">
            Go talk to them. We checked them out. Most are really nice.
            One is Esther. Heed the warnings. World peace starts at the property line.
          </p>
        </div>

        <div className="mt-10 official-border bg-mustard text-mustard-foreground p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="font-mono text-sm">
            <span className="font-display uppercase">Heads up:</span> entries marked <span className="font-bold">avoid</span> are non-negotiable.
            We tried. We really did. Just wave and keep walking.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 font-mono text-muted-foreground">Loading the cul-de-sac…</p>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {list.map((n) => (
              <article
                key={n.id}
                className={`official-border p-6 transition-transform hover:-translate-y-1 ${
                  n.avoid
                    ? "bg-destructive text-destructive-foreground official-shadow"
                    : "bg-card official-shadow"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display uppercase text-2xl">{n.name}</h2>
                  {n.avoid ? (
                    <span className="official-border border-background bg-foreground text-background px-2 py-0.5 text-[10px] font-mono uppercase">avoid</span>
                  ) : (
                    <Heart className="h-4 w-4 text-coral fill-coral" />
                  )}
                </div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-70 mt-1">{n.vibe}</p>
                <p className="font-mono text-sm mt-3 leading-relaxed">{n.notes}</p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 official-border bg-primary text-primary-foreground p-8 official-shadow-coral">
          <p className="font-display uppercase text-2xl">Action Item</p>
          <p className="font-mono mt-2">
            Pick one neighbor (not Esther). Knock. Compliment something specific.
            Offer one (1) snack. Walk away before it gets weird. You just hacked world peace at a local level.
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Neighbors;
