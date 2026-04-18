import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Settings } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

interface AgentIdentity { name: string; pronouns: string; backstory: string }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent`;

export const AgentChat = ({ initialMode = "chat" as "chat" | "validate" }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [identity, setIdentity] = useState<AgentIdentity | null>(null);
  const [byokOpen, setByokOpen] = useState(false);
  const [byokKey, setByokKey] = useState(() => localStorage.getItem("ivcwp_byok_key") ?? "");
  const [byokProvider, setByokProvider] = useState(() => localStorage.getItem("ivcwp_byok_provider") ?? "openai");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("agent_identity").select("*").limit(1).single().then(({ data }) => {
      if (data) setIdentity(data as AgentIdentity);
    });
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setBusy(true);

    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      };
      if (byokKey) {
        headers["x-byok-key"] = byokKey;
        headers["x-byok-provider"] = byokProvider;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: [...messages, userMsg], mode: initialMode }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Rate limited. Take a breath.");
        else if (resp.status === 402) toast.error("Out of credits. Try BYOK or wait.");
        else toast.error("Wren glitched out. Try again?");
        setBusy(false);
        return;
      }

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const js = line.slice(6).trim();
          if (js === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(js);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Network sigh.");
    } finally {
      setBusy(false);
    }
  };

  const saveByok = () => {
    localStorage.setItem("ivcwp_byok_key", byokKey);
    localStorage.setItem("ivcwp_byok_provider", byokProvider);
    toast.success(byokKey ? "BYOK saved (lives in your browser only)" : "BYOK cleared");
    setByokOpen(false);
  };

  return (
    <div className="brutal-card max-w-3xl mx-auto p-0 overflow-hidden">
      <div className="brutal-border border-x-0 border-t-0 bg-foreground text-background p-3 flex items-center justify-between">
        <div>
          <p className="font-display uppercase text-sm">
            {identity?.name ?? "Wren"} · <span className="opacity-70">{identity?.pronouns ?? "they/them"}</span>
          </p>
          <p className="text-[10px] font-mono opacity-70 max-w-md">
            {identity?.backstory ?? "loading agent…"}
          </p>
        </div>
        <button onClick={() => setByokOpen((o) => !o)} className="brutal-border bg-mustard text-mustard-foreground p-2" aria-label="BYOK settings">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {byokOpen && (
        <div className="brutal-border border-x-0 border-t-0 bg-card p-4 space-y-2 animate-fade-in">
          <p className="text-xs font-mono uppercase">Bring Your Own Key — saved in your browser only, never sent to Mark.</p>
          <div className="flex gap-2">
            <select
              value={byokProvider}
              onChange={(e) => setByokProvider(e.target.value)}
              className="brutal-border bg-background px-2 py-1 text-xs font-mono"
            >
              <option value="openai">OpenAI (gpt-4o-mini)</option>
              <option value="default">Use Mark's cheap default</option>
            </select>
            <Input
              type="password"
              placeholder="sk-..."
              value={byokKey}
              onChange={(e) => setByokKey(e.target.value)}
              className="brutal-border font-mono text-xs"
            />
            <Button onClick={saveByok} className="brutal-border bg-primary text-primary-foreground">Save</Button>
          </div>
        </div>
      )}

      <div ref={scroller} className="h-[420px] overflow-y-auto p-4 space-y-3 bg-background">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm font-mono py-12">
            <p className="text-2xl mb-2">🕊️</p>
            <p>say literally anything to {identity?.name ?? "Wren"}</p>
            <p className="text-xs opacity-60 mt-1">they're chill. probably.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`brutal-border px-3 py-2 max-w-[85%] ${
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card"
            }`}>
              <div className="prose prose-sm max-w-none text-inherit text-sm leading-snug">
                <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="brutal-border border-x-0 border-b-0 bg-card p-3 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={initialMode === "validate" ? "share a kind thought…" : "say something peaceful…"}
          className="brutal-border font-mono"
          maxLength={2000}
        />
        <Button type="submit" disabled={busy || !input.trim()} className="brutal-border bg-foreground text-background">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};
