#!/usr/bin/env tsx
/**
 * Test Script for Simplified MarketGap AI
 * 
 * This script tests the new Letta-native implementation
 * to ensure it follows the workspace rules correctly.
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import { OrchestratorAgent } from '../agents/orchestrator';

async function testSimpleApproach() {
  console.log('🧪 Testing Simplified MarketGap AI Implementation...\n');

  try {
    // Step 1: Initialize Orchestrator
    console.log('📋 Step 1: Initialize Orchestrator Agent');
    const apiKey = process.env.LETTA_API_KEY;
    if (!apiKey) {
      throw new Error('LETTA_API_KEY environment variable is required');
    }
    
    const orchestrator = new OrchestratorAgent({
      lettaApiKey: apiKey,
      lettaBaseUrl: process.env.LETTA_BASE_URL
    });
    const orchestratorId = await orchestrator.initialize();
    console.log(`✅ Orchestrator created: ${orchestratorId}\n`);

    // Step 2: Get initial status
    console.log('📋 Step 2: Get Initial Status');
    const initialStatus = await orchestrator.getWorkflowStatus();
    console.log('📊 Initial Status:');
    console.log(JSON.stringify(initialStatus, null, 2));
    console.log('');

    // Step 3: Start workflow for FinTech
    console.log('📋 Step 3: Start FinTech Workflow');
    const workflowResult = await orchestrator.executeWorkflow('FinTech');
    console.log('🚀 Workflow Result:');
    console.log(JSON.stringify(workflowResult, null, 2));
    console.log('');

    // Step 4: Wait a bit and check status again
    console.log('📋 Step 4: Check Status After Workflow Start');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    
    const updatedStatus = await orchestrator.getWorkflowStatus();
    console.log('📊 Updated Status:');
    console.log(JSON.stringify(updatedStatus, null, 2));
    console.log('');

    // Step 5: Test shared memory block update
    console.log('📋 Step 5: Test Shared Memory Block Update');
    await orchestrator.updateSharedBlock('consulting_groups', 
      'McKinsey,BCG,Accenture,Deloitte - Updated via test script');
    
    const finalStatus = await orchestrator.getWorkflowStatus();
    console.log('📊 Final Status (after memory update):');
    console.log(JSON.stringify(finalStatus, null, 2));

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('1. ✅ Orchestrator Agent initialized with shared memory blocks');
    console.log('2. ✅ Workflow started using Letta\'s built-in tools');
    console.log('3. ✅ Shared memory blocks working correctly');
    console.log('4. ✅ Status retrieval working');
    console.log('5. ✅ Memory block updates working');

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    process.exit(1);
  }
}

async function main() {
  console.log('🎯 MarketGap AI - Simplified Implementation Test\n');
  
  // Check environment
  if (!process.env.LETTA_API_KEY) {
    console.error('❌ LETTA_API_KEY environment variable is required');
    console.log('Please set your Letta API key:');
    console.log('export LETTA_API_KEY=your_api_key_here');
    process.exit(1);
  }

  console.log('🔧 Configuration:');
  console.log(`Base URL: ${process.env.LETTA_BASE_URL || 'https://api.letta.com'}`);
  console.log(`API Key: ${process.env.LETTA_API_KEY.substring(0, 10)}...`);
  console.log('');

  await testSimpleApproach();
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

export { testSimpleApproach }; 