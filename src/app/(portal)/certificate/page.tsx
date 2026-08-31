"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Certificate, { type CertificateData } from "@/components/Certificate";
import { getProgress, getQuizRecord, isQuizPassed } from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";

export default function CertificatePage() {
  const mounted = useMounted();
  const [, force] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);

  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    window.addEventListener("beige-progress-changed", rerender);
    return () => window.removeEventListener("beige-progress-changed", rerender);
  }, []);

  const progress = mounted ? getProgress() : { learnerName: null };
  const earned = mounted && isQuizPassed("final-certification-assessment");
  const record = mounted ? getQuizRecord("final-certification-assessment") : undefined;

  const data: CertificateData = useMemo(() => {
    const dateLabel = record
      ? new Date(record.lastAttemptAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const seed = `${progress.learnerName ?? "preview"}-${record?.lastAttemptAt ?? "0"}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    const certId = "BG-" + hash.toString(36).toUpperCase().slice(0, 6);
    return {
      name: progress.learnerName ?? "",
      scorePct: record?.bestScorePct ?? 0,
      dateLabel,
      certId,
      earned,
    };
  }, [progress.learnerName, record, earned]);

  async function download(kind: "png" | "pdf") {
    if (!ref.current) return;
    setBusy(kind);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });

      if (kind === "png") {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `beige-certificate-${data.certId}.png`;
        a.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const img = new Image();
        img.src = dataUrl;
        await new Promise((res) => (img.onload = res));
        const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [img.width, img.height] });
        pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
        pdf.save(`beige-certificate-${data.certId}.pdf`);
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">Certification</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-pure-white">
        {earned ? "Your certificate" : "Certificate preview"}
      </h1>
      <p className="mt-3 max-w-xl text-slate-muted">
        {earned
          ? "Congratulations — download your certificate below."
          : "This is what your certificate will look like once you pass the Final Certification Assessment with an 80% or higher score."}
      </p>

      <div className="mt-8">
        <Certificate ref={ref} data={data} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/dashboard" className="rounded-full border border-border px-6 py-2.5 text-sm text-slate-muted hover:text-pure-white">
          Dashboard
        </Link>
        {earned ? (
          <>
            <button
              onClick={() => download("png")}
              disabled={busy !== null}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:opacity-50"
            >
              {busy === "png" ? "Preparing…" : "Download PNG"}
            </button>
            <button
              onClick={() => download("pdf")}
              disabled={busy !== null}
              className="rounded-full border border-warm-beige/50 px-6 py-2.5 text-sm font-medium text-warm-beige transition hover:bg-warm-beige/10 disabled:opacity-50"
            >
              {busy === "pdf" ? "Preparing…" : "Download PDF"}
            </button>
          </>
        ) : (
          <Link
            href="/quiz/final-certification-assessment"
            className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
          >
            Go to Final Certification Assessment →
          </Link>
        )}
      </div>
    </div>
  );
}
