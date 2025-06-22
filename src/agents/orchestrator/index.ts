/**
 * Orchestrator Agent
 * 
 * This agent serves as the central coordinator for the MarketGap AI workflow.
 * It manages:
 * - Workflow state and phase transitions
 * - Agent coordination and communication
 * - Retry logic (max 3 retries per phase)
 * - Error handling and recovery
 * - Progress tracking and reporting
 */

import { LettaClient } from '@letta-ai/letta-client';
import { LETTA_CONFIG, MEMORY_BLOCKS, WORKFLOW_PHASES, WorkflowPhase } from '../../config/letta';
import { ToolIntegrationManager } from '../../utils/toolIntegration';

interface WorkflowState {
  currentPhase: WorkflowPhase;
  completedPhases: WorkflowPhase[];
  failedPhases: WorkflowPhase[];
  retryCount: Record<WorkflowPhase, number>;
  agentStatuses: Record<string, 'online' | 'offline' | 'busy' | 'error'>;
  startTime: string;
  lastUpdated: string;
}

export class OrchestratorAgent {
  private client: LettaClient;
  private agentId: string | null = null;
  private maxRetries = 3; // As per cursor rules
  private toolManager: ToolIntegrationManager;

  constructor() {
    this.client = new LettaClient({
      baseUrl: LETTA_CONFIG.baseUrl,
      token: LETTA_CONFIG.token,
    });
    this.toolManager = new ToolIntegrationManager(this.client);
  }

  /**
   * Initialize the Orchestrator Agent
   */
  async initialize(): Promise<string> {
    try {
      console.log('🎯 Initializing Orchestrator Agent...');
      
      // Initialize custom tools first
      await this.toolManager.initializeAllTools();
      
      // Create the orchestrator agent with custom tools
      const agent = await this.toolManager.createAgentWithTools({
        name: 'OrchestratorAgent',
        agentType: 'orchestrator',
        memoryBlocks: Object.values(MEMORY_BLOCKS.orchestrator),
        model: LETTA_CONFIG.defaultModel,
        embedding: LETTA_CONFIG.defaultEmbedding,
        contextWindowLimit: LETTA_CONFIG.contextWindowLimit,
      });

      this.agentId = agent.id;
      console.log(`✅ Orchestrator Agent created with ID: ${agent.id}`);
      
      // Initialize workflow state
      await this.initializeWorkflowState();
      
      return agent.id;
    } catch (error) {
      console.error('❌ Error initializing Orchestrator Agent:', error);
      throw error;
    }
  }

