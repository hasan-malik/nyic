import { DollarSign } from "lucide-react";
import { PageHeader } from "./Dashboard";
import { useStories } from "../../lib/useStories";

// Per-stage economics. "list" = public price; "cost" = what NYIC actually pays
// (transcription is $0 because it's covered by ElevenLabs hackathon/credit plan;
// Supabase free tier covers storage + DB at this scale).
const ROWS = [
  {
    stage: "Transcribe",
    model: "ElevenLabs Scribe",
    listCents: 3.3,
    costCents: 0,
    note: "Covered by ElevenLabs credits (list ≈ $0.40/hr audio)",
  },
  {
    stage: "Care check",
    model: "Claude Haiku",
    listCents: 0.4,
    costCents: 0.4,
    note: "~1k in / 200 out tokens per story",
  },
  {
    stage: "Tag + summarize",
    model: "Claude Sonnet",
    listCents: 1.6,
    costCents: 1.6,
    note: "Themes, emotion, pull-quote, one-line summary",
  },
  {
    stage: "Embed",
    model: "OpenAI text-embedding-3-small",
    listCents: 0.1,
    costCents: 0.1,
    note: "Powers search + Belonging Circles",
  },
  {
    stage: "Store + serve",
    model: "Supabase (Postgres + Storage)",
    listCents: 0.2,
    costCents: 0,
    note: "Free tier covers demo scale; ~$25/mo Pro at full scale",
  },
];

const fmtBig = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CostBreakdown() {
  const stories = useStories();
  const n = stories.length;

  const listPer = ROWS.reduce((s, r) => s + r.listCents, 0);
  const costPer = ROWS.reduce((s, r) => s + r.costCents, 0);
  const archiveTotal = n * costPer;

  const projections = [
    { label: "This archive", count: n },
    { label: "10,000 stories", count: 10000 },
    { label: "40,000 ('40 Years, 40,000 Stories')", count: 40000 },
  ];

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Cost & budget"
        subtitle="Full transparency on what the AI pipeline costs NYIC — itemized per story and projected to scale. Built for a nonprofit budget."
      />

      {/* headline */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Big label="Cost per story (NYIC)" value={`${costPer.toFixed(1)}¢`} sub={`list price ≈ ${listPer.toFixed(1)}¢`} />
        <Big label={`Total for ${n.toLocaleString()} stories`} value={fmtBig(archiveTotal)} sub="and growing" />
        <Big
          label="NY Proud campaign budget"
          value="$150,000"
          sub="billboards · subway · PR"
          accent
        />
      </div>

      {/* per-stage table */}
      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">
        Per-story breakdown
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Model</th>
              <th className="hidden px-5 py-3 text-right font-semibold sm:table-cell">
                List / story
              </th>
              <th className="px-5 py-3 text-right font-semibold">NYIC / story</th>
              <th className="hidden px-5 py-3 text-right font-semibold md:table-cell">
                × {n.toLocaleString()}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ROWS.map((r) => (
              <tr key={r.stage} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <p className="font-semibold text-slate-900">{r.stage}</p>
                  <p className="text-xs text-slate-400">{r.note}</p>
                </td>
                <td className="px-5 py-3 text-slate-600">{r.model}</td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-slate-400 line-through sm:table-cell">
                  {r.listCents.toFixed(1)}¢
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-900">
                  {r.costCents === 0 ? (
                    <span className="text-emerald-600">$0</span>
                  ) : (
                    `${r.costCents.toFixed(1)}¢`
                  )}
                </td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-slate-600 md:table-cell">
                  {fmtBig(r.costCents * n)}
                </td>
              </tr>
            ))}
            <tr className="bg-emerald-50 font-bold text-emerald-900">
              <td className="px-5 py-3" colSpan={3}>
                Total
              </td>
              <td className="px-5 py-3 text-right tabular-nums">
                {costPer.toFixed(1)}¢
              </td>
              <td className="hidden px-5 py-3 text-right tabular-nums md:table-cell">
                {fmtBig(archiveTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Token-based estimates at current Anthropic/OpenAI list prices for a
        ~5-minute story. Transcription shows $0 because ElevenLabs credits cover
        it; list price is struck through for honesty.
      </p>

      {/* projections */}
      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-400">
        Projected at scale
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {projections.map((p) => (
          <div
            key={p.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{p.label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">
              {fmtBig(p.count * costPer)}
            </p>
            <p className="text-xs text-slate-400">
              {p.count.toLocaleString()} stories × {costPer.toFixed(1)}¢
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <DollarSign className="mt-0.5 shrink-0" size={18} />
        <p>
          Even at <strong>40,000 stories</strong> — NYIC's own "40 Years, 40,000
          Stories" vision — the entire AI pipeline costs{" "}
          <strong>{fmtBig(40000 * costPer)}</strong>, about{" "}
          <strong>{((40000 * costPer) / 100 / 150000 * 100).toFixed(2)}%</strong>{" "}
          of a single NY Proud campaign budget. One part-time coordinator + the
          volunteer network does the rest.
        </p>
      </div>
    </div>
  );
}

function Big({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-slate-200 bg-slate-900 text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className={`text-sm ${accent ? "text-white/60" : "text-slate-500"}`}>
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
      <p className={`text-xs ${accent ? "text-white/50" : "text-slate-400"}`}>
        {sub}
      </p>
    </div>
  );
}
