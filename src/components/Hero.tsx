export default function Hero() {
  return (
    <section id="home" className="bg-navy text-white">
      <div className="mx-auto grid max-w-container items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-28">
        {/* Left: copy */}
        <div>
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
            New York Immigration Coalition
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
            Uniting immigrants, members, and allies so all New Yorkers can
            thrive.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
            For over 39 years, the NYIC has organized New York's immigrant
            communities to advance policy, build power, and deliver positive
            change.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#gala"
              className="rounded-lg bg-brand-red px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-redHover"
            >
              Join the 2026 Gala
            </a>
            <a
              href="#about"
              className="rounded-lg border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              About our work
            </a>
          </div>
        </div>

        {/* Right: video placeholder */}
        <div className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
          <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-300/60 bg-gradient-to-br from-slate-50 to-indigo-200 px-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-300/50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#475199">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-slate-900">
              Gala 2026 Promo Video
            </p>
            <p className="mt-3 max-w-xs text-sm text-slate-600">
              Drop your marketing video here to promote the This Is Our New York
              2026 Gala.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Drop video file here later
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
