import type { Word } from "../../lib/wordfreq";

const COLORS = [
  "text-navy",
  "text-brand-red",
  "text-emerald-600",
  "text-amber-600",
  "text-indigo-600",
  "text-slate-500",
];

/** Dependency-free word cloud: font size scales with frequency. */
export default function WordCloud({ words }: { words: Word[] }) {
  if (words.length === 0)
    return <p className="text-sm text-slate-400">Not enough text yet.</p>;

  const max = words[0].count;
  const min = words[words.length - 1].count;
  const size = (c: number) => {
    if (max === min) return 1.1;
    return 0.85 + ((c - min) / (max - min)) * 1.5; // 0.85rem → 2.35rem
  };

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 leading-tight">
      {words.map((w, i) => (
        <span
          key={w.text}
          className={`font-extrabold tracking-tight ${COLORS[i % COLORS.length]}`}
          style={{ fontSize: `${size(w.count)}rem`, opacity: 0.55 + size(w.count) / 5 }}
          title={`${w.count} mentions`}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}
