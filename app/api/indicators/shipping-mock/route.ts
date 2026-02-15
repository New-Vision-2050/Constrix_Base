import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock shipping data with real Arabic terms
    const shippingData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        shipping: {
          chart_type: "shipping",
          total: 172,
          data: [
            { label: 'منتهي', code: "completed", count: 1, percentage: '1%' },
            { label: 'جاري', code: "ongoing", count: 145, percentage: '84%' },
            { label: 'لا يوجد', code: "none", count: 26, percentage: '15%' }
          ]
        }
      }
    };

    return NextResponse.json(shippingData);
  } catch (error) {
    console.error('Error fetching shipping mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipping mock data' },
      { status: 500 }
    );
  }
}
