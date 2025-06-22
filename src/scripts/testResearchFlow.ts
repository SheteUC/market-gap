/**
 * Test Research Flow Script
 * 
 * This script tests the complete research flow:
 * 1. Initialize agents
 * 2. Start PDF crawling
 * 3. Monitor progress
 * 4. View research output
 * 
 * To run: npx ts-node src/scripts/testResearchFlow.ts
 */

import { agentManager } from '../utils/agentManager';

async function testResearchFlow() {
  console.log('🧪 Testing Research Flow');
  console.log('========================\n');

  try {
    // Step 1: Initialize Agents
    console.log('Step 1: Initialize Agents');
    console.log('-------------------------');
    const agentIds = await agentManager.initializeAllAgents();
    console.log('✅ Agents initialized:', agentIds);
    console.log('');

    // Step 2: Start PDF Crawling
    console.log('Step 2: Start PDF Crawling');
    console.log('---------------------------');
    const firmNames = ['McKinsey & Company', 'Deloitte'];
    console.log(`📄 Starting PDF crawl for: ${firmNames.join(', ')}`);
    
    await agentManager.marketResearch.crawlPDFs(firmNames);
    console.log('✅ PDF crawling started');
    console.log('');

    // Step 3: Wait and Monitor Progress
    console.log('Step 3: Monitor Progress');
    console.log('------------------------');
    console.log('⏳ Waiting 15 seconds for processing...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Step 4: Get Research Status
    console.log('Step 4: Get Research Status');
    console.log('---------------------------');
    try {
      const status = await agentManager.marketResearch.getCrawlingStatus();
      console.log('📊 Crawling Status:', status);
    } catch (error) {
      console.warn('⚠️ Could not get status:', error instanceof Error ? error.message : 'Unknown error');
    }
    console.log('');

    // Step 5: Get Research Chunks
    console.log('Step 5: Get Research Chunks');
    console.log('---------------------------');
    try {
      const chunks = await agentManager.marketResearch.getPDFChunks();
      console.log('📄 Research Chunks:');
      console.log('-------------------');
      console.log(chunks.substring(0, 500) + (chunks.length > 500 ? '...' : ''));
    } catch (error) {
      console.warn('⚠️ Could not get chunks:', error instanceof Error ? error.message : 'Unknown error');
    }
    console.log('');

    // Step 6: Get Research Summary
    console.log('Step 6: Get Research Summary');
    console.log('----------------------------');
    try {
      const summary = await agentManager.marketResearch.getResearchSummary();
      console.log('📋 Research Summary:');
      console.log('--------------------');
      console.log(summary);
    } catch (error) {
      console.warn('⚠️ Could not get summary:', error instanceof Error ? error.message : 'Unknown error');
    }
    console.log('');

    // Step 7: Get Memory State
    console.log('Step 7: Get Memory State');
    console.log('------------------------');
    try {
      const memory = await agentManager.marketResearch.getMemoryState();
      console.log('🧠 Memory Blocks:');
      console.log('-----------------');
      if (memory && Array.isArray(memory)) {
        memory.forEach((block: any) => {
          console.log(`- ${block.label}: ${block.value?.substring(0, 100)}...`);
        });
      } else {
        console.log(JSON.stringify(memory, null, 2));
      }
    } catch (error) {
      console.warn('⚠️ Could not get memory:', error instanceof Error ? error.message : 'Unknown error');
    }

    console.log('\n✅ Research flow test completed!');
    console.log('\nNext steps:');
    console.log('1. Open the web app: http://localhost:3000');
    console.log('2. Select an industry');
    console.log('3. Choose a consulting group');
    console.log('4. View the research output on the research page');

  } catch (error) {
    console.error('❌ Research flow test failed:', error);
    throw error;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testResearchFlow()
    .then(() => {
      console.log('\n🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testResearchFlow }; 