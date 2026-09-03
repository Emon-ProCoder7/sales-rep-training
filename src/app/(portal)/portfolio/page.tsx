"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ALL_PORTFOLIO_VIDEOS, PORTFOLIO_CATEGORIES, type PortfolioVideo } from "@/content/portfolio";
import PortfolioRow from "@/components/portfolio/PortfolioRow";
import VideoCard from "@/components/portfolio/VideoCard";
import VideoModal from "@/components/portfolio/VideoModal";

export default function PortfolioPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<(PortfolioVideo & { categoryName?: string }) | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_PORTFOLIO_VIDEOS.filter((v) => (v.title ?? "").toLowerCase().includes(q));
  }, [query]);

  const totalVideos = ALL_PORTFOLIO_VIDEOS.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">Always available</p>
          <span className="rounded-full border border-emerald-green/40 bg-emerald-green/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-green">
            Not locked
          </span>
        </div>
        <h1 className="font-display mt-2 text-3xl font-semibold text-pure-white sm:text-4xl">Client Portfolio</h1>
        <p className="mt-3 max-w-2xl text-slate-muted">
          Every real project Beige has delivered, organized the way clients ask for it: by category. When a lead
          asks &quot;can you share some samples?&quot;, pull up their event type here and send the link straight
          from the video&apos;s page on Vimeo, or play it right in the portal. This section is always open — come
          back to it any time, whether or not you&apos;ve finished a module.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mt-6"
      >
        <div className="relative max-w-md">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mid-gray"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder={`Search ${totalVideos} videos by title...`}
            className="w-full rounded-full border border-border bg-near-black py-3 pl-11 pr-4 text-sm text-pure-white placeholder:text-mid-gray focus:border-warm-beige/50 focus:outline-none"
          />
        </div>
      </motion.div>

      <div className="mt-10">
        {results ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <p className="mb-4 text-sm text-mid-gray">
              {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {results.map((v) => (
                  <VideoCard key={v.id} video={v} onOpen={() => setActive(v)} width={undefined} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-muted">No videos match that title. Try a different search.</p>
            )}
          </motion.div>
        ) : (
          <div className="space-y-10">
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <PortfolioRow
                key={cat.slug}
                title={`${cat.displayName} (${cat.videos.length})`}
                videos={cat.videos}
                onOpen={(v) => setActive({ ...v, categoryName: cat.displayName })}
              />
            ))}
          </div>
        )}
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  );
}
