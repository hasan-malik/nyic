const cards = [
  { title: "Board of Directors", href: "#board" },
  { title: "Our Staff", href: "#staff" },
  { title: "Our Successes", href: "#successes" },
  { title: "Strategic Plan", href: "#strategic-plan" },
];

export default function GetToKnow() {
  return (
    <section id="about" className="bg-mist">
      <div className="mx-auto max-w-container px-6 py-20 lg:px-10">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900">
          Get to know us
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors group-hover:text-navy">
                Learn more
                <span className="transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
