import { NextRequest, NextResponse } from 'next/server';
import { getItineraryItems, addItineraryItem, clearItinerary } from '@/lib/itineraryStore';

export async function GET() {
  try {
    const items = await getItineraryItems();
    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve itinerary' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.city || !body.placeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, city, and placeId are mandatory.',
        },
        { status: 400 }
      );
    }

    const item = await addItineraryItem({
      placeId: body.placeId,
      name: body.name,
      city: body.city,
      country: body.country || 'Destination',
      category: body.category || 'Landmarks',
      description: body.description || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      latitude: body.latitude,
      longitude: body.longitude,
      dayNumber: Number(body.dayNumber) || 1,
      notes: body.notes || '',
      targetDate: body.targetDate,
      estimatedCost: Number(body.estimatedCost) || 0,
      isVisited: Boolean(body.isVisited),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Destination successfully added to your itinerary.',
        data: item,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create itinerary item' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearItinerary();
    return NextResponse.json({
      success: true,
      message: 'Itinerary successfully cleared.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear itinerary' },
      { status: 500 }
    );
  }
}
