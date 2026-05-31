import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Container, Eyebrow } from "../components/ui/Container";
import StoryCard from "../components/StoryCard";
import { usePublishedStories } from "../lib/useStories";
import { tagCounts } from "../lib/analytics";

type Track = "all" | "new" | "legacy";

export default function Stories() {
  const stories = usePublishedStories();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const topTags = useMemo(() => tagCounts(stories).slice(0, 10), [stories]);

  const filtered = stories.filter((s) => {
    if (track !== "all" && s.track !== track) return false;
    if (activeTag && !s.tags.some((t) => t.label === activeTag)) return false;
    if (query) {
      const hay =
        `${s.narratorDisplay} ${s.summary} ${s.transcript} ${s.origin} ${s.location}`.toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="bg-mist">
      {/* header */}
      <section className="bg-navy text-white">
        <Container className="py-14">
          <Eyebrow>The story bank</Eyebrow>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {stories.length.toLocaleString()} voices and counting
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Forty years of New Yorkers, in their own words and languages. Search
            by feeling, theme, or moment — every story is searchable thanks to
            AI tagging and semantic embeddings.
          </p>

          <div className="mt-7 flex items-center gap-3 rounded-xl bg-white p-1.5 ring-1 ring-white/10">
            <Search size={18} className="ml-2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories — 'belonging', 'mother', 'Yemen'…"
              className="flex-1 bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </Container>
      </section>

      <Container className="py-10">
        {/* filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "new", "legacy"] as Track[]).map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                track === t
                  ? "bg-navy text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t === "all"
                ? "All voices"
                : t === "legacy"
                  ? "Legacy (40-yr history)"
                  : "New voices"}
            </button>
          ))}
          <span className="mx-2 h-6 w-px bg-slate-300" />
          {topTags.map((t) => (
            <button
              key={t.label}
              onClick={() =>
                setActiveTag(activeTag === t.label ? null : t.label)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTag === t.label
                  ? "bg-brand-red text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* count */}
        <p className="mt-6 text-sm text-slate-500">
          {filtered.length.toLocaleString()}{" "}
          {filtered.length === 1 ? "story" : "stories"}
          {filtered.length > 60 && " · showing the 60 most recent"}
        </p>

        {/* grid */}
        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, 60).map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-slate-500">
            No stories match that yet. Try clearing a filter.
          </p>
        )}
      </Container>
    </div>
  );
}
