import type { Lesson, Module } from "./types";
import rawLessons from "./generated/lessons.json";

// Maps the original course-builder export's block ids to stable, readable slugs used in URLs.
// Order here is the authored reading order within each module.
const SLUG_MAP: Record<string, { slug: string; moduleId: Module["id"] }> = {
  ahgbhirzw: { slug: "welcome-to-beige", moduleId: "module-1" },
  fbyxrbgsr: { slug: "the-beige-platform", moduleId: "module-1" },
  pymaeeyuy: { slug: "your-role-earning-potential", moduleId: "module-1" },
  ejbomsbli: { slug: "traction-partnerships-competitive-edge", moduleId: "module-1" },

  nytyfovrc: { slug: "lead-hit-funnel", moduleId: "module-2" },
  ejhmfwitn: { slug: "initial-client-contact", moduleId: "module-2" },
  yigkaemjk: { slug: "scheduling-discovery-calls", moduleId: "module-2" },
  cmrecuyfh: { slug: "invoice-creation", moduleId: "module-2" },
  lhtxafopm: { slug: "payment-processing-policies", moduleId: "module-2" },
  jzijwwwnr: { slug: "hubspot-crm-revenue-sheet", moduleId: "module-2" },
  tpingpcaa: { slug: "slack-discord-communication", moduleId: "module-2" },
  gtdtusntn: { slug: "follow-up-pending-client-status", moduleId: "module-2" },

  glpaohlli: { slug: "universal-call-script-framework", moduleId: "module-3" },
  ifvmvypbe: { slug: "weddings", moduleId: "module-3" },
  psqgpnxpj: { slug: "corporate-events", moduleId: "module-3" },
  krdrjnqau: { slug: "music-videos", moduleId: "module-3" },
  jjqthbeum: { slug: "private-events", moduleId: "module-3" },
  izrxinuww: { slug: "podcasts", moduleId: "module-3" },
  jitshgfpm: { slug: "film-projects", moduleId: "module-3" },
  epbaglois: { slug: "commercials", moduleId: "module-3" },
  mbxtcokvw: { slug: "memorials", moduleId: "module-3" },
  jfsmkccaf: { slug: "sms-voicemail-quick-reference", moduleId: "module-3" },

  dxeiwepff: { slug: "common-objections-rebuttals", moduleId: "module-4" },
  paihdjurr: { slug: "discount-strategy-closing", moduleId: "module-4" },
  ziempbfsn: { slug: "follow-up-urgency-strategy", moduleId: "module-4" },
  wmzqjzuvc: { slug: "scenario-tough-corporate-call", moduleId: "module-4" },
};

const generated: Lesson[] = (rawLessons as any[]).map((raw, idx) => {
  const mapping = SLUG_MAP[raw.sourceId];
  if (!mapping) throw new Error(`No slug mapping for source lesson ${raw.sourceId}`);
  return {
    id: mapping.slug,
    moduleId: mapping.moduleId,
    title: raw.title,
    order: idx,
    blocks: raw.blocks,
  };
});

// Editorial additions: the "Universal Call Script Framework" page lost
// its entire body to a never-rendered AI-video placeholder (video: null in the
// source). Replaced with an authored process breakdown grounded in the storyboard
// spec and the shared structure of all 9 docx scripts.
const universalFramework = generated.find((l) => l.id === "universal-call-script-framework")!;
universalFramework.blocks.push({
  type: "process",
  steps: [
    {
      title: "1. Intro",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Greet the client by name, identify yourself and Beige, and reference their Thumbtack inquiry directly. “Hello [Name], this is [Your Name] with Beige Video & Photo from Thumbtack.”",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      title: "2. Value Propositions",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Lead with brand credibility — Amazon, Chase, Rolls Royce for corporate; congratulate/condolences for emotional events — and customize the pitch to the event type before asking anything.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      title: "3. Discovery Questions",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Use filler affirmations throughout (“great,” “awesome,” “absolutely,” “amazing”). Always ask: services needed (video/photo/both), hours of coverage, location, guest count, their vision and key moments, video length/deliverables, budget, and email.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      title: "4. Wrap-Up",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "Promise a proposal, send portfolio links relevant to their event type, and set a concrete follow-up window.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      title: "5. Closing",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "“After I send that information, when's a good time to circle back? Dates are filling up quickly, so we'd love to get things finalized.”",
              marks: ["italic"],
            },
          ],
        },
      ],
    },
  ],
});

// Live-data verification pass: cross-checked this content against real, recent
// (Aug 2026) Quo/OpenPhone call transcripts, call summaries, and SMS threads
// across the sales lines. These additions capture what's actually current in
// the field that the original authoring never had visibility into.
function findLesson(id: string) {
  const l = generated.find((x) => x.id === id);
  if (!l) throw new Error(`No lesson ${id} to append live-data notes to`);
  return l;
}

