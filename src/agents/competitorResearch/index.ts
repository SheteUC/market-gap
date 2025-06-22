/**
 * Competitor Research Agent – Worker for MarketGap AI
 *
 * Reads: final_ideas
 * Writes: competitor_table
 * Uses web_search to validate novelty based on custom competitive analysis prompt.
 */

import { LettaClient } from '@letta-ai/letta-client';

const COMP_PROMPT_TEMPLATE = `<instructions> You are a top-tier strategy consultant with deep expertise in competitive analysis, growth loops, pricing, and unit-economics-driven product strategy. If information is unavailable, state that explicitly. </instructions>

<context>
<business_name>{{COMPANY}}</business_name>
<industry>{{INDUSTRY}}</industry>
<current_focus>{{CURRENT_FOCUS}}</current_focus>
<known_challenges>{{KNOWN_CHALLENGES}}</known_challenges>
</context>

<task>
1. Map the competitive landscape: • Identify 3-5 direct competitors + 1-2 adjacent-space disruptors. • Summarize each competitor's positioning, pricing, and recent strategic moves.
2. Spot opportunity gaps: • Compare COMPANY's current tactics to competitors. • Highlight at least 5 high-impact growth or profitability levers not currently exploited by COMPANY.
3. Prioritize: • Score each lever on Impact (1-5) and Feasibility (1-5). • Recommend the top 3 actions with the strongest Impact × Feasibility.
</task>

<output_format>
<answer>
<competitive_landscape></competitive_landscape>
<opportunity_gaps></opportunity_gaps>
<prioritized_actions></prioritized_actions>
<sources></sources>
</answer>`;

export async function createCompetitorResearchAgent(
  client: LettaClient,
  sharedBlockIds: string[]
): Promise<string> {
  console.log('🔍 Creating Competitor Research Agent…');

  const agent = await client.agents.create({
    name: 'CompetitorResearchWorker',
    memoryBlocks: [
      {
        label: 'persona',
        value:
          'I am the Competitor Research worker. For each idea in final_ideas I will perform deep competitive analysis using web_search and write a similarity score (0-1) into competitor_table along with summary insights.',
      },
      {
        label: 'human',
        value: 'Validate novelty of generated ideas.',
      },
    ],
    blockIds: sharedBlockIds,
    tools: ['web_search'],
    model: 'openai/gpt-4o-mini',
    embedding: 'openai/text-embedding-3-small',
  });

  console.log(`✅ Competitor Research Agent created: ${agent.id}`);
  return agent.id;
}

export async function runCompetitorCheck(
  client: LettaClient,
  agentId: string,
  ideaTitle: string,
  industry: string
) {
  const prompt = COMP_PROMPT_TEMPLATE.replace('{{COMPANY}}', ideaTitle)
    .replace('{{INDUSTRY}}', industry)
    .replace('{{CURRENT_FOCUS}}', 'New product idea drafted during hackathon')
    .replace('{{KNOWN_CHALLENGES}}', 'N/A');

  return client.agents.messages.create(
    agentId,
    { messages: [{ role: 'user', content: prompt }] },
    { timeoutInSeconds: 900 }
  );
} 