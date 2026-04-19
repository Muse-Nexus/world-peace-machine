import { PageShell } from "@/components/PageShell";
import { Link, useSearchParams } from "react-router-dom";

const ShopSuccess = () => {
  const [params] = useSearchParams();
  const sid = params.get("sid");

  return (
    <PageShell>
      <section className="container py-20 max-w-2xl text-center">
        <span className="brutal-border bg-primary text-primary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">paid · received · loved</span>
        <h1 className="font-display uppercase text-6xl md:text-7xl leading-none tracking-tighter mt-3">
          You did the thing<span className="text-primary">.</span>
        </h1>
        <p className="font-mono mt-4">
          Spike just teared up. Mark just exhaled. The snacks budget grew. Thank you, real one.
        </p>
        {sid && <p className="font-mono text-xs text-muted-foreground mt-2">ref: {sid.slice(0, 18)}…</p>}
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/" className="brutal-border bg-foreground text-background px-4 py-2 font-display uppercase">Home</Link>
          <Link to="/chat" className="brutal-border bg-mustard text-mustard-foreground px-4 py-2 font-display uppercase">Tell Spike</Link>
        </div>
      </section>
    </PageShell>
  );
};

export default ShopSuccess;
