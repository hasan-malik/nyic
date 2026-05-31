// "The Question That Doesn't Extract" — NYIC's conversation guide.
//
// Four open doorways in a fixed order. Two people sit across from each other;
// BOTH answer every question. Symmetry of vulnerability, asymmetry of stakes.
// Nothing is asked in return — being heard, and asked for nothing, is the point.

export interface Doorway {
  n: number;
  phase: string;
  question: string;
  why: string;
}

export const DOORWAYS: Doorway[] = [
  {
    n: 1,
    phase: "Opening",
    question:
      "What's a small thing you do that would tell someone they're in your home?",
    why: "You're the authority on your own life. Warms the room without asking for anything exposing.",
  },
  {
    n: 2,
    phase: "First descent",
    question:
      "What's something you carry that the people around you don't fully understand?",
    why: "The gap in stakes sits in the open air. A thing not understood is the opposite of an extractable contribution.",
  },
  {
    n: 3,
    phase: "Deepest",
    question: "What's something you held onto that you were told to give up?",
    why: "The kintsugi question. It presumes the person is whole and asks about the self underneath the function.",
  },
  {
    n: 4,
    phase: "Hand-back",
    question:
      "What do you want the person across from you to remember about what you just said?",
    why: "Returns authorship. Names the witness in the room and lets the teller decide what this was for — and sets the consent dial.",
  },
];

export type CollectionMode = "friend" | "booth";

export const MODE_COPY: Record<
  CollectionMode,
  { label: string; blurb: string }
> = {
  friend: {
    label: "With a friend",
    blurb:
      "Someone who already knows you. No strangers — that's the whole point. Easier, braver, more honest.",
  },
  booth: {
    label: "At an NYIC event",
    blurb:
      "A trained volunteer gently steers the conversation at a fair, gala, or resource booth. Still friend-to-friend.",
  },
};
