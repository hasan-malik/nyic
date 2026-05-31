import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/stories" },
  { label: "Constellation", to: "/constellation" },
  { label: "Share yours", to: "/share" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[64px] max-w-container items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <Link
          to="/"
          aria-label="NYIC home"
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo variant="dark" />
          <span className="hidden text-sm font-bold text-brand-red sm:inline">
            #IChooseNY
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-8 md:flex md:gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-[15px] font-semibold transition-colors hover:text-navy ${
                      isActive ? "text-navy" : "text-slate-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/admin"
                className="text-[15px] font-semibold text-slate-400 transition-colors hover:text-slate-700"
              >
                NYIC Staff
              </Link>
            </li>
          </ul>
          <Link
            to="/share"
            className="rounded-full bg-brand-red px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-redHover"
          >
            Add your voice
          </Link>
        </nav>

        {/* mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/share"
            onClick={() => setOpen(false)}
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Add your voice
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      {open && (
        <nav className="border-t border-slate-100 bg-white md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-3 text-base font-semibold ${
                      isActive
                        ? "bg-mist text-navy"
                        : "text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-semibold text-slate-500 hover:bg-slate-50"
              >
                NYIC Staff
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
