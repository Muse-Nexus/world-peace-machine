import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error("Email + 8+ char password, please."); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Welcome. Check your email if confirmation is on.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back, real one.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't auth.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <section className="container py-12 md:py-20 max-w-md">
        <div className="space-y-2 mb-8">
          <span className="brutal-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">door · auth</span>
          <h1 className="font-display uppercase text-4xl md:text-5xl leading-none tracking-tighter">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">Optional. You can do peace anonymously. Signing in just saves your snacks.</p>
        </div>

        <form onSubmit={submit} className="brutal-card space-y-4">
          <div>
            <Label className="font-mono uppercase text-xs">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="brutal-border font-mono" maxLength={254} />
          </div>
          <div>
            <Label className="font-mono uppercase text-xs">Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="brutal-border font-mono" maxLength={128} />
          </div>
          <Button type="submit" disabled={busy} className="brutal-border bg-primary text-primary-foreground font-display uppercase w-full">
            {busy ? "…" : mode === "signin" ? "Enter" : "Create Account"}
          </Button>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs font-mono underline w-full text-center">
            {mode === "signin" ? "Need an account? Sign up." : "Already a real one? Sign in."}
          </button>
        </form>
      </section>
    </PageShell>
  );
};

export default Auth;
