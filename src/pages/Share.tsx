import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Mic,
  ShieldCheck,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { Container, Eyebrow } from "../components/ui/Container";
import PipelineProgress from "../components/PipelineProgress";
import { DOORWAYS, MODE_COPY, type CollectionMode } from "../lib/doorways";
import { store } from "../lib/store";
import { COST_PER_STORY_CENTS, PIPELINE_ORDER, freshStages } from "../lib/pipeline";
import type { ConsentSettings, StageStatus, Story } from "../lib/types";

type Step = "record" | "consent" | "details" | "processing" | "done";

export default function Share() {
  const [step, setStep] = useState<Step>("record");
  const [hasAudio, setHasAudio] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    publicShare: true,
    identity: "name",
    displayName: "",
    anonymizeVoice: false,
    allowCampaignUse: true,
  });
  const [details, setDetails] = useState({
    interviewerName: "",
    location: "",
    origin: "",
  });

  return (
    <div className="bg-mist">
      <Container className="py-14">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>#IChooseNY · Share a story</Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {step === "done"
              ? "Your friend's voice just joined the coalition"
              : "Interview someone you choose"}
          </h1>

          {step !== "done" && <Stepper step={step} />}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {step === "record" && (
              <RecordStep
                hasAudio={hasAudio}
                setHasAudio={setHasAudio}
                onNext={() => setStep("consent")}
              />
            )}
            {step === "consent" && (
              <ConsentStep
                consent={consent}
                setConsent={setConsent}
                onBack={() => setStep("record")}
                onNext={() => setStep("details")}
              />
            )}
            {step === "details" && (
              <DetailsStep
                details={details}
                setDetails={setDetails}
                onBack={() => setStep("consent")}
                onNext={() => setStep("processing")}
              />
            )}
            {step === "processing" && (
              <ProcessingStep
                consent={consent}
                details={details}
                onDone={() => setStep("done")}
              />
            )}
            {step === "done" && <DoneStep />}
          </div>
        </div>
      </Container>
    </div>
  );
}

const STEP_LABELS: Record<Exclude<Step, "done">, string> = {
  record: "Record",
  consent: "Consent",
  details: "Details",
  processing: "Magic",
};

