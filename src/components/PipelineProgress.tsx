import { AlertTriangle, Check, Loader2 } from "lucide-react";
import type { StageStatus } from "../lib/types";
import { STAGE_META } from "../lib/pipeline";

/** Vertical or horizontal view of the transcribe→moderate→tag→embed pipeline. */
export default function PipelineProgress({
  stages,
  orientation = "vertical",
}: {
  stages: StageStatus[];
  orientation?: "vertical" | "horizontal";
}) {
  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-1">
        {stages.map((s, i) => (
          <div key={s.stage} className="flex items-center gap-1">
            <Dot state={s.state} />
            {i < stages.length - 1 && (
              <span
                className={`h-0.5 w-5 ${
                  s.state === "done" ? "bg-emerald-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {stages.map((s) => {
        const meta = STAGE_META[s.stage];
        return (
          <li key={s.stage} className="flex items-start gap-3">
            <StageIcon state={s.state} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-sm font-semibold ${
                    s.state === "pending" ? "text-slate-400" : "text-slate-900"
                  }`}
                >
                  {meta.label}
                </p>
                <span className="shrink-0 text-[11px] font-medium text-slate-400">
                  {meta.model}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {s.detail ?? meta.blurb}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StageIcon({ state }: { state: StageStatus["state"] }) {
  const base =
    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full";
  if (state === "done")
    return (
      <span className={`${base} bg-emerald-500 text-white`}>
        <Check size={14} />
      </span>
    );
  if (state === "running")
    return (
      <span className={`${base} bg-navy text-white`}>
        <Loader2 size={14} className="animate-spin" />
      </span>
    );
  if (state === "flagged")
    return (
      <span className={`${base} bg-amber-500 text-white`}>
        <AlertTriangle size={14} />
      </span>
    );
  return <span className={`${base} border-2 border-slate-200 bg-white`} />;
}

function Dot({ state }: { state: StageStatus["state"] }) {
  const color =
    state === "done"
      ? "bg-emerald-500"
      : state === "running"
        ? "bg-navy animate-pulse"
        : state === "flagged"
          ? "bg-amber-500"
          : "bg-slate-200";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}
