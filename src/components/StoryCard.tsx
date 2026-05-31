import { Link } from "react-router-dom";
import { MapPin, Quote, Sparkles } from "lucide-react";
import type { Story } from "../lib/types";
import { formatDuration } from "../lib/analytics";
import TagChip from "./TagChip";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={`/stories/${story.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* pull quote header */}
      <div className="relative bg-navy p-6 text-white">
        {story.featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-gold/90 px-2.5 py-1 text-[11px] font-bold text-navy-ink">
            <Sparkles size={12} /> Featured
          </span>
        )}
        <Quote size={22} className="mb-3 text-brand-gold" />
        <p className="text-lg font-bold leading-snug">"{story.pullQuote}"</p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span>{story.narratorDisplay}</span>
          {story.track === "legacy" && (
            <span className="rounded bg-brand-gold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
              Legacy
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={12} /> {story.location} · from {story.origin}
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {story.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {story.tags.slice(0, 4).map((t) => (
            <TagChip key={t.label} tag={t} />
          ))}
          {story.tags.length > 4 && (
            <span className="text-[11px] font-semibold text-slate-400">
              +{story.tags.length - 4}
            </span>
          )}
        </div>

        {story.memberOrg && (
          <p className="mt-3 truncate text-[11px] font-medium text-indigo-600">
            via {story.memberOrg}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400">
          <span>Interviewed by {story.interviewerName}</span>
          <span className="tabular-nums">{formatDuration(story.durationSec)}</span>
        </div>
      </div>
    </Link>
  );
}
