import { NextRequest, NextResponse } from 'next/server';
import { fetchDestinations } from '@/lib/api/destinations';
import { Category } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || undefined;
    const search = searchParams.get('search') || undefined;
    const category = (searchParams.get('category') as Category) || undefined;
    const sortBy = (searchParams.get('sortBy') as 'rating-desc' | 'name-asc' | 'name-desc') || undefined;

    const destinations = await fetchDestinations({
      city,
      search,
      category,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch destinations',
      },
      { status: 500 }
    );
  }
}
