"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import NameGate from "@/components/NameGate";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-canvas-black">
      <NameGate />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-canvas-black/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-pure-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <img src="/beige-icon.png" alt="Beige" className="h-7 w-7 rounded-full" />
          <span className="text-sm font-medium text-pure-white">Sales Rep Training</span>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
