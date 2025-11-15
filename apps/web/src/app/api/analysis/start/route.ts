import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Forward to NestJS API
    const response = await fetch(`${API_URL}/scraper/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to start analysis' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return analysis ID
    return NextResponse.json({
      success: true,
      analysisId: data.id || crypto.randomUUID(), // Fallback for MVP
      ...data,
    });
  } catch (error) {
    console.error('Analysis start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
