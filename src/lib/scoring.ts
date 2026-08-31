import type { Question } from "@/content/types";

export type AnswerValue =
  | string // single / scenario: selected option id
  | string[] // multi: selected option ids; ordering: chosen order of steps
  | Record<string, string>; // matching: left -> chosen right

export const CORRECT_POINTS = 1;
export const INCORRECT_POINTS = -0.5;

export function isCorrect(q: Question, answer: AnswerValue | undefined): boolean {
  if (answer === undefined) return false;
  switch (q.type) {
    case "single":
    case "scenario":
      return answer === q.correctOptionId;
    case "multi": {
      const a = new Set(Array.isArray(answer) ? answer : []);
      const c = new Set(q.correctOptionIds);
      if (a.size !== c.size) return false;
      for (const id of a) if (!c.has(id)) return false;
      return true;
    }
    case "matching": {
      if (typeof answer !== "object" || Array.isArray(answer)) return false;
      return q.pairs.every((p) => (answer as Record<string, string>)[p.left] === p.right);
    }
    case "ordering": {
      if (!Array.isArray(answer)) return false;
      if (answer.length !== q.steps.length) return false;
      return q.steps.every((s, i) => answer[i] === s);
    }
  }
}

export interface QuestionResult {
  id: string;
  moduleId: string;
  correct: boolean;
}

export interface QuizResult {
  pointsRaw: number;
  scorePct: number; // 0-100, floor 0
  passed: boolean;
  perQuestion: QuestionResult[];
}

export function scoreQuiz(
  questions: Question[],
  answers: Record<string, AnswerValue | undefined>,
  passThreshold: number
): QuizResult {
  let points = 0;
  const perQuestion: QuestionResult[] = [];
  for (const q of questions) {
    const correct = isCorrect(q, answers[q.id]);
    points += correct ? CORRECT_POINTS : INCORRECT_POINTS;
    perQuestion.push({ id: q.id, correct, moduleId: q.moduleId });
  }
  const max = questions.length;
  const scorePct = Math.round((Math.max(0, points) / max) * 100);
  return { pointsRaw: points, scorePct, passed: scorePct / 100 >= passThreshold, perQuestion };
}

export function missedModuleIds(perQuestion: QuestionResult[]): string[] {
  const missed = new Set<string>();
  for (const q of perQuestion) if (!q.correct) missed.add(q.moduleId);
  return Array.from(missed);
}
