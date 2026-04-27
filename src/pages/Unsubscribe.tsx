import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "invalid" }
  | { kind: "already" }
  | { kind: "ready" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setState({ kind: "missing" });
      return;
    }
    setToken(t);
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(t)}`,
          { headers: { apikey: SUPABASE_ANON } },
        );
        const data = await res.json();
        if (!res.ok) {
          setState({ kind: "invalid" });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ kind: "already" });
          return;
        }
        setState({ kind: "ready" });
      } catch {
        setState({ kind: "error", message: "Couldn't reach the server." });
      }
    })();
  }, []);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } },
      );
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") {
        setState({ kind: "done" });
      } else {
        setState({ kind: "error", message: "Something went sideways." });
      }
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Failed to unsubscribe.",
      });
    }
  };

  return (
    <PageShell>
      <section className="container py-16 md:py-24 max-w-xl">
        <div className="space-y-2 mb-8">
          <span className="brutal-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">
            inbox · exit
          </span>
          <h1 className="font-display uppercase text-4xl md:text-5xl leading-none tracking-tighter">
            Unsubscribe
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            No hard feelings. We'll stop emailing this address.
          </p>
        </div>

        <div className="brutal-card space-y-4">
          {state.kind === "loading" && (
            <p className="font-mono text-sm">Checking your link…</p>
          )}
          {state.kind === "missing" && (
            <p className="font-mono text-sm">
              No token in the URL. Use the unsubscribe link from the email.
            </p>
          )}
          {state.kind === "invalid" && (
            <p className="font-mono text-sm">
              This link is invalid or expired. If you keep getting emails, reply
              with "STOP" and a real human will sort it.
            </p>
          )}
          {state.kind === "already" && (
            <p className="font-mono text-sm">
              You're already off the list. Peace.
            </p>
          )}
          {state.kind === "ready" && (
            <>
              <p className="font-mono text-sm">
                Click below to confirm. We'll suppress your address immediately.
              </p>
              <Button
                onClick={confirm}
                className="brutal-border bg-primary text-primary-foreground font-display uppercase w-full"
              >
                Confirm Unsubscribe
              </Button>
            </>
          )}
          {state.kind === "submitting" && (
            <p className="font-mono text-sm">Removing you from the list…</p>
          )}
          {state.kind === "done" && (
            <p className="font-mono text-sm">
              Done. You're suppressed. Go touch grass.
            </p>
          )}
          {state.kind === "error" && (
            <p className="font-mono text-sm text-destructive">
              {state.message}
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Unsubscribe;