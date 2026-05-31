import { Link } from "react-router-dom";
import { ArrowRight, Heart, Mic, Share2, Sparkles } from "lucide-react";
import { Container, Eyebrow } from "../components/ui/Container";
import StoryCard from "../components/StoryCard";
import AudioPlayer from "../components/AudioPlayer";
import { usePublishedStories } from "../lib/useStories";

export default function Home() {
  const stories = usePublishedStories();
  const featured = stories.find((s) => s.featured) ?? stories[0];
  const gallery = stories.filter((s) => s.id !== featured?.id).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="animate-fade-up">
            <Eyebrow>New York Immigration Coalition · 40 years</Eyebrow>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[68px]">
              I Choose New York.
              <br />
              <span className="text-brand-gold">New York Chooses You.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">
              You don't belong here because of what you build, pay, or give. You
              belong, full stop. <strong>#IChooseNY</strong> is a coalition of
              voices — friends interviewing friends, five minutes at a time —
              proving that belonging was never a transaction.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/share"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-base font-semibold shadow-sm transition-colors hover:bg-brand-redHover"
              >
                <Mic size={18} /> Interview a friend
              </Link>
              <Link
                to="/stories"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
              >
                Listen to the bank <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              <Stat n="4.5M" label="New Yorkers served" />
              <Stat n="40 yrs" label="of coalition history" />
              <Stat n="≈5¢" label="to process a story with AI" />
            </div>
          </div>

          {/* Featured story player */}
          {featured && (
            <div className="animate-fade-up rounded-2xl bg-white p-6 text-slate-900 shadow-2xl ring-1 ring-white/10 [animation-delay:120ms]">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold text-amber-800">
                <Sparkles size={13} /> Story of the day
              </div>
              <p className="text-2xl font-extrabold leading-snug text-navy">
                "{featured.pullQuote}"
              </p>
              <p className="mt-3 text-sm text-slate-600">{featured.summary}</p>
              <div className="mt-5">
                <AudioPlayer
                  src={featured.audioUrl}
                  durationSec={featured.durationSec}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">
                  {featured.narratorDisplay} · from {featured.origin}
                </span>
                <Link
                  to={`/stories/${featured.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand-red hover:underline"
                >
                  Full story <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white">
        <Container className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A movement that grows one friendship at a time
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              icon={<Heart />}
              n="01"
              title="A friend chooses you"
              body="No strangers, no forms. Someone who loves you invites you to share five minutes of your story — in any language."
            />
            <Step
              icon={<Mic />}
              n="02"
              title="Five minutes, your voice"
              body="Record the interview right here. Our AI transcribes, protects, and gently understands it — you choose how (or whether) to appear."
            />
            <Step
              icon={<Share2 />}
              n="03"
              title="You choose two more"
              body="Every voice nominates two friends. That's how a coalition of 4.5 million remembers it was built person by person."
            />
          </div>
        </Container>
      </section>

      {/* FEATURED STORIES */}
      {gallery.length > 0 && (
        <section className="bg-mist">
          <Container className="py-20">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>From the story bank</Eyebrow>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  Voices choosing New York
                </h2>
              </div>
              <Link
                to="/constellation"
                className="hidden items-center gap-1 font-semibold text-brand-red hover:underline sm:inline-flex"
              >
                Explore the constellation <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy-deep text-white">
        <Container className="py-20 text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Someone is waiting for you to choose them.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Five minutes. One friend. A story that tells 4.5 million people they
            belong.
          </p>
          <Link
            to="/share"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-red px-8 py-4 text-base font-semibold transition-colors hover:bg-brand-redHover"
          >
            <Mic size={18} /> Start an interview
          </Link>
        </Container>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-brand-gold">{n}</div>
      <div className="text-white/70">{label}</div>
    </div>
  );
}

function Step({
  icon,
  n,
  title,
  body,
}: {
  icon: React.ReactNode;
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
          {icon}
        </span>
        <span className="text-4xl font-extrabold text-slate-100">{n}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
