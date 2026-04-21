import { Agent } from "@mastra/core/agent";
import { actionItemGroundedness } from "../scorers/action-item-groundedness";

const V2_INSTRUCTIONS = `Extract action items from this meeting transcript.

An action item is something a participant explicitly committed to do during the meeting. Direct quotes or clear paraphrases count.

Do NOT include:
- Advice or suggestions the participant never committed to act on
- Ongoing work or things already on someone's plate (only new commitments made in this meeting)
- Conditional or aspirational statements ("we might", "if we have time", "next quarter if budget allows")
- Plausible inferences about what someone "should" do

For each action item, the transcript must contain an explicit commitment from the owner.`;

export const actionItemExtractor = new Agent({
  id: "action-item-extractor",
  name: "Action Item Extractor",
  model: "anthropic/claude-sonnet-4-5",
  instructions: V2_INSTRUCTIONS,
  scorers: {
    groundedness: {
      scorer: actionItemGroundedness,
      sampling: { type: "ratio", rate: 1 }
    }
  }
});
