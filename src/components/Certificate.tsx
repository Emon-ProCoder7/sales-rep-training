"use client";

import { forwardRef } from "react";

export interface CertificateData {
  name: string;
  scorePct: number;
  dateLabel: string;
  certId: string;
  earned: boolean;
}

const Certificate = forwardRef<HTMLDivElement, { data: CertificateData }>(function Certificate(
  { data },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl border border-warm-beige/20 bg-canvas-black text-center"
      style={{
        backgroundImage: "url(/images/certificate-background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-8 py-10 sm:px-14">
        <img src="/beige-icon.png" alt="Beige" className="h-12 w-12 rounded-full sm:h-14 sm:w-14" />
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-warm-beige sm:text-xs">
          Beige Sales Rep Certification
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-slate-muted">
          This certifies that
        </p>
        <p className="font-display mt-2 text-3xl font-semibold text-pure-white sm:text-4xl">
          {data.name || "Your Name Here"}
        </p>
        <p className="mt-4 max-w-md text-xs leading-relaxed text-slate-muted sm:text-sm">
          has successfully completed the Beige Sales Rep Training program and passed the Final
          Certification Assessment with a score of{" "}
          <span className="font-semibold text-warm-beige">{data.scorePct}%</span>, earning full
          clearance to represent Beige on live client leads.
        </p>

        <div className="mt-8 flex w-full max-w-md items-center justify-between border-t border-warm-beige/20 pt-4 text-[10px] text-mid-gray sm:text-xs">
          <span>Issued {data.dateLabel}</span>
          <span>Certificate ID {data.certId}</span>
        </div>

        {!data.earned && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-canvas-black/25" />
            <p className="absolute right-3 top-3 rotate-[8deg] rounded-md border-2 border-warm-beige/70 bg-canvas-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-warm-beige sm:right-6 sm:top-6 sm:px-4 sm:text-xs">
              Preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Certificate;
