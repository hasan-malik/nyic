# #IChooseNY — Pitch & Presentation Playbook

> Everything you need to walk on stage and win. Read this once out loud before
> you present.

---

## 0. The one sentence

**"We don't ask immigrants to prove they're useful. We ask them a question that
only makes sense if they already belong — and we built the system that turns
that question into a 40-year archive, a community, and a voting bloc."**

---

## 1. The narrative shift (your whole thesis on one slide)

| | |
|---|---|
| **The old story** (everyone else will pitch this) | "Immigrants belong because they contribute — they work, they build, they pay taxes." |
| **Why it fails** | Usefulness only buys **tolerance**. You may stay *as long as you produce*. The "essential workers" of 2020 are the "invaders" of 2025. It leaves people auditioning forever. |
| **Our shift** | Belonging isn't a transaction. We built a system whose every question is **un-extractable** — nothing in it could be lifted into a fundraising deck as proof of worth. **#IChooseYou.** |

> Say this line to the judges: *"The question a system asks is a statement about
> what it believes a person is for. Every other story bank asks 'what did you
> contribute?' Ours asks 'what did you hold onto that you were told to give up?'"*

This is **not** a contradiction of NYIC's "immigrants built New York" message —
it's its **evolution**. Keep "we built New York" as the *legacy* layer (the
40-year archive). Add "…and we belong regardless" as the *emotional* core. Both/
and. Tell the judges you listened to NYIC's current narrative and elevated it.

---

## 2. THE OPEN — your first 60 seconds (do NOT skip this)

**Lights. No slide. Just sound.** Play **~30 seconds of one real interview** —
Amina's "I belong because someone chose me first," or Diego's "belonging is not a
paycheck, it's a block party in the dark." Let it breathe. Don't talk over it.

Then, one presenter, quietly:

> *"That was five minutes between two friends. No form, no donation, no 'now do
> something for us.' She was just… heard. We're going to show you the system that
> collects ten thousand of these — and turns them into the thing that actually
> moves laws."*

**Why it wins:** the rubric's #1 weight is Mission Alignment & emotional
resonance. You open by *enacting* belonging, not describing it. Judges feel it
before they evaluate it. (This is the "argues for belonging by enacting it"
principle, performed live.)

---

## 3. The 8-minute demo script (live, on the seeded build)

> The app runs on **seeded data with no network** — nothing can fail live. Have
> `/admin?staff=1` open in a second tab.

1. **(0:00) The open** — 30s audio (above). Land the narrative-shift slide.
2. **(1:30) Collect** → `/share`. Show the **mode toggle** (friend vs NYIC event
   booth) and walk the **Four Doorways**. Emphasize: *"Both people answer.
   Symmetry of vulnerability, asymmetry of stakes. The friend-to-friend design is
   the unlock — people freeze in front of strangers, but open up with someone who
   already loves them."* Hit "Use a sample interview."
3. **(3:00) The magic** → watch the **pipeline animate**: ElevenLabs Scribe →
   Claude Haiku care-check → Claude Sonnet tagging → pgvector. Drop the number:
   **"about two cents a story."**
4. **(4:00) Consent** → show identity = anonymous + voice-mask. *"Many neighbors
   have real reasons to hide. NY Proud failed in Rochester because people wouldn't
   put their face on a billboard. We're audio-first and consent-first."*
5. **(4:45) The bank** → `/stories`. Search "belonging," filter Legacy. *"Forty
   years, every language, searchable by feeling."*
6. **(5:30) The brain** → `/admin`. The console: word cloud, archive
   intelligence, momentum, **$ vs the $150k NY Proud budget.**
7. **(6:30) The payoff** → `/admin/circles`. **Belonging Circles** — *"the AI
   found that Amina, Diego, and Fatou share a thread. Three countries, same heart.
   It proposes a monthly gathering. This is how a witnessed person becomes a
   ten-year member."* Then `/admin/activation` → **"a bill is moving"** match +
   the daily Runway feature.
8. **(7:30) Close** (see §7).

---

## 4. How it scores every rubric box (25% each)

- **Mission Alignment & Insight** — the un-extractable question + the narrative
  shift. You respond to the *actual* brief: re-engage, collect 40 years, drive
  action. You hit all three deliverables explicitly.
- **Creativity & Originality** — Four Doorways methodology, friend-to-friend
  virality ("minute of fame"), Belonging Circles, advocacy story-match. No one
  else will have these.
- **Execution & Clarity** — a *working* end-to-end product + one clean
  architecture diagram + the sound-first open. Polished, not half-built.
- **Feasibility & Viability** — **2¢/story** vs **$150k** NY Proud; runs on
  NYIC's existing stack (Salesforce, Google, Publer); one coordinator + volunteers
  (1:25); consent/anonymity = ethically collectible. Quote these numbers.

---

## 5. The Instagram side-by-side (do it — it sells "real")

**Yes — make a real `@ichoose.ny` Instagram and pre-load 3–4 posts.** It's the
single cheapest way to make the whole thing feel *alive* and shipped, not
theoretical. Put the phone (or a mock IG feed) **next to** the laptop demo.

