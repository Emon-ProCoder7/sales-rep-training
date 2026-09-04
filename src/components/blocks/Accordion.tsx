"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ContentBlock } from "@/content/types";
import BlockRenderer from "./BlockRenderer";

export default function Accordion({
  items,
}: {
  items: { title: string; blocks: ContentBlock[]; image?: string }[];
}) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="my-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-near-black">
      {items.map((item, i) => {
        const expanded = open.has(i);
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-lg border border-warm-beige/20 bg-canvas-black object-cover"
                />
              )}
              <span className="min-w-0 flex-1 font-medium text-pure-white">{item.title}</span>
              <motion.span
                animate={{ rotate: expanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-warm-beige"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <BlockRenderer blocks={item.blocks} animate={false} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
