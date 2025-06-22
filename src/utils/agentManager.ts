/**
 * Agent Manager for MarketGap AI
 * 
 * This utility manages the lifecycle and coordination of all agents in the system.
 * It provides a high-level interface for:
 * - Agent initialization and management
 * - Inter-agent communication
 * - Workflow orchestration
 * - Error handling and recovery
 */

import { OrchestratorAgent } from '../agents/orchestrator';
import { MarketResearchAgent } from '../agents/marketResearch';
import { CONSULTING_FIRMS } from '../config/letta';
import { 
  getOrCreateAgentIds, 
  saveAgentIds, 
  loadAgentIds, 
  clearStoredAgentIds,
  type StoredAgentIds 
} from './agentPersistence';

export interface AgentManagerConfig {
  lettaApiKey?: string;
  lettaBaseUrl?: string;
  initializeAgents?: boolean;
}

export class AgentManager {
  // Agent instances
  public orchestrator: OrchestratorAgent;
  public marketResearch: MarketResearchAgent;
  
  // Agent registry
  private agents: Map<string, any> = new Map();
  private agentIds: Map<string, string> = new Map();

  constructor(config: AgentManagerConfig = {}) {
    // Initialize agent instances
    this.orchestrator = new OrchestratorAgent();
    this.marketResearch = new MarketResearchAgent();
    
    // Register agents
    this.agents.set('orchestrator', this.orchestrator);
    this.agents.set('marketResearch', this.marketResearch);
  }

  /**
   * Initialize all agents (only create if they don't exist)
   */
  async initializeAllAgents(): Promise<Record<string, string>> {
    console.log('🚀 Initializing all MarketGap AI agents...');
    
    try {
      // Check for existing agents first
      const { LettaClient } = await import('@letta-ai/letta-client');
      const { LETTA_CONFIG } = await import('../config/letta');
      const client = new LettaClient({
        baseUrl: LETTA_CONFIG.baseUrl,
        token: LETTA_CONFIG.token,
      });
      const existingAgents = await getOrCreateAgentIds(client);

      const agentIds: Record<string, string> = {};

      // Load existing agent IDs if available
      if (existingAgents.orchestrator || existingAgents.marketResearch) {
        console.log('♻️ Found existing agents, loading them...');
        const agentIdsForLoading: Record<string, string> = {};
        if (existingAgents.orchestrator) agentIdsForLoading.orchestrator = existingAgents.orchestrator;
        if (existingAgents.marketResearch) agentIdsForLoading.marketResearch = existingAgents.marketResearch;
        this.loadExistingAgentIds(agentIdsForLoading);
        
        if (existingAgents.orchestrator) {
          agentIds.orchestrator = existingAgents.orchestrator;
          console.log(`♻️ Reusing existing Orchestrator Agent: ${existingAgents.orchestrator}`);
        }
        
        if (existingAgents.marketResearch) {
          agentIds.marketResearch = existingAgents.marketResearch;
          console.log(`♻️ Reusing existing Market Research Agent: ${existingAgents.marketResearch}`);
        }
      }

      // Initialize any missing agents
      if (!existingAgents.orchestrator) {
        console.log('📋 Creating new Orchestrator Agent...');
        agentIds.orchestrator = await this.orchestrator.initialize();
        this.agentIds.set('orchestrator', agentIds.orchestrator);
        existingAgents.orchestrator = agentIds.orchestrator;
      }

      if (!existingAgents.marketResearch) {
        console.log('📋 Creating new Market Research Agent...');
        agentIds.marketResearch = await this.marketResearch.initialize();
        this.agentIds.set('marketResearch', agentIds.marketResearch);
        existingAgents.marketResearch = agentIds.marketResearch;
      }

      // Save the agent IDs persistently
      saveAgentIds(existingAgents);

      console.log('✅ All agents initialized successfully!');
      console.log('Agent IDs:', agentIds);

      return agentIds;

    } catch (error) {
      console.error('❌ Error initializing agents:', error);
      throw error;
    }
  }

  /**
   * Start market research workflow for a specific industry
   */
  async startMarketResearchWorkflow(targetIndustry: string): Promise<void> {
    console.log(`🔬 Starting market research workflow for industry: ${targetIndustry}`);

    try {
      // Use orchestrator to start the full workflow
      console.log('🎯 Initiating workflow through orchestrator...');
      await this.orchestrator.startWorkflow(targetIndustry, {
        consultingFirms: CONSULTING_FIRMS,
        targetMarkets: [targetIndustry],
        timeframe: '2024-2025'
      });

      console.log('✅ Market research workflow initiated successfully!');

    } catch (error) {
      console.error('❌ Error starting market research workflow:', error);
      throw error;
    }
  }

  /**
   * Start PDF crawling workflow for specific consulting firms
   */
  async startPDFCrawlWorkflow(firmNames: string[]): Promise<void> {
    console.log(`📄 Starting PDF crawl workflow for firms: ${firmNames.join(', ')}`);

    try {
      // Only delegate to market research agent for PDF crawling
      console.log('📄 Starting PDF crawling...');
      await this.marketResearch.crawlPDFs(firmNames);

      console.log('✅ PDF crawl workflow initiated successfully!');

    } catch (error) {
      console.error('❌ Error starting PDF crawl workflow:', error);
      throw error;
    }
  }

