# #IChooseNY — NYIC Story Collection & Activation Ecosystem

> **I Choose New York. New York Chooses You.**
> An end-to-end storytelling system for the New York Immigration Coalition that
> collects immigrant stories friend-to-friend, understands them with AI, and
> activates them into belonging, community, and advocacy — for about **2¢ a story**.

Built for the ACF Social Impact Hackathon. React + Vite + TypeScript + Tailwind,
with a wireable Supabase + Edge Function backend.

---

## The idea in one breath

NYIC's current story argues immigrants belong because they're *useful*. But
usefulness only buys tolerance — the "essential workers" of 2020 are the
"invaders" of 2025. **#IChooseNY changes the question.** Two friends interview
each other through [four open "doorways"](src/lib/doorways.ts) that only make
sense if the person is *already whole* — no question that could be lifted into a
fundraising deck. Being heard, and asked for nothing, is the corrective
experience. A witnessed person becomes a member who shows up for ten years —
and that is what moves legislation.

## The system (maps to all three deliverables)

| Deliverable | What we built |
|---|---|
| **Collection & Outreach** | Friend-to-friend [Share flow](src/pages/Share.tsx) with the Four Doorways guide; two modes (organic + volunteer-run event booth); viral "nominate two friends" loop; consent & anonymity built in. |
| **Story Bank & Management** | [NYIC staff console](src/pages/admin): AI pipeline, care-first review queue, archive intelligence (themes, emotion, word cloud, momentum), all computed cheaply. |
| **Activation & Engagement** | [Belonging Circles](src/pages/admin/Circles.tsx) (AI clusters → monthly bonding sessions), advocacy story-match for moving bills, daily Runway-animated feature → Instagram via Publer. |

## The AI pipeline (≈ 2¢/story)

```
audio → Supabase Storage
  → ElevenLabs Scribe   multilingual transcript
  → Claude Haiku        care check (flags for a human — never auto-rejects)
  → Claude Sonnet       summary, pull-quote, sentiment, theme tags
  → OpenAI embeddings   pgvector → semantic search + Belonging Circles
  → published | in_review
```

## Run it (demo mode — zero setup, zero keys)

```bash
npm install
npm run dev            # http://localhost:5173
```

The app runs fully on **seeded data with no network**, so the live demo never
depends on an API call on stage. Routes:

- `/` — campaign landing + story of the day
- `/stories` — searchable story bank
- `/share` — the Four Doorways collection flow
- `/admin` — NYIC staff console (click "Sign in", or deep-link `/admin?staff=1`)

## Going live

Add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` and the app switches to the
real backend automatically. Full steps in [supabase/README.md](supabase/README.md).
See [PITCH.md](PITCH.md) for the presentation playbook.

## Project structure

```
src/
  pages/          Home, Stories, StoryDetail, Share, admin/*
  components/     Navbar, Footer, StoryCard, AudioPlayer, PipelineProgress, charts/*
  lib/            types, seed, store, doorways, connections, analytics, wordfreq, pipeline
supabase/
  migrations/     pgvector schema + RLS
  functions/      process-story Edge Function (the real pipeline)
```
