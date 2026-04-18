import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <PageShell>
      <section className="container py-20 md:py-32 text-center max-w-2xl">
        <p className="font-display text-9xl md:text-[12rem] leading-none text-primary">404</p>
        <h1 className="font-display uppercase text-3xl md:text-5xl mt-4">This page is at peace.</h1>
        <p className="font-mono text-muted-foreground mt-4">
          It chose a quieter life elsewhere. We respect that. So should you.
        </p>
        <Link to="/"><Button className="mt-8 brutal-border brutal-shadow bg-mustard text-mustard-foreground font-display uppercase">Back to the Globe</Button></Link>
      </section>
    </PageShell>
  );
};

export default NotFound;
