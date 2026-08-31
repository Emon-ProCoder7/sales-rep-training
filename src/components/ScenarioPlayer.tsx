"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Scenario, ScenarioOption } from "@/content/types";

export default function ScenarioPlayer({
  scenario,
  onComplete,
}: {
  scenario: Scenario;
  onComplete?: () => void;
}) {
  const [nodeId, setNodeId] = useState(scenario.rootId);
  const [selected, setSelected] = useState<ScenarioOption | null>(null);
  const [completedOnce, setCompletedOnce] = useState(false);

  const node = scenario.nodes[nodeId];

  function pick(opt: ScenarioOption) {
    setSelected(opt);
  }

  function advance(nextId: string | null) {
    setSelected(null);
    if (nextId) {
      setNodeId(nextId);
    } else {
      restart();
    }
  }

  function restart() {
    setSelected(null);
    setNodeId(scenario.rootId);
  }

  if (!node) return null;

  const characterImage = selected?.reactionImage ?? node.characterImage;
  const bodyText = selected ? selected.feedback : node.text;
  const isEnding = node.kind === "narration";

  useEffect(() => {
    if (isEnding && node.kind === "narration" && node.result === "correct" && !completedOnce) {
      setCompletedOnce(true);
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-near-black">
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={scenario.sceneImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/20 to-transparent" />
        <AnimatePresence mode="wait">
          {characterImage && (
            <motion.img
              key={characterImage}
              src={characterImage}
              alt=""
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-0 right-4 h-full max-h-56 w-auto object-contain sm:right-8 sm:max-h-72"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={nodeId + (selected?.outcomeId ?? "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {selected && (
              <p
                className={`mb-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                  selected.isBest ? "text-emerald-green" : "text-error"
                }`}
              >
                {selected.isBest ? "Strong choice" : "Not quite"}
              </p>
            )}
            <p className="text-lg leading-relaxed text-pure-white">{bodyText}</p>

            {isEnding && node.result === "correct" && (
              <p className="mt-4 rounded-xl border border-emerald-green/30 bg-emerald-green/10 px-4 py-3 text-sm text-emerald-green">
                Scenario complete — you handled every decision point well.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 space-y-2.5">
          {!selected && node.kind === "choice" && (
            <>
              {node.options.map((opt) => (
                <button
                  key={opt.outcomeId}
                  onClick={() => pick(opt)}
                  className="block w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-left text-sm text-pure-white transition hover:border-warm-beige hover:bg-warm-beige/[0.08]"
                >
                  {opt.text}
                </button>
              ))}
            </>
          )}

          {selected && (
            <button
              onClick={() => advance(selected.nextId)}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
            >
              {selected.nextId ? "Continue →" : "Try that decision again"}
            </button>
          )}

          {isEnding && (
            <button
              onClick={restart}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-slate-muted transition hover:border-warm-beige hover:text-warm-beige"
            >
              Replay scenario
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
