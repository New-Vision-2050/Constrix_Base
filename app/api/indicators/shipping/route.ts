import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for shipping cases
    const shippingData = [
      { name: 'منتهي', value: 1, percentage: '1%' },
      { name: 'جاري', value: 145, percentage: '84%' },
      { name: 'لا يوجد', value: 26, percentage: '15%' },
    ];

    return NextResponse.json({
      success: true,
      data: shippingData
    });
  } catch (error) {
    console.error('Error fetching shipping data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipping data' },
      { status: 500 }
    );
  }
}
