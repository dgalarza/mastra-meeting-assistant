import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { actionItemExtractor } from "../agents/action-item-extractor";

export const actionItemSchema = z.object({
  description: z.string(),
  owner: z.string().nullable(),
});

export const extractActionItemsOutputSchema = z.object({
  action_items: z.array(actionItemSchema),
});

export type ExtractActionItemsOutput = z.infer<
  typeof extractActionItemsOutputSchema
>;

export const extractActionItems = createTool({
  id: "extract-action-items",
  description:
    "Extract action items from a meeting transcript. Returns a list of action items with descriptions and owners.",
  inputSchema: z.object({
    transcript: z.string().describe("The full meeting transcript text"),
  }),
  outputSchema: extractActionItemsOutputSchema,
  execute: async (inputData) => {
    const result = await actionItemExtractor.generate(inputData.transcript, {
      structuredOutput: { schema: extractActionItemsOutputSchema },
    });

    return result.object as ExtractActionItemsOutput;
  },
});
