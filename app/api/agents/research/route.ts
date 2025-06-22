/**
 * API Route: Market Research Operations (PDF Crawling)
 * 
 * This endpoint handles PDF crawling from consulting firms and retrieving
 * the resulting document chunks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '../../../../src/utils/agentManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firmNames, action } = body;

    if (!firmNames || !Array.isArray(firmNames) || firmNames.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'firmNames array is required',
      }, { status: 400 });
    }

    console.log(`📄 API: Starting PDF crawl for firms: ${firmNames.join(', ')}`);

    let result;

    switch (action) {
      case 'crawl_pdfs':
        // Start PDF crawling for specified firms
        await agentManager.marketResearch.crawlPDFs(firmNames);
        result = {
          message: `PDF crawling started for firms: ${firmNames.join(', ')}`,
          firmNames,
          crawlingStarted: true,
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "crawl_pdfs"',
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ API: Error starting PDF crawl:', error);

    let errorMessage = 'Failed to start PDF crawling';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'chunks';

    console.log(`📄 API: Getting PDF data (type: ${type})`);

    let result;

    switch (type) {
      case 'chunks':
        // Get raw PDF chunks (no analysis)
        const chunks = await agentManager.marketResearch.getPDFChunks();
        result = {
          type: 'chunks',
          chunks,
        };
        break;

      case 'status':
        // Get crawling status
        const status = await agentManager.marketResearch.getCrawlingStatus();
        result = {
          type: 'status',
          status,
        };
        break;

      case 'summary':
        // Get research summary
        const summary = await agentManager.marketResearch.getResearchSummary();
        result = {
          type: 'summary',
          summary,
        };
        break;

      case 'memory':
        // Get agent memory state
        const memory = await agentManager.marketResearch.getMemoryState();
        result = {
          type: 'memory',
          memory,
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type. Use "chunks", "status", "summary", or "memory"',
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ API: Error getting PDF data:', error);

    let errorMessage = 'Failed to get PDF data';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 