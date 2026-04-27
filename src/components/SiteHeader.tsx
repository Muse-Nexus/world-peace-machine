import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/manifesto", label: "Manifesto" },
  { to: "/synthesism", label: "Synthesism" },
  { to: "/snacks", label: "Snacks" },
  { to: "/neighbors", label: "Neighbors" },
  { to: "/blog", label: "Blog" },
  { to: "/slacktivate", label: "Slacktivate" },
  { to: "/chat", label: "Spike" },
  { to: "/shop", label: "Support" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { user, loading } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out. Snacks remain yours in spirit.");
  };

  const emailShort = user?.email
    ? user.email.length > 18
      ? user.email.slice(0, 16) + "…"
      : user.email
    : "";

  return (
    <header className="sticky top-0 z-50 official-border border-x-0 border-t-0 bg-background/95 backdrop-blur">
      {/* Official-looking badge bar */}
      <div className="bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest text-center py-1">
        Official-ish · v.2 · "cause v.1 was ugly af" · snacks &amp; kindness are legal tender
      </div>
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="seal w-10 h-10 text-[10px]" aria-hidden>
            ✶
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display uppercase text-sm tracking-tight">
              I Vibe Coded <span className="text-primary">World Peace</span>
            </span>
            <span className="text-[9px] font-mono uppercase text-muted-foreground tracking-widest">we hacked harmony · open-sourced</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-coral hover:text-coral-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          {!loading && (
            user ? (
              <div className="ml-2 flex items-center gap-1">
                <span className="official-border bg-mustard text-mustard-foreground px-2 py-1 text-[10px] font-mono uppercase tracking-wider" title={user.email ?? ""}>
                  {emailShort}
                </span>
                <button
                  onClick={signOut}
                  className="official-border bg-card text-foreground px-2 py-1 text-[10px] font-mono uppercase tracking-wider hover:bg-coral hover:text-coral-foreground transition-colors flex items-center gap-1"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3 w-3" /> Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-2 official-border bg-mustard text-mustard-foreground px-3 py-1 text-xs font-mono uppercase tracking-wider hover:bg-coral hover:text-coral-foreground transition-colors"
              >
                Sign In
              </Link>
            )
          )}
        </nav>

        <button
          className="lg:hidden official-border p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden official-border border-x-0 border-b-0 bg-card">
          <div className="container py-2 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`px-2 py-2 text-sm font-mono uppercase ${
                  loc.pathname === n.to ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {n.label}
              </Link>
            ))}
            {!loading && (
              user ? (
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="px-2 py-2 text-sm font-mono uppercase text-left border-t border-border mt-1"
                >
                  Sign Out ({emailShort})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="px-2 py-2 text-sm font-mono uppercase bg-mustard text-mustard-foreground border-t border-border mt-1"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};
