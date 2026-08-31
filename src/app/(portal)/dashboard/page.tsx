"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODULES } from "@/content/modules";
import {
  getProgress,
  isLessonComplete,
  isLessonUnlocked,
  isModuleFullyDone,
  isQuizPassed,
  isQuizUnlocked,
  overallPercentComplete,
} from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";

export default function DashboardPage() {
  const mounted = useMounted();
  const [, force] = useState(0);
  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    window.addEventListener("beige-progress-changed", rerender);
    return () => window.removeEventListener("beige-progress-changed", rerender);
  }, []);

  const progress = mounted ? getProgress() : { learnerName: null };
  const pct = mounted ? overallPercentComplete() : 0;
  const certified = mounted && isQuizPassed("final-certification-assessment");

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">
        Welcome{progress.learnerName ? `, ${progress.learnerName}` : ""}
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-pure-white sm:text-4xl">
        {certified ? "You're a certified Beige sales rep." : "Your certification journey"}
      </h1>
      <p className="mt-3 max-w-xl text-slate-muted">
        {certified
          ? "You've earned your Beige Sales Rep Certification and cleared to take live leads."
          : "Work through each module, pass the module quizzes, then earn your certification in the final assessment."}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-near-black p-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-muted">Overall progress</span>
          <span className="font-semibold text-warm-beige">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-warm-beige transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {MODULES.map((mod) => {
          const done = mounted && isModuleFullyDone(mod.id);
          const firstItem = mod.items[0];
          const unlocked =
            mounted &&
            !!firstItem &&
            (firstItem.kind === "lesson" ? isLessonUnlocked(firstItem.id) : isQuizUnlocked(firstItem.id));
          const completedCount = mounted
            ? mod.items.filter((i) => (i.kind === "lesson" ? isLessonComplete(i.id) : isQuizPassed(i.id))).length
            : 0;

          return (
            <div
              key={mod.id}
              className={`overflow-hidden rounded-2xl border transition ${
                done ? "border-emerald-green/30 bg-emerald-green/[0.04]" : "border-border bg-near-black"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mod.coverImage}
                    alt=""
                    className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mid-gray">
                      Module {mod.order}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-pure-white">{mod.title}</h3>
                    <p className="mt-1 max-w-md text-sm text-slate-muted">{mod.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-mid-gray">
                    {completedCount}/{mod.items.length}
                  </span>
                  {done ? (
                    <span className="rounded-full bg-emerald-green/15 px-3 py-1.5 text-xs font-medium text-emerald-green">
                      Complete
                    </span>
                  ) : unlocked ? (
                    <Link
                      href={firstItem.kind === "lesson" ? `/lesson/${firstItem.id}` : `/quiz/${firstItem.id}`}
                      className="rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-canvas-black transition hover:brightness-95"
                    >
                      {completedCount > 0 ? "Continue" : "Start"} →
                    </Link>
                  ) : (
                    <span className="rounded-full border border-border px-3 py-1.5 text-xs text-mid-gray">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-warm-beige/25 bg-warm-beige/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-pure-white">Beige Sales Rep Certification</p>
          <p className="mt-1 text-sm text-slate-muted">
            {certified ? "Download your certificate anytime." : "Preview what you're working toward."}
          </p>
        </div>
        <Link
          href="/certificate"
          className="rounded-full border border-warm-beige/50 px-5 py-2.5 text-sm font-medium text-warm-beige transition hover:bg-warm-beige/10"
        >
          {certified ? "View & download →" : "Preview certificate →"}
        </Link>
      </div>
    </div>
  );
}
