import { useMemo, useState } from "react";
import {
  Film,
  Instagram,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { PageHeader } from "./Dashboard";
import { useStories } from "../../lib/useStories";
import { store } from "../../lib/store";
import type { Story } from "../../lib/types";

export default function Activation() {
  const stories = useStories().filter((s) => s.status === "published");
  const featured = stories.find((s) => s.featured);

  const setFeatured = (s: Story) => {
    stories.forEach((x) => {
      if (x.featured && x.id !== s.id) store.update(x.id, { featured: false });
    });
    store.update(s.id, { featured: true });
  };

  const queueAnimation = (s: Story) => {
    store.update(s.id, {
      animationStatus: s.animationStatus === "none" ? "queued" : "rendered",
    });
  };

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Activation"
        subtitle="Turn stories into action. Match the right voice to a moving bill, feature one a day, queue a Runway animation, and schedule it to Instagram + LinkedIn via Publer."
      />

      {/* advocacy story-match — "find the right story when a bill is moving" */}
      <AdvocacyMatch stories={stories} />

      {/* daily feature spotlight */}
      {featured && (
        <div className="mt-6 grid gap-6 rounded-2xl border border-slate-200 bg-navy p-6 text-white lg:grid-cols-[1fr_1.4fr]">
          <div className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/25 bg-gradient-to-br from-white/10 to-white/0 text-center">
            <Film size={36} className="text-brand-gold" />
            <p className="mt-3 px-6 text-sm text-white/70">
              {featured.animationStatus === "rendered"
                ? "Runway animation rendered ✓"
                : "Runway animation: drop render here"}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold text-brand-gold">
              <Sparkles size={13} /> Story of the day
            </span>
            <p className="mt-3 text-2xl font-extrabold leading-snug">
              "{featured.pullQuote}"
            </p>
            <p className="mt-2 text-sm text-white/70">
              {featured.narratorDisplay} · {featured.location} · from{" "}
              {featured.origin}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-white/90">
                <Instagram size={16} /> Schedule to Instagram
              </button>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80">
                via Publer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* selection table */}
      <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-slate-400">
        Choose stories to animate & feature
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Story</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">
                Sentiment
              </th>
              <th className="px-5 py-3 font-semibold">Runway</th>
              <th className="px-5 py-3 font-semibold">Feature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stories.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <p className="font-semibold text-slate-900">
                    {s.narratorDisplay}
                  </p>
                  <p className="line-clamp-1 max-w-xs text-xs text-slate-500">
                    "{s.pullQuote}"
                  </p>
                </td>
                <td className="hidden px-5 py-3 capitalize text-slate-600 md:table-cell">
                  {s.sentiment}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => queueAnimation(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      s.animationStatus === "rendered"
                        ? "bg-emerald-100 text-emerald-700"
                        : s.animationStatus === "queued"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Wand2 size={13} />
                    {s.animationStatus === "rendered"
                      ? "Rendered"
                      : s.animationStatus === "queued"
                        ? "Queued"
                        : "Queue render"}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setFeatured(s)}
                    aria-label="Feature story"
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      s.featured
                        ? "bg-brand-gold/20 text-amber-800"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Star
                      size={13}
                      fill={s.featured ? "currentColor" : "none"}
                    />
                    {s.featured ? "Featured" : "Feature"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * "A bill is moving" — semantic-ish match of consented stories to a campaign.
 * In live mode this is a pgvector similarity search; here it's keyword/theme
 * overlap. Crucially, it only surfaces stories whose teller set the consent
 * dial to allow campaign use — agency, not extraction.
 */
function AdvocacyMatch({ stories }: { stories: Story[] }) {
  const [query, setQuery] = useState("language access bill");
  const eligible = stories.filter((s) => s.consent.allowCampaignUse);

  const matches = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    return eligible
      .map((s) => {
        const hay = `${s.transcript} ${s.summary} ${s.tags
          .map((t) => t.label)
          .join(" ")}`.toLowerCase();
        const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
        return { s, score };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [query, eligible]);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-red text-white">
          <Megaphone size={15} />
        </span>
        A bill is moving — find the right voice
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Search the consented bank by theme. The consent dial (set in Doorway 4)
        governs the reciprocal ask — we request inclusion, never assume it.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-mist p-1.5">
        <Search size={18} className="ml-2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. language access, detention, small business relief…"
          className="flex-1 bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-3">
        {matches.length === 0 && (
          <p className="text-sm text-slate-400">
            No consented stories match yet. Try another theme.
          </p>
        )}
        {matches.map(({ s }) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                "{s.pullQuote}"
              </p>
              <p className="text-xs text-slate-500">
                {s.narratorDisplay} · {s.origin} ·{" "}
                {s.tags
                  .slice(0, 3)
                  .map((t) => t.label)
                  .join(", ")}
              </p>
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-deep">
              <ShieldCheck size={14} /> Request inclusion
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