function Stepper({ step }: { step: Step }) {
  const keys = Object.keys(STEP_LABELS) as (keyof typeof STEP_LABELS)[];
  const activeIdx = keys.indexOf(step as keyof typeof STEP_LABELS);
  return (
    <div className="mt-6 flex items-center gap-2">
      {keys.map((k, i) => (
        <div key={k} className="flex flex-1 items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              i <= activeIdx
                ? "bg-navy text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`text-xs font-semibold ${
              i <= activeIdx ? "text-navy" : "text-slate-400"
            }`}
          >
            {STEP_LABELS[k]}
          </span>
          {i < keys.length - 1 && (
            <div
              className={`h-0.5 flex-1 ${
                i < activeIdx ? "bg-navy" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function RecordStep({
  hasAudio,
  setHasAudio,
  onNext,
}: {
  hasAudio: boolean;
  setHasAudio: (v: boolean) => void;
  onNext: () => void;
}) {
  const [mode, setMode] = useState<CollectionMode>("friend");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [doorway, setDoorway] = useState(0);
  const timer = useRef<number>();

  useEffect(() => {
    if (recording) {
      timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      window.clearInterval(timer.current);
    }
    return () => window.clearInterval(timer.current);
  }, [recording]);

  const toggle = () => {
    if (recording) {
      setRecording(false);
      setHasAudio(true);
    } else {
      setSeconds(0);
      setRecording(true);
    }
  };

  const mmss = `${Math.floor(seconds / 60)}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
  const d = DOORWAYS[doorway];

  return (
    <div>
      {/* mode selector */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(MODE_COPY) as CollectionMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              mode === m
                ? "border-navy bg-navy/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              {m === "friend" ? <Heart size={14} /> : <Users size={14} />}
              {MODE_COPY[m].label}
            </span>
            <span className="mt-1 block text-xs leading-snug text-slate-500">
              {MODE_COPY[m].blurb}
            </span>
          </button>
        ))}
      </div>

      {/* the four doorways guide */}
      <div className="mt-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-red">
            Doorway {d.n} of 4 · {d.phase}
          </p>
          <div className="flex gap-1">
            {DOORWAYS.map((dw, i) => (
              <button
                key={dw.n}
                onClick={() => setDoorway(i)}
                aria-label={`Doorway ${dw.n}`}
                className={`h-1.5 w-7 rounded-full transition-colors ${
                  i <= doorway ? "bg-navy" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xl font-extrabold leading-snug text-navy">
          "{d.question}"
        </p>
        <p className="mt-2 text-xs italic text-slate-500">{d.why}</p>
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-slate-600">
          Both of you answer — nothing is asked in return.{" "}
          {mode === "booth" && (
            <span className="font-semibold text-slate-800">
              Volunteer: follow what's alive, don't rush the descent.
            </span>
          )}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setDoorway((i) => Math.max(0, i - 1))}
            disabled={doorway === 0}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 disabled:opacity-30"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <button
            onClick={() => setDoorway((i) => Math.min(3, i + 1))}
            disabled={doorway === 3}
            className="flex items-center gap-1 text-xs font-semibold text-navy disabled:opacity-30"
          >
            Next doorway <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* recorder */}
      <div className="mt-5 flex flex-col items-center rounded-xl bg-mist py-8">
        <button
          onClick={toggle}
          className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${
            recording ? "animate-pulse bg-brand-red" : "bg-navy"
          }`}
        >
          <Mic size={30} />
        </button>
        <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900">
          {mmss}{" "}
          <span className="text-base font-normal text-slate-400">/ 5:00</span>
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {recording
            ? "Recording… tap to stop"
            : hasAudio
              ? "Recorded ✓ — tap to re-record"
              : "Record all four doorways in one take"}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-600 transition-colors hover:border-navy hover:text-navy">
        <Upload size={18} />
        Upload an audio file
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={() => setHasAudio(true)}
        />
      </label>

      <button
        onClick={() => {
          setHasAudio(true);
          onNext();
        }}
        className="mt-3 w-full text-center text-xs font-medium text-slate-400 underline hover:text-slate-600"
      >
        Use a sample interview (for demo)
      </button>

      <button
        disabled={!hasAudio}
        onClick={onNext}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red py-3.5 font-semibold text-white transition-colors hover:bg-brand-redHover disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue <ArrowRight size={18} />
      </button>
    </div>
  );
}

function ConsentStep({
  consent,
  setConsent,
  onBack,
  onNext,
}: {
  consent: ConsentSettings;
  setConsent: (c: ConsentSettings) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900">
        <ShieldCheck className="mt-0.5 shrink-0" size={20} />
        <p className="text-sm">
          <strong>Your story, your rules.</strong> Many of our neighbors have
          real reasons to protect their identity. You control everything below,
          and you can delete your story at any time.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            How should your friend appear?
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["name", "pseudonym", "anonymous"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setConsent({ ...consent, identity: opt })}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold capitalize transition-colors ${
                  consent.identity === opt
                    ? "border-navy bg-navy text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt === "name" ? "Real name" : opt}
              </button>
            ))}
          </div>
        </div>

        {consent.identity !== "anonymous" && (
          <input
            value={consent.displayName}
            onChange={(e) =>
              setConsent({ ...consent, displayName: e.target.value })
            }
            placeholder={
              consent.identity === "pseudonym"
                ? "Choose a pseudonym"
                : "First name to display"
            }
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-navy focus:outline-none"
          />
        )}

        <Toggle
          checked={consent.anonymizeVoice}
          onChange={(v) => setConsent({ ...consent, anonymizeVoice: v })}
          title="Mask the voice"
          desc="ElevenLabs voice-changer keeps the emotion, hides the identity."
        />
        <Toggle
          checked={consent.allowCampaignUse}
          onChange={(v) => setConsent({ ...consent, allowCampaignUse: v })}
          title="Allow NYIC campaign use"
          desc="Story may be featured on social, in advocacy, or animated."
        />
      </div>

      <div className="mt-7 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-red py-3 font-semibold text-white transition-colors hover:bg-brand-redHover"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function DetailsStep({
  details,
  setDetails,
  onBack,
  onNext,
}: {
  details: { interviewerName: string; location: string; origin: string };
  setDetails: (d: typeof details) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        A few optional details help us connect this story to others. Skip
        anything that doesn't feel safe to share.
      </p>
      <Field
        label="Your name (the interviewer)"
        value={details.interviewerName}
        onChange={(v) => setDetails({ ...details, interviewerName: v })}
        placeholder="e.g. Layla (her daughter)"
      />
      <Field
        label="Neighborhood"
        value={details.location}
        onChange={(v) => setDetails({ ...details, location: v })}
        placeholder="e.g. Astoria, Queens"
      />
      <Field
        label="Country of origin (optional)"
        value={details.origin}
        onChange={(v) => setDetails({ ...details, origin: v })}
        placeholder="e.g. Yemen — or leave blank"
      />
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-red py-3 font-semibold text-white transition-colors hover:bg-brand-redHover"
        >
          Send through the AI pipeline <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function ProcessingStep({
  consent,
  details,
  onDone,
}: {
  consent: ConsentSettings;
  details: { interviewerName: string; location: string; origin: string };
  onDone: () => void;
}) {
  const [stages, setStages] = useState<StageStatus[]>(freshStages());

  useEffect(() => {
    let i = 0;
    const run = () => {
      setStages((prev) =>
        prev.map((s, idx) => {
          if (idx < i) return { ...s, state: "done" };
          if (idx === i) return { ...s, state: "running" };
          return s;
        })
      );
      i++;
      if (i <= PIPELINE_ORDER.length) {
        window.setTimeout(run, 900);
      } else {
        // finalize: persist a new published story built from the canned demo result
        const story = buildStory(consent, details);
        store.add(story);
        window.setTimeout(onDone, 600);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p className="text-sm text-slate-600">
        Watch the story move through our pipeline — multilingual transcription,
        a care check, theme tagging, and semantic embedding. All for about{" "}
        <strong>{(COST_PER_STORY_CENTS / 100).toFixed(2)}¢… err, ${(COST_PER_STORY_CENTS / 100).toFixed(2)}</strong>{" "}
        per story.
      </p>
      <div className="mt-6 rounded-xl bg-mist p-5">
        <PipelineProgress stages={stages} />
      </div>
    </div>
  );
}

function DoneStep() {
  const [invited, setInvited] = useState<string[]>([]);
  const [name, setName] = useState("");

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="text-emerald-500" size={56} />
        <p className="mt-3 text-lg font-bold text-slate-900">
          It's live in the story bank.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Thank you for choosing someone. Now keep the chain going.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <UserPlus size={18} className="text-brand-red" /> Nominate two friends
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Every voice invites two more. That's how a coalition remembers it was
          built person by person.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Friend's name or number"
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-navy focus:outline-none"
          />
          <button
            onClick={() => {
              if (name.trim() && invited.length < 2) {
                setInvited([...invited, name.trim()]);
                setName("");
              }
            }}
            disabled={invited.length >= 2}
            className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Invite
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {invited.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
            >
              <Heart size={12} /> {n} invited
            </span>
          ))}
        </div>
      </div>

      <Link
        to="/stories"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red py-3.5 font-semibold text-white transition-colors hover:bg-brand-redHover"
      >
        See your story in the bank <ArrowRight size={18} />
      </Link>
    </div>
  );
}

/* ---------- helpers ---------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-navy focus:outline-none"
      />
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-slate-300"
    >
      <span
        className={`mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-navy" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
    </button>
  );
}

function buildStory(
  consent: ConsentSettings,
  details: { interviewerName: string; location: string; origin: string }
): Story {
  const display =
    consent.identity === "anonymous"
      ? "Anonymous"
      : consent.displayName || "A neighbor";
  return {
    id: `st_${Date.now()}`,
    track: "new",
    narratorDisplay: display,
    interviewerName: details.interviewerName || "A friend",
    location: details.location || "New York",
    origin: details.origin || "Withheld for safety",
    status: "published",
    stages: PIPELINE_ORDER.map((stage) => ({
      stage,
      state: "done",
      detail:
        stage === "transcribed"
          ? "ElevenLabs Scribe"
          : stage === "moderated"
            ? "Claude Haiku"
            : stage === "tagged"
              ? "Claude Sonnet"
              : undefined,
    })),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSec: 274,
    language: "English",
    transcript:
      "The first time I felt like I belonged was the day my neighbor learned my name and used it. Such a small thing. But it told me I was not invisible here.",
    summary: "A new voice on the small moment that turned a city into a home.",
    pullQuote: "The day my neighbor learned my name, I stopped being invisible.",
    tags: [
      { label: "Belonging", category: "theme" },
      { label: "Community", category: "topic" },
      { label: "Hopeful", category: "emotion" },
    ],
    sentiment: "hopeful",
    moderation: { flagged: false, sensitive: false },
    consent,
    featured: false,
    animationStatus: "none",
    nominations: 0,
    createdAt: new Date().toISOString(),
    cta: { label: "Add your voice", href: "/share" },
  };
}
