import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
      <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-6 lg:px-10">
        <a href="#home" aria-label="NYIC home">
          <Logo variant="dark" />
        </a>

        <nav className="flex items-center gap-8 md:gap-10">
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[15px] font-semibold text-slate-900 transition-colors hover:text-navy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#donate"
            className="rounded-full bg-brand-red px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-redHover"
          >
            Donate
          </a>
        </nav>
      </div>
    </header>
  );
}
