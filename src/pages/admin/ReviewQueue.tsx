import { AlertTriangle, Check, Heart, X } from "lucide-react";
import { PageHeader } from "./Dashboard";
import AudioPlayer from "../../components/AudioPlayer";
import TagChip from "../../components/TagChip";
import PipelineProgress from "../../components/PipelineProgress";
import { useStories } from "../../lib/useStories";
import { store } from "../../lib/store";
import { PIPELINE_ORDER } from "../../lib/pipeline";
import type { Story } from "../../lib/types";

export default function ReviewQueue() {
  const stories = useStories();
  const queue = stories.filter(
    (s) => s.status === "in_review" || s.status === "processing"
  );

  const approve = (s: Story) => {
    store.update(s.id, {
      status: "published",
      stages: PIPELINE_ORDER.map((stage) => ({ stage, state: "done" })),
    });
  };
  const decline = (s: Story) => {
    store.update(s.id, { status: "rejected" });
  };

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Review queue"
        subtitle="Claude Haiku flags sensitive content for a human — it never auto-rejects. We honor consent and handle hard stories with care."
      />

      {queue.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          <Check className="mx-auto text-emerald-500" size={32} />
          <p className="mt-2 font-semibold">Queue is clear.</p>
          <p className="text-sm">Every story has been reviewed with care.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {queue.map((s) => (
            <div
              key={s.id}
              className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:grid-cols-[1.5fr_1fr]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {s.narratorDisplay}
                  </span>
                  <span className="text-sm text-slate-500">
                    · {s.location} · {s.language}
                  </span>
                </div>

                {s.moderation.flagged && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-900">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Care flag (Claude Haiku) — needs a human
                      </p>
                      <p className="mt-0.5 text-amber-800">
                        {s.moderation.reason}
                      </p>
                    </div>
                  </div>
                )}

                {s.transcript ? (
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
                    {s.transcript}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-slate-400">
                    Transcript pending…
                  </p>
                )}

                {s.audioUrl && (
                  <div className="mt-4">
                    <AudioPlayer src={s.audioUrl} durationSec={s.durationSec} />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <TagChip key={t.label} tag={t} />
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="capitalize">
                    Identity: <strong>{s.consent.identity}</strong>
                  </span>
                  <span>
                    Voice masked:{" "}
                    <strong>{s.consent.anonymizeVoice ? "yes" : "no"}</strong>
                  </span>
                  <span>
                    Campaign use:{" "}
                    <strong>
                      {s.consent.allowCampaignUse ? "allowed" : "no"}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl bg-mist p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  AI pipeline
                </p>
                <PipelineProgress stages={s.stages} />

                {s.status === "in_review" && (
                  <div className="mt-auto space-y-2">
                    <button
                      onClick={() => approve(s)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Heart size={16} /> Publish with care
                    </button>
                    <button
                      onClick={() => decline(s)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-white"
                    >
                      <X size={16} /> Keep private
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
