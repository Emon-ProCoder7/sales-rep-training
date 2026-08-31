"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Quiz } from "@/content/types";
import type { AnswerValue } from "@/lib/scoring";
import { scoreQuiz, type QuizResult } from "@/lib/scoring";
import { applyQuizAttempt } from "@/lib/progress";
import QuestionRenderer from "./QuestionRenderer";

type Phase = "intro" | "question" | "result";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue | undefined>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.timeLimitSeconds ?? null);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const question = quiz.questions[index];
  const answered = answers[question?.id] !== undefined;

  function submitWith(currentAnswers: Record<string, AnswerValue | undefined>) {
    const r = scoreQuiz(quiz.questions, currentAnswers, quiz.passThreshold);
    applyQuizAttempt(quiz, r);
    setResult(r);
    setPhase("result");
  }

  function submit() {
    submitWith(answersRef.current);
  }

  function start() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setTimeLeft(quiz.timeLimitSeconds ?? null);
    setPhase("question");
  }

  // Countdown for timed assessments - auto-submits whatever is answered at 0.
  useEffect(() => {
    if (phase !== "question" || quiz.timeLimitSeconds == null) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return t;
        if (t <= 1) {
          clearInterval(interval);
          submitWith(answersRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-14">
        {quiz.heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 overflow-hidden rounded-3xl border border-border bg-near-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={quiz.heroImage} alt="" className="h-44 w-full object-cover sm:h-56" />
          </motion.div>
        )}

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-beige">
          {quiz.isFinal ? "Certification" : "Module Quiz"}
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-pure-white">{quiz.title}</h1>
        <p className="mt-3 text-slate-muted">{quiz.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Questions" value={String(quiz.questions.length)} />
          <Stat label="Pass mark" value={`${Math.round(quiz.passThreshold * 100)}%`} />
          <Stat label="Wrong answer" value="−0.5 pts" />
          {quiz.timeLimitSeconds != null && (
            <Stat label="Time limit" value={`${Math.round(quiz.timeLimitSeconds / 60)} min`} />
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-warm-beige/25 bg-warm-beige/[0.06] p-5 text-sm text-slate-muted">
          Wrong answers subtract points, so guessing hurts more than skipping ahead carefully.
          {quiz.timeLimitSeconds != null &&
            ` This exam is timed — it auto-submits whatever you've answered when the clock hits zero.`}{" "}
          If you don&apos;t hit {Math.round(quiz.passThreshold * 100)}%,{" "}
          {quiz.isFinal
            ? "the modules you missed questions on get marked incomplete and you'll need to review them before retaking the exam."
            : "this module's lessons get marked incomplete and you'll need to review them before retaking the quiz."}
        </div>

        <button
          onClick={start}
          className="mt-8 rounded-full bg-ivory px-7 py-3 text-sm font-semibold text-canvas-black transition hover:brightness-95"
        >
          Start {quiz.isFinal ? "exam" : "quiz"} →
        </button>
      </div>
    );
  }

  if (phase === "question" && question) {
    const progress = ((index + 1) / quiz.questions.length) * 100;
    const lowTime = timeLeft !== null && timeLeft <= 120;
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-mid-gray">
            <span>
              Question {index + 1} / {quiz.questions.length}
            </span>
            <div className="flex items-center gap-3">
              {timeLeft !== null && (
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                    lowTime
                      ? "border-error/50 bg-error/10 text-error animate-pulse"
                      : "border-border bg-surface text-warm-beige"
                  }`}
                >
                  ⏱ {formatTime(timeLeft)}
                </span>
              )}
              <span>{quiz.title}</span>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-warm-beige transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-5 text-xl font-medium text-pure-white">{question.prompt}</h2>

            <QuestionRenderer
              question={question}
              value={answers[question.id]}
              onChange={(v) => setAnswers((a) => ({ ...a, [question.id]: v }))}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-full border border-border px-5 py-2.5 text-sm text-slate-muted disabled:opacity-30"
          >
            ← Back
          </button>
          {index < quiz.questions.length - 1 ? (
            <button
              onClick={() => setIndex((i) => i + 1)}
              disabled={!answered}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!answered}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-3xl border p-7 text-center ${
            result.passed ? "border-emerald-green/40 bg-emerald-green/[0.08]" : "border-error/40 bg-error/[0.06]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mid-gray">
            {result.passed ? "Passed" : "Not passed"}
          </p>
          <p className={`font-display mt-2 text-5xl font-bold ${result.passed ? "text-emerald-green" : "text-error"}`}>
            {result.scorePct}%
          </p>
          <p className="mt-2 text-sm text-slate-muted">
            Pass mark is {Math.round(quiz.passThreshold * 100)}%
          </p>
        </motion.div>

        {timeLeft === 0 && (
          <p className="mt-4 text-sm text-warm-beige">Time expired — your answers were submitted automatically.</p>
        )}

        {!result.passed && (
          <p className="mt-4 text-sm text-slate-muted">
            {quiz.isFinal
              ? "The modules tied to your missed questions are now marked incomplete. Review them, then retake the full exam from question 1."
              : "This module's lessons are now marked incomplete. Review them, then retake the quiz from question 1."}
          </p>
        )}

        <div className="mt-8 space-y-3">
          {quiz.questions.map((q, i) => {
            const r = result.perQuestion[i];
            return (
              <div key={q.id} className="rounded-2xl border border-border bg-near-black p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-pure-white">{q.prompt}</p>
                  <span className={`shrink-0 text-xs font-semibold ${r.correct ? "text-emerald-green" : "text-error"}`}>
                    {r.correct ? "Correct" : "Missed"}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-muted">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full border border-border px-6 py-2.5 text-sm text-slate-muted hover:text-pure-white">
            Dashboard
          </Link>
          {result.passed ? (
            quiz.isFinal ? (
              <button
                onClick={() => router.push("/certificate")}
                className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
              >
                View your certificate →
              </button>
            ) : null
          ) : (
            <button
              onClick={start}
              className="rounded-full bg-ivory px-6 py-2.5 text-sm font-semibold text-canvas-black transition hover:brightness-95"
            >
              Restart {quiz.isFinal ? "exam" : "quiz"} from question 1
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
      <p className="font-display text-lg font-semibold text-pure-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-mid-gray">{label}</p>
    </div>
  );
}
