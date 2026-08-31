# Beige Sales Rep Training Portal

A self-contained, password-gated training and certification portal for Beige's newly
appointed sales reps. Five modules of interactive lessons, three module quizzes, two
branching-dialogue scenarios, and a 25-question Final Certification Assessment that
unlocks a downloadable certificate.

Built with Next.js (App Router) + TypeScript + Tailwind CSS. No database — progress,
scores, and unlock state live in the learner's browser (`localStorage`). Auth is a
single shared portal password, not per-user accounts.

## What's inside

- **Module 1–4**: Welcome & platform, Tools & Systems, Call Scripts (all 9 event
  types), Objection Handling — rebuilt from the original course content, re-themed to
  Beige's actual brand (dark canvas, warm beige accent), with several sections
  cross-checked and refreshed against live Quo (formerly OpenPhone) call/message data
  (real current first-touch script, `beige.app` quote links, the 13 active Sales
  Zones, a hybrid-creator service tier, live example pricing).
- **Two branching scenarios**: "Tough Corporate Call" (ported from the original
  authoring) and "Wedding Budget Pushback" (newly authored — the original was never
  finished), both using the Mathieu avatar character set.
- **Module 5**: Three 10-question topic quizzes plus the 25-question Final
  Certification Assessment — all newly authored (none of this existed before).
- **Assessment engine**: correct = +1pt, incorrect = −0.5pt, 80% to pass. Failing a
  quiz resets it to question 1 and marks that module's lessons incomplete again; the
  Final Exam resets only the module(s) tied to the questions actually missed.
- **Certificate**: AI-generated Beige-branded background, learner name/score/date
  overlaid client-side, downloadable as PNG or PDF. A live preview is shown before
  it's earned.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in SITE_PASSWORD and AUTH_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
|---|---|
| `SITE_PASSWORD` | The single shared password that gates the whole portal. |
| `AUTH_SECRET` | Random secret used to sign the session cookie (`openssl rand -hex 32`). |

Both are required — the app refuses to log anyone in without them. Never commit
`.env.local`.

## Content pipeline

The 26 lessons carried over from the original course export live in
`_source/decoded-lesson-data.json` and are converted once via:

```bash
node scripts/convert-lesson-data.mjs
```

This regenerates `src/content/generated/lessons.json` and `scenarios.json`. Editorial
additions on top of the converted content (missing sections, live-data corrections,
the new scenario/quizzes) live directly in `src/content/modules.ts`,
`src/content/quizzes/*.ts`, and `src/content/scenarios/*.ts` — the conversion script
does not need to be re-run unless `_source/decoded-lesson-data.json` changes.

## Deployment (Vercel)

1. Import this repo in Vercel.
2. Set `SITE_PASSWORD` and `AUTH_SECRET` as Production (and Preview) environment
   variables in the Vercel project settings.
3. Deploy. No database or other services required.

## Project structure

```
src/
  app/
    login/                 password gate
    (portal)/               everything behind auth (shared sidebar layout)
      dashboard/
      lesson/[lessonId]/
      quiz/[quizId]/
      certificate/
    api/auth, api/logout    session cookie endpoints
  components/               UI: block renderer, quiz engine, scenario player, certificate
  content/                  typed lesson/module/quiz/scenario data
  lib/                      auth, progress store (localStorage), scoring
```
