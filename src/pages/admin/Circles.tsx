import { useMemo, useState } from "react";
import { CalendarHeart, Check, Sparkles, Users2 } from "lucide-react";
import { PageHeader } from "./Dashboard";
import { useStories } from "../../lib/useStories";
import { belongingCircles, connections } from "../../lib/connections";
import type { Connection } from "../../lib/connections";
import TagChip from "../../components/TagChip";
import type { Story } from "../../lib/types";

const PALETTE = ["#1c3aa8", "#e0492f", "#0ea5e9", "#10b981", "#f0b429", "#8b5cf6"];

export default function Circles() {
  const stories = useStories().filter((s) => s.status === "published");
  const circles = useMemo(() => belongingCircles(stories), [stories]);
  const conns = useMemo(() => connections(stories, 0.2), [stories]);
  const [scheduled, setScheduled] = useState<Set<string>>(new Set());

  // color map: storyId -> circle color
  const colorOf = new Map<string, string>();
  circles.forEach((c, i) => {
    c.members.forEach((m) => colorOf.set(m.id, PALETTE[i % PALETTE.length]));
  });

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Belonging Circles"
        subtitle="Our embedding engine reads every transcript and surfaces the subtle threads connecting community members — then proposes a monthly bonding session to turn shared stories into real relationships."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* connection map */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sparkles size={16} className="text-brand-red" /> Community
            connection map
          </h3>
          <p className="mb-2 text-xs text-slate-500">
            Each dot is a narrator. Lines link kindred stories — thicker means a
            stronger semantic match. Colors are detected circles.
          </p>
          <ConnectionMap
            stories={stories}
            connections={conns}
            colorOf={colorOf}
          />
        </div>

        {/* circles list */}
        <div className="space-y-4">
          {circles.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Need a few more stories to form circles. Keep collecting!
            </p>
          )}
          {circles.map((c, i) => {
            const done = scheduled.has(c.id);
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                    >
                      <Users2 size={16} />
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {c.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-navy">
                    {Math.round(c.strength * 100)}% kinship
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">{c.thread}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.members.map((m) => (
                    <span
                      key={m.id}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                    >
                      {m.narratorDisplay} · {m.origin}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.sharedThemes.map((t) => (
                    <TagChip key={t} tag={{ label: t, category: "theme" }} />
                  ))}
                </div>

                {/* suggested session */}
                <div className="mt-4 rounded-xl bg-mist p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-red">
                    <CalendarHeart size={14} /> Suggested monthly session
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    {c.session.title}
                  </p>
                  <p className="text-sm italic text-slate-600">
                    "{c.session.prompt}"
                  </p>
                  <button
                    onClick={() =>
                      setScheduled((prev) => new Set(prev).add(c.id))
                    }
                    disabled={done}
                    className={`mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-navy text-white hover:bg-navy-deep"
                    }`}
                  >
                    {done ? (
                      <>
                        <Check size={16} /> Invites sent to {c.members.length}{" "}
                        members
                      </>
                    ) : (
                      <>
                        <CalendarHeart size={16} /> Schedule & invite circle
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnectionMap({
  stories,
  connections,
  colorOf,
}: {
  stories: Story[];
  connections: Connection[];
  colorOf: Map<string, string>;
}) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 50;

  const pos = new Map<string, { x: number; y: number }>();
  stories.forEach((s, i) => {
    const angle = (i / stories.length) * Math.PI * 2 - Math.PI / 2;
    pos.set(s.id, {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
      {connections.map((c, i) => {
        const a = pos.get(c.a.id);
        const b = pos.get(c.b.id);
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#94a3b8"
            strokeOpacity={0.25 + c.score * 0.5}
            strokeWidth={0.5 + c.score * 3}
          />
        );
      })}
      {stories.map((s) => {
        const p = pos.get(s.id)!;
        const color = colorOf.get(s.id) ?? "#cbd5e1";
        return (
          <g key={s.id}>
            <circle cx={p.x} cy={p.y} r={9} fill={color} />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              className="fill-slate-600 text-[9px] font-semibold"
            >
              {s.narratorDisplay.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
