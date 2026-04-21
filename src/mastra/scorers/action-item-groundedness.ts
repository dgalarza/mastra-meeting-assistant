import { createScorer } from "@mastra/core/evals";
import {
  getUserMessageFromRunInput,
  getAssistantMessageFromRunOutput,
} from "@mastra/evals/scorers/utils";
import { z } from "zod";

const perItemJudgmentSchema = z.object({
  items: z.array(
    z.object({
      description: z.string(),
      score: z.number().min(0).max(1),
      justification: z.string(),
    }),
  ),
});

export type PerItemJudgment = z.infer<typeof perItemJudgmentSchema>;

interface PreprocessResult {
  transcript: string;
  actionItems: { description: string; owner: string | null }[];
}

const JUDGE_INSTRUCTIONS = `You evaluate whether action items extracted from a meeting transcript are grounded in what participants actually committed to.

For each action item, decide whether it is GROUNDED in the transcript.

An action item is GROUNDED (score 1) if a participant explicitly committed to a specific task during the meeting. Direct quotes or clear paraphrases count.

An action item is NOT GROUNDED (score 0) if any of the following are true:
- It describes something conditional ("we might", "if we have time", "we should probably consider")
- It's a topic of discussion without a clear commitment
- It's plausible but not actually said in the transcript
- It's an inference about what someone "should" do, rather than something they committed to do

For each action item, return its description verbatim, a score of 1 or 0, and a one-sentence justification quoting or referencing the relevant transcript passage (or noting its absence).`;

export const actionItemGroundedness = createScorer({
  id: "action-item-groundedness",
  name: "Action Item Groundedness",
  description:
    "Scores each extracted action item 1 if grounded in the transcript, 0 otherwise. Final score is the mean.",
  type: "agent",
  judge: {
    model: "anthropic/claude-sonnet-4-5",
    instructions: JUDGE_INSTRUCTIONS,
  },
})
  .preprocess(({ run }): PreprocessResult => {
    const transcript = getUserMessageFromRunInput(run.input) ?? "";
    const assistantText = getAssistantMessageFromRunOutput(run.output) ?? "";

    let actionItems: PreprocessResult["actionItems"] = [];
    if (assistantText) {
      try {
        const parsed = JSON.parse(assistantText) as {
          action_items?: PreprocessResult["actionItems"];
        };
        if (Array.isArray(parsed?.action_items)) {
          actionItems = parsed.action_items;
        }
      } catch {
        // Not structured JSON — leave empty, judge will score 0 items.
      }
    }

    return { transcript, actionItems };
  })
  .analyze({
    description: "Per-item groundedness judgment",
    outputSchema: perItemJudgmentSchema,
    createPrompt: ({ results }) => {
      const { transcript, actionItems } =
        (results.preprocessStepResult as PreprocessResult | undefined) ?? {
          transcript: "",
          actionItems: [],
        };

      const itemList = actionItems
        .map(
          (item, i) =>
            `${i + 1}. ${item.description}${item.owner ? ` (owner: ${item.owner})` : ""}`,
        )
        .join("\n");

      return `TRANSCRIPT:
${transcript}

EXTRACTED ACTION ITEMS:
${itemList}`;
    },
  })
  .generateScore(({ results }) => {
    const judgment = results.analyzeStepResult as PerItemJudgment | undefined;
    const items = judgment?.items ?? [];
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item.score, 0);
    return sum / items.length;
  })
  .generateReason(({ results, score }) => {
    const judgment = results.analyzeStepResult as PerItemJudgment | undefined;
    const items = judgment?.items ?? [];
    const ungrounded = items.filter((i) => i.score < 1);

    if (ungrounded.length === 0) {
      return `Score ${score.toFixed(2)}. All ${items.length} extracted action items are grounded in the transcript.`;
    }

    const lines = ungrounded
      .map((i) => `- "${i.description}": ${i.justification}`)
      .join("\n");
    return `Score ${score.toFixed(2)}. ${ungrounded.length} of ${items.length} action items are not grounded in the transcript:\n${lines}`;
  });
