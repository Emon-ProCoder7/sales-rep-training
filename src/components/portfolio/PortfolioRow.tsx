"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PortfolioVideo } from "@/content/portfolio";
import VideoCard from "./VideoCard";

export default function PortfolioRow({
  title,
  videos,
  onOpen,
}: {
  title: string;
  videos: PortfolioVideo[];
  onOpen: (video: PortfolioVideo) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateArrows() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  // Click-and-drag horizontal scrolling for mouse/trackpad users - touch
  // devices already get native momentum scrolling via overflow-x-auto.
  // Pointer capture is deferred until real movement is detected (not set on
  // every pointerdown) - capturing immediately on a plain click/tap swallows
  // the card's own click event, since the button no longer sees the pointerup
  // that a native "click" is synthesized from.
  function onPointerDown(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  }
  function onPointerMove(e: React.PointerEvent) {
    const el = trackRef.current;
    const ds = dragState.current;
    if (!ds.dragging || !el) return;
    const dx = e.clientX - ds.startX;
    if (Math.abs(dx) > 4) {
      if (!ds.moved) el.setPointerCapture(e.pointerId);
      ds.moved = true;
    }
    if (ds.moved) el.scrollLeft = ds.startScroll - dx;
  }
  function onPointerUp(e: React.PointerEvent) {
    const el = trackRef.current;
    if (dragState.current.moved) el?.releasePointerCapture(e.pointerId);
    dragState.current.dragging = false;
    updateArrows();
  }

  return (
    <div className="group/row relative">
      <h2 className="mb-3 px-1 text-base font-semibold text-pure-white sm:text-lg">{title}</h2>

      <button
        onClick={() => scrollByPage(-1)}
        aria-label="Scroll left"
        className={`absolute -left-2 top-1/2 z-10 mt-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas-black/90 text-pure-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/row:opacity-100 hover:bg-surface sm:flex ${
          canLeft ? "" : "pointer-events-none opacity-0"
        }`}
      >
        ‹
      </button>
      <button
        onClick={() => scrollByPage(1)}
        aria-label="Scroll right"
        className={`absolute -right-2 top-1/2 z-10 mt-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-canvas-black/90 text-pure-white opacity-0 shadow-lg backdrop-blur transition-opacity group-hover/row:opacity-100 hover:bg-surface sm:flex ${
          canRight ? "" : "pointer-events-none opacity-0"
        }`}
      >
        ›
      </button>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex cursor-grab gap-3 overflow-x-auto scroll-smooth px-1 pb-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-proximity [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <motion.div
            key={v.id + i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
          >
            <VideoCard
              video={v}
              onOpen={() => {
                if (!dragState.current.moved) onOpen(v);
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
