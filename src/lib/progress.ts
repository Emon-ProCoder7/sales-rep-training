"use client";

import { LESSONS, MODULES, MODULES_BY_ID } from "@/content/modules";
import type { ModuleId, Quiz } from "@/content/types";
import type { QuizResult } from "@/lib/scoring";
import { missedModuleIds } from "@/lib/scoring";

const STORAGE_KEY = "beige-training-progress-v1";

export interface QuizAttemptRecord {
  bestScorePct: number; // 0-100
  passed: boolean;
  attempts: number;
  lastAttemptAt: string;
}

export interface ProgressState {
  learnerName: string | null;
  completedLessons: Record<string, true>;
  quizzes: Record<string, QuizAttemptRecord>;
}

function emptyState(): ProgressState {
  return { learnerName: null, completedLessons: {}, quizzes: {} };
}

function read(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("beige-progress-changed"));
}

export function getProgress(): ProgressState {
  return read();
}

export function setLearnerName(name: string) {
  const s = read();
  s.learnerName = name.trim();
  write(s);
}

export function isLessonComplete(lessonId: string): boolean {
  return !!read().completedLessons[lessonId];
}

export function markLessonComplete(lessonId: string) {
  const s = read();
  s.completedLessons[lessonId] = true;
  write(s);
}

export function markLessonsIncomplete(lessonIds: string[]) {
  const s = read();
  for (const id of lessonIds) delete s.completedLessons[id];
  write(s);
}

export function getQuizRecord(quizId: string): QuizAttemptRecord | undefined {
  return read().quizzes[quizId];
}

export function isQuizPassed(quizId: string): boolean {
  return !!read().quizzes[quizId]?.passed;
}

export function recordQuizResult(quizId: string, scorePct: number, passed: boolean) {
  const s = read();
  const prev = s.quizzes[quizId];
  s.quizzes[quizId] = {
    bestScorePct: Math.max(prev?.bestScorePct ?? 0, scorePct),
    passed: passed || !!prev?.passed,
    attempts: (prev?.attempts ?? 0) + 1,
    lastAttemptAt: new Date().toISOString(),
  };
  write(s);
}

export function resetAll() {
  write(emptyState());
}

/**
 * Applies the restart rule after a quiz/exam attempt: on fail, resets that
 * assessment (record it, un-pass it) AND marks the lessons of the module(s)
 * it covers as incomplete, forcing a re-read before the retry. Module quizzes
 * always reset their single module; the final exam resets only the module(s)
 * where the rep actually missed a question, per its own `resetModules` config.
 */
export function applyQuizAttempt(quiz: Quiz, result: QuizResult) {
  recordQuizResult(quiz.id, result.scorePct, result.passed);
  if (result.passed) return;

  const modulesToReset: ModuleId[] =
    quiz.resetModules === "by-missed-question"
      ? (missedModuleIds(result.perQuestion) as ModuleId[])
      : quiz.resetModules;

  const lessonIdsToReset = modulesToReset.flatMap((m) => moduleLessonIds(m));
  markLessonsIncomplete(lessonIdsToReset);
}

// ---------------- Derived unlock / completion logic ----------------

export function moduleLessonIds(moduleId: ModuleId): string[] {
  const mod = MODULES_BY_ID[moduleId];
  return mod ? mod.items.filter((i) => i.kind === "lesson").map((i) => i.id) : [];
}

export function isModuleLessonsComplete(moduleId: ModuleId): boolean {
  const ids = moduleLessonIds(moduleId);
  const completed = read().completedLessons;
  return ids.length > 0 && ids.every((id) => completed[id]);
}

export function isModuleFullyDone(moduleId: ModuleId): boolean {
  const mod = MODULES_BY_ID[moduleId];
  if (!mod) return false;
  if (!isModuleLessonsComplete(moduleId)) return false;
  if (mod.quizId) return isQuizPassed(mod.quizId);
  return true;
}

/** Lessons unlock sequentially within their module; module 1 lesson 1 is always open. */
export function isLessonUnlocked(lessonId: string): boolean {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return false;

  const moduleIdx = MODULES.findIndex((m) => m.id === lesson.moduleId);
  // previous modules must be fully done
  for (let i = 0; i < moduleIdx; i++) {
    if (!isModuleFullyDone(MODULES[i].id)) return false;
  }

  const ids = moduleLessonIds(lesson.moduleId);
  const posInModule = ids.indexOf(lessonId);
  if (posInModule <= 0) return true;
  const completed = read().completedLessons;
  return completed[ids[posInModule - 1]] === true;
}

export function isQuizUnlocked(quizId: string): boolean {
  if (quizId === "final-certification-assessment") {
    return ["module-2", "module-3", "module-4"].every((m) =>
      isModuleFullyDone(m as ModuleId)
    );
  }
  const owningModule = MODULES.find((m) => m.quizId === quizId);
  if (!owningModule) return false;
  const moduleIdx = MODULES.findIndex((m) => m.id === owningModule.id);
  for (let i = 0; i < moduleIdx; i++) {
    if (!isModuleFullyDone(MODULES[i].id)) return false;
  }
  return isModuleLessonsComplete(owningModule.id);
}

export function isCertified(): boolean {
  return isQuizPassed("final-certification-assessment");
}

export function overallPercentComplete(): number {
  const totalLessons = LESSONS.length;
  const done = Object.keys(read().completedLessons).length;
  const quizzesTotal = 4;
  const quizzesDone = ["quiz-tools-workflow", "quiz-scripts-event-types", "quiz-objection-handling", "final-certification-assessment"].filter(isQuizPassed).length;
  const totalUnits = totalLessons + quizzesTotal;
  const doneUnits = done + quizzesDone;
  return Math.round((doneUnits / totalUnits) * 100);
}
