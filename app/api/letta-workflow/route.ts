/**
 * Letta Workflow API Route (replaces /api/simple-workflow)
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrchestratorAgent } from '../../../src/agents/orchestrator';

let orchestratorAgent: OrchestratorAgent | null = null;

export async function POST(request: NextRequest) {
  try {
    const { action, industry } = await request.json();

    if (!process.env.LETTA_API_KEY) {
      return NextResponse.json(
        { error: 'LETTA_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    // Initialise orchestrator once
    if (!orchestratorAgent) {
      console.log('🎯 Creating new Orchestrator Agent...');
      orchestratorAgent = new OrchestratorAgent({
        lettaApiKey: process.env.LETTA_API_KEY,
        lettaBaseUrl: process.env.LETTA_BASE_URL,
      });
      await orchestratorAgent.initialize();
    }

    switch (action) {
      case 'start':
        console.log(`🚀 Starting workflow for ${industry}`);
        const workflowResult = await orchestratorAgent.executeWorkflow(industry);
        return NextResponse.json({
          success: true,
          message: 'Workflow started successfully',
          result: workflowResult,
          agentId: orchestratorAgent.getAgentId(),
        });

      case 'status':
        console.log('📊 Getting workflow status...');
        const status = await orchestratorAgent.getWorkflowStatus();
        return NextResponse.json({ success: true, status });

      case 'research-progress':
        console.log('📈 Checking research progress...');
        const progress = await orchestratorAgent.checkResearchProgress();
        return NextResponse.json({ success: true, progress });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      if (!orchestratorAgent) {
        return NextResponse.json({ success: false, message: 'No active workflow' });
      }
      const status = await orchestratorAgent.getWorkflowStatus();
      return NextResponse.json({ success: true, status, hasOrchestrator: !!orchestratorAgent });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('❌ GET API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
} 