"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Certificate, { type CertificateData } from "@/components/Certificate";
import { getProgress, getQuizRecord, isQuizPassed } from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";
import MagneticButton from "@/components/motion/MagneticButton";
import ConfettiBurst from "@/components/motion/ConfettiBurst";

export default function CertificatePage() {
  const mounted = useMounted();
  const [, force] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const hasFiredConfetti = useRef(false);

  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    window.addEventListener("beige-progress-changed", rerender);
    return () => window.removeEventListener("beige-progress-changed", rerender);
  }, []);

  const progress = mounted ? getProgress() : { learnerName: null };
  const earned = mounted && isQuizPassed("final-certification-assessment");
  const record = mounted ? getQuizRecord("final-certification-assessment") : undefined;

  useEffect(() => {
    if (earned && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2200);
      return () => clearTimeout(t);
    }
  }, [earned]);

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
    <div className="relative mx-auto max-w-4xl overflow-hidden px-6 py-10 sm:py-14">
      {showConfetti && <ConfettiBurst />}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">Certification</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-pure-white">
          {earned ? "Your certificate" : "Certificate preview"}
        </h1>
        <p className="mt-3 max-w-xl text-slate-muted">
          {earned
            ? "Congratulations, download your certificate below."
            : "This is what your certificate will look like once you pass the Final Certification Assessment with an 80% or higher score."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`mt-8 rounded-3xl ${earned ? "shadow-[0_0_60px_-15px_rgba(232,209,171,0.35)]" : ""}`}
      >
        <Certificate ref={ref} data={data} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Link href="/dashboard" className="rounded-full border border-border px-6 py-2.5 text-sm text-slate-muted hover:text-pure-white">
          Dashboard
        </Link>
        {earned ? (
          <>
            <MagneticButton
              onClick={() => download("png")}
              disabled={busy !== null}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:opacity-50"
            >
              {busy === "png" ? "Preparing…" : "Download PNG"}
            </MagneticButton>
            <MagneticButton
              onClick={() => download("pdf")}
              disabled={busy !== null}
              className="rounded-full border border-warm-beige/50 px-6 py-2.5 text-sm font-medium text-warm-beige transition hover:bg-warm-beige/10 disabled:opacity-50"
            >
              {busy === "pdf" ? "Preparing…" : "Download PDF"}
            </MagneticButton>
          </>
        ) : (
          <Link
            href="/quiz/final-certification-assessment"
            className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
          >
            Go to Final Certification Assessment →
          </Link>
        )}
      </motion.div>
    </div>
  );
}
