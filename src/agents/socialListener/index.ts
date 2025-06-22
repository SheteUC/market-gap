/**
 * Social Listener Agent - Worker Agent for MarketGap AI
 *
 * Purpose: After the Market-Analyzer produces a gap list, this agent gathers
 * audience sentiment (Reddit) and high-level market context (Google search)
 * for each gap. It then stores the combined result in the `audience_signals`
 * shared memory block where the Solution-Generator will consume it.
 *
 * Custom Tools
 * 1. reddit_audience_research(keywords: string): string
 *    ‑ Calls Reddit API (or Pushshift) to fetch recent posts/comments that
 *      mention the provided keywords, summarising demographics & sentiment.
 * 2. google_market_research(query: string): string
 *    ‑ Performs a Google Custom Search (or SerpAPI) on the query and
 *      returns a concise summary of top results describing competitors,
 *      market size, and trends.
 *
 * The agent will iterate through the gaps, run both tools, and write an
 * array of objects to the audience_signals block:
 *   [{ gapId, redditInsights, googleInsights }]
 */

import { LettaClient } from '@letta-ai/letta-client';

/**
 * Create the Social Listener worker agent.
 */
export async function createSocialListenerAgent(
  client: LettaClient,
  sharedBlockIds: string[]
): Promise<string> {
  console.log('📡 Creating Social Listener Agent…');

  const agent = await client.agents.create({
    name: 'SocialListenerWorker',
    memoryBlocks: [
      {
        label: 'persona',
        value:
          `I am the Social Listener worker. For each market gap in gap_list I will:
1. Use the built-in run_code tool to call Reddit's API (or Pushshift) and gather recent posts/comments for the gap keywords. Summarise sentiment and audience demographics.
2. Use the built-in web_search tool (Google mode) to collect market-level insights for the same keywords.
3. Merge the two sources into an object {gapId, redditInsights, googleInsights} and append it to the audience_signals shared block.

Respond "done" after all gaps are processed.`,
      },
      {
        label: 'human',
        value: 'Analyse social and market signals for each identified gap.',
      },
    ],
    blockIds: sharedBlockIds,
    tools: ['run_code', 'web_search'],
    model: 'openai/gpt-4o-mini',
    embedding: 'openai/text-embedding-3-small',
  });

  console.log(`✅ Social Listener Agent created: ${agent.id}`);
  return agent.id;
}

/**
 * Trigger the social listening phase.
 */
export async function runSocialListening(
  client: LettaClient,
  socialAgentId: string,
  industry: string
): Promise<any> {
  const instruction = `The gap_list is ready. For each gap, gather audience and market signals using your tools. Industry context: ${industry}.`;

  return client.agents.messages.create(
    socialAgentId,
    {
      messages: [{ role: 'user', content: instruction }],
    },
    { timeoutInSeconds: 600 }
  );
} 