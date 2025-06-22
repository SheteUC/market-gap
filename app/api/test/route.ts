/**
 * API Route: Test MarketGap AI Integration
 * 
 * This endpoint tests the integration between Next.js and Letta agents
 * without triggering long-running operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '../../../src/utils/agentManager';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 API Test: Checking MarketGap AI system...');

    // Check if agents are already initialized
    const isInitialized = agentManager.isInitialized();
    
    if (!isInitialized) {
      console.log('🚀 Initializing agents for first time...');
      const agentIds = await agentManager.initializeAllAgents();
      
      return NextResponse.json({
        success: true,
        message: 'MarketGap AI system initialized successfully',
        data: {
          initialized: true,
          agentIds,
          timestamp: new Date().toISOString(),
        }
      });
    } else {
      const agentIds = agentManager.getAgentIds();
      
      return NextResponse.json({
        success: true,
        message: 'MarketGap AI system is ready',
        data: {
          initialized: true,
          agentIds,
          agentCount: Object.keys(agentIds).length,
          timestamp: new Date().toISOString(),
        }
      });
    }

  } catch (error) {
    console.error('❌ API Test Error:', error);

    let errorMessage = 'System test failed';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('token') || error.message.includes('API key')) {
        statusCode = 401;
        errorMessage = 'Invalid Letta API key configuration';
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        statusCode = 402;
        errorMessage = 'Letta API quota exceeded';
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message is required',
      }, { status: 400 });
    }

    console.log(`💬 API Test: Sending message to Market Research Agent...`);

    // Ensure agents are initialized
    if (!agentManager.isInitialized()) {
      console.log('🚀 Auto-initializing agents...');
      await agentManager.initializeAllAgents();
    }

    // Send a simple message to the market research agent
    const response = await agentManager.marketResearch.sendMessage(
      `${message} (Please keep your response brief and do not start any PDF crawling.)`
    );

    // Extract the assistant response
    let agentResponse = 'No response received';
    for (const msg of response.messages) {
      if (msg.messageType === 'assistant_message') {
        const content = msg.content;
        if (typeof content === 'string') {
          agentResponse = content;
        } else if (Array.isArray(content)) {
          agentResponse = content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join(' ');
        }
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        userMessage: message,
        agentResponse,
        messageCount: response.messages.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('❌ API Test Message Error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Message test failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 