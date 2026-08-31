"use client";

import { useState } from "react";
import type { ContentBlock } from "@/content/types";
import BlockRenderer from "./BlockRenderer";

export default function Tabs({ tabs }: { tabs: { label: string; blocks: ContentBlock[] }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-border bg-near-black">
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {tabs.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === i
                ? "bg-warm-beige text-canvas-black"
                : "text-slate-muted hover:bg-surface hover:text-pure-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <BlockRenderer blocks={tabs[active].blocks} />
      </div>
    </div>
  );
}
