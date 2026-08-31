import type { ContentBlock } from "@/content/types";
import { Spans } from "./Spans";
import Flashcards from "./Flashcards";
import Tabs from "./Tabs";
import Accordion from "./Accordion";

export default function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "eyebrow":
      return (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">
          {block.text}
        </p>
      );

    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          className={
            block.level === 2
              ? "font-display pt-2 text-2xl font-semibold text-pure-white sm:text-3xl"
              : "font-display pt-1 text-xl font-semibold text-pure-white"
          }
        >
          <Spans spans={block.spans} />
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p className="text-[15px] leading-relaxed text-slate-muted sm:text-base">
          <Spans spans={block.spans} />
        </p>
      );

    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-muted sm:text-base">
          {block.items.map((item, i) => (
            <li key={i}>
              <Spans spans={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-muted sm:text-base">
          {block.items.map((item, i) => (
            <li key={i}>
              <Spans spans={item} />
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-warm-beige pl-4 italic text-slate-muted">
          <BlockRenderer blocks={block.blocks} />
        </blockquote>
      );

    case "image":
      return (
        <figure className="overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="w-full object-cover" />
        </figure>
      );

    case "process":
      return (
        <ol className="space-y-3">
          {block.steps.map((step, i) => (
            <li key={i} className="flex gap-4 rounded-2xl border border-border bg-near-black p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-beige text-sm font-bold text-canvas-black">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                {/* step.title duplicates the heading already inside step.blocks (both come
                    from the same source heading) - only render blocks to avoid repeating it */}
                <BlockRenderer blocks={step.blocks} />
              </div>
            </li>
          ))}
        </ol>
      );

    case "flashcards":
      return <Flashcards items={block.items} />;

    case "tabs":
      return <Tabs tabs={block.tabs} />;

    case "accordion":
      return <Accordion items={block.items} />;

    case "note":
      return (
        <div className="rounded-2xl border border-warm-beige/30 bg-warm-beige/[0.06] p-5">
          <BlockRenderer blocks={block.blocks} />
        </div>
      );

    case "objective":
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-green/40 bg-emerald-green/10 px-4 py-1.5 text-sm text-emerald-green">
          🎯 {block.text}
        </div>
      );

    case "scenario-ref":
      return null; // handled by the lesson page directly, which renders the ScenarioPlayer

    default:
      return null;
  }
}
