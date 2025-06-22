/**
 * Tool Integration Manager
 * 
 * Manages the creation and assignment of custom tools to Letta agents.
 * Ensures all agents have the appropriate tools for their specific roles.
 */

import { LettaClient } from '@letta-ai/letta-client';
import { CustomToolsManager } from './customTools';

export class ToolIntegrationManager {
  private client: LettaClient;
  private customToolsManager: CustomToolsManager;
  private createdTools: Record<string, any[]> = {};

  constructor(client: LettaClient) {
    this.client = client;
    this.customToolsManager = new CustomToolsManager(client);
  }

  /**
   * Initialize all custom tools for the MarketGap AI system
   */
  async initializeAllTools(): Promise<void> {
    try {
      console.log('🔧 Initializing all custom tools...');
      
      // Create all custom tools
      this.createdTools = await this.customToolsManager.createAllTools();
      
      console.log('✅ All tools initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing tools:', error);
      throw error;
    }
  }

  /**
   * Get tool names for a specific agent type
   */
  getToolsForAgent(agentType: string): string[] {
    return this.customToolsManager.getToolsByAgentType(agentType);
  }

  /**
   * Get created tool instances for an agent type
   */
  getToolInstancesForAgent(agentType: string): any[] {
    return this.createdTools[agentType] || [];
  }

  /**
   * Check if tools have been initialized
   */
  areToolsInitialized(): boolean {
    return Object.keys(this.createdTools).length > 0;
  }

  /**
   * Get all created tools
   */
  getAllCreatedTools(): Record<string, any[]> {
    return this.createdTools;
  }

  /**
   * Create agent with appropriate tools
   */
  async createAgentWithTools(agentConfig: {
    name: string;
    agentType: string;
    memoryBlocks: any[];
    model: string;
    embedding: string;
    contextWindowLimit?: number;
  }): Promise<any> {
    try {
      // Ensure tools are initialized
      if (!this.areToolsInitialized()) {
        await this.initializeAllTools();
      }

      // Get tools for this agent type
      const toolNames = this.getToolsForAgent(agentConfig.agentType);
      
      console.log(`🤖 Creating ${agentConfig.name} with tools:`, toolNames);

      // Create the agent with tools
      const agent = await this.client.agents.create({
        name: agentConfig.name,
        memoryBlocks: agentConfig.memoryBlocks,
        model: agentConfig.model,
        embedding: agentConfig.embedding,
        contextWindowLimit: agentConfig.contextWindowLimit,
        tools: toolNames,
      });

      console.log(`✅ ${agentConfig.name} created with ID: ${agent.id}`);
      return agent;

    } catch (error) {
      console.error(`❌ Error creating agent ${agentConfig.name}:`, error);
      throw error;
    }
  }
} 