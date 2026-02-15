import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for release classification
    const classificationData = [
      { name: 'Brand', value: 45 },
      { name: 'New', value: 110 }
    ];

    return NextResponse.json({
      success: true,
      data: classificationData
    });
  } catch (error) {
    console.error('Error fetching classification data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classification data' },
      { status: 500 }
    );
  }
}
