// Core content schema for the Beige Sales Rep Training Portal.
// Bespoke, not a 1:1 port of any course-builder's internal format.

export type Mark = "bold" | "italic" | "code" | "underline";

export interface Span {
  text: string;
  marks?: Mark[];
}

export type ContentBlock =
  | { type: "eyebrow"; text: string }
  | { type: "heading"; level: 2 | 3; spans: Span[] }
  | { type: "paragraph"; spans: Span[] }
  | { type: "list"; ordered: boolean; items: Span[][] }
  | { type: "quote"; blocks: ContentBlock[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "process";
      steps: { title: string; blocks: ContentBlock[]; imageHint?: string | null }[];
    }
  | { type: "flashcards"; items: { front: string; back: string }[] }
  | { type: "tabs"; tabs: { label: string; blocks: ContentBlock[] }[] }
  | { type: "accordion"; items: { title: string; blocks: ContentBlock[] }[] }
  | { type: "note"; blocks: ContentBlock[] }
  | { type: "objective"; text: string }
  | { type: "scenario-ref"; rootNodeId: string };

export interface Lesson {
  id: string; // slug, stable across rebuilds
  moduleId: ModuleId;
  title: string;
  order: number;
  blocks: ContentBlock[];
  /** if set, lesson body is a full-screen branching scenario instead of blocks */
  scenarioId?: string;
}

export type ModuleId = "module-1" | "module-2" | "module-3" | "module-4" | "module-5";

export interface ModuleItem {
  kind: "lesson" | "quiz";
  id: string;
}

export interface Module {
  id: ModuleId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  color: string; // accent color for this module's chrome
  coverImage: string;
  items: ModuleItem[];
  /** the quiz that gates this module's completion, if any (module 5's items are quizzes themselves, so it has none) */
  quizId?: string;
}

// ---------------- Scenario (branching dialogue) ----------------

export interface ScenarioOption {
  text: string;
  feedback: string;
  reactionImage: string | null;
  nextId: string | null;
  outcomeId: string;
  /** true if this is the "correct"/recommended path */
  isBest: boolean;
}

export interface ScenarioChoiceNode {
  id: string;
  kind: "choice";
  text: string;
  characterImage: string | null;
  sceneId: string | null;
  options: ScenarioOption[];
}

export interface ScenarioNarrationNode {
  id: string;
  kind: "narration";
  text: string;
  characterImage: string | null;
  sceneId: string | null;
  result: "correct" | "incorrect" | null;
  nextId: string | null;
}

export type ScenarioNode = ScenarioChoiceNode | ScenarioNarrationNode;

export interface Scenario {
  id: string;
  title: string;
  moduleId: ModuleId;
  lessonId: string;
  sceneImage: string;
  rootId: string;
  nodes: Record<string, ScenarioNode>;
}

// ---------------- Quiz / Assessment ----------------

export type QuestionType = "single" | "multi" | "matching" | "ordering" | "scenario";

export interface ChoiceOption {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  moduleId: ModuleId;
  prompt: string;
  explanation: string; // shown after answering, why correct answer is correct
  /** compact topic thumbnail shown next to the prompt (single/multi/matching/ordering questions) */
  topicImage?: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single" | "scenario";
  options: ChoiceOption[];
  correctOptionId: string;
  scenarioContext?: string; // extra framing paragraph for "scenario" type
  /** scenario-type visual dressing: a "customer" avatar delivering scenarioContext as a speech line */
  characterImage?: string;
  sceneImage?: string;
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: "multi";
  options: ChoiceOption[];
  correctOptionIds: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  pairs: { left: string; right: string }[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: "ordering";
  steps: string[]; // correct order
}

export type Question =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | MatchingQuestion
  | OrderingQuestion;

export interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleIds: ModuleId[]; // modules this quiz draws from / gates
  passThreshold: number; // 0-1, e.g. 0.8
  questions: Question[];
  /** on fail, which modules' lessons get marked incomplete. Empty = derive from missed questions (final exam). */
  resetModules: ModuleId[] | "by-missed-question";
  unlocksQuizId?: string; // e.g. module quizzes unlock the final exam once ALL are passed
  isFinal?: boolean;
  /** if set, the whole attempt is timed - auto-submits whatever is answered when it hits 0 */
  timeLimitSeconds?: number;
  /** shown on the quiz intro screen */
  heroImage?: string;
}
