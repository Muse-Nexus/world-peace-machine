import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/manifesto", label: "Manifesto" },
  { to: "/synthesism", label: "Synthesism" },
  { to: "/snacks", label: "Snacks" },
  { to: "/slacktivate", label: "Slacktivate" },
  { to: "/chat", label: "Agent" },
  { to: "/shop", label: "Support" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-50 brutal-border border-x-0 border-t-0 bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="brutal-border bg-primary text-primary-foreground px-2 py-1 font-display text-sm group-hover:animate-wobble">
            IVCWP
          </span>
          <span className="hidden sm:inline font-display uppercase text-sm tracking-tight">
            I Vibe Coded <span className="text-primary">World Peace</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "hover:bg-mustard hover:text-mustard-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden brutal-border p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden brutal-border border-x-0 border-b-0 bg-card">
          <div className="container py-2 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`px-2 py-2 text-sm font-mono uppercase ${
                  loc.pathname === n.to ? "bg-foreground text-background" : ""
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
