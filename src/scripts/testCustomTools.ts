/**
 * Test Custom Tools
 * 
 * Script to test the custom tools system and demonstrate
 * how each agent uses their specialized tools.
 */

import { LettaClient } from '@letta-ai/letta-client';
import { LETTA_CONFIG } from '../config/letta';
import { ToolIntegrationManager } from '../utils/toolIntegration';
import { OrchestratorAgent } from '../agents/orchestrator';
import { MarketResearchAgent } from '../agents/marketResearch';

async function testCustomTools() {
  console.log('🧪 Testing Custom Tools System...\n');

  try {
    // Initialize client
    const client = new LettaClient({
      baseUrl: LETTA_CONFIG.baseUrl,
      token: LETTA_CONFIG.token,
    });

    // Initialize tool manager
    const toolManager = new ToolIntegrationManager(client);
    
    console.log('🔧 Initializing all custom tools...');
    await toolManager.initializeAllTools();
    console.log('✅ Tools initialized successfully\n');

    // Test 1: Create Orchestrator Agent
    console.log('🎯 Test 1: Creating Orchestrator Agent...');
    const orchestrator = new OrchestratorAgent();
    const orchestratorId = await orchestrator.initialize();
    console.log(`✅ Orchestrator created: ${orchestratorId}\n`);

    // Test 2: Create Market Research Agent
    console.log('🔬 Test 2: Creating Market Research Agent...');
    const marketAgent = new MarketResearchAgent();
    const marketAgentId = await marketAgent.initialize();
    console.log(`✅ Market Research Agent created: ${marketAgentId}\n`);

    // Test 3: Test PDF extraction tool
    console.log('📄 Test 3: Testing PDF extraction tool...');
    const pdfResponse = await marketAgent.sendMessage(`
      Use the fetch_and_extract_pdf tool to extract content from this sample PDF URL:
      https://example.com/sample-report.pdf
      
      This is a test of the custom PDF extraction tool.
    `);
    console.log('PDF extraction response:', pdfResponse.messages?.[0]?.content || 'No response');
    console.log('');

    // Test 4: Create worker agents through orchestrator
    console.log('🤖 Test 4: Creating worker agents through orchestrator...');
    const socialListenerId = await orchestrator.createWorkerAgent('socialListener', 'SocialListenerAgent');
    const marketAnalyzerId = await orchestrator.createWorkerAgent('marketAnalyzer', 'MarketAnalyzerAgent');
    console.log(`✅ Social Listener created: ${socialListenerId}`);
    console.log(`✅ Market Analyzer created: ${marketAnalyzerId}\n`);

    // Test 5: Test inter-agent communication
    console.log('📞 Test 5: Testing inter-agent communication...');
    await orchestrator.sendMessageToAgent(marketAgentId, `
      Test message from orchestrator: Please report your current status and available tools.
    `);
    console.log('✅ Inter-agent communication test completed\n');

    // Test 6: Test workflow initialization
    console.log('🚀 Test 6: Testing workflow initialization...');
    await orchestrator.startWorkflow('Technology', {
      targetMarkets: ['SaaS', 'AI/ML', 'Enterprise'],
      timeframe: '2024-2025'
    });
    console.log('✅ Workflow initialization test completed\n');

    // Test 7: Get workflow status
    console.log('📊 Test 7: Getting workflow status...');
    const status = await orchestrator.getWorkflowStatus();
    console.log('Workflow status:', status);
    console.log('');

    console.log('🎉 All custom tools tests completed successfully!');

  } catch (error) {
    console.error('❌ Error during custom tools testing:', error);
    throw error;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testCustomTools()
    .then(() => {
      console.log('\n✅ Custom tools test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Custom tools test failed:', error);
      process.exit(1);
    });
}

export { testCustomTools }; 