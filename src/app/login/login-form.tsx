"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Incorrect password.");
        setLoading(false);
        return;
      }
      const next = params.get("next") ?? "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-near-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    >
      <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-muted">
        Portal password
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter the password"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-pure-white placeholder:text-mid-gray focus:border-warm-beige focus:outline-none"
      />
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="mt-5 w-full rounded-full bg-ivory px-5 py-3 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Checking…" : "Enter training portal"}
      </button>
      <p className="mt-4 text-center text-xs text-mid-gray">
        Ask your manager for the portal password if you don&apos;t have it.
      </p>
    </form>
  );
}