findLesson("lead-hit-funnel").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [
        { text: "Verified from live data — the 13 active Beige Sales Zones: ", marks: ["bold"] },
        {
          text: "SF, Miami, Atlanta, DC, Nashville, Boston, Phoenix, Chicago, LA, Houston, New York, Ohio, and Hawaii. Each zone runs its own dedicated Quo (formerly OpenPhone) number — that's the \"Beige [Market]\" name you'll use when you introduce yourself.",
          marks: [],
        },
      ],
    },
  ],
});

findLesson("initial-client-contact").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [{ text: "Current standard first-touch text (verified from live threads, Aug 2026):", marks: ["bold"] }],
    },
    {
      type: "paragraph",
      spans: [
        {
          text: "\"Hi [Name], We saw your inquiry come through on Thumbtack. We're the top-rated videography company on the platform and would love to hear more about your project. Grab a time, give us a call, or text us back here: [your Google Calendar booking link] — Beige, https://beige.app/\"",
          marks: ["italic"],
        },
      ],
    },
    {
      type: "paragraph",
      spans: [
        {
          text: "This short, link-first version is what's actually going out today — send it immediately, then use the fuller event-specific voicemail/SMS scripts in Module 3 once you're following up or leaving a voicemail.",
          marks: [],
        },
      ],
    },
  ],
});

findLesson("invoice-creation").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [
        {
          text: "Live-verified update: ",
          marks: ["bold"],
        },
        {
          text: "proposals are now commonly sent as a beige.app quote link (beige.app/quotes/preview?quoteKey=...) alongside Invoice Simple. Same information either way — package details, price, and a one-click view for the client.",
          marks: [],
        },
      ],
    },
  ],
});

findLesson("payment-processing-policies").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [
        { text: "Live-verified Zelle details: ", marks: ["bold"] },
        { text: "accounting@beigecorporation.io, or the Zelle tag ", marks: [] },
        { text: "@beigecorp", marks: ["bold", "code"] },
        { text: " — either works, share whichever is easier for the client.", marks: [] },
      ],
    },
  ],
});

findLesson("weddings").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [{ text: "Live-verified example package structure (Aug 2026 — treat as illustrative, always confirm current pricing):", marks: ["bold"] }],
    },
    {
      type: "list",
      ordered: false,
      items: [
        [{ text: "$1,500 — 6 hrs videography + 3–4 min highlight film", marks: [] }],
        [{ text: "$1,950 — 6 hrs videography + highlight film + extended wedding film", marks: [] }],
        [{ text: "$2,500 — 6 hrs, 2 videographers + highlight + extended film + drone (weather/location permitting)", marks: [] }],
        [{ text: "~$2,950 — bundled 6 hrs photo + 6 hrs video + highlight + extended film (the bundle is almost always better value than booking photo and video separately — lead with that)", marks: [] }],
      ],
    },
    {
      type: "paragraph",
      spans: [
        {
          text: "Also confirmed live: a single hybrid creator covering both photo and video is a real, lower-cost option worth offering budget-conscious clients alongside separate dedicated photo + video crews.",
          marks: [],
        },
      ],
    },
  ],
});

findLesson("corporate-events").blocks.push({
  type: "note",
  blocks: [
    {
      type: "paragraph",
      spans: [
        { text: "Live-verified example: ", marks: ["bold"] },
        {
          text: "a 4-hour corporate booking with one hybrid creator (photo + video, no edit/cull add-on) priced at $800. Use this as a rough anchor, not a fixed rate — always confirm current pricing before quoting.",
          marks: [],
        },
      ],
    },
  ],
});

// The Wedding Budget Pushback scenario has no source block from the original export (it was
// never authored) - hand-add its lesson entry so the branching dialogue has a
// page to live on, matching the shape of the existing "Tough Corporate Call"
// scenario lesson.
generated.push({
  id: "scenario-wedding-budget-pushback",
  moduleId: "module-4",
  title: "Live Scenario: Wedding Budget Pushback",
  order: generated.length,
  blocks: [
    { type: "eyebrow", text: "MODULE 4 · LIVE SCENARIOS" },
    {
      type: "heading",
      level: 2,
      spans: [{ text: "Live Scenario: Wedding Budget Pushback", marks: [] }],
    },
    {
      type: "paragraph",
      spans: [
        { text: "You're a Beige sales rep. ", marks: [] },
        { text: "A wedding lead", marks: ["bold"] },
        {
          text: " just responded to your proposal saying it's a bit out of their budget. Apply everything from Modules 1–4: empathy first, discipline on the discount ceiling, and real urgency.",
          marks: [],
        },
      ],
    },
    {
      type: "paragraph",
      spans: [{ text: "Make the right choices — every decision matters.", marks: ["bold"] }],
    },
    { type: "scenario-ref", rootNodeId: "n1" },
  ],
});

