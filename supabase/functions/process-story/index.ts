// Supabase Edge Function: process-story
//
// Triggered after an audio upload. Runs the full pipeline:
//   1. ElevenLabs Scribe  → multilingual transcript
//   2. Claude Haiku        → care check (flags sensitive content for a human)
//   3. Claude Sonnet       → summary, pull-quote, sentiment, theme tags
//   4. OpenAI embeddings   → pgvector for search + Belonging Circles
//
// Deploy:  supabase functions deploy process-story
// Secrets: supabase secrets set ELEVENLABS_API_KEY=... ANTHROPIC_API_KEY=... OPENAI_API_KEY=...
//
// Cost per 5-min story ≈ $0.02 (ElevenLabs covered by credits; Haiku+Sonnet+embeddings are pennies).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ELEVENLABS = Deno.env.get("ELEVENLABS_API_KEY")!;
const ANTHROPIC = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI = Deno.env.get("OPENAI_API_KEY")!;

const HAIKU = "claude-haiku-4-5-20251001";
const SONNET = "claude-sonnet-4-6";

Deno.serve(async (req) => {
  try {
    const { storyId, audioPath } = await req.json();

    // 1 ── download audio from private Storage
    const { data: file, error: dlErr } = await supabase.storage
      .from("story-audio")
      .download(audioPath);
    if (dlErr) throw dlErr;

    // 2 ── ElevenLabs Scribe (multilingual STT + language detection)
    const fd = new FormData();
    fd.append("file", file, "interview.webm");
    fd.append("model_id", "scribe_v1");
    const sttRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS },
      body: fd,
    });
    const stt = await sttRes.json();
    const transcript: string = stt.text ?? "";
    const language: string = stt.language_code ?? "unknown";

    // 3 ── Claude Haiku: care check (flag-only, never auto-reject)
    const moderation = await claude(HAIKU, [
      {
        role: "user",
        content:
          `You are a compassionate content reviewer for an immigrant-rights org. ` +
          `Read this story transcript. Return STRICT JSON: ` +
          `{"flagged":bool,"sensitive":bool,"reason":string}. ` +
          `"sensitive"=true for trauma (detention, abuse, violence) that we KEEP but handle with care — never reject it. ` +
          `"flagged"=true only if it needs a human before publishing (PII of others, hate speech, doxxing).\n\n` +
          transcript,
      },
    ]);
    const mod = safeJson(moderation, {
      flagged: false,
      sensitive: false,
      reason: "",
    });

    // 4 ── Claude Sonnet: summary, pull-quote, sentiment, tags
    const analysis = await claude(SONNET, [
      {
        role: "user",
        content:
          `Analyze this immigrant story for the #IChooseNY bank. Return STRICT JSON: ` +
          `{"summary":string (<=18 words),"pull_quote":string (verbatim, most moving sentence),` +
          `"sentiment":"uplifting"|"bittersweet"|"somber"|"hopeful",` +
          `"tags":[{"label":string,"category":"emotion"|"theme"|"topic"|"struggle"|"heritage"|"lifeStage"}]}.\n` +
          `Tag richly (8-12 tags) across MULTIPLE dimensions so the archive is searchable: ` +
          `mood/emotion (e.g. Hopeful, Proud, Nostalgic); key themes (Belonging, Motherhood, Faith, Work…); ` +
          `topic (Small business, Education, Housing…); the central struggle (Detention, Seeking asylum, ` +
          `Language barrier, Family separation…); and cultural heritage / diaspora background ` +
          `(e.g. West African, Caribbean, South Asian) inferred respectfully from the story. ` +
          `Do not invent facts; only tag what the narrator conveys.\n\n` +
          transcript,
      },
    ]);
    const a = safeJson(analysis, {
      summary: "",
      pull_quote: "",
      sentiment: "hopeful",
      tags: [],
    });

    // 5 ── OpenAI embedding for semantic search / Belonging Circles
    const embRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: transcript.slice(0, 8000),
      }),
    });
    const embedding = (await embRes.json()).data?.[0]?.embedding ?? null;

    // 6 ── persist; sensitive/flagged stories go to the review queue
    const status = mod.flagged || mod.sensitive ? "in_review" : "published";
    await supabase
      .from("stories")
      .update({
        transcript,
        language,
        summary: a.summary,
        pull_quote: a.pull_quote,
        sentiment: a.sentiment,
        embedding,
        moderation_flagged: mod.flagged,
        moderation_sensitive: mod.sensitive,
        moderation_reason: mod.reason,
        status,
      })
      .eq("id", storyId);

    if (Array.isArray(a.tags) && a.tags.length) {
      await supabase.from("story_tags").insert(
        a.tags.map((t: { label: string; category: string }) => ({
          story_id: storyId,
          label: t.label,
          category: t.category,
        }))
      );
    }

    return Response.json({ ok: true, status });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
});

// ── helpers ───────────────────────────────────────────────────────────────
async function claude(model: string, messages: unknown[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: 1024, messages }),
  });
  const json = await res.json();
  return json.content?.[0]?.text ?? "";
}

function safeJson<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? (JSON.parse(match[0]) as T) : fallback;
  } catch {
    return fallback;
  }
}
