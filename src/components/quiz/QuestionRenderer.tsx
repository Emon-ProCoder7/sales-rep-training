"use client";

import { useMemo } from "react";
import type { Question } from "@/content/types";
import type { AnswerValue } from "@/lib/scoring";
import { shuffle } from "@/lib/shuffle";

export default function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}) {
  // Hooks must run unconditionally on every render of this instance - compute
  // both shuffles up front (cheap) rather than after an early return per type.
  const shuffledRight = useMemo(
    () => (question.type === "matching" ? shuffle(question.pairs.map((p) => p.right)) : []),
    [question.id]
  );
  const shuffledSteps = useMemo(
    () => (question.type === "ordering" ? shuffle(question.steps) : []),
    [question.id]
  );

  if (question.type === "single" || question.type === "scenario") {
    return (
      <div className="space-y-2.5">
        {question.scenarioContext && (
          <p className="mb-3 rounded-xl border border-border bg-surface p-4 text-sm italic text-slate-muted">
            {question.scenarioContext}
          </p>
        )}
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`block w-full rounded-2xl border px-5 py-3.5 text-left text-sm transition ${
              value === opt.id
                ? "border-warm-beige bg-warm-beige/10 text-pure-white"
                : "border-border bg-surface text-slate-muted hover:border-warm-beige/50 hover:text-pure-white"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "multi") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2.5">
        <p className="text-xs text-mid-gray">Select all that apply.</p>
        {question.options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() =>
                onChange(checked ? selected.filter((id) => id !== opt.id) : [...selected, opt.id])
              }
              className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 text-left text-sm transition ${
                checked
                  ? "border-warm-beige bg-warm-beige/10 text-pure-white"
                  : "border-border bg-surface text-slate-muted hover:border-warm-beige/50 hover:text-pure-white"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  checked ? "border-warm-beige bg-warm-beige text-canvas-black" : "border-mid-gray"
                }`}
              >
                {checked && "✓"}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "matching") {
    const answer = (typeof value === "object" && !Array.isArray(value) ? value : {}) as Record<string, string>;
    return (
      <div className="space-y-3">
        {question.pairs.map((p) => (
          <div key={p.left} className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-pure-white">{p.left}</span>
            <select
              value={answer[p.left] ?? ""}
              onChange={(e) => onChange({ ...answer, [p.left]: e.target.value })}
              className="rounded-lg border border-border bg-canvas-black px-3 py-2 text-sm text-pure-white sm:w-64"
            >
              <option value="" disabled>
                Choose the match…
              </option>
              {shuffledRight.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }

  // ordering
  const order = Array.isArray(value) && value.length ? value : shuffledSteps;

  function move(i: number, dir: -1 | 1) {
    const next = [...order];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-mid-gray">Use the arrows to put these in the correct order.</p>
      {order.map((step, i) => (
        <div
          key={step}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-beige text-xs font-bold text-canvas-black">
            {i + 1}
          </span>
          <span className="flex-1 text-sm text-pure-white">{step}</span>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="rounded-md border border-border px-2 py-1 text-xs text-slate-muted disabled:opacity-30"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => move(i, 1)}
              disabled={i === order.length - 1}
              className="rounded-md border border-border px-2 py-1 text-xs text-slate-muted disabled:opacity-30"
              aria-label="Move down"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
