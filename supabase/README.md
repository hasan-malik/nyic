# Going live on Supabase

The app ships in **demo mode** (seeded data, zero network) so it always works
on stage. To make it live, here's everything NYIC needs — about 15 minutes.

## What I need from you on Supabase

1. **A Supabase project** → copy the **Project URL** and **anon key**
   (Settings → API). Put them in `.env`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   That alone flips the frontend to live mode.

2. **Run the schema** (creates tables, pgvector, RLS):
   ```bash
   supabase db push          # or paste supabase/migrations/0001_init.sql into the SQL editor
   ```

3. **Create a private Storage bucket** named `story-audio` (uploads land here).

4. **Deploy the pipeline** Edge Function + set its secrets:
   ```bash
   supabase functions deploy process-story
   supabase secrets set \
     ELEVENLABS_API_KEY=...  \
     ANTHROPIC_API_KEY=...   \
     OPENAI_API_KEY=...      \
     SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. **(Optional) Auth** — add NYIC staff as users; RLS already restricts the
   dashboard's full-archive access to `authenticated` users only.

## The pipeline (runs per upload, ≈ 2¢/story)

```
audio → story-audio bucket
      → process-story Edge Function
          1. ElevenLabs Scribe   → multilingual transcript
          2. Claude Haiku         → care check (flags for human, never auto-rejects)
          3. Claude Sonnet        → summary, pull-quote, sentiment, theme tags
          4. OpenAI embeddings    → pgvector (search + Belonging Circles)
      → row.status = 'published' | 'in_review'
```

## Where to get the keys

| Key | Where | Notes |
|-----|-------|-------|
| Supabase URL + anon + service-role | supabase.com → Project → Settings → API | anon is public; service-role is secret |
| ELEVENLABS_API_KEY | elevenlabs.io → profile (top-right) → **API Keys** | Scribe model; your credits cover STT |
| ANTHROPIC_API_KEY | console.anthropic.com → **API Keys** | Haiku + Sonnet |
| OPENAI_API_KEY | platform.openai.com → **API Keys** | embeddings (+ Whisper fallback) |
