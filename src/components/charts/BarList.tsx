import type { TagCount } from "../../lib/analytics";

/** Lightweight horizontal bar list — no charting dependency. */
export default function BarList({
  data,
  color = "bg-navy",
  max,
}: {
  data: TagCount[];
  color?: string;
  max?: number;
}) {
  const top = max ? data.slice(0, max) : data;
  const peak = Math.max(1, ...top.map((d) => d.count));

  return (
    <ul className="space-y-2.5">
      {top.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{d.label}</span>
            <span className="tabular-nums text-slate-400">{d.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${color} transition-all`}
              style={{ width: `${(d.count / peak) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
