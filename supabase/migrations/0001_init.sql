-- #IChooseNY story bank — initial schema
-- Run with: supabase db push   (or paste into the Supabase SQL editor)

-- Semantic search over story transcripts.
create extension if not exists vector;

-- ── stories ────────────────────────────────────────────────────────────────
create table if not exists public.stories (
  id              uuid primary key default gen_random_uuid(),
  track           text not null default 'new' check (track in ('new','legacy')),

  -- narrator + interviewer (StoryCorps-style: a friend interviews a friend)
  interviewer_name text,
  location         text,
  origin           text,
  years_in_ny      int,

  -- lifecycle
  status          text not null default 'processing'
                  check (status in ('processing','in_review','published','rejected')),

  -- audio (object lives in the `story-audio` storage bucket)
  audio_path      text,
  duration_sec    int,
  language        text,

  -- AI outputs
  transcript      text,
  summary         text,
  pull_quote      text,
  sentiment       text,
  embedding       vector(1536),         -- OpenAI text-embedding-3-small

  -- moderation (Claude Haiku) — flag for a human, never auto-reject
  moderation_flagged   boolean default false,
  moderation_sensitive boolean default false,
  moderation_reason    text,

  -- consent — the trust layer
  consent_public        boolean default true,
  consent_identity      text default 'name' check (consent_identity in ('name','pseudonym','anonymous')),
  consent_display_name  text,
  consent_anonymize_voice boolean default false,
  consent_campaign_use  boolean default true,

  -- activation
  featured          boolean default false,
  animation_status  text default 'none' check (animation_status in ('none','queued','rendered')),
  nominations       int default 0,

  cta_label  text,
  cta_href   text,

  created_at timestamptz not null default now()
);

-- tags produced by Claude Sonnet
create table if not exists public.story_tags (
  id        bigint generated always as identity primary key,
  story_id  uuid not null references public.stories(id) on delete cascade,
  label     text not null,
  category  text not null check (category in ('emotion','theme','lifeStage','topic'))
);

-- friend-interviews-friend viral loop
create table if not exists public.nominations (
  id            bigint generated always as identity primary key,
  from_story_id uuid references public.stories(id) on delete cascade,
  invited_name  text not null,
  status        text not null default 'invited' check (status in ('invited','recorded')),
  created_at    timestamptz not null default now()
);

create index if not exists stories_status_idx on public.stories(status);
create index if not exists story_tags_story_idx on public.story_tags(story_id);

-- ── semantic search: "stories like this" + Belonging Circles ─────────────────
create or replace function public.match_stories(
  query_embedding vector(1536),
  match_count int default 5,
  exclude_id uuid default null
)
returns table (id uuid, similarity float)
language sql stable as $$
  select s.id, 1 - (s.embedding <=> query_embedding) as similarity
  from public.stories s
  where s.status = 'published'
    and s.embedding is not null
    and (exclude_id is null or s.id <> exclude_id)
  order by s.embedding <=> query_embedding
  limit match_count;
$$;

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.stories     enable row level security;
alter table public.story_tags  enable row level security;
alter table public.nominations enable row level security;

-- public can read only PUBLISHED + publicly-consented stories
create policy "public reads published stories"
  on public.stories for select
  using (status = 'published' and consent_public = true);

create policy "public reads tags of published stories"
  on public.story_tags for select
  using (exists (
    select 1 from public.stories s
    where s.id = story_id and s.status = 'published' and s.consent_public = true
  ));

-- anyone can submit a story (anon key) — it lands in 'processing'
create policy "anyone can submit a story"
  on public.stories for insert
  with check (status = 'processing');

create policy "anyone can nominate"
  on public.nominations for insert with check (true);

-- NYIC staff (authenticated) can read + manage everything
create policy "staff read all stories"
  on public.stories for select to authenticated using (true);
create policy "staff update stories"
  on public.stories for update to authenticated using (true);
create policy "staff read all tags"
  on public.story_tags for select to authenticated using (true);
create policy "staff manage tags"
  on public.story_tags for all to authenticated using (true) with check (true);

-- NOTE: create a Storage bucket named `story-audio` (private). The
-- process-story Edge Function reads from it with the service-role key.
