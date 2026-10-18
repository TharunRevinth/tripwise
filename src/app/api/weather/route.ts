import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/api/weather';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const city = searchParams.get('city') || 'Destination';

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { success: false, error: 'Query parameters "lat" and "lon" are required.' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude or longitude values.' },
        { status: 400 }
      );
    }

    const weather = await fetchWeather(lat, lon, city);
    return NextResponse.json({ success: true, data: weather });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Weather lookup failed' },
      { status: 500 }
    );
  }
}
