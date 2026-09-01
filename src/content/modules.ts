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

// Recursively swaps text across a lesson's blocks - used for terminology corrections
// that don't warrant a full section rewrite (see the "process refresh" pass below).
function deepReplaceText(node: any, from: string, to: string) {
  if (Array.isArray(node)) {
    node.forEach((n) => deepReplaceText(n, from, to));
    return;
  }
  if (node && typeof node === "object") {
    if (typeof node.text === "string" && node.text.includes(from)) {
      node.text = node.text.split(from).join(to);
    }
    for (const key of Object.keys(node)) deepReplaceText(node[key], from, to);
  }
}

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

// Inserts a full-width lead image right after the lesson's heading block, so every
// lesson opens with a relevant visual instead of jumping straight into body text.
function insertHeroImage(id: string, src: string, alt: string) {
  const l = findLesson(id);
  const headingIdx = l.blocks.findIndex((b) => b.type === "heading");
  const insertAt = headingIdx === -1 ? 0 : headingIdx + 1;
  l.blocks.splice(insertAt, 0, { type: "image", src, alt });
}

// Attaches a relevant photo/screenshot to each step of a lesson's process block,
// so multi-step SOPs read as an illustrated walkthrough rather than a text wall.
function addStepImages(id: string, images: string[]) {
  const l = findLesson(id);
  const proc = l.blocks.find((b) => b.type === "process");
  if (!proc || proc.type !== "process") throw new Error(`No process block in lesson ${id}`);
  proc.steps.forEach((step, i) => {
    if (images[i]) step.image = images[i];
  });
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

// ---------------------------------------------------------------------------
// Process refresh (Aug 2026): a wider pull of live Quo threads - 100 recent
// conversations, ~400 messages, across every sales zone - shows the deal flow
// has moved on from what the original course describes. Zero occurrences of
// "Invoice Simple" or "HoneyBook" turned up anywhere in that sample; every
// proposal instead goes out as a beige.app quote link
// (beige.app/quotes/preview?quoteKey=...), which also handles the client's
// digital signature on the same page ("Just saw contract signed!" - no
// separate contract step). Every payment instruction observed was Zelle
// (accounting@beigecorporation.io or the tag @beigecorp) sent directly over
// text; no wire transfer or credit card payment appeared in the sample.
// Terminology swaps for lessons that only mention the old tool name in passing:
deepReplaceText(findLesson("welcome-to-beige").blocks, "Invoice Simple", "beige.app");
deepReplaceText(findLesson("your-role-earning-potential").blocks, "Invoice Simple", "beige.app");
deepReplaceText(findLesson("hubspot-crm-revenue-sheet").blocks, "Invoice Simple estimate link", "beige.app quote link");
deepReplaceText(findLesson("hubspot-crm-revenue-sheet").blocks, "Invoice Simple", "beige.app");

// Full rewrite: the invoice-creation lesson's actual steps changed, not just
// the tool's name (quoting and contract signing merged into one beige.app page).
const proposalLesson = findLesson("invoice-creation");
proposalLesson.title = "Proposal & Quote Creation";
proposalLesson.blocks = [
  { type: "eyebrow", text: "MODULE 2 · TOOLS & SYSTEMS" },
  { type: "heading", level: 2, spans: [{ text: "Proposal & Quote Creation", marks: [] }] },
  {
    type: "paragraph",
    spans: [
      {
        text: "Every proposal now goes out through beige.app's built-in quoting tool. It replaced the old Invoice Simple workflow entirely — live deal threads show zero Invoice Simple usage, and the beige.app quote page does more in one step: pricing, package details, and the client's digital signature all live on the same link.",
        marks: [],
      },
    ],
  },
  {
    type: "process",
    steps: [
      {
        title: "1. Gather Client Info",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 1: Gather Client Info", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              { text: "Pull everything from the ", marks: [] },
              { text: "Thumbtack inquiry", marks: ["bold"] },
              { text: ": full name, phone number, mailing address, email address. Double-check these — errors here create friction later.", marks: [] },
            ],
          },
        ],
      },
      {
        title: "2. Build the Quote in beige.app",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 2: Build the Quote in beige.app", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              { text: "Create the quote directly in ", marks: [] },
              { text: "beige.app", marks: ["bold"] },
              { text: " with: package and service details, shoot date, location, coverage hours, crew/camera setup, and edit deliverables.", marks: [] },
            ],
          },
          {
            type: "list",
            ordered: false,
            items: [
              [{ text: "Standard inclusions to add every time: creative direction, IP rights (client owns the raw content), $1M liability insurance.", marks: [] }],
            ],
          },
        ],
      },
      {
        title: "3. Send the Quote Link",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 3: Send the Quote Link", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "beige.app generates a shareable link in the form beige.app/quotes/preview?quoteKey=... Text it to the client via OpenPhone (Quo) right after the call, and have it emailed as a backup in case the text bounces.",
                marks: [],
              },
            ],
          },
          {
            type: "paragraph",
            spans: [
              { text: "This one link is the whole proposal experience: ", marks: [] },
              { text: "the client reviews pricing and signs on the same page", marks: ["bold"] },
              { text: " — there's no separate contract step to chase down.", marks: [] },
            ],
          },
        ],
      },
      {
        title: "4. Follow Up",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 4: Follow Up", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "If the client hasn't opened or signed within a day or two, send a short check-in referencing the quote directly — real threads show this is often what gets a stalled deal moving again.",
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "note",
    blocks: [
      {
        type: "paragraph",
        spans: [{ text: "What changed from the old training: ", marks: ["bold"] }],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Invoice Simple is no longer part of the live workflow. beige.app's quote tool replaced it end to end — one link covers the proposal, the pricing breakdown, and the client's signature, confirmed from real deal threads (\"Just saw contract signed!\" right after a beige.app quote link went out).",
            marks: [],
          },
        ],
      },
    ],
  },
];

