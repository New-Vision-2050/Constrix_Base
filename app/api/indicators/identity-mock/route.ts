import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock identity data with real Arabic terms
    const identityData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        identity: {
          chart_type: "identity",
          total: 172,
          data: [
            { label: 'منتهي', code: "completed", count: 1, percentage: '1%' },
            { label: 'جاري', code: "ongoing", count: 145, percentage: '84%' },
            { label: 'لا يوجد', code: "none", count: 26, percentage: '15%' }
          ]
        }
      }
    };

    return NextResponse.json(identityData);
  } catch (error) {
    console.error('Error fetching identity mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch identity mock data' },
      { status: 500 }
    );
  }
}
