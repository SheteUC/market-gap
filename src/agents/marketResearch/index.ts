/**
 * Market Research Agent
 * 
 * This agent has ONE specific role:
 * - Crawl white papers (PDFs) from consulting firms
 * - Split them into structured chunks (title, exec-summary, finding, table)
 * - Redact PII and tag chunks
 * - Store in consulting_docs memory block
 * 
 * It does NOT analyze markets, identify trends, or provide insights.
 * That's the Market Analyzer's job.
 */

import { LettaClient } from '@letta-ai/letta-client';
import { LETTA_CONFIG, MEMORY_BLOCKS, CONSULTING_FIRMS } from '../../config/letta';
import { ToolIntegrationManager } from '../../utils/toolIntegration';

export class MarketResearchAgent {
  private client: LettaClient;
  private agentId: string | null = null;
  private toolManager: ToolIntegrationManager;

  constructor() {
    this.client = new LettaClient({
      baseUrl: LETTA_CONFIG.baseUrl,
      token: LETTA_CONFIG.token,
    });
    this.toolManager = new ToolIntegrationManager(this.client);
  }

  /**
   * Create the Market Research Agent - focused only on PDF crawling and chunking
   */
  async initialize(): Promise<string> {
    try {
      console.log('🔬 Initializing Market Research Agent (PDF Crawler)...');
      
      // Create agent with custom tools
      const agent = await this.toolManager.createAgentWithTools({
        name: 'MarketResearchAgent',
        agentType: 'marketResearch',
        memoryBlocks: Object.values(MEMORY_BLOCKS.marketResearch),
        model: LETTA_CONFIG.defaultModel,
        embedding: LETTA_CONFIG.defaultEmbedding,
        contextWindowLimit: LETTA_CONFIG.contextWindowLimit,
      });

      this.agentId = agent.id;
      console.log(`✅ Market Research Agent created with ID: ${agent.id}`);
      
      return agent.id;
    } catch (error) {
      console.error('❌ Error initializing Market Research Agent:', error);
      throw error;
    }
  }

  /**
   * Start research for specific topic and firms (alias for crawlPDFs)
   */
  async startResearch(topic: string, firmNames: string[]): Promise<void> {
    console.log(`🔬 Starting research on "${topic}" for firms: ${firmNames.join(', ')}`);
    await this.crawlPDFs(firmNames);
  }

  /**
   * Start PDF crawling for specific consulting firms
   * Only crawls and chunks PDFs - does not analyze content
   */
  async crawlPDFs(firmNames: string[]): Promise<void> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    console.log(`📄 Starting PDF crawl for firms: ${firmNames.join(', ')}`);

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: `Your ONLY job is to crawl and process PDFs from consulting firms. Do NOT analyze content or provide insights.

TASK: Crawl PDFs from these consulting firms: ${firmNames.join(', ')}

PROCESS:
1. Search each firm's website for recent white papers, reports, and research PDFs
2. Download/access the PDFs using available tools
3. Use PDFMiner (via run_code) to extract text from each PDF
4. Split each PDF into these specific chunks:
   - title: Document title and metadata
   - exec-summary: Executive summary section
   - finding: Key findings and data points
   - table: Any tables, charts, or structured data
5. Redact any PII (personal information) from chunks
6. Tag each chunk with firm name and document source
7. Store in consulting_docs memory block

DO NOT:
- Analyze market trends
- Identify opportunities
- Provide insights or summaries
- Make recommendations

Just crawl, chunk, and store the raw data.`
        }]
      });

      // Process the response
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          console.log('🤖 PDF Crawler:', message.content);
        } else if (message.messageType === 'tool_call_message') {
          console.log(`🔧 Tool Called: ${message.toolCall.name}`);
        }
      }

    } catch (error) {
      console.error('❌ Error during PDF crawling:', error);
      throw error;
    }
  }

  /**
   * Get the raw PDF chunks from memory (not analysis)
   */
  async getPDFChunks(): Promise<any> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: 'List all PDF chunks you have stored in consulting_docs memory. Just return the raw chunks with their tags - no analysis or interpretation.'
        }]
      });

      // Extract assistant message
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          const content = message.content;
          if (typeof content === 'string') {
            return content;
          } else if (Array.isArray(content)) {
            return content
              .filter(item => item.type === 'text')
              .map(item => item.text)
              .join(' ') || 'No chunks available';
          }
          return 'No chunks available';
        }
      }

      return 'No chunks available';
    } catch (error) {
      console.error('❌ Error getting PDF chunks:', error);
      throw error;
    }
  }

  /**
   * Get research summary for demo purposes
   */
  async getResearchSummary(): Promise<string> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: 'Provide a comprehensive summary of all research conducted so far, including: number of PDFs processed, key consulting firms covered, main topics identified, and current status of the research process.'
        }]
      });

      // Extract assistant message
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          const content = message.content;
          if (typeof content === 'string') {
            return content;
          } else if (Array.isArray(content)) {
            return content
              .filter(item => item.type === 'text')
              .map(item => item.text)
              .join(' ') || 'No research summary available';
          }
          return 'No research summary available';
        }
      }

      return 'No research summary available';
    } catch (error) {
      console.error('❌ Error getting research summary:', error);
      throw error;
    }
  }

  /**
   * Get crawling status (how many PDFs processed, etc.)
   */
  async getCrawlingStatus(): Promise<any> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{
          role: 'user',
          content: 'Report your crawling status: how many PDFs have you processed, which firms have been covered, and any issues encountered. Keep it factual - no analysis.'
        }]
      });

      return response;
    } catch (error) {
      console.error('❌ Error getting crawling status:', error);
      throw error;
    }
  }

  /**
   * Get the current state of the agent's memory blocks
   */
  async getMemoryState(): Promise<any> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const blocks = await this.client.agents.blocks.list(this.agentId);
      return blocks;
    } catch (error) {
      console.error('❌ Error getting memory state:', error);
      throw error;
    }
  }

  /**
   * Send a custom message to the agent (for debugging)
   */
  async sendMessage(message: string): Promise<any> {
    if (!this.agentId) {
      throw new Error('Agent not initialized. Call initialize() first.');
    }

    try {
      const response = await this.client.agents.messages.create(this.agentId, {
        messages: [{ role: 'user', content: message }]
      });

      return response;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
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