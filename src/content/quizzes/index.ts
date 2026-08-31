import type { Quiz } from "../types";
import { quizToolsWorkflow } from "./quiz-tools-workflow";
import { quizScriptsEventTypes } from "./quiz-scripts-event-types";
import { quizObjectionHandling } from "./quiz-objection-handling";
import { finalCertificationAssessment } from "./final-certification-assessment";

export const QUIZZES: Quiz[] = [
  quizToolsWorkflow,
  quizScriptsEventTypes,
  quizObjectionHandling,
  finalCertificationAssessment,
];

export const QUIZZES_BY_ID: Record<string, Quiz> = Object.fromEntries(
  QUIZZES.map((q) => [q.id, q])
);

export function getQuiz(id: string): Quiz | undefined {
  return QUIZZES_BY_ID[id];
}