  /**
   * Get overall workflow status
   */
  async getWorkflowStatus(): Promise<any> {
    try {
      const status = {
        orchestrator: null as any,
        marketResearch: null as any,
        overall: 'unknown' as string,
      };

      // Get orchestrator workflow status
      try {
        status.orchestrator = await this.orchestrator.getWorkflowStatus();
      } catch (error) {
        console.warn('Could not get orchestrator status:', error instanceof Error ? error.message : 'Unknown error');
      }

      // Get market research status
      try {
        status.marketResearch = await this.marketResearch.getCrawlingStatus();
      } catch (error) {
        console.warn('Could not get market research status:', error instanceof Error ? error.message : 'Unknown error');
      }

      // Determine overall status
      if (status.orchestrator || status.marketResearch) {
        status.overall = 'active';
      } else {
        status.overall = 'inactive';
      }

      return status;

    } catch (error) {
      console.error('❌ Error getting workflow status:', error);
      throw error;
    }
  }

  /**
   * Get PDF crawling status
   */
  async getPDFCrawlStatus(): Promise<any> {
    try {
      const status = {
        marketResearch: null as any,
        overall: 'unknown' as string,
      };

      // Get market research (PDF crawling) status
      try {
        status.marketResearch = await this.marketResearch.getCrawlingStatus();
      } catch (error) {
        console.warn('Could not get PDF crawling status:', error instanceof Error ? error.message : 'Unknown error');
      }

      // Determine overall status
      if (status.marketResearch) {
        status.overall = 'active';
      } else {
        status.overall = 'inactive';
      }

      return status;

    } catch (error) {
      console.error('❌ Error getting PDF crawl status:', error);
      throw error;
    }
  }

  /**
   * Send a message between agents
   */
  async sendInterAgentMessage(
    fromAgent: string, 
    toAgent: string, 
    message: string
  ): Promise<any> {
    const fromAgentId = this.agentIds.get(fromAgent);
    const toAgentId = this.agentIds.get(toAgent);

    if (!fromAgentId || !toAgentId) {
      throw new Error(`Agent IDs not found. From: ${fromAgentId}, To: ${toAgentId}`);
    }

    console.log(`📤 Sending message from ${fromAgent} to ${toAgent}`);

    try {
      return await this.orchestrator.sendMessageToAgent(toAgentId, message);
    } catch (error) {
      console.error(`❌ Error sending message from ${fromAgent} to ${toAgent}:`, error);
      throw error;
    }
  }

  /**
   * Get agent memory state
   */
  async getAgentMemory(agentName: string): Promise<any> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    if (agentName === 'marketResearch') {
      return await this.marketResearch.getMemoryState();
    }
    // Add other agents as needed

    throw new Error(`Memory access not implemented for agent: ${agentName}`);
  }

  /**
   * Check if all agents are properly initialized
   */
  isInitialized(): boolean {
    return this.agentIds.size > 0;
  }

  /**
   * Get all agent IDs
   */
  getAgentIds(): Record<string, string> {
    const ids: Record<string, string> = {};
    this.agentIds.forEach((id, name) => {
      ids[name] = id;
    });
    return ids;
  }

  /**
   * Load existing agent IDs (if agents were already created)
   */
  loadExistingAgentIds(agentIds: Record<string, string>): void {
    console.log('📥 Loading existing agent IDs...');
    
    if (agentIds.orchestrator) {
      this.orchestrator.setAgentId(agentIds.orchestrator);
      this.agentIds.set('orchestrator', agentIds.orchestrator);
      console.log(`✅ Loaded Orchestrator Agent ID: ${agentIds.orchestrator}`);
    }
    
    if (agentIds.marketResearch) {
      this.marketResearch.setAgentId(agentIds.marketResearch);
      this.agentIds.set('marketResearch', agentIds.marketResearch);
      console.log(`✅ Loaded Market Research Agent ID: ${agentIds.marketResearch}`);
    }

    console.log('✅ Agent IDs loaded successfully');
  }

  /**
   * Reset all agents (useful for testing)
   */
  async resetAllAgents(): Promise<void> {
    console.log('🔄 Resetting all agents...');
    this.agents.clear();
    this.agentIds.clear();
    
    // Clear persistent storage
    clearStoredAgentIds();
    
    // Reinitialize
    this.orchestrator = new OrchestratorAgent();
    this.marketResearch = new MarketResearchAgent();
    
    this.agents.set('orchestrator', this.orchestrator);
    this.agents.set('marketResearch', this.marketResearch);
    
    console.log('✅ All agents reset successfully');
  }

  /**
   * Clear stored agent IDs (useful for forcing new agent creation)
   */
  clearStoredAgents(): void {
    console.log('🗑️ Clearing stored agent IDs...');
    clearStoredAgentIds();
    this.agentIds.clear();
  }
}

// Singleton instance for global use
export const agentManager = new AgentManager(); 