import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Landmark, MapPin, Sparkles, Workflow, X } from "lucide-react";
import { Container, Eyebrow } from "../components/ui/Container";
import AudioPlayer from "../components/AudioPlayer";
import BoroughMap from "../components/maps/BoroughMap";
import StatewideMap from "../components/maps/StatewideMap";
import OriginMap from "../components/maps/OriginMap";
import { usePublishedStories } from "../lib/useStories";
import { connections } from "../lib/connections";
import { forceLayout } from "../lib/layout";
import type { Story } from "../lib/types";

type View = "threads" | "boroughs" | "statewide" | "origins";

const VIEWS: { id: View; label: string; icon: typeof Workflow; blurb: string }[] = [
  {
    id: "threads",
    label: "Threads",
    icon: Workflow,
    blurb:
      "Each star is a story. The lines are kinship — drawn by AI reading every transcript. Brighter threads mean a deeper shared experience.",
  },
  {
    id: "boroughs",
    label: "Boroughs",
    icon: MapPin,
    blurb:
      "Every neighborhood holds a voice. Click a borough to hear who chose New York there — and see where we still have gaps to fill.",
  },
  {
    id: "statewide",
    label: "State-wide",
    icon: Landmark,
    blurb:
      "NYIC is a statewide coalition. From Buffalo to Long Island, this is every voice across New York State — not just the five boroughs.",
  },
  {
    id: "origins",
    label: "Origins",
    icon: Globe2,
    blurb:
      "120+ countries, one city. Pan the map and tap a point to follow each journey home to New York.",
  },
];

const SENTIMENT_COLOR: Record<Story["sentiment"], string> = {
  hopeful: "#34d399",
  uplifting: "#fbbf24",
  bittersweet: "#818cf8",
  somber: "#fb7185",
};
const SENTIMENTS = Object.keys(SENTIMENT_COLOR) as Story["sentiment"][];

const W = 1000;
const H = 620;

export default function Constellation() {
  const stories = usePublishedStories();
  const [view, setView] = useState<View>(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    return v === "boroughs" || v === "statewide" || v === "origins"
      ? v
      : "threads";
  });
  const [filter, setFilter] = useState<Story["sentiment"] | "all">("all");
  const [selected, setSelected] = useState<Story | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  // The graph samples a legible slice (featured + a sample) so it stays fast
  // and readable even when the bank holds thousands of stories.
  const nodeStories = useMemo(() => {
    const featured = stories.filter((s) => s.featured);
    const rest = stories.filter((s) => !s.featured).slice(0, 48);
    return [...featured, ...rest];
  }, [stories]);

  const conns = useMemo(() => connections(nodeStories, 0.18), [nodeStories]);
  const positions = useMemo(
    () =>
      forceLayout(
        nodeStories.map((s) => s.id),
        conns.map((c) => ({ a: c.a.id, b: c.b.id, w: c.score })),
        W,
        H
      ),
    [nodeStories, conns]
  );

  const dim = (s: Story) => filter !== "all" && s.sentiment !== filter;

  return (
    <div className="bg-navy-ink text-white">
      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Explore the bank</Eyebrow>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {view === "threads"
                ? "Every voice. Every thread."
                : view === "boroughs"
                  ? "Every borough. Every voice."
                  : view === "statewide"
                    ? "Every corner of New York."
                    : "Every origin. One city."}
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              {VIEWS.find((v) => v.id === view)!.blurb}
            </p>
          </div>
          <Link
            to="/stories"
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            Browse as a list
          </Link>
        </div>

        {/* view switcher */}
        <div className="mt-6 inline-flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                view === v.id
                  ? "bg-white text-navy-ink"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <v.icon size={16} /> {v.label}
            </button>
          ))}
        </div>

        {view === "boroughs" && (
          <div className="mt-6">
            <BoroughMap stories={stories} />
          </div>
        )}
        {view === "statewide" && (
          <div className="mt-6">
            <StatewideMap stories={stories} />
          </div>
        )}
        {view === "origins" && (
          <div className="mt-6">
            <OriginMap stories={stories} />
          </div>
        )}

        {view === "threads" && (
          <>
        {/* filters / legend */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === "all"
                ? "bg-white text-navy-ink"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All feelings
          </button>
          {SENTIMENTS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                filter === s
                  ? "bg-white text-navy-ink"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SENTIMENT_COLOR[s] }}
              />
              {s}
            </button>
          ))}
        </div>

        {/* the map */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,#1b2a6b_0%,#0d1b4c_70%)]">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* edges */}
            {conns.map((c, i) => {
              const a = positions.get(c.a.id);
              const b = positions.get(c.b.id);
              if (!a || !b) return null;
              const active =
                hover === c.a.id ||
                hover === c.b.id ||
                (!dim(c.a) && !dim(c.b));
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#aab8ff"
                  strokeOpacity={active ? 0.15 + c.score * 0.5 : 0.04}
                  strokeWidth={0.5 + c.score * 2.5}
                />
              );
            })}

            {/* nodes */}
            {nodeStories.map((s) => {
              const p = positions.get(s.id);
              if (!p) return null;
              const color = SENTIMENT_COLOR[s.sentiment];
              const r = 7 + Math.min(8, s.nominations * 2 + s.durationSec / 60);
              const faded = dim(s);
              const isHover = hover === s.id;
              return (
                <g
                  key={s.id}
                  style={{ cursor: "pointer", opacity: faded ? 0.18 : 1 }}
                  onMouseEnter={() => setHover(s.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setSelected(s)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + (isHover ? 6 : 3)}
                    fill={color}
                    opacity={0.25}
                    filter="url(#glow)"
                  />
                  <circle cx={p.x} cy={p.y} r={r} fill={color} />
                  <circle cx={p.x} cy={p.y} r={r * 0.4} fill="#ffffff" opacity={0.9} />
                  {(isHover || s.featured) && (
                    <text
                      x={p.x}
                      y={p.y - r - 9}
                      textAnchor="middle"
                      className="fill-white text-[12px] font-semibold"
                    >
                      {s.narratorDisplay}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* selected story card */}
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 mx-auto max-w-md rounded-2xl bg-white/95 p-5 text-slate-900 shadow-2xl backdrop-blur sm:left-6 sm:right-auto">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: SENTIMENT_COLOR[selected.sentiment] }}
                />
                <span className="text-xs font-semibold capitalize text-slate-500">
                  {selected.sentiment} · {selected.origin}
                </span>
              </div>
              <p className="mt-2 text-lg font-extrabold leading-snug text-navy">
                "{selected.pullQuote}"
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {selected.narratorDisplay}
                {selected.memberOrg && ` · via ${selected.memberOrg}`}
              </p>
              <div className="mt-3">
                <AudioPlayer
                  src={selected.audioUrl}
                  durationSec={selected.durationSec}
                  compact
                />
              </div>
              <Link
                to={`/stories/${selected.id}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline"
              >
                Full story <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {/* hint */}
          <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 text-xs text-white/50">
            <Sparkles size={13} /> tap a star
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-white/50">
          showing {nodeStories.length} of {stories.length} stories ·{" "}
          {conns.length} kinship threads · powered by semantic embeddings
          (pgvector)
        </p>
          </>
        )}
      </Container>
    </div>
  );
}