export const LESSONS: Lesson[] = generated;

export const LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l])
);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS_BY_ID[id];
}

export const MODULES: Module[] = [
  {
    id: "module-1",
    order: 1,
    title: "Welcome to Beige",
    shortTitle: "Welcome",
    description: "Beige's mission, the three-pillar platform, and your role and earning potential as a sales rep.",
    color: "#e8d1ab",
    coverImage: "/images/module-1-cover.png",
    items: [
      { kind: "lesson", id: "welcome-to-beige" },
      { kind: "lesson", id: "the-beige-platform" },
      { kind: "lesson", id: "your-role-earning-potential" },
      { kind: "lesson", id: "traction-partnerships-competitive-edge" },
    ],
  },
  {
    id: "module-2",
    order: 2,
    title: "Tools & Systems",
    shortTitle: "Tools",
    description: "The full lead-to-cash workflow: Thumbtack, OpenPhone, Invoice Simple, HubSpot, Slack & Discord.",
    color: "#e8d1ab",
    coverImage: "/images/module-2-cover.png",
    items: [
      { kind: "lesson", id: "lead-hit-funnel" },
      { kind: "lesson", id: "initial-client-contact" },
      { kind: "lesson", id: "scheduling-discovery-calls" },
      { kind: "lesson", id: "invoice-creation" },
      { kind: "lesson", id: "payment-processing-policies" },
      { kind: "lesson", id: "hubspot-crm-revenue-sheet" },
      { kind: "lesson", id: "slack-discord-communication" },
      { kind: "lesson", id: "follow-up-pending-client-status" },
    ],
    quizId: "quiz-tools-workflow",
  },
  {
    id: "module-3",
    order: 3,
    title: "Call Scripts & Event Types",
    shortTitle: "Scripts",
    description: "The universal call framework plus dedicated scripts for all 9 Beige event types.",
    color: "#e8d1ab",
    coverImage: "/images/module-3-cover.png",
    items: [
      { kind: "lesson", id: "universal-call-script-framework" },
      { kind: "lesson", id: "weddings" },
      { kind: "lesson", id: "corporate-events" },
      { kind: "lesson", id: "music-videos" },
      { kind: "lesson", id: "private-events" },
      { kind: "lesson", id: "podcasts" },
      { kind: "lesson", id: "film-projects" },
      { kind: "lesson", id: "commercials" },
      { kind: "lesson", id: "memorials" },
      { kind: "lesson", id: "sms-voicemail-quick-reference" },
    ],
    quizId: "quiz-scripts-event-types",
  },
  {
    id: "module-4",
    order: 4,
    title: "Objection Handling & Live Scenarios",
    shortTitle: "Objections",
    description: "Rebuttals, discount discipline, urgency strategy, and two live branching-dialogue scenarios.",
    color: "#e8d1ab",
    coverImage: "/images/module-4-cover.png",
    items: [
      { kind: "lesson", id: "common-objections-rebuttals" },
      { kind: "lesson", id: "discount-strategy-closing" },
      { kind: "lesson", id: "follow-up-urgency-strategy" },
      { kind: "lesson", id: "scenario-tough-corporate-call" },
      { kind: "lesson", id: "scenario-wedding-budget-pushback" },
    ],
    quizId: "quiz-objection-handling",
  },
  {
    id: "module-5",
    order: 5,
    title: "Quizzes & Certification",
    shortTitle: "Certify",
    description: "Prove mastery of each module, then pass the final assessment to earn your Beige Sales Rep Certification.",
    color: "#e8d1ab",
    coverImage: "/images/module-5-cover.png",
    items: [
      { kind: "quiz", id: "quiz-tools-workflow" },
      { kind: "quiz", id: "quiz-scripts-event-types" },
      { kind: "quiz", id: "quiz-objection-handling" },
      { kind: "quiz", id: "final-certification-assessment" },
    ],
  },
];

export const MODULES_BY_ID: Record<string, Module> = Object.fromEntries(
  MODULES.map((m) => [m.id, m])
);

export function nextLessonId(currentId: string): string | null {
  const flatOrder = MODULES.flatMap((m) => m.items);
  const idx = flatOrder.findIndex((i) => i.id === currentId);
  if (idx === -1 || idx === flatOrder.length - 1) return null;
  return flatOrder[idx + 1].id;
}

export function moduleForItem(itemId: string): Module | undefined {
  return MODULES.find((m) => m.items.some((i) => i.id === itemId));
}
