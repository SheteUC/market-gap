/**
 * Orchestrator Agent - Manager Agent for MarketGap AI
 * 
 * Properly implements Letta's manager-worker pattern using:
 * - Built-in Letta tools (web_search, run_code, send_message_to_agent_async)
 * - Shared memory blocks for coordination
 * - Proper agent creation via SDK
 */

import { LettaClient } from '@letta-ai/letta-client';
import { createMarketResearchAgent } from '../marketResearch';
import {
  createMarketAnalyzerAgent,
  runMarketAnalysis,
} from '../marketAnalyzer';
import { createSolutionGeneratorAgent, runSolutionIteration } from '../solutionGenerator';
import { createCompetitorResearchAgent, runCompetitorCheck } from '../competitorResearch';

export interface OrchestratorConfig {
  lettaApiKey: string;
  lettaBaseUrl?: string;
}

export class OrchestratorAgent {
  private client: LettaClient;
  private agentId: string | null = null;
  private sharedBlockIds: Map<string, string> = new Map();
  private marketResearchAgentId: string | null = null;
  private marketAnalyzerAgentId: string | null = null;
  private solutionGeneratorAgentId: string | null = null;
  private competitorResearchAgentId: string | null = null;

  constructor(config: OrchestratorConfig) {
    this.client = new LettaClient({
      baseUrl: config.lettaBaseUrl || 'https://api.letta.com',
      token: config.lettaApiKey,
    });
  }

