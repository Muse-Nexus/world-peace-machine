import { PageShell } from "@/components/PageShell";
import { AgentChat } from "@/components/AgentChat";

const Validate = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-4xl">
      <div className="space-y-2 mb-8 text-center">
        <span className="brutal-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">AI · validation mode</span>
        <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">Validate Me.</h1>
        <p className="font-mono text-base max-w-xl mx-auto">
          Share a kind thought. Wren will tell you what's good about it. Sincerely. Not by reflex.
        </p>
      </div>
      <AgentChat initialMode="validate" />
    </section>
  </PageShell>
);

export default Validate;
