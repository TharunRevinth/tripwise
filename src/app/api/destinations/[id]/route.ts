import { NextRequest, NextResponse } from 'next/server';
import { getDestinationById } from '@/lib/api/destinations';
import { fetchWeather } from '@/lib/api/weather';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const destination = getDestinationById(id);

    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Include real-time weather alongside destination details
    let weather = null;
    if (destination.latitude && destination.longitude) {
      weather = await fetchWeather(destination.latitude, destination.longitude, destination.city);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...destination,
        weather,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
