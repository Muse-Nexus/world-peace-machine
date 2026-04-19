import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

/**
 * PledgeNag — forced-on-you pledge popups.
 * Pops up every ~45s on most pages. Sometimes from a corner, sometimes a banner.
 * Dismissible. Resurfaces. Because peace requires nagging.
 */

const PLEDGES = [
  { text: "Pledge: I will not bicker today.", to: "/no-bickering", emoji: "🤐" },
  { text: "Pledge: No nukes. Like, ever.", to: "/no-nukes", emoji: "🚫" },
  { text: "Pledge: Talk to a neighbor (not Esther).", to: "/neighbors", emoji: "🏡" },
  { text: "Pledge: Tip in snacks today.", to: "/snacks", emoji: "🍿" },
  { text: "Pledge: Send Renw a kind word.", to: "/chat", emoji: "🪴" },
  { text: "Pledge: War is dumb. Sign the wall.", to: "/no-nukes", emoji: "🕊️" },
];

const SUPPRESS_PATHS = ["/auth"];
const STORAGE_KEY = "ivcwp_pledge_last_dismiss";

export const PledgeNag = () => {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [pledge, setPledge] = useState(PLEDGES[0]);

  useEffect(() => {
    if (SUPPRESS_PATHS.includes(loc.pathname)) return;

    const lastDismiss = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
    const sinceDismiss = Date.now() - lastDismiss;
    const initialDelay = Math.max(8000, 30000 - sinceDismiss); // first nag faster if user hasn't dismissed recently

    const showOne = () => {
      setPledge(PLEDGES[Math.floor(Math.random() * PLEDGES.length)]);
      setOpen(true);
    };

    const t1 = setTimeout(showOne, initialDelay);
    const interval = setInterval(showOne, 45000);

    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [loc.pathname]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[60] max-w-sm official-border bg-card official-shadow-coral animate-fade-in"
      style={{ animation: "float-up 0.4s ease-out, pulse-coral 2s ease-in-out infinite" }}
    >
      <div className="bg-coral text-coral-foreground px-3 py-1 flex items-center justify-between official-border border-x-0 border-t-0">
        <span className="text-[10px] font-mono uppercase tracking-widest">Forced Pledge™ · sorry not sorry</span>
        <button onClick={dismiss} aria-label="Dismiss" className="hover:bg-foreground hover:text-background px-1">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="p-4">
        <p className="font-display uppercase text-lg leading-tight">
          <span className="mr-2 text-2xl">{pledge.emoji}</span>{pledge.text}
        </p>
        <div className="flex gap-2 mt-3">
          <Link
            to={pledge.to}
            onClick={dismiss}
            className="official-border bg-primary text-primary-foreground px-3 py-1 font-display uppercase text-xs tracking-wider hover:bg-coral hover:text-coral-foreground"
          >
            Sign it →
          </Link>
          <button
            onClick={dismiss}
            className="official-border bg-card px-3 py-1 font-mono uppercase text-xs hover:bg-muted"
          >
            Maybe later (we'll ask again)
          </button>
        </div>
      </div>
    </div>
  );
};