  /**
   * Initialize the Orchestrator agent with proper Letta architecture
   */
  async initialize(): Promise<string> {
    console.log('🎯 Initializing Orchestrator Agent with Letta architecture...');

    try {
      // Step 1: Create shared memory blocks first
      await this.createSharedMemoryBlocks();

      // Step 2: Create the orchestrator agent
      const agent = await this.client.agents.create({
        name: 'MarketGapOrchestrator',
        memoryBlocks: [
          {
            label: 'persona',
            value: 'I am the Orchestrator Agent for MarketGap AI. I manage the workflow: 1) research consulting firms, 2) analyze gaps, 3) generate solutions. I use web_search to find the latest 2 whitepapers from each consulting firm for a specific industry. I use send_message_to_agent_async to delegate tasks when needed.',
          },
          {
            label: 'human',
            value: 'Working with MarketGap AI system to identify market opportunities through consulting firm research.',
          },
          {
            label: 'audience_signals',
            value: 'No audience data yet',
            description: 'Social signals and audience personas for identified gaps'
          },
          {
            label: 'idea_history',
            value: '[]',
            description: 'All brainstorming iterations',
          },
          {
            label: 'final_ideas',
            value: '[]',
            description: 'Approved novel ideas',
          },
          {
            label: 'competitor_table',
            value: '[]',
            description: 'Competitor similarity scores',
          },
          {
            label: 'workflow_state',
            value: 'Workflow state: initialized. Ready to execute MarketGap sequence.',
            description: 'Tracks current workflow phase and progress'
          }
        ],
        // Attach shared memory blocks  
        blockIds: Array.from(this.sharedBlockIds.values()),
        // Use built-in Letta tools
        tools: [
          'web_search',                           // For researching consulting firms
          'run_code',                             // For data processing
          'send_message_to_agent_async',          // For multi-agent coordination
        ],
        model: 'openai/gpt-4o-mini',
        embedding: 'openai/text-embedding-3-small',
      });

      this.agentId = agent.id;
      console.log(`✅ Orchestrator Agent created: ${agent.id}`);
      
      return agent.id;

    } catch (error) {
      console.error('❌ Error initializing Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Create shared memory blocks for multi-agent coordination
   */
  private async createSharedMemoryBlocks(): Promise<void> {
    console.log('🧠 Creating shared memory blocks...');

    const blockSpecs = [
      {
        label: 'consulting_groups',
        value: JSON.stringify([
          'McKinsey & Company', 
          'Boston Consulting Group', 
          'Accenture', 
          'Deloitte'
        ]),
        description: 'List of consulting firms for market research'
      },
      {
        label: 'consulting_docs',
        value: 'No research data yet',
        description: 'Research data from consulting firm whitepapers'
      },
      {
        label: 'gap_list',
        value: 'No gaps identified yet',
        description: 'Identified market gaps with severity and opportunity scores'
      },
    ];

    for (const spec of blockSpecs) {
      const block = await this.client.blocks.create({
        label: spec.label,
        value: spec.value,
        description: spec.description
      });
      
      this.sharedBlockIds.set(spec.label, block.id!);
      console.log(`✅ Created shared block: ${spec.label} (${block.id})`);
    }
  }

  /**
   * Execute the MarketGap workflow using built-in Letta tools
   */
  async executeWorkflow(industry: string): Promise<any> {
    if (!this.agentId) {
      throw new Error('Orchestrator not initialized');
    }

    console.log(`🚀 Starting MarketGap workflow for ${industry}...`);

    // Phase 1: Parallel research workers
    await this.runParallelResearch(industry);

    // Phase 2: Gap analysis using Market-Analyzer worker
    await this.runGapAnalysis(industry);

    // Phase 3: Ideation loop
    await this.runIdeationLoop(industry);

    // Phase 4: Notify Orchestrator LLM to continue to solution generation (future implementation)
    try {
      const response = await this.client.agents.messages.create(
        this.agentId,
        {
          messages: [
            {
              role: 'user',
              content:
                `Ideation loop completed for ${industry}. The final_ideas block is now populated. Proceed with socialListener and solutionGenerator phases.`,
            },
          ],
        },
        { timeoutInSeconds: 300 }
      );

      return this.processResponse(response);

    } catch (error) {
      console.error('❌ Workflow execution error:', error);
      throw error;
    }
  }

  /**
   * Spin up market research workers and run them in parallel batches (size 3)
   */
  private async runParallelResearch(industry: string): Promise<void> {
    const groupsBlockId = this.sharedBlockIds.get('consulting_groups');
    if (!groupsBlockId) throw new Error('consulting_groups block missing');

    const block = await this.client.blocks.retrieve(groupsBlockId);
    const firms: string[] = JSON.parse(block.value || '[]');
    if (!Array.isArray(firms) || firms.length === 0) {
      throw new Error('consulting_groups block empty');
    }

    // Create a single Market-Research worker once per workflow
    if (!this.marketResearchAgentId) {
      this.marketResearchAgentId = await createMarketResearchAgent(
        this.client,
        Array.from(this.sharedBlockIds.values()),
        industry
      );
    }

    console.log(`🔄 Sending research task covering ${firms.length} firms to Market-Research agent ${this.marketResearchAgentId} ...`);

    const instruction = `Research task: For each of the following consulting firms: ${firms.join(", ")} – find the two most recent (${industry}, 2023-2025) whitepapers or publicly available reports. For each firm:
- Download the PDF (or scrape the HTML summary if PDF unavailable)
- Extract key findings, pain points, opportunities (bullet points or short paragraphs)
- Append structured JSON into the consulting_docs shared block using the firm's exact name as the top-level key.

Feel free to parallelise downloads using run_code (e.g. Promise.all in JS) and web_search. Respond "done" when all entries are written.`;

    const workerResponse = await this.client.agents.messages.create(
      this.marketResearchAgentId,
      {
        messages: [
          {
            role: 'user',
            content: instruction
          }
        ],
      },
      { timeoutInSeconds: 900 }
    );

    // Combine assistant messages into one blob
    const combined = workerResponse.messages
      .filter((m: any) => m.messageType === 'assistant_message')
      .map((m: any) => m.content)
      .join('\n');

    if (combined) {
      const docsId = this.sharedBlockIds.get('consulting_docs');
      if (docsId) {
        await this.client.blocks.modify(docsId, { value: combined });
        console.log('📥 Stored research findings into consulting_docs');
      }
    }
  }

  /**
   * Spin up Market-Analyzer worker (if not existing) and instruct it to perform gap detection.
   */
  private async runGapAnalysis(industry: string): Promise<void> {
    // Ensure analyzer agent exists
    if (!this.marketAnalyzerAgentId) {
      this.marketAnalyzerAgentId = await createMarketAnalyzerAgent(
        this.client,
        Array.from(this.sharedBlockIds.values())
      );
    }

    console.log(
      `📈 Delegating gap analysis to Market-Analyzer agent ${this.marketAnalyzerAgentId}…`
    );

    // Send analysis task and wait for completion
    const response = await runMarketAnalysis(
      this.client,
      this.marketAnalyzerAgentId,
      industry
    );

    // Optional: parse assistant messages to confirm completion
    const finished = response.messages.some(
      (m: any) =>
        m.messageType === 'assistant_message' &&
        (m.content?.toLowerCase().includes('done') ||
          m.content?.toLowerCase().includes('completed'))
    );

    if (finished) {
      console.log('✅ Gap analysis completed and stored in gap_list');

      // Update workflow_state block to indicate completion
      const workflowStateId = this.sharedBlockIds.get('workflow_state');
      if (workflowStateId) {
        try {
          await this.client.blocks.modify(workflowStateId, {
            value: `Gap analysis completed for ${industry} at ${new Date().toISOString()}`,
          });
        } catch (err) {
          console.warn('⚠️ Failed to update workflow_state block:', err);
        }
      }

      // TODO: Emit WebSocket "phaseComplete" event (handled server-side)
    } else {
      console.warn('⚠️ Gap analysis response did not include completion signal');
    }
  }

  /**
   * Process agent response and extract tool calls and results
   */
  private processResponse(response: any) {
    const result = {
      success: true,
      agentId: this.agentId,
      messages: [] as string[],
      toolCalls: [] as any[],
      timestamp: new Date().toISOString()
    };

    for (const message of response.messages) {
      if (message.messageType === 'assistant_message') {
        result.messages.push(message.content);
        console.log('🎯 Orchestrator:', message.content);
      } else if (message.messageType === 'tool_call_message') {
        result.toolCalls.push(message.toolCall);
        console.log(`🔧 Tool Called: ${message.toolCall.name}`);
        console.log(`📄 Arguments:`, message.toolCall.arguments);
      } else if (message.messageType === 'tool_return_message') {
        console.log(`📊 Tool Result:`, message.toolReturn);
      }
    }

    return result;
  }

  /**
   * Get current workflow status by reading shared memory blocks
   */
  async getWorkflowStatus(): Promise<any> {
    if (!this.agentId) {
      return { error: 'Orchestrator not initialized' };
    }

    try {
      const status = {
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
        sharedBlocks: {} as any
      };

      // Read shared memory blocks
      const entries = Array.from(this.sharedBlockIds.entries());
      for (const [label, blockId] of entries) {
        try {
          const block = await this.client.blocks.retrieve(blockId);
          status.sharedBlocks[label] = {
            value: block.value,
            size: block.value?.length || 0,
            lastUpdated: new Date().toISOString()
          };
        } catch (error) {
          status.sharedBlocks[label] = { error: `Failed to read: ${error}` };
        }
      }

      return status;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Check if research data has been stored
   */
  async checkResearchProgress(): Promise<any> {
    const consultingDocsId = this.sharedBlockIds.get('consulting_docs');
    if (!consultingDocsId) {
      return { error: 'Consulting docs block not found' };
    }

    try {
      const block = await this.client.blocks.retrieve(consultingDocsId);
      const hasData = block.value && block.value !== 'No research data yet' && block.value.length > 50;
      
      return {
        success: true,
        consultingDocsSize: block.value?.length || 0,
        consultingDocsContent: block.value?.substring(0, 500) + (block.value && block.value.length > 500 ? '...' : ''),
        dataStored: hasData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  getAgentId(): string | null {
    return this.agentId;
  }

  /**
   * Generic helper to update any shared memory block by label.
   * Exposed for test scripts and frontend utilities.
   */
  async updateSharedBlock(label: string, newValue: string): Promise<void> {
    const blockId = this.sharedBlockIds.get(label);
    if (!blockId) throw new Error(`Shared block ${label} not found`);

    await this.client.blocks.modify(blockId, { value: newValue });
  }

  /**
   * Quick helper to check whether gap_list has been populated (size heuristic).
   */
  async checkAnalysisProgress(): Promise<any> {
    const gapListId = this.sharedBlockIds.get('gap_list');
    if (!gapListId) return { error: 'gap_list block not found' };

    try {
      const block = await this.client.blocks.retrieve(gapListId);
      const hasData =
        block.value &&
        block.value !== 'No gaps identified yet' &&
        block.value.length > 20;

      return {
        success: true,
        gapListSize: block.value?.length || 0,
        gapListPreview:
          block.value?.substring(0, 500) +
          (block.value && block.value.length > 500 ? '...' : ''),
        analysisCompleted: hasData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  private async runIdeationLoop(industry: string): Promise<void> {
    if (!this.solutionGeneratorAgentId) {
      this.solutionGeneratorAgentId = await createSolutionGeneratorAgent(
        this.client,
        Array.from(this.sharedBlockIds.values()),
      );
    }

    console.log('💡 Generating initial solution proposals');
    await runSolutionIteration(this.client, this.solutionGeneratorAgentId, 1);

    console.log('✅ Solutions generated and stored in final_ideas – competitor analysis disabled for demo.');
  }
} 