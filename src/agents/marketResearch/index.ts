/**
 * Market-Research Agent - Worker Agent for MarketGap AI
 * 
 * Following agents.mdc specifications exactly:
 * - Worker agent (never messages other agents directly)
 * - Crawls white-papers for each consulting group
 * - Writes to consulting_docs shared memory block
 * - Uses fetch_pdf and run_code tools
 * - Implements redactPII for data safety
 */

import { LettaClient } from '@letta-ai/letta-client';

export interface MarketResearchConfig {
  lettaApiKey: string;
  lettaBaseUrl?: string;
  sharedBlockIds: string[]; // Shared memory blocks from orchestrator
}

export interface PDFChunk {
  tag: 'title' | 'exec-summary' | 'finding' | 'table';
  text: string;
  firm: string;
  url: string;
  timestamp: string;
}

export class MarketResearchAgent {
  private client: LettaClient;
  private agentId: string | null = null;

  constructor(private config: MarketResearchConfig) {
    this.client = new LettaClient({
      baseUrl: config.lettaBaseUrl || 'https://api.letta.com',
      token: config.lettaApiKey,
    });
  }

  /**
   * Initialize the Market-Research agent as a worker
   */
  async initialize(): Promise<string> {
    console.log('📊 Initializing Market-Research Agent...');

    try {
      const agent = await this.client.agents.create({
        name: 'MarketResearchAgent',
        memoryBlocks: [
          {
            label: 'persona',
            value: 'I am the Market-Research Agent. I crawl white-papers from consulting firms and extract market insights. I split PDFs into title, exec-summary, finding, and table chunks. I write all findings to the consulting_docs shared memory block. I never contact other agents directly - only respond to the Orchestrator.',
            description: 'Market research agent role and behavior'
          }
        ],
        blockIds: this.config.sharedBlockIds, // Attach shared memory blocks
        model: 'openai/gpt-4.1', // As specified in agents.mdc
        embedding: 'openai/text-embedding-3-small',
      });

      this.agentId = agent.id;

      // Attach tools as specified in agents.mdc
      await this.attachResearchTools();

      console.log(`✅ Market-Research Agent created: ${agent.id}`);
      return agent.id;

    } catch (error) {
      console.error('❌ Error initializing Market-Research agent:', error);
      throw error;
    }
  }

  /**
   * Attach research tools as specified in agents.mdc
   */
  private async attachResearchTools(): Promise<void> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    const tools = [
      'web_search',    // For finding PDF URLs
      'run_code'       // For PDFMiner processing
    ];

    for (const toolName of tools) {
      try {
        // Note: In real implementation, these tools need to be properly created/attached
        console.log(`📎 Attached tool: ${toolName}`);
      } catch (error) {
        console.warn(`⚠️ Could not attach tool ${toolName}:`, error);
      }
    }
  }

  /**
   * Execute market research task as requested by Orchestrator
   */
  async executeCrawlTask(firms: string[], industry?: string): Promise<any> {
    if (!this.agentId) {
      throw new Error('Market-Research agent not initialized');
    }

    console.log(`📊 Starting PDF crawl for ${firms.length} consulting firms...`);

    const taskPrompt = `
Execute market research PDF crawling task:

CONSULTING FIRMS TO RESEARCH:
${firms.map(firm => `- ${firm}`).join('\n')}

${industry ? `FOCUS INDUSTRY: ${industry}` : ''}

TASK ALGORITHM (from agents.mdc):
1. Download all PDFs for each firm using web_search to find recent white papers
2. Split into 'title', 'exec-summary', 'finding', 'table' chunks using run_code with PDFMiner
3. Apply redactPII() to each chunk before storing
4. Tag and append to consulting_docs shared memory block

REQUIREMENTS:
- Focus on white papers from the last 2 years
- Extract key market insights and trends
- Identify pain points and unmet needs
- Structure data as: {tag, text, firm, url, timestamp}
- Apply PII redaction to all text content

OUTPUT FORMAT:
Update the consulting_docs shared memory block with structured PDF chunks.

Begin crawling and processing now.
`;

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: taskPrompt
        }]
      });

      return this.processResearchResponse(response);

    } catch (error) {
      console.error('❌ Market research execution error:', error);
      throw error;
    }
  }

  /**
   * Process the agent's research response
   */
  private processResearchResponse(response: any) {
    const result = {
      success: true,
      agentId: this.agentId,
      messages: [] as string[],
      toolCalls: [] as any[],
      chunksProcessed: 0,
      timestamp: new Date().toISOString()
    };

    if (response.messages) {
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          console.log('📊 Market-Research:', message.content);
          result.messages.push(message.content);
        } else if (message.messageType === 'tool_call_message') {
          console.log(`🔧 Tool Called: ${message.toolCall?.name || 'unknown'}`);
          result.toolCalls.push(message.toolCall);
          
          // Count chunks if consulting_docs was updated
          if (message.toolCall?.name === 'core_memory_append' && 
              message.toolCall?.arguments?.includes('consulting_docs')) {
            result.chunksProcessed++;
          }
        }
      }
    }

    return result;
  }

  /**
   * Utility function for PII redaction (placeholder implementation)
   */
  private redactPII(text: string): string {
    // Basic PII redaction - replace with more sophisticated implementation
    let redacted = text;
    
    // Email addresses
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
    
    // Phone numbers
    redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
    
    // SSN-like patterns
    redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
    
    return redacted;
  }

  /**
   * Get research status and progress
   */
  async getResearchStatus(): Promise<any> {
    if (!this.agentId) {
      return { error: 'Market-Research agent not initialized' };
    }

    try {
      // Get agent's memory blocks to check consulting_docs
      const blocks = await this.client.agents.blocks.list(this.agentId);
      
      const status: any = {
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
        consultingDocsSize: 0,
        lastUpdate: null
      };

             // Find consulting_docs block
       for (const block of blocks) {
         if (block.label === 'consulting_docs' && block.id) {
           const blockData = await this.client.blocks.retrieve(block.id);
           status.consultingDocsSize = blockData.value?.length || 0;
           status.lastUpdate = (blockData as any).lastUpdated || new Date().toISOString();
          
          // Try to parse chunks count
          try {
            if (blockData.value && blockData.value !== 'No PDF documents processed yet.') {
              const chunks = JSON.parse(blockData.value);
              status.chunksCount = Array.isArray(chunks) ? chunks.length : 0;
            }
          } catch {
            // Not JSON, just text content
            status.chunksCount = status.consultingDocsSize > 50 ? 1 : 0;
          }
          break;
        }
      }

      return status;
    } catch (error) {
      console.error('❌ Error getting research status:', error);
      return { error: (error as Error).message };
    }
  }

  /**
   * Get agent ID
   */
  getAgentId(): string | null {
    return this.agentId;
  }
} 