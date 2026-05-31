import Logo from "./Logo";

const exploreCols = [
  [
    { label: "Annual Reports", href: "#annual-reports" },
    { label: "Careers", href: "#careers" },
    { label: "Organizational Timeline", href: "#timeline" },
    { label: "Staff", href: "#staff" },
    { label: "Contact", href: "#contact" },
  ],
  [
    { label: "Board of Directors", href: "#board" },
    { label: "Gala 2026", href: "#gala" },
    { label: "Our Successes", href: "#successes" },
    { label: "Strategic Plan", href: "#strategic-plan" },
    { label: "Donate", href: "#donate" },
  ],
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy-deep text-white">
      <div className="mx-auto max-w-container px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: subscribe + contact */}
          <div>
            <Logo variant="white" />

            <h3 className="mt-8 text-2xl font-extrabold tracking-tight">
              Stay in the loop
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
              Subscribe to our email list for updates, action alerts, and
              stories from across New York.
            </p>

            <form
              className="mt-6 flex max-w-md gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-brand-red px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-redHover"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-10 space-y-1.5 text-[15px] text-white/80">
              <p>
                <a href="mailto:info@nyic.org" className="hover:text-white">
                  info@nyic.org
                </a>
              </p>
              <p>(212) 627-2227</p>
              <p>131 W 33rd St, Suite 610, New York, NY 10001</p>
            </div>
          </div>

          {/* Right: explore links */}
          <div className="lg:pl-8">
            <h3 className="text-xl font-extrabold tracking-tight">Explore</h3>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
              {exploreCols.map((col, i) => (
                <ul key={i} className="space-y-4">
                  {col.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[15px] text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-sm text-white/55">
          &copy; 2026 New York Immigration Coalition. Recreated layout for
          preview purposes.
        </div>
      </div>
    </footer>
  );
}
