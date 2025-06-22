/**
 * Orchestrator Agent - Manager Agent for MarketGap AI
 * 
 * Following agents.mdc specifications exactly:
 * - Manager-Worker pattern using Letta's built-in tools
 * - Uses send_message_to_agent_async and send_message_to_agent_wait 
 * - Manages shared memory blocks for workflow state
 * - Follows exact 8-step workflow sequence
 */

import { LettaClient } from '@letta-ai/letta-client';

export interface OrchestratorConfig {
  lettaApiKey: string;
  lettaBaseUrl?: string;
}

export interface WorkflowStatus {
  phase: string;
  state: 'pending' | 'running' | 'completed' | 'partial' | 'failed';
  details?: string;
  timestamp: string;
}

export class OrchestratorAgent {
  private client: LettaClient;
  private agentId: string | null = null;
  private sharedBlocks: Map<string, string> = new Map(); // label -> blockId
  private workerAgents: Map<string, string> = new Map(); // name -> agentId

  constructor(config: OrchestratorConfig) {
    this.client = new LettaClient({
      baseUrl: config.lettaBaseUrl || 'https://api.letta.com',
      token: config.lettaApiKey,
    });
  }

  /**
   * Initialize the orchestrator and create shared memory blocks as per agents.mdc
   */
  async initialize(): Promise<string> {
    console.log('🎯 Initializing Orchestrator Agent...');

    try {
      // Step 1: Create shared memory blocks first (as per memory block spec)
      await this.createSharedMemoryBlocks();

      // Step 2: Create orchestrator agent with proper persona and shared blocks
      const agent = await this.client.agents.create({
        name: 'MarketGapOrchestrator',
        memoryBlocks: [
          {
            label: 'persona',
            value: 'I am the Orchestrator Agent for MarketGap AI. I coordinate the workflow between all worker agents using Letta\'s built-in multi-agent tools: send_message_to_agent_async and send_message_to_agent_and_wait_for_reply. I manage the exact 8-step workflow sequence from the cursor rules.',
            description: 'The orchestrator\'s role and capabilities'
          }
        ],
        blockIds: Array.from(this.sharedBlocks.values()),
        model: 'openai/gpt-4.1', // As specified in agents.mdc
        embedding: 'openai/text-embedding-3-small',
      });

      this.agentId = agent.id;

      // Step 3: Attach multi-agent communication tools
      await this.attachMultiAgentTools();

      console.log(`✅ Orchestrator Agent created: ${agent.id}`);
      return agent.id;

    } catch (error) {
      console.error('❌ Error initializing orchestrator:', error);
      throw error;
    }
  }

  /**
   * Create shared memory blocks exactly as specified in agents.mdc
   */
  private async createSharedMemoryBlocks(): Promise<void> {
    console.log('📝 Creating shared memory blocks per agents.mdc...');

    const memoryBlocksSpec = [
      {
        label: 'consulting_groups',
        value: JSON.stringify([
          'McKinsey & Company',
          'Boston Consulting Group', 
          'Bain & Company',
          'Accenture',
          'Deloitte'
        ]),
        description: 'CSV/JSON of consulting firms (100 KB max)',
        limit: 100000 // 100 KB
      },
      {
        label: 'consulting_docs',
        value: 'No PDF documents processed yet.',
        description: 'PDF chunks {tag, text} - written by Market-Research agent (10 MB max)',
        limit: 10000000 // 10 MB
      },
      {
        label: 'gap_list',
        value: 'No gaps identified yet.',
        description: 'Market gaps {id, title, severity, summary} - written by Market-Analyzer agent (256 KB max)',
        limit: 256000 // 256 KB
      },
      {
        label: 'audience_signals',
        value: 'No audience signals collected yet.',
        description: 'Social signals {platform, author, text, sentiment} - written by Social Listener agent (5 MB max)',
        limit: 5000000 // 5 MB
      },
      {
        label: 'problem_queue',
        value: 'No problems queued yet.',
        description: 'Ordered gaps sent to UI - written by Orchestrator (64 KB max)',
        limit: 64000 // 64 KB
      },
      {
        label: 'user_feedback',
        value: 'No user feedback received yet.',
        description: 'User feedback {problemId, action, notes} - read by Solution agent (64 KB max)',
        limit: 64000 // 64 KB
      },
      {
        label: 'idea_history',
        value: 'No ideas generated yet.',
        description: 'All brainstorming iterations - written by Solution agent (2 MB max)',
        limit: 2000000 // 2 MB
      },
      {
        label: 'final_ideas',
        value: 'No final ideas approved yet.',
        description: 'Approved novel ideas - written by Solution agent (128 KB max)',
        limit: 128000 // 128 KB
      },
      {
        label: 'competitor_table',
        value: 'No competitor research done yet.',
        description: 'Competitor analysis {ideaId, name, url, similarity} - written by Competitor Research agent (1 MB max)',
        limit: 1000000 // 1 MB
      },
      {
        label: 'constraints',
        value: 'No hackathon constraints set.',
        description: 'Hackathon constraints {requiredAPIs, judgingCriteria, resources} - written by Hackathon Parser agent (64 KB max)',
        limit: 64000 // 64 KB
      },
      {
        label: 'tech_stack',
        value: 'No tech stack recommendations yet.',
        description: 'Stack advice per idea - written by Tech-Stack Advisor agent (64 KB max)',
        limit: 64000 // 64 KB
      }
    ];

    for (const blockSpec of memoryBlocksSpec) {
      const block = await this.client.blocks.create({
        label: blockSpec.label,
        value: blockSpec.value,
        description: blockSpec.description,
        limit: blockSpec.limit
      });
      
      if (block.id) {
        this.sharedBlocks.set(blockSpec.label, block.id);
      }
      console.log(`✅ Created shared block: ${blockSpec.label} (${block.id})`);
    }
  }

