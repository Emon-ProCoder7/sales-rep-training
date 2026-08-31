"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getQuiz } from "@/content/quizzes";
import { isQuizUnlocked } from "@/lib/progress";
import QuizPlayer from "@/components/quiz/QuizPlayer";

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);

  // Checked once on entry, deliberately NOT reactive to later progress changes:
  // failing a quiz mid-attempt resets that module's lessons (by design), which
  // would otherwise re-run this check and yank the results screen out from
  // under the learner the instant they see their score.
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  useEffect(() => {
    setUnlocked(isQuizUnlocked(quizId));
  }, [quizId]);

  const quiz = getQuiz(quizId);
  if (!quiz) {
    return <div className="mx-auto max-w-2xl px-6 py-16 text-center text-slate-muted">Quiz not found.</div>;
  }

  if (unlocked === null) {
    return <div className="mx-auto max-w-2xl px-6 py-16" />;
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-slate-muted">
          {quiz.isFinal
            ? "Pass all three module quizzes before attempting the Final Certification Assessment."
            : "Complete every lesson in this module before taking its quiz."}
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-warm-beige hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <QuizPlayer key={quizId} quiz={quiz} />;
}
