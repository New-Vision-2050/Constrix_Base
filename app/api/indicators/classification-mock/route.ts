import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock classification data with real Arabic terms
    const classificationData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        classification: {
          chart_type: "classification",
          total: 155,
          data: [
            { label: "السعودية", code: "brand", count: 45, percentage: 29.03 },
            { label: "الغير سعودية", code: "new", count: 110, percentage: 70.97 }
          ]
        }
      }
    };

    return NextResponse.json(classificationData);
  } catch (error) {
    console.error('Error fetching classification mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classification mock data' },
      { status: 500 }
    );
  }
}
