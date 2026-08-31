import type { Span } from "@/content/types";

export function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => {
        let el: React.ReactNode = s.text;
        const marks = s.marks ?? [];
        if (marks.includes("code")) {
          el = (
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-warm-beige">
              {el}
            </code>
          );
        }
        if (marks.includes("bold")) el = <strong className="font-semibold text-pure-white">{el}</strong>;
        if (marks.includes("italic")) el = <em className="italic">{el}</em>;
        if (marks.includes("underline")) el = <span className="underline">{el}</span>;
        return <span key={i}>{el}</span>;
      })}
    </>
  );
}
