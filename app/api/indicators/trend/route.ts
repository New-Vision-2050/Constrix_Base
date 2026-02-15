import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for identity trend distribution
    const trendData = [
      { name: 'مايو', value: 8 },
      { name: 'يونيو', value: 12 },
      { name: 'يوليو', value: 15 },
      { name: 'أغسطس', value: 18 },
      { name: 'سبتمبر', value: 22 },
      { name: 'أكتوبر', value: 25 },
      { name: 'نوفمبر', value: 28 },
      { name: 'ديسمبر', value: 30 },
      { name: 'يناير', value: 32 },
      { name: 'فبراير', value: 28 },
      { name: 'مارس', value: 32 }
    ];

    return NextResponse.json({
      success: true,
      data: trendData
    });
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}
