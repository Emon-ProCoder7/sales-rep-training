"use client";

import { motion } from "framer-motion";
import { formatDuration, type PortfolioVideo } from "@/content/portfolio";

export default function VideoCard({
  video,
  onOpen,
  width = 260,
}: {
  video: PortfolioVideo;
  onOpen: () => void;
  /** fixed px width for horizontal rows; omit to fill the parent (grid contexts) */
  width?: number;
}) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ scale: 1.06, zIndex: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={width ? { width } : undefined}
      className={`group relative snap-start overflow-hidden rounded-xl border border-border bg-near-black text-left shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-beige ${
        width ? "shrink-0" : "w-full"
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-canvas-black">
        {video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-mid-gray">
              <path
                d="M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-canvas-black shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {video.durationSeconds != null && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-pure-white">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
        {video.passwordProtected && (
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-warm-beige">
            🔒 Locked
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 text-xs leading-snug text-slate-muted transition-colors group-hover:text-pure-white">
          {video.title ?? "Password-protected video"}
        </p>
      </div>
    </motion.button>
  );
}
