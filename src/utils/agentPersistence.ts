/**
 * Agent Persistence Utility
 * 
 * Handles saving/loading agent IDs and checking for existing agents
 * to avoid creating duplicates on every request.
 */

import { LettaClient } from '@letta-ai/letta-client';
import { LETTA_CONFIG } from '../config/letta';
import fs from 'fs';
import path from 'path';

// File to store agent IDs persistently
const AGENT_IDS_FILE = path.join(process.cwd(), '.agent-ids.json');

export interface StoredAgentIds {
  orchestrator?: string;
  marketResearch?: string;
  timestamp?: string;
}

/**
 * Save agent IDs to persistent storage
 */
export function saveAgentIds(agentIds: StoredAgentIds): void {
  try {
    const data = {
      ...agentIds,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(AGENT_IDS_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Agent IDs saved to persistent storage');
  } catch (error) {
    console.warn('⚠️ Failed to save agent IDs:', error);
  }
}

/**
 * Load agent IDs from persistent storage
 */
export function loadAgentIds(): StoredAgentIds {
  try {
    if (fs.existsSync(AGENT_IDS_FILE)) {
      const data = fs.readFileSync(AGENT_IDS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      console.log('📂 Loaded agent IDs from persistent storage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.warn('⚠️ Failed to load agent IDs:', error);
  }
  return {};
}

/**
 * Check if an agent exists by ID and is accessible
 */
export async function verifyAgentExists(client: LettaClient, agentId: string): Promise<boolean> {
  try {
    const agent = await client.agents.retrieve(agentId);
    console.log(`✅ Agent ${agentId} exists and is accessible`);
    return true;
  } catch (error) {
    console.log(`❌ Agent ${agentId} not found or not accessible:`, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Find existing agents by name pattern
 */
export async function findExistingAgents(client: LettaClient): Promise<StoredAgentIds> {
  try {
    console.log('🔍 Searching for existing MarketGap AI agents...');
    
    // List all agents
    const agents = await client.agents.list();
    
    const foundAgents: StoredAgentIds = {};
    
    for (const agent of agents) {
      // Check agent name patterns to identify our agents
      if (agent.name?.toLowerCase().includes('orchestrator')) {
        foundAgents.orchestrator = agent.id;
        console.log(`🎯 Found existing Orchestrator Agent: ${agent.id} (${agent.name})`);
      }
      
      if (agent.name?.toLowerCase().includes('market') || 
          agent.name?.toLowerCase().includes('research')) {
        foundAgents.marketResearch = agent.id;
        console.log(`🔬 Found existing Market Research Agent: ${agent.id} (${agent.name})`);
      }
    }
    
    if (foundAgents.orchestrator || foundAgents.marketResearch) {
      console.log('📋 Found existing agents:', foundAgents);
      // Save the found agents
      saveAgentIds(foundAgents);
    } else {
      console.log('🆕 No existing MarketGap AI agents found');
    }
    
    return foundAgents;
    
  } catch (error) {
    console.warn('⚠️ Failed to search for existing agents:', error);
    return {};
  }
}

/**
 * Get or create agent IDs with persistence
 */
export async function getOrCreateAgentIds(client: LettaClient): Promise<StoredAgentIds> {
  // First, try to load from persistent storage
  let agentIds = loadAgentIds();
  
  // Verify that the stored agents still exist
  if (agentIds.orchestrator) {
    const exists = await verifyAgentExists(client, agentIds.orchestrator);
    if (!exists) {
      console.log('🗑️ Stored orchestrator agent no longer exists');
      delete agentIds.orchestrator;
    }
  }
  
  if (agentIds.marketResearch) {
    const exists = await verifyAgentExists(client, agentIds.marketResearch);
    if (!exists) {
      console.log('🗑️ Stored market research agent no longer exists');
      delete agentIds.marketResearch;
    }
  }
  
  // If we don't have valid stored agents, search for existing ones
  if (!agentIds.orchestrator || !agentIds.marketResearch) {
    console.log('🔍 Searching for existing agents...');
    const foundAgents = await findExistingAgents(client);
    
    // Merge found agents with stored ones
    agentIds = {
      ...agentIds,
      ...foundAgents,
    };
  }
  
  return agentIds;
}

/**
 * Clear stored agent IDs (useful for testing)
 */
export function clearStoredAgentIds(): void {
  try {
    if (fs.existsSync(AGENT_IDS_FILE)) {
      fs.unlinkSync(AGENT_IDS_FILE);
      console.log('🗑️ Cleared stored agent IDs');
    }
  } catch (error) {
    console.warn('⚠️ Failed to clear stored agent IDs:', error);
  }
} 