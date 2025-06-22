/**
 * Market-Research Agent - Worker Agent for MarketGap AI
 * 
 * This agent is created by the Orchestrator and only responds to direct messages.
 * It doesn't manage its own lifecycle - the Orchestrator handles everything.
 */

import { LettaClient } from '@letta-ai/letta-client';

export interface MarketResearchConfig {
  lettaApiKey: string;
  lettaBaseUrl?: string;
}

/**
 * Simple factory function to create a Market Research worker agent
 * This agent will be created by the Orchestrator when needed
 */
export async function createMarketResearchAgent(
  client: LettaClient,
  sharedBlockIds: string[],
  industry: string
): Promise<string> {
  console.log(`📊 Creating Market-Research Worker Agent for industry ${industry}...`);

  try {
    const agent = await client.agents.create({
      name: `MarketResearchWorker-${industry.replace(/[^a-zA-Z0-9_\-]/g, '')}`,
      memoryBlocks: [
        {
          label: 'persona',
          value: `I am a Market-Research worker. I respond only to the Orchestrator. When instructed, I iterate over a list of consulting firms provided in the consulting_groups block and find the latest 2 whitepapers/reports for each firm in the ${industry} industry (years 2023-2025). I extract key findings, pain points, and opportunities, then append structured JSON into the consulting_docs shared memory block using the firm's name as the top-level key. I am free to call web_search and run_code, and I may execute multiple fetch_pdf or web_search calls in parallel where helpful.`,
        },
        {
          label: 'human',
          value: `Researching multiple consulting firms for the ${industry} industry.`,
        }
      ],
      blockIds: sharedBlockIds, // Attach shared memory blocks
      tools: ['web_search', 'run_code'],
      model: 'openai/gpt-4o-mini',
      embedding: 'openai/text-embedding-3-small',
    });

    console.log(`✅ Market-Research Worker Agent created: ${agent.id}`);
    return agent.id;

  } catch (error) {
    console.error('❌ Error creating Market-Research worker:', error);
    throw error;
  }
} 