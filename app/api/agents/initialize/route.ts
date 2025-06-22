/**
 * API Route: Initialize MarketGap AI Agents
 * 
 * This endpoint initializes all Letta agents for the MarketGap AI system
 * and returns their IDs for frontend use.
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '../../../../src/utils/agentManager';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Initializing MarketGap AI agents...');

    // Initialize all agents
    const agentIds = await agentManager.initializeAllAgents();

    console.log('✅ API: Agents initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'All agents initialized successfully',
      data: {
        agentIds,
        totalAgents: Object.keys(agentIds).length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('❌ API: Error initializing agents:', error);

    // Handle specific error types
    let errorMessage = 'Failed to initialize agents';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('token') || error.message.includes('API key')) {
        statusCode = 401;
        errorMessage = 'Invalid Letta API key. Please check your configuration.';
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        statusCode = 402;
        errorMessage = 'Letta API quota exceeded. Please check your billing status.';
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        statusCode = 503;
        errorMessage = 'Unable to connect to Letta service. Please try again later.';
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if agents are already initialized
    const isInitialized = agentManager.isInitialized();
    const agentIds = agentManager.getAgentIds();

    return NextResponse.json({
      success: true,
      data: {
        isInitialized,
        agentIds,
        agentCount: Object.keys(agentIds).length,
      }
    });

  } catch (error) {
    console.error('❌ API: Error checking agent status:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to check agent status',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 