import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/stories" },
  { label: "Constellation", to: "/constellation" },
  { label: "Share yours", to: "/share" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-6 lg:px-10">
        <Link to="/" aria-label="NYIC home" className="flex items-center gap-3">
          <Logo variant="dark" />
          <span className="hidden text-sm font-bold text-brand-red sm:inline">
            #IChooseNY
          </span>
        </Link>

        <nav className="flex items-center gap-8 md:gap-10">
          <ul className="hidden items-center gap-8 md:flex">
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
      </div>
    </header>
  );
}
