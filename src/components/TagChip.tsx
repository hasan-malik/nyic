import type { StoryTag } from "../lib/types";

const CATEGORY_STYLES: Record<StoryTag["category"], string> = {
  emotion: "bg-amber-50 text-amber-800 ring-amber-200",
  theme: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  lifeStage: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  topic: "bg-rose-50 text-rose-800 ring-rose-200",
  struggle: "bg-orange-50 text-orange-800 ring-orange-200",
  heritage: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200",
  region: "bg-sky-50 text-sky-800 ring-sky-200",
  org: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function TagChip({
  tag,
  active = false,
  onClick,
}: {
  tag: StoryTag;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors";
  const style = active
    ? "bg-navy text-white ring-navy"
    : CATEGORY_STYLES[tag.category];

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} ${style} hover:opacity-80`}>
        {tag.label}
      </button>
    );
  }
  return <span className={`${base} ${style}`}>{tag.label}</span>;
}
