"use client";

import { useState } from "react";

export default function Flashcards({ items }: { items: { front: string; back: string }[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = items[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  return (
    <div className="my-4">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="group relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center transition [perspective:1000px]"
      >
        <span className="absolute left-4 top-4 text-[11px] uppercase tracking-[0.14em] text-mid-gray">
          {flipped ? "Answer" : "Card " + (index + 1) + " / " + items.length}
        </span>
        <p className="max-w-xl text-lg leading-relaxed text-pure-white">
          {flipped ? card.back : card.front}
        </p>
        <span className="mt-4 text-xs text-mid-gray group-hover:text-warm-beige">
          Tap to {flipped ? "see the question" : "reveal the answer"}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-slate-muted transition hover:border-warm-beige hover:text-warm-beige"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-full border border-border px-4 py-1.5 text-sm text-slate-muted transition hover:border-warm-beige hover:text-warm-beige"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
