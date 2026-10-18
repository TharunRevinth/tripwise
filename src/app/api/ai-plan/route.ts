import { NextRequest, NextResponse } from 'next/server';
import { generateAITripPlan } from '@/lib/api/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const city = body.city || 'Chennai';
    const days = Math.min(Math.max(Number(body.days) || 3, 1), 7);
    const theme = body.theme || 'Cultural & Highlights';
    const pace = body.pace || 'moderate';

    const plan = await generateAITripPlan({
      city,
      days,
      theme,
      pace,
    });

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI itinerary generation failed',
      },
      { status: 500 }
    );
  }
}
