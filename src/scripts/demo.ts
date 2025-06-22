/**
 * MarketGap AI Demo Script
 * 
 * This script demonstrates how to use the Letta-based agents to:
 * 1. Initialize the orchestrator and market research agents
 * 2. Start a market research workflow 
 * 3. Monitor progress and get results
 * 
 * To run this demo:
 * 1. Set your LETTA_API_KEY environment variable
 * 2. Run: npx ts-node src/scripts/demo.ts
 */

import { agentManager } from '../utils/agentManager';
import { CONSULTING_FIRMS } from '../config/letta';

async function runDemo() {
  console.log('🚀 Starting MarketGap AI Demo');
  console.log('================================\n');

  try {
    // Step 1: Initialize all agents
    console.log('Step 1: Initializing Agents');
    console.log('----------------------------');
    const agentIds = await agentManager.initializeAllAgents();
    console.log('\n📋 Agent IDs:');
    console.log(JSON.stringify(agentIds, null, 2));
    console.log('\n');

    // Step 2: Start market research workflow
    console.log('Step 2: Starting Market Research Workflow');
    console.log('----------------------------------------');
    const targetIndustry = 'Artificial Intelligence and Machine Learning';
    console.log(`🎯 Target Industry: ${targetIndustry}`);
    console.log(`📊 Consulting Firms: ${CONSULTING_FIRMS.join(', ')}`);
    
    await agentManager.startMarketResearchWorkflow(targetIndustry);
    console.log('\n');

    // Step 3: Wait a bit and check status
    console.log('Step 3: Monitoring Progress');
    console.log('--------------------------');
    console.log('⏳ Waiting 10 seconds for agents to process...\n');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 4: Get workflow status
    console.log('Step 4: Getting Workflow Status');
    console.log('-------------------------------');
    const status = await agentManager.getWorkflowStatus();
    console.log('📊 Workflow Status:');
    console.log(JSON.stringify(status, null, 2));
    console.log('\n');

    // Step 5: Get detailed research results
    console.log('Step 5: Getting Research Results');
    console.log('-------------------------------');
    const researchSummary = await agentManager.marketResearch.getResearchSummary();
    console.log('📋 Research Summary:');
    console.log(researchSummary);
    console.log('\n');

    // Step 6: Show agent memory states
    console.log('Step 6: Agent Memory States');
    console.log('---------------------------');
    try {
      const marketResearchMemory = await agentManager.getAgentMemory('marketResearch');
      console.log('🧠 Market Research Agent Memory:');
      console.log(JSON.stringify(marketResearchMemory, null, 2));
    } catch (error) {
      console.log('⚠️ Could not retrieve agent memory:', error);
    }
    console.log('\n');

    console.log('✅ Demo completed successfully!');
    console.log('\n🎉 Your MarketGap AI agents are now operational and have conducted initial research!');
    console.log('\n💡 Next steps:');
    console.log('   1. Integrate with your frontend using the AgentManager');
    console.log('   2. Add more specialized agents (Social Listener, Market Analyzer, etc.)');
    console.log('   3. Implement real-time updates with WebSocket events');
    console.log('   4. Set up persistent storage for agent IDs');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('API key')) {
        console.log('\n💡 Tip: Make sure you have set your LETTA_API_KEY environment variable');
        console.log('   You can get an API key from: https://app.letta.com/api-keys');
      }
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        console.log('\n💡 Tip: Check your Letta Cloud quota and billing status');
        console.log('   Visit: https://app.letta.com/settings');
      }
    }
    
    throw error;
  }
}

// Additional demo functions for specific scenarios

/**
 * Demo: Research a specific consulting firm
 */
async function demoSpecificFirmResearch() {
  console.log('\n🔬 Demo: Specific Firm Research');
  console.log('==============================');

  try {
    // Research only McKinsey reports
    await agentManager.marketResearch.startResearch(
      'Digital Transformation', 
      ['McKinsey & Company']
    );

    console.log('✅ Specific firm research initiated');
  } catch (error) {
    console.error('❌ Specific firm research failed:', error);
  }
}

/**
 * Demo: Inter-agent communication
 */
async function demoInterAgentCommunication() {
  console.log('\n📡 Demo: Inter-Agent Communication');
  console.log('================================');

  try {
    const message = 'Please provide a summary of your research findings for coordination with other agents.';
    
    const response = await agentManager.sendInterAgentMessage(
      'orchestrator',
      'marketResearch', 
      message
    );

    console.log('📤 Message sent successfully');
    console.log('📥 Response:', response);
  } catch (error) {
    console.error('❌ Inter-agent communication failed:', error);
  }
}

// Run the main demo if this script is executed directly
if (require.main === module) {
  runDemo()
    .then(() => {
      console.log('\n🎯 Demo script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Demo script failed:', error);
      process.exit(1);
    });
}

module.exports = { runDemo, demoSpecificFirmResearch, demoInterAgentCommunication };