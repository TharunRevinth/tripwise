import { NextRequest, NextResponse } from 'next/server';
import { updateItineraryItem, deleteItineraryItem } from '@/lib/itineraryStore';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateItineraryItem(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Itinerary item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Itinerary item updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update itinerary item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteItineraryItem(id);

    return NextResponse.json({
      success,
      message: 'Itinerary item successfully removed.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete itinerary item' },
      { status: 500 }
    );
  }
}
