"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#e8d1ab", "#ece1ce", "#14c573", "#ffffff"];

/** Hand-rolled particle burst - no canvas-confetti dependency needed for ~40 pieces. */
export default function ConfettiBurst({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: Math.random() * -420 - 80,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        shape: Math.random() > 0.5 ? "50%" : "2px",
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.4 + Math.random() * 0.6, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "40%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape,
          }}
        />
      ))}
    </div>
  );
}
