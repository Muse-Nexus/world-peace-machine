import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";

const ShopCancel = () => (
  <PageShell>
    <section className="container py-20 max-w-2xl text-center">
      <span className="brutal-border bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-mono uppercase inline-block">no harm · no foul</span>
      <h1 className="font-display uppercase text-6xl md:text-7xl leading-none tracking-tighter mt-3">
        You bailed<span className="text-primary">.</span>
      </h1>
      <p className="font-mono mt-4">
        Respectfully — no pressure. World peace remains free. Spike still likes you.
      </p>
      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/shop" className="brutal-border bg-foreground text-background px-4 py-2 font-display uppercase">Back to shop</Link>
        <Link to="/" className="brutal-border bg-mustard text-mustard-foreground px-4 py-2 font-display uppercase">Home</Link>
      </div>
    </section>
  </PageShell>
);

export default ShopCancel;
