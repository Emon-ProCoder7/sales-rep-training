"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioVideo } from "@/content/portfolio";

export default function VideoModal({
  video,
  onClose,
}: {
  video: (PortfolioVideo & { categoryName?: string }) | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!video) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-near-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-pure-white">
                  {video.title ?? "Password-protected video"}
                </p>
                {video.categoryName && (
                  <p className="text-xs text-mid-gray">{video.categoryName}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-4 shrink-0 rounded-full p-1.5 text-mid-gray transition hover:bg-surface hover:text-pure-white"
              >
                ✕
              </button>
            </div>

            {video.passwordProtected ? (
              <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-warm-beige/30 bg-warm-beige/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-warm-beige">
                    <path
                      d="M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
                <p className="max-w-sm text-sm text-slate-muted">
                  This video is password-protected on Vimeo, so it can&apos;t be previewed or played here. Open it
                  directly on Vimeo and enter the password to view it.
                </p>
                <a
                  href={video.vimeoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-ivory px-5 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
                >
                  Open on Vimeo ↗
                </a>
              </div>
            ) : (
              <>
                <div className="relative aspect-video w-full bg-canvas-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${video.id}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    allowFullScreen
                    title={video.title ?? "Portfolio video"}
                  />
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-mid-gray">Not loading? It may be domain-restricted on Vimeo.</p>
                  <a
                    href={video.vimeoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-warm-beige hover:underline"
                  >
                    Open on Vimeo ↗
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
