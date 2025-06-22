/**
 * Market-Analyzer Agent - Worker Agent for MarketGap AI
 *
 * Reads: consulting_docs memory block
 * Writes: gap_list memory block
 *
 * This worker is created by the Orchestrator and triggered once the consulting_docs
 * block has been populated with research data. It should not be instantiated directly
 * by the frontend or other workers.
 *
 * The agent relies primarily on the `run_code` built-in tool to perform TF-IDF analysis
 * over the white-paper snippets and fuse sentiment / pain signals to generate a ranked
 * list of ≤ 10 market gaps. The final JSON payload is persisted in the shared
 * `gap_list` memory block so that downstream agents (e.g. socialListener,
 * solutionGenerator) can consume it.
 */

import { LettaClient } from '@letta-ai/letta-client';

/**
 * Helper factory to create a Market-Analyzer worker agent.
 *
 * @param client         Pre-configured LettaClient instance (same one used by the orchestrator)
 * @param sharedBlockIds Array of block IDs to attach ‑ must contain `consulting_docs` & `gap_list`
 * @returns              Newly created Agent ID
 */
export async function createMarketAnalyzerAgent(
  client: LettaClient,
  sharedBlockIds: string[]
): Promise<string> {
  console.log('🧩 Creating Market-Analyzer Worker Agent…');

  // Basic validation – ensure both required blocks are attached
  if (!sharedBlockIds || sharedBlockIds.length === 0) {
    throw new Error('sharedBlockIds array is empty – cannot attach memory blocks');
  }

  try {
    const agent = await client.agents.create({
      name: 'MarketAnalyzerWorker',
      memoryBlocks: [
        {
          label: 'persona',
          value:
            `I am the Market-Analyzer worker. My sole responsibility is to read the consulting_docs shared block (a JSON object keyed by firm names, each containing an array of chunks). Using run_code I will:
1. Construct a term × pain matrix (TF-IDF) across all chunks.
2. Optionally weight terms by sentiment (pain sentiment > 0 should increase severity).
3. Cluster and rank the top ≤ 10 distinct market gaps. Each gap object must include: {id, title, severity (1-5), summary}.
4. Persist the final JSON array into the gap_list shared block, replacing any existing value.

I never create new memory blocks – I only modify gap_list. I reply "done" when the list has been successfully written.`,
        },
        {
          label: 'human',
          value:
            'Identify market gaps from consulting white-papers and store them in gap_list.',
        },
      ],
      blockIds: sharedBlockIds,
      tools: ['run_code'], // run_code is sufficient for matrix computations
      model: 'openai/gpt-4o-mini',
      embedding: 'openai/text-embedding-3-small',
    });

    console.log(`✅ Market-Analyzer Worker Agent created: ${agent.id}`);
    return agent.id;
  } catch (error) {
    console.error('❌ Error creating Market-Analyzer worker:', error);
    throw error;
  }
}

/**
 * Trigger gap analysis by sending a single instruction to the worker.
 * The worker will read consulting_docs (already attached via shared memory)
 * and write its output to gap_list.
 */
export async function runMarketAnalysis(
  client: LettaClient,
  analyzerAgentId: string,
  industry: string
): Promise<any> {
  console.log(`📊 Instructing Market-Analyzer (${analyzerAgentId}) to analyse ${industry} consulting_docs…`);

  const instruction = `Consulting white-paper research for the ${industry} industry has been ingested into the consulting_docs shared memory block. Perform gap analysis now according to your persona instructions and write the resulting JSON array into gap_list.`;

  const response = await client.agents.messages.create(
    analyzerAgentId,
    {
      messages: [
        {
          role: 'user',
          content: instruction,
        },
      ],
    },
    { timeoutInSeconds: 600 }
  );

  return response;
} 