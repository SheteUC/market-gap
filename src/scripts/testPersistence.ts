/**
 * Agent Persistence Test Script
 * 
 * This script tests that agents are properly persisted and reused
 * instead of being recreated on every request.
 */

import { agentManager } from '../utils/agentManager';
import { clearStoredAgentIds } from '../utils/agentPersistence';

async function testAgentPersistence() {
  console.log('🧪 Testing Agent Persistence');
  console.log('============================\n');

  try {
    // Step 1: Clear any existing stored agents
    console.log('Step 1: Clearing stored agents');
    console.log('------------------------------');
    clearStoredAgentIds();
    agentManager.clearStoredAgents();
    console.log('✅ Storage cleared\n');

    // Step 2: First initialization (should create new agents)
    console.log('Step 2: First Initialization (should create new agents)');
    console.log('--------------------------------------------------------');
    const firstIds = await agentManager.initializeAllAgents();
    console.log('✅ First initialization complete');
    console.log('Agent IDs:', firstIds);
    console.log('');

    // Step 3: Second initialization (should reuse existing agents)
    console.log('Step 3: Second Initialization (should reuse existing agents)');
    console.log('------------------------------------------------------------');
    const secondIds = await agentManager.initializeAllAgents();
    console.log('✅ Second initialization complete');
    console.log('Agent IDs:', secondIds);
    console.log('');

    // Step 4: Compare IDs
    console.log('Step 4: Comparing Agent IDs');
    console.log('---------------------------');
    
    const orchestratorMatch = firstIds.orchestrator === secondIds.orchestrator;
    const marketResearchMatch = firstIds.marketResearch === secondIds.marketResearch;
    
    console.log(`Orchestrator IDs match: ${orchestratorMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`  First:  ${firstIds.orchestrator}`);
    console.log(`  Second: ${secondIds.orchestrator}`);
    console.log('');
    
    console.log(`Market Research IDs match: ${marketResearchMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`  First:  ${firstIds.marketResearch}`);
    console.log(`  Second: ${secondIds.marketResearch}`);
    console.log('');

    // Step 5: Test agent communication to ensure they're working
    console.log('Step 5: Testing Agent Communication');
    console.log('----------------------------------');
    
    try {
      const response = await agentManager.marketResearch.sendMessage(
        'Please confirm you are working by introducing yourself briefly.'
      );
      
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
                     const content = typeof message.content === 'string' 
             ? message.content 
             : Array.isArray(message.content) 
               ? message.content.filter((item: any) => item.type === 'text').map((item: any) => item.text).join(' ')
               : 'No content';
          console.log('🤖 Agent Response:', content.substring(0, 150) + '...');
          break;
        }
      }
      console.log('✅ Agent communication successful\n');
      
    } catch (error) {
      console.log('❌ Agent communication failed:', error instanceof Error ? error.message : 'Unknown error');
      console.log('');
    }

    // Step 6: Results
    console.log('Step 6: Test Results');
    console.log('-------------------');
    
    if (orchestratorMatch && marketResearchMatch) {
      console.log('🎉 SUCCESS: Agent persistence is working correctly!');
      console.log('   Agents are being reused instead of recreated.');
    } else {
      console.log('❌ FAILURE: Agent persistence is not working.');
      console.log('   New agents are being created on every initialization.');
    }

    return { 
      success: orchestratorMatch && marketResearchMatch,
      firstIds, 
      secondIds 
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAgentPersistence()
    .then((result) => {
      console.log('\n🎯 Test completed');
      console.log('Result:', result.success ? 'PASS' : 'FAIL');
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testAgentPersistence }; 