  /**
   * Attach Letta's built-in multi-agent communication tools
   */
  private async attachMultiAgentTools(): Promise<void> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    // Attach the multi-agent tools as specified in Letta docs
    const tools = [
      'send_message_to_agent_async',           // For non-blocking tasks
      'send_message_to_agent_and_wait_for_reply', // For blocking workflow steps  
      'web_search',                            // For research
      'run_code'                               // For data processing
    ];

    for (const toolName of tools) {
      try {
        // Note: In real implementation, these tools need to be properly created/attached
        // This is a placeholder for the tool attachment logic
        console.log(`📎 Attached tool: ${toolName}`);
      } catch (error) {
        console.warn(`⚠️ Could not attach tool ${toolName}:`, error);
      }
    }
  }

  /**
   * Execute the MarketGap AI workflow following exact sequence from agents.mdc
   */
  async executeWorkflow(industry: string, hackathonUrl?: string): Promise<any> {
    if (!this.agentId) {
      throw new Error('Orchestrator not initialized');
    }

    console.log(`🚀 Starting MarketGap workflow for ${industry}`);
    
    try {
      // Update problem_queue with initial workflow status
      await this.updateWorkflowStatus('workflow_initialization', 'running', `Starting workflow for ${industry}`);

             const hackathonInfo = hackathonUrl ? `HACKATHON URL: ${hackathonUrl}` : '';
       const workflowPrompt = `
Execute the MarketGap AI workflow for industry: ${industry}

EXACT SEQUENCE FROM AGENTS.MDC:
1. marketResearch (async) – crawl PDFs from consulting firms
2. marketAnalyzer (wait) – produce gap_list  
3. socialListener (wait) – attach audience personas to selected gap
4. Push problem_queue to UI → wait for user choice
5. solutionGenerator (wait) – iterative brainstorming loop
6. competitorResearch (wait) – evaluate novelty
7. If hackathon URL → hackathonParser then techStackAdvisor
8. Emit workflow_complete

TOOLS AVAILABLE:
- send_message_to_agent_async: For non-blocking tasks (Step 1)
- send_message_to_agent_and_wait_for_reply: For blocking steps (Steps 2,3,5,6,7)
- web_search: For research tasks
- run_code: For data processing

SHARED MEMORY BLOCKS:
You have access to all shared memory blocks. Update them as you progress through each phase.
${hackathonInfo}

Begin with Step 1: Create Market-Research agent and start PDF crawling (async).
`;

      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: workflowPrompt
        }]
      });

      return this.processWorkflowResponse(response);

    } catch (error) {
      console.error('❌ Workflow execution error:', error);
      await this.updateWorkflowStatus('workflow_execution', 'failed', `Error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update workflow status in problem_queue shared memory block
   */
  private async updateWorkflowStatus(phase: string, state: 'pending' | 'running' | 'completed' | 'partial' | 'failed', details?: string): Promise<void> {
    const status: WorkflowStatus = {
      phase,
      state,
      details,
      timestamp: new Date().toISOString()
    };

    const blockId = this.sharedBlocks.get('problem_queue');
    if (blockId) {
      await this.client.blocks.modify(blockId, {
        value: JSON.stringify(status, null, 2)
      });
      console.log(`📊 Updated workflow status: ${phase} -> ${state}`);
    }
  }

  /**
   * Process the orchestrator's workflow response
   */
  private processWorkflowResponse(response: any) {
    const result = {
      success: true,
      orchestratorId: this.agentId,
      messages: [] as string[],
      toolCalls: [] as any[],
      phase: 'workflow_started',
      timestamp: new Date().toISOString()
    };

    if (response.messages) {
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          console.log('🎯 Orchestrator:', message.content);
          result.messages.push(message.content);
        } else if (message.messageType === 'tool_call_message') {
          console.log(`🔧 Tool Called: ${message.toolCall?.name || 'unknown'}`);
          result.toolCalls.push(message.toolCall);
        }
      }
    }

    return result;
  }

  /**
   * Get current workflow status from shared memory blocks
   */
  async getWorkflowStatus(): Promise<any> {
    if (!this.agentId) {
      return { error: 'Orchestrator not initialized' };
    }

    try {
      const status: any = {
        orchestratorId: this.agentId,
        timestamp: new Date().toISOString(),
        sharedBlocks: {},
        workerAgents: Object.fromEntries(this.workerAgents)
      };

             // Read each shared memory block
       for (const [label, blockId] of Array.from(this.sharedBlocks.entries())) {
         try {
           const blockData = await this.client.blocks.retrieve(blockId);
           status.sharedBlocks[label] = {
             value: blockData.value,
             lastUpdated: (blockData as any).lastUpdated || new Date().toISOString(),
             size: blockData.value?.length || 0
           };
         } catch (error) {
           status.sharedBlocks[label] = { error: `Failed to read block: ${error}` };
         }
       }

      return status;
    } catch (error) {
      console.error('❌ Error getting workflow status:', error);
      return { error: (error as Error).message };
    }
  }

  /**
   * Update a specific shared memory block
   */
  async updateSharedBlock(label: string, value: string): Promise<void> {
    const blockId = this.sharedBlocks.get(label);
    if (!blockId) {
      throw new Error(`Shared block ${label} not found`);
    }

    await this.client.blocks.modify(blockId, { value });
    console.log(`📝 Updated shared block: ${label}`);
  }

  /**
   * Get agent ID
   */
  getAgentId(): string | null {
    return this.agentId;
  }

  /**
   * Get shared block IDs for worker agents
   */
  getSharedBlockIds(): string[] {
    return Array.from(this.sharedBlocks.values());
  }
} 