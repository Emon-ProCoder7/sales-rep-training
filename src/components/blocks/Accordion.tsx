"use client";

import { useState } from "react";
import type { ContentBlock } from "@/content/types";
import BlockRenderer from "./BlockRenderer";

export default function Accordion({ items }: { items: { title: string; blocks: ContentBlock[] }[] }) {
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
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-pure-white">{item.title}</span>
              <span
                className={`shrink-0 text-warm-beige transition-transform ${expanded ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            {expanded && (
              <div className="px-5 pb-5">
                <BlockRenderer blocks={item.blocks} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
