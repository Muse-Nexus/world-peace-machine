import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PROMPT = `My name is Mark, a vibecoding professional hobbyist, and I have vibe-coded World Peace.
To prove it, I want to make a website to show people I did it and that they are welcome.

(…the full original prompt lives here, open-sourced under MIT-Peace, a license Mark also vibe-coded on a Tuesday.
You may copy, fork, gift, fold into a paper crane, or yell into a canyon. Attribution to "Mark, a real one" is appreciated but not required.)`;

const OpenSource = () => (
  <PageShell>
    <section className="container py-12 md:py-20 max-w-4xl">
      <div className="space-y-2">
        <span className="brutal-border bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">License · MIT-Peace</span>
        <h1 className="font-display uppercase text-5xl md:text-7xl leading-none tracking-tighter">The Prompt.</h1>
        <p className="font-mono text-lg max-w-2xl">
          World peace, source-available. Read it. Run it. Improve it. Send a pull request to your group chat.
        </p>
      </div>

      <div className="mt-10 brutal-border brutal-shadow bg-foreground text-background p-6 md:p-8 relative">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{PROMPT}</pre>
        <Button
          onClick={() => { navigator.clipboard.writeText(PROMPT); toast.success("Prompt copied. Go forth."); }}
          className="absolute top-4 right-4 brutal-border bg-mustard text-mustard-foreground font-mono text-xs"
        >
          Copy
        </Button>
      </div>

      <div className="mt-8 brutal-border bg-card p-6">
        <p className="font-display uppercase text-xl">Why open-source?</p>
        <p className="font-mono text-sm mt-2">
          Because if peace can be locked behind a paywall it isn't peace, it's a feature flag. Mark would like a feature flag for his rent, but that is a separate fundraiser at <a className="underline" href="/shop">/shop</a>.
        </p>
      </div>
    </section>
  </PageShell>
);

export default OpenSource;
