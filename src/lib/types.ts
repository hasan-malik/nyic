// Domain model for the #IChooseNY story bank.

/** Lifecycle of a story as it moves through the AI pipeline. */
export type StoryStatus =
  | "processing" // pipeline is running
  | "in_review" // Haiku flagged something; needs a human
  | "published" // live on the public gallery
  | "rejected"; // a human declined to publish

/** Each stage the audio passes through after upload. */
export type PipelineStage =
  | "uploaded"
  | "transcribed"
  | "moderated"
  | "tagged"
  | "embedded"
  | "published";

export type StageState = "pending" | "running" | "done" | "flagged";

export interface StageStatus {
  stage: PipelineStage;
  state: StageState;
  /** Human-readable note, e.g. which model ran. */
  detail?: string;
}

/** How the narrator chose to appear publicly. */
export interface ConsentSettings {
  /** Narrator agreed to public sharing at all. */
  publicShare: boolean;
  /** Show a real first name, a pseudonym, or stay anonymous. */
  identity: "name" | "pseudonym" | "anonymous";
  displayName: string;
  /** Mask the voice with ElevenLabs voice-changer for safety. */
  anonymizeVoice: boolean;
  /** Narrator allows NYIC to use the story in campaigns / social. */
  allowCampaignUse: boolean;
}

/** A theme tag produced by Claude Sonnet. */
export interface StoryTag {
  label: string;
  /** Coarse category used for filtering + analytics. */
  category: "emotion" | "theme" | "lifeStage" | "topic";
}

export interface Story {
  id: string;
  /** Track the story belongs to. */
  track: "new" | "legacy"; // legacy = 40-year-history voices
  /**
   * Which NYIC member organization collected/surfaced this story. NYIC is an
   * umbrella coalition of 200+ member orgs; attribution credits them and powers
   * role-based access (a member org sees its own stories in the console).
   */
  memberOrg?: string;
  /** Who recorded whom (the friend-interviews-friend mechanic). */
  narratorDisplay: string; // resolved from consent
  interviewerName: string;
  /** City / neighborhood, country of origin (optional, consented). */
  location: string;
  origin: string;
  /** Years in New York, if shared. */
  yearsInNY?: number;

  status: StoryStatus;
  stages: StageStatus[];

  /** Audio. In local/demo mode this is a public sample URL. */
  audioUrl: string;
  durationSec: number;
  language: string; // detected by transcription

  /** AI outputs. */
  transcript: string;
  summary: string; // one-line, Sonnet
  pullQuote: string; // the sentence to feature
  tags: StoryTag[];
  sentiment: "uplifting" | "bittersweet" | "somber" | "hopeful";
  /** Haiku moderation result. */
  moderation: {
    flagged: boolean;
    reason?: string;
    /** True trauma content we keep but handle with care. */
    sensitive: boolean;
  };

  consent: ConsentSettings;

  /** Activation. */
  featured: boolean; // featured on the public site
  animationStatus: "none" | "queued" | "rendered";
  /** Friends this narrator nominated next (viral loop). */
  nominations: number;

  createdAt: string; // ISO
  /** The call-to-action chosen for this story. */
  cta: { label: string; href: string };
}

export interface Nomination {
  id: string;
  fromStoryId: string;
  invitedName: string;
  status: "invited" | "recorded";
}
