import type { PipelineStage, StageStatus, Story } from "./types";

/** Display metadata for each pipeline stage (used in Share flow + dashboard). */
export const STAGE_META: Record<
  PipelineStage,
  { label: string; model: string; blurb: string; costCents: number }
> = {
  uploaded: {
    label: "Secured",
    model: "Supabase Storage",
    blurb: "Audio encrypted at rest in your private bucket.",
    costCents: 0,
  },
  transcribed: {
    label: "Transcribed",
    model: "ElevenLabs Scribe",
    blurb: "Multilingual speech-to-text with speaker labels.",
    costCents: 0, // covered by ElevenLabs credits
  },
  moderated: {
    label: "Care check",
    model: "Claude Haiku",
    blurb: "Flags sensitive content for a human — never auto-rejects.",
    costCents: 0.4,
  },
  tagged: {
    label: "Understood",
    model: "Claude Sonnet",
    blurb: "Themes, emotion, life-stage, pull-quote + one-line summary.",
    costCents: 1.6,
  },
  embedded: {
    label: "Connected",
    model: "pgvector",
    blurb: "Semantic embedding powers search + 'stories like this'.",
    costCents: 0.1,
  },
  published: {
    label: "Live",
    model: "NYIC review",
    blurb: "Approved and shared on #IChooseNY.",
    costCents: 0,
  },
};

export const PIPELINE_ORDER: PipelineStage[] = [
  "uploaded",
  "transcribed",
  "moderated",
  "tagged",
  "embedded",
  "published",
];

/** Total marginal AI cost to process one story — the feasibility headline. */
export const COST_PER_STORY_CENTS = PIPELINE_ORDER.reduce(
  (sum, s) => sum + STAGE_META[s].costCents,
  0
);

export function freshStages(): StageStatus[] {
  return PIPELINE_ORDER.map((stage) => ({ stage, state: "pending" }));
}

/** Heuristic that mirrors what Claude Haiku does server-side, for demo mode. */
const SENSITIVE_HINTS =
  /(detention|deport|ICE|abuse|assault|trafficking|suicide|violence)/i;

export function localModerate(transcript: string): Story["moderation"] {
  const sensitive = SENSITIVE_HINTS.test(transcript);
  return {
    flagged: sensitive,
    sensitive,
    reason: sensitive
      ? "Sensitive lived experience detected. Confirm consent and surface support resources before publishing."
      : undefined,
  };
}
