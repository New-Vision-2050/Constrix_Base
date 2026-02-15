import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for guarantor cases
    const guarantorData = [
      { name: 'منتهي', value: 1, percentage: '1%' },
      { name: 'جاري', value: 145, percentage: '84%' },
      { name: 'لا يوجد', value: 26, percentage: '15%' },
    ];

    return NextResponse.json({
      success: true,
      data: guarantorData
    });
  } catch (error) {
    console.error('Error fetching guarantor data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guarantor data' },
      { status: 500 }
    );
  }
}
