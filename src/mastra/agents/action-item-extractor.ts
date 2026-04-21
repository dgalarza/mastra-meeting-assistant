import { Agent } from "@mastra/core/agent";
import { actionItemGroundedness } from "../scorers/action-item-groundedness";

// v1 prompt — intentionally underspecified.
// We'll tighten this after the eval surfaces what it misses.
const V1_INSTRUCTIONS = `Extract action items from this meeting transcript.`;

export const actionItemExtractor = new Agent({
  id: "action-item-extractor",
  name: "Action Item Extractor",
  model: "anthropic/claude-sonnet-4-5",
  instructions: V1_INSTRUCTIONS,
  scorers: {
    groundedness: {
      scorer: actionItemGroundedness,
      sampling: { type: "ratio", rate: 1 },
    },
  },
});
