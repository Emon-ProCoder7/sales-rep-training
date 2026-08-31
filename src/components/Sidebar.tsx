"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MODULES } from "@/content/modules";
import {
  getProgress,
  isLessonComplete,
  isLessonUnlocked,
  isQuizPassed,
  isQuizUnlocked,
  overallPercentComplete,
} from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-mid-gray">
      <path
        d="M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-emerald-green">
      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const [, force] = useState(0);

  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    window.addEventListener("beige-progress-changed", rerender);
    return () => window.removeEventListener("beige-progress-changed", rerender);
  }, []);

  const pct = mounted ? overallPercentComplete() : 0;
  const learnerName = mounted ? getProgress().learnerName : null;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-border bg-near-black transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex items-center gap-3 px-5 pb-4 pt-5">
          <img src="/beige-icon.png" alt="Beige" className="h-9 w-9 rounded-full" />
          <div>
            <p className="text-sm font-semibold text-pure-white">Sales Rep Training</p>
            <p className="text-xs text-mid-gray">{learnerName || "Beige AI"}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded-full p-1 text-mid-gray hover:text-pure-white lg:hidden"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-muted">Overall progress</span>
            <span className="font-medium text-warm-beige">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-warm-beige transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <nav className="flex-1 space-y-6 px-3 pb-6">
          {MODULES.map((mod) => (
            <div key={mod.id}>
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-mid-gray">
                {mod.title}
              </p>
              <ul className="space-y-0.5">
                {mod.items.map((item) => {
                  const href = item.kind === "lesson" ? `/lesson/${item.id}` : `/quiz/${item.id}`;
                  const unlocked =
                    mounted && (item.kind === "lesson" ? isLessonUnlocked(item.id) : isQuizUnlocked(item.id));
                  const done =
                    mounted && (item.kind === "lesson" ? isLessonComplete(item.id) : isQuizPassed(item.id));
                  const active = pathname === href;
                  const label = navLabel(item.id);

                  const content = (
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="truncate">{label}</span>
                    </span>
                  );

                  return (
                    <li key={item.id}>
                      {unlocked ? (
                        <Link
                          href={href}
                          onClick={onClose}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                            active
                              ? "bg-surface text-pure-white"
                              : "text-slate-muted hover:bg-surface/60 hover:text-pure-white"
                          }`}
                        >
                          {content}
                          {done && <CheckIcon />}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-mid-gray/60">
                          {content}
                          <LockIcon />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/certificate"
            className="flex items-center justify-center gap-2 rounded-full border border-warm-beige/40 px-4 py-2.5 text-sm font-medium text-warm-beige transition hover:bg-warm-beige/10"
          >
            View certificate
          </Link>
        </div>
      </div>
    </aside>
  );
}

function navLabel(id: string): string {
  const overrides: Record<string, string> = {
    "invoice-creation": "Proposal & Quote Creation",
    "hubspot-crm-revenue-sheet": "GHL: Lead & Pipeline Mgmt",
    "shoot-activation-handoff": "Shoot Activation & Handoff",
    "quiz-tools-workflow": "Tools & Workflow Quiz",
    "quiz-scripts-event-types": "Scripts & Event Types Quiz",
    "quiz-objection-handling": "Objection Handling Quiz",
    "final-certification-assessment": "Final Certification Exam",
    "scenario-tough-corporate-call": "Scenario: Tough Corporate Call",
    "scenario-wedding-budget-pushback": "Scenario: Wedding Budget Pushback",
  };
  if (overrides[id]) return overrides[id];
  return id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