// Full rewrite: payment collection has consolidated onto Zelle in practice,
// and HoneyBook's payment-link/access-code step no longer appears anywhere.
const paymentLesson = findLesson("payment-processing-policies");
paymentLesson.blocks = [
  { type: "eyebrow", text: "MODULE 2 · TOOLS & SYSTEMS" },
  { type: "heading", level: 2, spans: [{ text: "Payment Processing & Policies", marks: [] }] },
  {
    type: "process",
    steps: [
      {
        title: "1. Quote Edits",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 1: Quote Edits", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "Need to add extra hours, remove tax, or adjust anything after sending? Update the beige.app quote, notify the client via OpenPhone, update the Revenue Sheet, and inform the team in Discord + Slack.",
                marks: [],
              },
            ],
          },
        ],
      },
      {
        title: "2. Collecting Payment",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 2: Collecting Payment", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "Once the client signs the beige.app quote, send Zelle payment instructions directly over text — no separate payment-link tool involved:",
                marks: [],
              },
            ],
          },
          {
            type: "list",
            ordered: false,
            items: [
              [{ text: "Zelle email: accounting@beigecorporation.io", marks: [] }],
              [{ text: "Zelle tag: @beigecorp", marks: [] }],
            ],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "Zelle is the default for nearly every deal today. Wire transfer or a card payment can still be arranged for a client who specifically needs one — mention the 4% processing fee if a card comes up — but lead with Zelle.",
                marks: [],
              },
            ],
          },
        ],
      },
      {
        title: "3. Confirming Receipt",
        blocks: [
          {
            type: "heading",
            level: 2,
            spans: [{ text: "Step 3: Confirming Receipt", marks: [] }],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "When the client confirms the Zelle payment is sent, thank them, let them know pre-production is starting, and log the payment in the Revenue Sheet.",
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "note",
    blocks: [
      {
        type: "heading",
        level: 3,
        spans: [{ text: "Payment Policy (unchanged)", marks: [] }],
      },
      {
        type: "list",
        ordered: false,
        items: [
          [{ text: "Corporate clients: full payment.", marks: [] }],
          [{ text: "Non-corporate clients: 50% deposit to lock the date, remainder due 3 days before the shoot.", marks: [] }],
          [{ text: "Rush bookings (under 7 days out): 100% upfront.", marks: [] }],
        ],
      },
    ],
  },
  {
    type: "note",
    blocks: [
      {
        type: "paragraph",
        spans: [{ text: "What changed from the old training: ", marks: ["bold"] }],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "HoneyBook is no longer used to generate payment links or confirm receipt — that concept (and the \"never include the access code\" rule) is gone. Payment info now goes straight to the client as a Zelle email/tag in a text message.",
            marks: [],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// CRM migration (Aug 2026): Beige moved off HubSpot onto GHL (GoHighLevel),
// with a locked-down, per-rep pipeline model. Full rewrite of the old
// "HubSpot CRM & Revenue Sheet" lesson, provided directly by ops - not
// something inferable from Quo messages, since it's an internal tool change.
deepReplaceText(findLesson("welcome-to-beige").blocks, "HubSpot", "GHL");
deepReplaceText(findLesson("your-role-earning-potential").blocks, "HubSpot", "GHL");
deepReplaceText(findLesson("music-videos").blocks, "HubSpot", "GHL");
deepReplaceText(findLesson("private-events").blocks, "HubSpot", "GHL");

const ghlLesson = findLesson("hubspot-crm-revenue-sheet");
ghlLesson.title = "GHL: Lead & Pipeline Management";
ghlLesson.blocks = [
  { type: "eyebrow", text: "MODULE 2 · TOOLS & SYSTEMS" },
  { type: "heading", level: 2, spans: [{ text: "GHL: Lead & Pipeline Management", marks: [] }] },
  {
    type: "paragraph",
    spans: [
      {
        text: "Beige runs lead and pipeline management on GHL (GoHighLevel), not HubSpot. Access is locked down by design: outside of 4 admin accounts, every rep sees only their own pipeline and only the leads assigned to them.",
        marks: [],
      },
    ],
  },
  {
    type: "note",
    blocks: [
      {
        type: "paragraph",
        spans: [
          { text: "Why the lockdown: ", marks: ["bold"] },
          {
            text: "keeping lead handling inside the CRM, with the Contacts tab hidden and bulk export disabled for everyone but Superadmins, protects against data abuse or leaks, and gives leadership real visibility into individual rep KPIs, bottlenecks, and where performance coaching is needed.",
            marks: [],
          },
        ],
      },
    ],
  },
  {
    type: "process",
    steps: [
      {
        title: "1. New Leads Land in the General Pipeline",
        blocks: [
          { type: "heading", level: 2, spans: [{ text: "Step 1: New Leads Land in the General Pipeline", marks: [] }] },
          {
            type: "paragraph",
            spans: [
              {
                text: "Every new lead starts in the General Purpose Events Pipeline, visible only to Superadmins, until a coordinator decides which rep it goes to based on rotation, availability, and whether it's a high-budget lead suited to an expert rep.",
                marks: [],
              },
            ],
          },
        ],
      },
      {
        title: "2. Coordinator Moves It to the Rep's Pipeline",
        blocks: [
          { type: "heading", level: 2, spans: [{ text: "Step 2: Coordinator Moves It to the Rep's Pipeline", marks: [] }] },
          {
            type: "list",
            ordered: true,
            items: [
              [{ text: "Open the Pipeline dropdown inside the lead card.", marks: [] }],
              [{ text: "Switch it from “General” to that rep's dedicated pipeline.", marks: [] }],
              [{ text: "Assign the rep as Owner (or add them as a Follower).", marks: [] }],
              [{ text: "Set the first stage in their pipeline.", marks: [] }],
              [{ text: "Click Update.", marks: [] }],
            ],
          },
          {
            type: "paragraph",
            spans: [
              {
                text: "The lead disappears from the General pipeline and appears in that rep's private view. From here, the rep is responsible for updating its progress themselves.",
                marks: [],
              },
            ],
          },
        ],
      },
      {
        title: "3. Rep Works the Lead Through Their Stages",
        blocks: [
          { type: "heading", level: 2, spans: [{ text: "Step 3: Rep Works the Lead Through Their Stages", marks: [] }] },
          {
            type: "paragraph",
            spans: [{ text: "Every rep's pipeline uses the same stage sequence:", marks: [] }],
          },
          {
            type: "list",
            ordered: false,
            items: [
              [{ text: "New Lead", marks: ["bold"] }],
              [{ text: "Engaged", marks: ["bold"] }],
              [{ text: "Discovery / Qualifying", marks: ["bold"] }],
              [{ text: "Proposal Sent", marks: ["bold"] }],
              [{ text: "Negotiation", marks: ["bold"] }],
              [{ text: "Pending Payment", marks: ["bold"] }],
              [{ text: "Closed Won", marks: ["bold"] }, { text: " or ", marks: [] }, { text: "Closed Lost", marks: ["bold"] }],
              [{ text: "Future Follow-up", marks: ["bold"] }],
            ],
          },
        ],
      },
    ],
  },
  {
    type: "note",
    blocks: [
      {
        type: "paragraph",
        spans: [{ text: "How existing leads carried over: ", marks: ["bold"] }],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "leads already assigned to a rep were moved straight into that rep's own pipeline with no data loss, and their stage carried over exactly (a lead marked “Invoice Sent” in the Events Pipeline is still “Invoice Sent” in the rep's pipeline). 927 unassigned leads and 14 sample opportunities under Sam and Swift remain in the General Events Pipeline for now.",
            marks: [],
          },
        ],
      },
    ],
  },
  {
    type: "accordion",
    items: [
      {
        title: "Rep says they can't see a lead",
        blocks: [
          {
            type: "paragraph",
            spans: [
              { text: "Why it happens: ", marks: ["bold"] },
              { text: "the Owner field is empty.", marks: [] },
            ],
          },
          {
            type: "paragraph",
            spans: [
              { text: "Fix: ", marks: ["bold"] },
              { text: "go to the lead and select the rep as the Owner.", marks: [] },
            ],
          },
        ],
      },
      {
        title: "The lead is showing in two pipelines at once",
        blocks: [
          {
            type: "paragraph",
            spans: [
              { text: "Why it happens: ", marks: ["bold"] },
              { text: "it wasn't moved correctly.", marks: [] },
            ],
          },
          {
            type: "paragraph",
            spans: [
              { text: "Fix: ", marks: ["bold"] },
              { text: "open the lead and set the Pipeline dropdown to the rep's pipeline only.", marks: [] },
            ],
          },
        ],
      },
      {
        title: "Rep can't export the lead database",
        blocks: [
          {
            type: "paragraph",
            spans: [
              { text: "Why it happens: ", marks: ["bold"] },
              { text: "export and bulk-copy permissions are locked for data safety.", marks: [] },
            ],
          },
          {
            type: "paragraph",
            spans: [
              { text: "Fix: ", marks: ["bold"] },
              { text: "this is correct behavior, not a bug. Reps are never permitted to export or bulk-copy lead data.", marks: [] },
            ],
          },
        ],
      },
    ],
  },
];

// New lesson: Shoot Activation & Handoff. This didn't exist in any prior
// version of the training - it's a brand-new formal SOP for the moment a
// deal closes, covering the handoff from Sales to Production and Accounting.
generated.push({
  id: "shoot-activation-handoff",
  moduleId: "module-2",
  title: "Shoot Activation & Handoff (SAH)",
  order: generated.length,
  blocks: [
    { type: "eyebrow", text: "MODULE 2 · TOOLS & SYSTEMS" },
    { type: "heading", level: 2, spans: [{ text: "Shoot Activation & Handoff (SAH)", marks: [] }] },
    {
      type: "paragraph",
      spans: [
        {
          text: "SAH is the official handoff of a paid project from Sales to Client Success, Production, Post-Production, and Accounting. It confirms payment, logs revenue, informs the client, and activates production. A project is not considered handed off until every SAH step below is complete.",
          marks: [],
        },
      ],
    },
    {
      type: "note",
      blocks: [
        {
          type: "paragraph",
          spans: [
            { text: "Ownership: ", marks: ["bold"] },
            {
              text: "the sales rep who closed the deal is the primary owner of SAH. Production and Accounting are secondary stakeholders who rely on a completed SAH before taking ownership of the project.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      type: "process",
      steps: [
        {
          title: "1. Verify Payment",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 1: Verify Payment", marks: [] }] },
            {
              type: "paragraph",
              spans: [{ text: "Confirm payment was successfully received, through a Stripe payment notification, the Stripe dashboard, an Accounting confirmation, or another approved payment channel.", marks: [] }],
            },
            {
              type: "paragraph",
              spans: [{ text: "Do not begin SAH until payment is confirmed.", marks: ["bold"] }],
            },
          ],
        },
        {
          title: "2. Confirm Payment Is Recorded in beige.app",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 2: Confirm Payment Is Recorded in beige.app", marks: [] }] },
            {
              type: "list",
              ordered: false,
              items: [
                [{ text: "Locate the client's quote inside beige.app.", marks: [] }],
                [{ text: "Verify the payment has been recorded.", marks: [] }],
                [{ text: "If it wasn't recorded automatically, record it manually before moving on.", marks: [] }],
                [{ text: "Confirm the invoice reflects the correct amount paid and any remaining balance.", marks: [] }],
              ],
            },
          ],
        },
        {
          title: "3. Send Client Handoff Message",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 3: Send Client Handoff Message", marks: [] }] },
            {
              type: "paragraph",
              spans: [{ text: "Once payment is confirmed, text this to the client on the same Quo line used throughout the sales process:", marks: [] }],
            },
            {
              type: "quote",
              blocks: [
                {
                  type: "paragraph",
                  spans: [{ text: "Hi [Client Name],", marks: ["italic"] }],
                },
                {
                  type: "paragraph",
                  spans: [{ text: "Thank you for your payment and for choosing Beige! We've successfully received your payment and your project has now been activated.", marks: ["italic"] }],
                },
                {
                  type: "paragraph",
                  spans: [{ text: "From this point forward, a member of our Production Team will be reaching out shortly to guide you through the next steps and help prepare everything for your upcoming shoot.", marks: ["italic"] }],
                },
                {
                  type: "paragraph",
                  spans: [{ text: "We're excited to work with you and appreciate the opportunity to bring your vision to life!", marks: ["italic"] }],
                },
              ],
            },
          ],
        },
        {
          title: "4. Update Revenue Sheet",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 4: Update Revenue Sheet", marks: [] }] },
            {
              type: "paragraph",
              spans: [{ text: "Add the project to the Revenue Sheet using the details in beige.app and the approved quote. Required fields:", marks: [] }],
            },
            {
              type: "list",
              ordered: false,
              items: [
                [{ text: "Client Name, Source, Status, Payment Terms", marks: [] }],
                [{ text: "City, State, Category, Email, Phone Number", marks: [] }],
                [{ text: "Total Deal, Amount Paid, Date Amount Paid", marks: [] }],
                [{ text: "Amount Due, Date Amount Due, Date Closed", marks: [] }],
                [{ text: "Shoot Date, Invoice Number, Invoice Link", marks: [] }],
                [{ text: "Payment Method, Rep Name", marks: [] }],
              ],
            },
          ],
        },
        {
          title: "5. Create New Shoot Announcement",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 5: Create New Shoot Announcement", marks: [] }] },
            {
              type: "paragraph",
              spans: [{ text: "Post the official handoff in Discord #newshoots. This is the activation notice for Client Success and Production, in this format:", marks: [] }],
            },
            {
              type: "quote",
              blocks: [
                { type: "paragraph", spans: [{ text: "New Shoots: [Project Title]", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Line: [State / Quo Line]", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Deal Owner (Sales Rep): [Rep Name]", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Shoot Link: [Shoot Link]", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Payment Status: [$__ Paid in Full / $$__ Deposit Received]", marks: ["code"] }] },
              ],
            },
          ],
        },
        {
          title: "6. Post Payment Confirmation",
          blocks: [
            { type: "heading", level: 2, spans: [{ text: "Step 6: Post Payment Confirmation in #in_payment_rih", marks: [] }] },
            {
              type: "paragraph",
              spans: [{ text: "After the Revenue Sheet is updated, post the confirmation in the designated payment channel:", marks: [] }],
            },
            {
              type: "quote",
              blocks: [
                { type: "paragraph", spans: [{ text: "[Shoot Name as written in the Discord New Shoot post]", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Payment Status: Paid in Full / Partial Payment", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "Revenue Sheet: Completed ✅", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "New Shoot: Posted ✅", marks: ["code"] }] },
                { type: "paragraph", spans: [{ text: "SAH: Completed ✅", marks: ["code"] }] },
              ],
            },
          ],
        },
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
// Visual pass (Aug 2026): the lesson bodies were pure text - every module read
// as a wall of paragraphs and process steps with nothing to look at. Adds an
// AI-generated lead image to every lesson that had none, and a per-step photo
// to every multi-step process so SOPs read as an illustrated walkthrough.
insertHeroImage("lead-hit-funnel", "/images/hero-lead-hit-funnel.png", "A sales rep's phone lighting up with a new lead notification");
insertHeroImage("scheduling-discovery-calls", "/images/hero-scheduling-calls.png", "A salesperson scheduling a discovery call on a digital calendar");
insertHeroImage("invoice-creation", "/images/hero-proposal-quote.png", "A laptop screen showing a digital quote and e-signature interface");
insertHeroImage("payment-processing-policies", "/images/hero-payment-processing.png", "A smartphone showing a payment confirmation notification");
insertHeroImage("shoot-activation-handoff", "/images/hero-shoot-activation.png", "A film production crew activating a shoot on set");
insertHeroImage("hubspot-crm-revenue-sheet", "/images/hero-ghl-pipeline.png", "A CRM pipeline board with deal cards across stages");
insertHeroImage("slack-discord-communication", "/images/hero-slack-discord.png", "Two team chat app interfaces side by side");
insertHeroImage("universal-call-script-framework", "/images/hero-universal-call-framework.png", "A confident sales rep on a call with a structured script visible");
insertHeroImage("corporate-events", "/images/hero-corporate-events.png", "A corporate conference event being filmed");
insertHeroImage("private-events", "/images/hero-private-events.png", "A vibrant birthday celebration with balloons and string lights");
insertHeroImage("film-projects", "/images/hero-film-projects.png", "A behind-the-scenes film set with lighting rigs");
insertHeroImage("sms-voicemail-quick-reference", "/images/hero-sms-voicemail.png", "A smartphone showing a text message thread and voicemail icon");
insertHeroImage("common-objections-rebuttals", "/images/hero-objection-handling.png", "Two business people in a confident handshake negotiation");
insertHeroImage("follow-up-urgency-strategy", "/images/hero-followup-urgency.png", "A salesperson checking a countdown timer next to a follow-up reminder");

addStepImages("your-role-earning-potential", [
  "/images/step-role-receive-lead.png",
  "/images/step-role-first-contact.png",
  "/images/step-role-discovery-call.png",
  "/images/step-role-send-proposal.png",
  "/images/step-role-close-payment.png",
]);
addStepImages("lead-hit-funnel", [
  "/images/step-funnel-lead-arrives.png",
  "/images/step-funnel-notify-slack.png",
  "/images/step-funnel-apply-template.png",
  "/images/step-funnel-assign-schedule.png",
]);
addStepImages("scheduling-discovery-calls", [
  "/images/step-sched-find-client.png",
  "/images/step-sched-create-event.png",
  "/images/step-sched-send-invite.png",
  "/images/step-sched-confirm.png",
]);
addStepImages("invoice-creation", [
  "/images/step-quote-gather-info.png",
  "/images/step-quote-build-beigeapp.png",
  "/images/step-quote-send-link.png",
  "/images/step-quote-followup.png",
]);
addStepImages("payment-processing-policies", [
  "/images/step-payment-quote-edits.png",
  "/images/step-payment-collecting.png",
  "/images/step-payment-confirming.png",
]);
addStepImages("shoot-activation-handoff", [
  "/images/step-sah-verify-payment.png",
  "/images/step-sah-confirm-recorded.png",
  "/images/step-sah-client-message.png",
  "/images/step-sah-revenue-sheet.png",
  "/images/step-sah-shoot-announcement.png",
  "/images/step-sah-payment-confirmation.png",
]);
addStepImages("hubspot-crm-revenue-sheet", [
  "/images/step-ghl-new-leads.png",
  "/images/step-ghl-coordinator-moves.png",
  "/images/step-ghl-rep-works-stages.png",
]);
addStepImages("slack-discord-communication", [
  "/images/step-comms-pre-securing.png",
  "/images/step-comms-new-shoot-channel.png",
  "/images/step-comms-production.png",
  "/images/step-comms-post-production.png",
  "/images/step-comms-user-success.png",
]);
addStepImages("follow-up-pending-client-status", [
  "/images/step-followup-immediately.png",
  "/images/step-followup-2-3-days.png",
  "/images/step-followup-3-days-before.png",
]);
addStepImages("universal-call-script-framework", [
  "/images/step-framework-intro.png",
  "/images/step-framework-value-props.png",
  "/images/step-framework-discovery.png",
  "/images/step-framework-wrapup.png",
  "/images/step-framework-closing.png",
]);

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
    description: "The full lead-to-cash workflow: Thumbtack, OpenPhone, beige.app, GHL, Slack & Discord.",
    color: "#e8d1ab",
    coverImage: "/images/module-2-cover.png",
    items: [
      { kind: "lesson", id: "lead-hit-funnel" },
      { kind: "lesson", id: "initial-client-contact" },
      { kind: "lesson", id: "scheduling-discovery-calls" },
      { kind: "lesson", id: "invoice-creation" },
      { kind: "lesson", id: "payment-processing-policies" },
      { kind: "lesson", id: "shoot-activation-handoff" },
      { kind: "lesson", id: "hubspot-crm-revenue-sheet" },
      { kind: "lesson", id: "slack-discord-communication" },
      { kind: "lesson", id: "follow-up-pending-client-status" },
      { kind: "quiz", id: "quiz-tools-workflow" },
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
      { kind: "quiz", id: "quiz-scripts-event-types" },
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
      { kind: "quiz", id: "quiz-objection-handling" },
    ],
    quizId: "quiz-objection-handling",
  },
  {
    id: "module-5",
    order: 5,
    title: "Final Certification",
    shortTitle: "Certify",
    description: "A timed, comprehensive exam covering all 5 modules. Pass it to earn your Beige Sales Rep Certification.",
    color: "#e8d1ab",
    coverImage: "/images/module-5-cover.png",
    items: [{ kind: "quiz", id: "final-certification-assessment" }],
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
