/**
 * Solution Generator Agent – Worker for MarketGap AI
 *
 * Reads: gap_list, audience_signals, user_feedback
 * Writes: idea_history (append every iteration), final_ideas (overwrite with most novel ideas)
 *
 * Loop logic handled by Orchestrator; this worker produces up to 3 ideas per call.
 */

import { LettaClient } from '@letta-ai/letta-client';

export async function createSolutionGeneratorAgent(
  client: LettaClient,
  sharedBlockIds: string[]
): Promise<string> {
  console.log('🧪 Creating Solution Generator Agent…');

  const agent = await client.agents.create({
    name: 'SolutionGeneratorWorker',
    memoryBlocks: [
      {
        label: 'persona',
        value:
          `I am the Solution Generator worker. Input: gap_list + audience_signals (+ user_feedback). Task: brainstorm up to 3 innovative, feasible product ideas addressing the highest-severity gaps. For each idea compute an ICE score (Impact, Confidence, Ease) 1-5 each.

Return JSON array [{id, title, description, ICE}]. Append the raw JSON to idea_history, and write ONLY the ideas that meet ICE ≥ 7 (avg) into final_ideas (overwrite). Respond "done" when finished.`,
      },
      {
        label: 'human',
        value: 'Generate innovative solutions for identified market gaps.',
      },
    ],
    blockIds: sharedBlockIds,
    tools: ['run_code'],
    model: 'openai/gpt-4o-mini',
    embedding: 'openai/text-embedding-3-small',
  });

  console.log(`✅ Solution Generator Agent created: ${agent.id}`);
  return agent.id;
}

export async function runSolutionIteration(
  client: LettaClient,
  agentId: string,
  iteration: number
) {
  const instruction = `Iteration ${iteration}: Generate up to 3 ideas now.`;

  return client.agents.messages.create(
    agentId,
    {
      messages: [{ role: 'user', content: instruction }],
    },
    { timeoutInSeconds: 600 }
  );
} 