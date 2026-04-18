import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

interface Pledge { id: string; user_id: string; body: string; created_at: string; category: string }

const schema = z.object({ body: z.string().trim().min(3).max(280) });

const PledgeWall = ({ category, title, kicker, color }: { category: "no-nukes" | "no-bickering"; title: string; kicker: string; color: string }) => {
  const { user } = useAuth();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("pledges").select("*").eq("category", category).order("created_at", { ascending: false }).limit(50);
    if (data) setPledges(data as Pledge[]);
  };
  useEffect(() => { load(); }, [category]);

  const submit = async () => {
    const parsed = schema.safeParse({ body });
    if (!parsed.success) { toast.error("Pledges are 3–280 characters."); return; }
    if (!user) { toast.error("Sign in to pledge — at /auth"); return; }
    setBusy(true);
    const { error } = await supabase.from("pledges").insert({ body: parsed.data.body, category, user_id: user.id });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setBody("");
    toast.success("Pledged. The vibes have been noted.");
    load();
  };

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-4xl">
        <div className="space-y-2">
          <span className={`brutal-border ${color} px-2 py-1 text-[10px] font-mono uppercase inline-block`}>{kicker}</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">{title}</h1>
        </div>

        <div className="mt-8 brutal-card">
          <p className="font-mono text-sm mb-2">Add your name to the wall. 280 chars. Be sincere or be funny — both work.</p>
          {!user && (
            <p className="text-xs font-mono text-muted-foreground mb-2">
              You need to <Link to="/auth" className="underline">sign in</Link> to post. (We give you a welcome snack 🍿.)
            </p>
          )}
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={280} placeholder="I pledge…" className="brutal-border font-mono" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-mono text-muted-foreground">{body.length}/280</span>
            <Button onClick={submit} disabled={busy || !user} className="brutal-border bg-primary text-primary-foreground font-display uppercase">Post Pledge</Button>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-3">
          {pledges.length === 0 && <p className="font-mono text-muted-foreground col-span-2 text-center py-8">no pledges yet. be the first real one.</p>}
          {pledges.map((p) => (
            <article key={p.id} className="brutal-border bg-card p-4 animate-fade-in">
              <p className="font-mono text-sm">{p.body}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-2 uppercase">— {new Date(p.created_at).toLocaleDateString()}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export const NoNukes = () => (
  <PledgeWall
    category="no-nukes"
    title="No Nukes."
    kicker="Pledge Wall · 001"
    color="bg-primary text-primary-foreground"
  />
);

export const NoBickering = () => (
  <PledgeWall
    category="no-bickering"
    title="No Bickering."
    kicker="Pledge Wall · 002"
    color="bg-accent text-accent-foreground"
  />
);
