/**
 * Simplified Workflow API Route
 * 
 * This replaces all the complex agent management with a single
 * Letta-native orchestrator that follows the workspace rules exactly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { OrchestratorAgent } from '../../../src/agents/orchestrator';
import { MarketResearchAgent } from '../../../src/agents/marketResearch';

// Global orchestrator instance
let orchestrator: OrchestratorAgent | null = null;

async function getOrchestrator(): Promise<OrchestratorAgent> {
  if (!orchestrator) {
    const apiKey = process.env.LETTA_API_KEY;
    if (!apiKey) {
      throw new Error('LETTA_API_KEY environment variable is required');
    }
    
    orchestrator = new OrchestratorAgent({
      lettaApiKey: apiKey,
      lettaBaseUrl: process.env.LETTA_BASE_URL
    });
  }
  return orchestrator;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, industry } = body;

    console.log(`🚀 API: ${action} for industry: ${industry}`);

    const orch = await getOrchestrator();

    switch (action) {
      case 'initialize':
        const orchestratorId = await orch.initialize();
        return NextResponse.json({
          success: true,
          data: {
            message: 'Simple Orchestrator initialized',
            orchestratorId,
            architecture: 'letta-native-manager-worker'
          }
        });

      case 'start_workflow':
        if (!industry) {
          return NextResponse.json({
            success: false,
            error: 'Industry is required for workflow'
          }, { status: 400 });
        }

        const workflowResult = await orch.executeWorkflow(industry);
        return NextResponse.json({
          success: true,
          data: {
            message: `Workflow started for ${industry}`,
            ...workflowResult
          }
        });

      case 'status':
        const status = await orch.getWorkflowStatus();
        return NextResponse.json({
          success: true,
          data: status
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'status';

    const orch = await getOrchestrator();

    switch (action) {
      case 'status':
        const status = await orch.getWorkflowStatus();
        return NextResponse.json({
          success: true,
          data: status
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 