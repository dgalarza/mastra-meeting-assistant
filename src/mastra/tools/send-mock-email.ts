import { mkdir, appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../../..");
const mockOutboxPath = resolve(
  projectRoot,
  "workspace",
  "mock-outbox",
  "sent-emails.jsonl",
);

const mockEmailSchema = z.object({
  to: z.array(z.email()).min(1).describe("Recipient email addresses"),
  subject: z.string().min(1).describe("Email subject line"),
  body: z.string().min(1).describe("Plain text email body"),
  from: z
    .email()
    .optional()
    .default("assistant@demo.local")
    .describe("Optional sender email address"),
  cc: z.array(z.email()).optional().default([]).describe("CC recipients"),
  bcc: z.array(z.email()).optional().default([]).describe("BCC recipients"),
});

const sendMockEmailOutputSchema = z.object({
  id: z.string(),
  status: z.literal("mock-sent"),
  savedTo: z.string(),
  sentAt: z.string(),
  summary: z.string(),
});

type MockEmailRecord = z.infer<typeof mockEmailSchema> & {
  id: string;
  status: "mock-sent";
  sentAt: string;
};

export const sendMockEmail = createTool({
  id: "send-mock-email",
  description:
    "Send an email and save the result to the local outbox file.",
  inputSchema: mockEmailSchema,
  outputSchema: sendMockEmailOutputSchema,
  requireApproval: true,
  execute: async (input) => {
    const record: MockEmailRecord = {
      ...input,
      id: randomUUID(),
      status: "mock-sent",
      sentAt: new Date().toISOString(),
    };

    await mkdir(dirname(mockOutboxPath), { recursive: true });
    await appendFile(mockOutboxPath, `${JSON.stringify(record)}\n`, "utf8");

    return {
      id: record.id,
      status: record.status,
      savedTo: mockOutboxPath,
      sentAt: record.sentAt,
      summary: `Mock email saved for ${record.to.join(", ")} with subject "${record.subject}".`,
    };
  },
});