  /**
   * Initialize the workflow state in agent memory
   */
  private async initializeWorkflowState(): Promise<void> {
    if (!this.agentId) return;

    const initialState: WorkflowState = {
      currentPhase: WORKFLOW_PHASES.INITIALIZATION,
      completedPhases: [],
      failedPhases: [],
      retryCount: {
        [WORKFLOW_PHASES.INITIALIZATION]: 0,
        [WORKFLOW_PHASES.MARKET_RESEARCH]: 0,
        [WORKFLOW_PHASES.SOCIAL_LISTENING]: 0,
        [WORKFLOW_PHASES.MARKET_ANALYSIS]: 0,
        [WORKFLOW_PHASES.SOLUTION_GENERATION]: 0,
        [WORKFLOW_PHASES.HACKATHON_PARSING]: 0,
        [WORKFLOW_PHASES.TECH_STACK_ADVISORY]: 0,
        [WORKFLOW_PHASES.COMPLETED]: 0,
        [WORKFLOW_PHASES.FAILED]: 0,
      },
      agentStatuses: {},
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    await this.updateWorkflowState(initialState);
  }

  /**
   * Start the complete MarketGap AI workflow
   */
  async startWorkflow(industry: string, parameters?: any): Promise<void> {
    if (!this.agentId) {
      throw new Error('Orchestrator not initialized. Call initialize() first.');
    }

    console.log(`🚀 Starting MarketGap AI workflow for industry: ${industry}`);

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: `Initialize and manage the complete MarketGap AI workflow for the ${industry} industry.
          
          Workflow phases to coordinate:
          1. Market Research - Crawl consulting firm white papers
          2. Social Listening - Monitor audience signals
          3. Market Analysis - Identify gaps and opportunities
          4. Solution Generation - Brainstorm novel solutions
          5. Hackathon Parsing - Extract constraints and requirements
          6. Tech Stack Advisory - Recommend technology stack
          
          Parameters: ${JSON.stringify(parameters || {})}
          
          Start by updating the workflow state and proceeding to the market research phase.
          Monitor each phase for completion and handle any failures with retry logic (max 3 retries per phase).`
        }]
      });

      this.logResponse(response);

    } catch (error) {
      console.error('❌ Error starting workflow:', error);
      await this.handlePhaseFailure(WORKFLOW_PHASES.INITIALIZATION, error);
      throw error;
    }
  }

  /**
   * Update workflow state in agent memory
   */
  private async updateWorkflowState(newState: Partial<WorkflowState>): Promise<void> {
    if (!this.agentId) return;

    try {
      const stateString = JSON.stringify({
        ...newState,
        lastUpdated: new Date().toISOString(),
      });

      await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: `Update workflow state: ${stateString}`
        }]
      });

    } catch (error) {
      console.error('❌ Error updating workflow state:', error);
    }
  }

  /**
   * Move to the next phase in the workflow
   */
  async transitionToPhase(phase: WorkflowPhase): Promise<void> {
    if (!this.agentId) return;

    console.log(`🔄 Transitioning to phase: ${phase}`);

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: `Transition to workflow phase: ${phase}. Update the workflow state and coordinate with the appropriate agents for this phase.`
        }]
      });

      this.logResponse(response);

    } catch (error) {
      console.error(`❌ Error transitioning to phase ${phase}:`, error);
      await this.handlePhaseFailure(phase, error);
    }
  }

  /**
   * Handle phase failure with retry logic
   */
  private async handlePhaseFailure(phase: WorkflowPhase, error: any): Promise<void> {
    console.log(`⚠️ Phase ${phase} failed:`, error.message);

    // Implementation of retry logic would go here
    // For now, just log the failure
    await this.updateWorkflowState({
      currentPhase: WORKFLOW_PHASES.FAILED,
      failedPhases: [phase],
    });
  }

  /**
   * Get current workflow status
   */
  async getWorkflowStatus(): Promise<any> {
    if (!this.agentId) {
      throw new Error('Orchestrator not initialized. Call initialize() first.');
    }

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: 'Provide a detailed status report of the current workflow state, including current phase, completed phases, agent statuses, and any errors or issues.'
        }]
      });

      return this.extractAssistantResponse(response);

    } catch (error) {
      console.error('❌ Error getting workflow status:', error);
      throw error;
    }
  }

  /**
   * Create a worker agent using the tool manager
   */
  async createWorkerAgent(agentType: string, name: string): Promise<string> {
    try {
      console.log(`🤖 Creating ${agentType} agent: ${name}`);
      
      const agent = await this.toolManager.createAgentWithTools({
        name: name,
        agentType: agentType,
        memoryBlocks: Object.values(MEMORY_BLOCKS[agentType as keyof typeof MEMORY_BLOCKS] || {}),
        model: LETTA_CONFIG.defaultModel,
        embedding: LETTA_CONFIG.defaultEmbedding,
        contextWindowLimit: LETTA_CONFIG.contextWindowLimit,
      });

      console.log(`✅ ${agentType} agent created with ID: ${agent.id}`);
      return agent.id;

    } catch (error) {
      console.error(`❌ Error creating ${agentType} agent:`, error);
      throw error;
    }
  }

  /**
   * Send message to another agent (for inter-agent communication)
   */
  async sendMessageToAgent(agentId: string, message: string): Promise<any> {
    try {
      console.log(`📤 Sending message to agent ${agentId}: ${message.substring(0, 100)}...`);
      
      // Direct communication with another agent
      const response = await this.client.agents.messages.create(agentId, {
        messages: [{
          role: 'user',
          content: message
        }]
      });

      return response;

    } catch (error) {
      console.error(`❌ Error sending message to agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Monitor agent status
   */
  async checkAgentStatus(agentId: string): Promise<'online' | 'offline' | 'error'> {
    try {
      const agent = await this.client.agents.retrieve(agentId);
      return agent ? 'online' : 'offline';
    } catch (error) {
      console.error(`❌ Error checking agent ${agentId} status:`, error);
      return 'error';
    }
  }

  /**
   * Extract assistant response from message response
   */
  private extractAssistantResponse(response: any): string {
    for (const message of response.messages) {
      if (message.messageType === 'assistant_message') {
        const content = message.content;
        if (typeof content === 'string') {
          return content;
        } else if (Array.isArray(content)) {
          return content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join(' ') || 'No response available';
        }
      }
    }
    return 'No response available';
  }

  /**
   * Log response messages for debugging
   */
  private logResponse(response: any): void {
    for (const message of response.messages) {
      if (message.messageType === 'assistant_message') {
        console.log('🤖 Orchestrator Response:', this.extractAssistantResponse({ messages: [message] }));
      } else if (message.messageType === 'tool_call_message') {
        console.log(`🔧 Tool Called: ${message.toolCall.name}`);
      } else if (message.messageType === 'reasoning_message') {
        console.log('🧠 Orchestrator Reasoning:', message.reasoning);
      }
    }
  }

  /**
   * Get agent ID
   */
  getAgentId(): string | null {
    return this.agentId;
  }

  /**
   * Set agent ID if already created
   */
  setAgentId(agentId: string): void {
    this.agentId = agentId;
  }
} 