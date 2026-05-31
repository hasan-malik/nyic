import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Clock,
  Database,
  Globe2,
  HeartHandshake,
  Languages,
  LifeBuoy,
  Network,
  Send,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import BarList from "../../components/charts/BarList";
import WordCloud from "../../components/charts/WordCloud";
import { useStories } from "../../lib/useStories";
import {
  dashboardStats,
  memberOrgBreakdown,
  originBreakdown,
  sentimentBreakdown,
  tagCounts,
} from "../../lib/analytics";
import { collectionByMonth, wordFrequencies } from "../../lib/wordfreq";
import { COST_PER_STORY_CENTS } from "../../lib/pipeline";

export default function Dashboard() {
  const stories = useStories();
  const stats = useMemo(() => dashboardStats(stories), [stories]);
  const themes = useMemo(() => tagCounts(stories, "theme"), [stories]);
  const emotions = useMemo(() => tagCounts(stories, "emotion"), [stories]);
  const heritage = useMemo(() => tagCounts(stories, "heritage"), [stories]);
  const struggles = useMemo(() => tagCounts(stories, "struggle"), [stories]);
  const origins = useMemo(() => originBreakdown(stories), [stories]);
  const sentiments = useMemo(() => sentimentBreakdown(stories), [stories]);
  const memberOrgs = useMemo(() => memberOrgBreakdown(stories), [stories]);
  const words = useMemo(() => wordFrequencies(stories, 36), [stories]);
  const timeline = useMemo(() => collectionByMonth(stories), [stories]);

  const monthlySpend = ((stats.total * COST_PER_STORY_CENTS) / 100).toFixed(2);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Overview"
        subtitle="The living archive of NYIC's 40 years — collected, understood, and ready to activate."
      />

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={<Database />} label="Stories collected" value={stats.total} />
        <Kpi
          icon={<Users2 />}
          label="Friend nominations"
          value={stats.totalNominations}
          hint="viral reach"
        />
        <Kpi
          icon={<Languages />}
          label="Languages preserved"
          value={stats.languages}
        />
        <Kpi
          icon={<Clock />}
          label="Minutes of testimony"
          value={stats.totalMinutes}
        />
      </div>

      {/* cost callout — click through to the full budget breakdown */}
      <Link
        to="/admin/costs"
        className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition-colors hover:bg-emerald-100"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <TrendingUp size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Total AI spend on this archive: ${monthlySpend}
            </p>
            <p className="text-xs text-emerald-700">
              ≈{COST_PER_STORY_CENTS.toFixed(1)}¢ per story (transcribe · moderate ·
              tag · embed). Compare to the $150k NY Proud billboard budget.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700">
          View cost breakdown <ArrowRight size={13} />
        </span>
      </Link>

      {/* archive intelligence — narrative synthesis + zero-cost text analytics */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
              <Brain size={15} />
            </span>
            Archive intelligence
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-indigo-600 ring-1 ring-indigo-200">
              Claude Sonnet · weekly synthesis
            </span>
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
            Across {stats.total} stories in {stats.languages} languages, one
            thread dominates: <strong>belonging that refuses to be transactional</strong>.
            Narrators rarely lead with what they built — they lead with the
            moment <em>someone chose them first</em>. The strongest emotional
            spikes cluster around <strong>strangers, names, and kitchens</strong>,
            not jobs. Recommendation: feature Diego's "block party" story next —
            its uplifting register balances this week's heavier detention
            testimony, and it pairs naturally with the{" "}
            <strong>Chosen First</strong> circle for a June gathering.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Insight label="Dominant theme" value="Belonging" />
            <Insight label="Rising emotion" value="Hope (+18%)" />
            <Insight label="Underserved era" value="1990s voices" />
          </div>
        </div>

        <Panel title="What our community says most" icon={<Sparkles size={16} />}>
          <WordCloud words={words} />
          <p className="mt-3 text-[11px] text-slate-400">
            Computed live from transcripts — $0 marginal cost.
          </p>
        </Panel>
      </div>

      {/* collection over time */}
      <div className="mt-6">
        <Panel
          title="Collection momentum"
          icon={<TrendingUp size={16} />}
        >
          <Timeline data={timeline} />
        </Panel>
      </div>

      {/* analytics grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Themes across the archive" icon={<Sparkles size={16} />}>
          <BarList data={themes} max={6} color="bg-navy" />
        </Panel>
        <Panel title="Emotional range" icon={<Sparkles size={16} />}>
          <BarList data={emotions} max={6} color="bg-brand-gold" />
        </Panel>
        <Panel title="Sentiment mix" icon={<Sparkles size={16} />}>
          <BarList data={sentiments} color="bg-brand-red" />
        </Panel>
        <Panel title="Cultural heritage" icon={<HeartHandshake size={16} />}>
          <BarList data={heritage} max={8} color="bg-rose-500" />
          <p className="mt-3 text-[11px] text-slate-400">
            Diaspora background inferred by Claude from each story — never a
            box anyone checks.
          </p>
        </Panel>
        <Panel title="Struggles named" icon={<LifeBuoy size={16} />}>
          <BarList data={struggles} max={8} color="bg-amber-600" />
          <p className="mt-3 text-[11px] text-slate-400">
            What people are actually facing — a live needs-assessment for
            advocacy and services.
          </p>
        </Panel>
        <Panel title="Countries of origin" icon={<Globe2 size={16} />}>
          <BarList data={origins} max={8} color="bg-emerald-500" />
        </Panel>
        <Panel
          title="By NYIC member organization"
          icon={<Network size={16} />}
        >
          <BarList data={memberOrgs} max={8} color="bg-indigo-500" />
          <p className="mt-3 text-[11px] text-slate-400">
            Coalition of 200+ orgs. Each member sees & is credited for its own
            stories (role-based access).
          </p>
        </Panel>
        <Panel title="Pipeline status" icon={<Database size={16} />}>
          <ul className="space-y-3 text-sm">
            <StatusRow label="Published" n={stats.published} color="bg-emerald-500" />
            <StatusRow label="In review" n={stats.inReview} color="bg-amber-500" />
            <StatusRow label="Processing" n={stats.processing} color="bg-navy" />
          </ul>
        </Panel>
      </div>

      {/* integrations — meet NYIC where they already work */}
      <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-slate-400">
        Connected to NYIC's existing stack
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Integration
          name="Salesforce"
          status="Sync narrators → donor/volunteer CRM"
          live={false}
        />
        <Integration
          name="Google Suite"
          status="Export archives to Drive / Sheets"
          live={false}
        />
        <Integration
          name="Publer"
          status="Schedule daily story to IG + LinkedIn"
          live={false}
          icon={<Send size={16} />}
        />
        <Integration
          name="Runway"
          status="Animate the story of the day"
          live={false}
        />
      </div>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-indigo-100">
      <span className="text-slate-400">{label}: </span>
      <span className="font-bold text-navy">{value}</span>
    </span>
  );
}

function Timeline({ data }: { data: { label: string; count: number }[] }) {
  const peak = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-3 pt-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-bold tabular-nums text-slate-500">
            {d.count}
          </span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-navy to-indigo-400 transition-all"
            style={{ height: `${(d.count / peak) * 120 + 8}px` }}
          />
          <span className="text-[11px] font-medium text-slate-400">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist text-navy">
        {icon}
      </div>
      <p className="mt-3 text-3xl font-extrabold tabular-nums text-slate-900">
        {value}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
      {hint && <p className="text-xs font-medium text-brand-red">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="text-brand-red">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatusRow({
  label,
  n,
  color,
}: {
  label: string;
  n: number;
  color: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-slate-600">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
      </span>
      <span className="font-bold tabular-nums text-slate-900">{n}</span>
    </li>
  );
}

function Integration({
  name,
  status,
  live,
  icon,
}: {
  name: string;
  status: string;
  live: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900">{name}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            live
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {live ? "Connected" : "Ready"}
        </span>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
        {icon} {status}
      </p>
    </div>
  );
}
