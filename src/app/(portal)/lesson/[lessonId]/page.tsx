"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLesson, moduleForItem, nextLessonId } from "@/content/modules";
import { SCENARIOS_BY_LESSON_ID } from "@/content/scenarios";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import { isLessonComplete, isLessonUnlocked, markLessonComplete } from "@/lib/progress";
import { useMounted } from "@/lib/useMounted";

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const mounted = useMounted();
  const [, force] = useState(0);

  const lesson = getLesson(lessonId);
  const scenario = SCENARIOS_BY_LESSON_ID[lessonId];
  const mod = lesson ? moduleForItem(lesson.id) : undefined;

  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    window.addEventListener("beige-progress-changed", rerender);
    return () => window.removeEventListener("beige-progress-changed", rerender);
  }, []);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-slate-muted">
        Lesson not found.
      </div>
    );
  }

  // Unlock state depends on localStorage progress, which the server can't see -
  // render a neutral shell until mounted so hydration has nothing to diff.
  if (!mounted) {
    return <div className="mx-auto max-w-3xl px-6 py-14" />;
  }

  const unlocked = isLessonUnlocked(lessonId);
  if (!unlocked) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-slate-muted">
          This lesson isn&apos;t unlocked yet. Complete the earlier lessons in this module first.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-warm-beige hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const complete = isLessonComplete(lessonId);
  const next = nextLessonId(lessonId);

  function complete_() {
    markLessonComplete(lessonId);
    if (next) {
      router.push(isQuizId(next) ? `/quiz/${next}` : `/lesson/${next}`);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      {mod && (
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.16em] text-mid-gray">
          {mod.title}
        </p>
      )}

      <BlockRenderer blocks={lesson.blocks.filter((b) => b.type !== "scenario-ref")} />

      {scenario && (
        <div className="mt-6">
          <ScenarioPlayer scenario={scenario} onComplete={() => markLessonComplete(lessonId)} />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <Link href="/dashboard" className="text-sm text-slate-muted hover:text-pure-white">
          ← Dashboard
        </Link>
        <button
          onClick={complete_}
          className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
        >
          {complete ? "Continue →" : "Mark complete & continue →"}
        </button>
      </div>
    </div>
  );
}

function isQuizId(id: string) {
  return (
    id === "quiz-tools-workflow" ||
    id === "quiz-scripts-event-types" ||
    id === "quiz-objection-handling" ||
    id === "final-certification-assessment"
  );
}
