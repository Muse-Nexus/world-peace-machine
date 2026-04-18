import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="brutal-border border-x-0 border-b-0 bg-foreground text-background mt-20">
      <div className="bg-primary text-primary-foreground py-2 overflow-hidden brutal-border border-x-0 border-t-0">
        <div className="ticker whitespace-nowrap font-display uppercase tracking-wider text-sm flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="px-6">
              🕊️ no nukes · 🫂 no bickering · 🍿 snacks for all · 🌍 vibes immaculate · ✌️ open-sourced harmony
            </span>
          ))}
        </div>
      </div>
      <div className="container py-10 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="font-display text-2xl uppercase">I Vibe Coded World Peace</p>
          <p className="text-sm font-mono mt-2 opacity-70 max-w-md">
            An open-source act of global harmony. Built on a Tuesday. Powered by snacks.
            Currently pending verification by literally everyone.
          </p>
        </div>
        <div>
          <p className="font-display uppercase text-mustard mb-2">Doors</p>
          <ul className="text-xs font-mono space-y-1">
            <li><Link to="/manifesto" className="hover:underline">/manifesto</Link></li>
            <li><Link to="/synthesism" className="hover:underline">/synthesism</Link></li>
            <li><Link to="/snacks" className="hover:underline">/snacks</Link></li>
            <li><Link to="/no-nukes" className="hover:underline">/no-nukes</Link></li>
            <li><Link to="/no-bickering" className="hover:underline">/no-bickering</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display uppercase text-mustard mb-2">More Doors</p>
          <ul className="text-xs font-mono space-y-1">
            <li><Link to="/slacktivate" className="hover:underline">/slacktivate</Link></li>
            <li><Link to="/validate" className="hover:underline">/validate</Link></li>
            <li><Link to="/chat" className="hover:underline">/chat</Link></li>
            <li><Link to="/open-source" className="hover:underline">/open-source</Link></li>
            <li><Link to="/shop" className="hover:underline">/shop</Link></li>
          </ul>
        </div>
      </div>
      <div className="brutal-border border-x-0 border-b-0 py-3">
        <div className="container flex flex-wrap justify-between gap-2 text-[10px] font-mono uppercase opacity-60">
          <span>© 2026 Mark · vibe-coded with sincerity</span>
          <span>est. the day i felt like it · not financial advice</span>
        </div>
      </div>
    </footer>
  );
};
