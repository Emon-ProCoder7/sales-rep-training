"use client";

import { useEffect, useState } from "react";
import { getProgress, setLearnerName } from "@/lib/progress";

export default function NameGate() {
  const [needsName, setNeedsName] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setNeedsName(!getProgress().learnerName);
  }, []);

  if (!needsName) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLearnerName(value.trim());
    setNeedsName(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-black/90 px-6 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-near-black p-6 text-center"
      >
        <img src="/beige-icon.png" alt="Beige" className="mx-auto mb-4 h-12 w-12 rounded-full" />
        <h2 className="font-display text-xl font-semibold text-pure-white">What's your name?</h2>
        <p className="mt-1.5 text-sm text-slate-muted">
          This is how you'll appear on your certification when you complete the training.
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Full name"
          className="mt-5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-center text-pure-white placeholder:text-mid-gray focus:border-warm-beige focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-4 w-full rounded-full bg-ivory px-5 py-3 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start training
        </button>
      </form>
    </div>
  );
}
