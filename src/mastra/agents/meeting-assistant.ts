import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace'
import { embedV3 as embed } from "@mastra/core/vector";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { LibSQLVector } from "@mastra/libsql";
import { fastembed } from "@mastra/fastembed";
import { searchWeb } from "../tools/research-tools";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspacePath = resolve(__dirname, "../../workspace");

const workspaceVectorStore = new LibSQLVector({
  id: 'libsql-vector',
  url: process.env.DATABASE_URL ?? `file:${resolve(workspacePath, 'workspace.db')}`,
})

const workspace = new Workspace({
  id: 'meeting-assistant',
  filesystem: new LocalFilesystem({ basePath: workspacePath }),
  sandbox: new LocalSandbox({ workingDirectory: workspacePath }),
  skills: ['./skills'],
  bm25: true,
  vectorStore: workspaceVectorStore,
  embedder: async (text: string) => {
    const { embedding } = await embed({ model: fastembed, value: text });
    return embedding;
  },
  autoIndexPaths: ['vault/**/*.md'],
})

// Create the vector index table, then initialize workspace to trigger auto-indexing
workspaceVectorStore.createIndex({
  indexName: 'meeting_assistant_search',
  dimension: 384,
  metric: 'cosine',
})

export const meetingAssistant = new Agent({
  id: "meeting-assistant",
  workspace: workspace,
  name: "Meeting Assistant",
  model: "anthropic/claude-sonnet-4-5",
  instructions: `
    You are a personal meeting assistant with access to an Obsidian vault of notes.

    When asked to prepare for a meeting, use the meeting-prep skill.

    When chatting casually:
    - Be helpful, direct, and low-friction
    - Remember context from previous conversations
    - If you don't know something, say so — don't make things up
  `,
  tools: { searchWeb },
  memory: new Memory({
    // Vector store for semantic recall — stores message embeddings
    // so the agent can search past conversations by meaning
    vector: new LibSQLVector({
      id: "memory-vector",
      url: "file:./mastra.db",
    }),

    // Local embedding model — no API key needed
    embedder: fastembed,

    options: {
      // Episodic memory (short-term): keeps the last 10 messages in context
      // so the agent remembers what was said earlier in the conversation.
      lastMessages: 10,

      // Semantic memory (long-term): searches past conversations by meaning
      // using vector embeddings. If someone mentioned a topic weeks ago,
      // the agent can find it.
      semanticRecall: {
        topK: 3,          // Retrieve the 3 most relevant past messages
        messageRange: 2,   // Include 2 messages of surrounding context per match
      },

      // Working memory: a persistent scratchpad the agent updates over time.
      // The agent automatically fills this in as it learns about you.
      // Scoped to resource — we use a fixed resource ID so your profile
      // persists across all channels and threads.
      workingMemory: {
        enabled: true,
        template: `# User Profile
- Name:
- Role:
- Company:

# Preferences
- Communication style:
- Meeting prep preferences:
- Topics of interest:
`,
      },
    },
  }),
});
