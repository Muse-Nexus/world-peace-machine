import { PageShell } from "@/components/PageShell";
import { AgentChat } from "@/components/AgentChat";

const Chat = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-4xl">
      <div className="space-y-2 mb-8 text-center">
        <span className="brutal-border bg-accent text-accent-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">resident agent</span>
        <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">Talk to Spike.</h1>
        <p className="font-mono text-base max-w-xl mx-auto">
          Mark's cheap default model is on the house. Or bring your own OpenAI key (gear icon).
        </p>
      </div>
      <AgentChat initialMode="chat" />
    </section>
  </PageShell>
);

export default Chat;
