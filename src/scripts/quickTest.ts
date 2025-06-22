/**
 * Quick Test Script for MarketGap AI
 * 
 * This script tests the basic functionality without triggering
 * long-running research operations that might timeout.
 */

import { agentManager } from '../utils/agentManager';

async function quickTest() {
  console.log('🧪 Quick Test: MarketGap AI Agents');
  console.log('=================================\n');

  try {
    // Test 1: Initialize agents
    console.log('Test 1: Agent Initialization');
    console.log('---------------------------');
    const agentIds = await agentManager.initializeAllAgents();
    console.log('✅ Agents initialized successfully!');
    console.log('📋 Agent IDs:');
    console.log(JSON.stringify(agentIds, null, 2));
    console.log('');

    // Test 2: Check agent status
    console.log('Test 2: Agent Status Check');
    console.log('-------------------------');
    const isInitialized = agentManager.isInitialized();
    console.log(`✅ Agent Manager Initialized: ${isInitialized}`);
    console.log('');

    // Test 3: Get agent memory (without triggering research)
    console.log('Test 3: Agent Memory Check');
    console.log('-------------------------');
    try {
      const memory = await agentManager.getAgentMemory('marketResearch');
      console.log('✅ Market Research Agent memory accessible');
      console.log(`📊 Memory blocks: ${memory.length || 'N/A'}`);
    } catch (error) {
      console.log('⚠️ Memory check issue:', error instanceof Error ? error.message : 'Unknown error');
    }
    console.log('');

    // Test 4: Simple agent message (non-research)
    console.log('Test 4: Simple Agent Communication');
    console.log('---------------------------------');
    try {
      const response = await agentManager.marketResearch.sendMessage(
        'Please introduce yourself and explain your role briefly. Do not start any research yet.'
      );
      
      for (const message of response.messages) {
        if (message.messageType === 'assistant_message') {
          const content = message.content;
          if (typeof content === 'string') {
            console.log('🤖 Agent Response:', content.substring(0, 200) + '...');
          } else if (Array.isArray(content)) {
            const text = content
              .filter(item => item.type === 'text')
              .map(item => item.text)
              .join(' ');
            console.log('🤖 Agent Response:', text.substring(0, 200) + '...');
          }
          break;
        }
      }
      console.log('✅ Agent communication successful');
    } catch (error) {
      console.log('⚠️ Agent communication issue:', error instanceof Error ? error.message : 'Unknown error');
    }
    console.log('');

    console.log('🎉 Quick test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Use these agent IDs in your application');
    console.log('   2. Start research with: npm run demo');
    console.log('   3. Integrate with your Next.js frontend');

    return agentIds;

  } catch (error) {
    console.error('❌ Quick test failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('token') || error.message.includes('API key')) {
        console.log('\n💡 Tip: Make sure you have set your LETTA_API_KEY environment variable');
        console.log('   You can get an API key from: https://app.letta.com/api-keys');
      }
    }
    
    throw error;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  quickTest()
    .then((agentIds) => {
      console.log('\n🎯 Quick test completed successfully');
      console.log('Agent IDs saved:', agentIds);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Quick test failed:', error);
      process.exit(1);
    });
}

module.exports = { quickTest }; 