- 2 posts = a **Runway-animated reel** with the real narrator voice (see §6).
- 1–2 posts = a **static "pull-quote" card** ("My worth did not start at the cash
  register." — Fatou, Harlem) — takes 2 minutes in Canva, looks great in a grid.
- Caption formula: pull-quote → 1 line of context → `#IChooseNY #IChooseYou` →
  soft CTA ("Tag a friend you'd interview").

**Effort + innovation signal:** "We didn't just design this — we ran it. Here's
the account, here's a real animated story, here's the daily cadence NYIC would
keep." That sentence wins Execution points.

---

## 6. Runway plan (you're on the free plan — that's fine)

You have a **one-time ~4,500 credits**, no recurring. Plan accordingly — make
**1, ideally 2, genuinely great** animated stories, not ten rough ones.

- **Recipe per video (~15s):** take ONE story's pull-quote + ~15s of the real
  voice. In Runway: Image→Video or the "Educational content / Animation" starter
  kit. Generate 3–4 short evocative shots (e.g., a subway platform in winter, a
  braiding chair, a block party at dusk — abstract, no real faces) and cut them
  to the audio. Add the pull-quote as a text overlay. Keep motion subtle and
  poetic; this is testimony, not a product ad.
- **Voice = the original recording from Supabase**, exactly as you said. It's
  more powerful than any TTS. **Important anonymity rule:** only use the real
  voice if the narrator's consent is `identity ≠ anonymous` **and**
  `anonymizeVoice = false`. For anonymous tellers, run the audio through
  **ElevenLabs Voice Changer** first (keeps the emotion, hides the person) — the
  app already captures this preference in the consent step.
- **Credits trick:** you *can* spin up multiple free accounts for a couple more
  generations, but don't sink time into volume. Two polished 15s reels (one
  uplifting = Diego, one tender = Amina) is the right scope for a demo.

---

## 7. The close (memorize this)

> *"NYIC has spent forty years proving immigrants are useful. We think they're
> done auditioning. #IChooseNY collects the stories no fundraising deck could
> ask for, for two cents each, and turns strangers into a circle, and a circle
> into a voting bloc. We're not asking these New Yorkers to earn their place.
> We're telling them: we already chose you."*

Hold. Then: *"Thank you — and play Amina one more time if they're quiet." (only
if it lands).*

---

## 8. Q&A — have these ready

- **"What's the 15-second video?"** → that's your Runway-animated daily Insta
  reel (§6). If the hackathon requires a 15s *submission teaser*, reuse the §2
  open: 8s of real audio over the pull-quote card → 4s of the connection-map /
  Belonging Circles → 3s `#IChooseNY` logo + "2¢ a story · 40 years · 4.5M
  voices." (See note below — confirm the exact requirement with organizers.)
- **"Multilingual?"** → Yes, fully. We do **not** make people self-translate
  (their current volunteers do it by hand). ElevenLabs Scribe handles 30+
  languages with detection; we store the original language *and* an English
  translation. Whisper is our cheap fallback.
- **"Abuse / trolls?"** → Claude Haiku flags into a human review queue; nothing
  auto-publishes; public submissions land as `processing`, RLS hides them until a
  staffer approves.
- **"Why will people share?"** → Friends, not strangers (organizers confirmed
  this is the unlock). Plus the "minute of fame" — your interview can be the
  story of the day. The viral loop (nominate 2) does the growth.
- **"Privacy for the scared?"** → anonymity, pseudonym, voice-mask, delete-anytime;
  audio-first means no face required; transcript-only public sharing is the
  default for anonymous tellers (see §9).

---

## 9. On your "post-to-Instagram-and-tag-us" idea — it FITS (with one guardrail)

You asked whether two intake doors contradict our principles. **They don't —
they're a clean fit, and they map onto consent settings we already built.** Two
doors:

1. **The Proud Door (public):** teller is happy to be seen → they post their reel
   to IG and tag `@nyic`; NYIC reshares and ingests it into the bank. Maximum
   reach + virality. *Guardrail:* the "tag us" is **teller-initiated**, so it's
   not the extractive "now do something for us." Still principle-safe. **One fix:**
   also capture the **audio into Supabase** (not just the reshared reel) so it gets
   transcribed, tagged, and made searchable — otherwise IG-only stories never
   enter the brain. Easiest: they post to IG *and* submit on the site; or NYIC
   pulls the reel's audio on reshare.
2. **The Safe Door (anonymous):** teller fears backlash → uploads on the web →
   **only the transcript (and/or masked voice) is public.** Correct on all counts.

**The one correction:** you said Runway videos "would still use the original
voice." Yes — **but only for the Proud Door**. For an anonymous teller, their raw
voice is biometric and identifying; a public Runway video must use the
**ElevenLabs-masked** voice (or text-only animation). The consent dial in
**Doorway 4** is exactly where the teller sets this, and the app already stores
`anonymizeVoice`. So: *proud → real voice; anonymous → masked voice, always.*

This is a great addition — it's a one-field change (`share_channel: 'ig' | 'web'`)
on top of the consent model that's already there. Pitch it as **"two doors, one
dial: the teller chooses how visible they are, every time."**

---

## 10. Cheat-sheet numbers (say these out loud)

- **2¢** — cost to fully process one story (transcribe + moderate + tag + embed).
- **$150k** — NYIC's current NY Proud campaign budget (billboards/subway/PR). We
  do the collection layer for a rounding error of that.
- **4.5M** immigrants served · **40 years** · **1 volunteer : 25 people.**
- **A few dozen** great stories is a winning launch (per NYIC) — depth over volume.
```
```
> Note: I don't have the official presentation-guidelines file, so the exact
> "15-second video" spec in §8 is my best inference — confirm the precise
> requirement (teaser vs. in-deck reel, dimensions, due time) with the organizers.
