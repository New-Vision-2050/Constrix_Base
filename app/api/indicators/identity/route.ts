import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for identity cases
    const identityData = [
      { name: 'منتهي', value: 1, percentage: '1%' },
      { name: 'جاري', value: 145, percentage: '84%' },
      { name: 'لا يوجد', value: 26, percentage: '15%' },
    ];

    return NextResponse.json({
      success: true,
      data: identityData
    });
  } catch (error) {
    console.error('Error fetching identity data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch identity data' },
      { status: 500 }
    );
  }
}
