import type { Scenario } from "../types";
import generatedScenarios from "../generated/scenarios.json";
import { weddingBudgetPushbackScenario } from "./wedding-budget-pushback";

const toughCorporateCallRaw = (generatedScenarios as any)["lwsxludvc"];
const sceneMeta = (generatedScenarios as any)["scene:niehodbbx"];

const toughCorporateCall: Scenario = {
  id: "scenario-tough-corporate-call",
  title: "Live Scenario: Handling a Tough Corporate Call",
  moduleId: "module-4",
  lessonId: "scenario-tough-corporate-call",
  sceneImage: sceneMeta?.src ?? "/images/scene-niehodbbx-EN.png",
  rootId: toughCorporateCallRaw.rootId,
  nodes: toughCorporateCallRaw.nodes,
};

export const SCENARIOS: Scenario[] = [toughCorporateCall, weddingBudgetPushbackScenario];

export const SCENARIOS_BY_LESSON_ID: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((s) => [s.lessonId, s])
);
