import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock trend data with real Arabic month names
    const trendData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        trend: {
          chart_type: "trend",
          total: 11,
          data: [
            { label: 'مايو', code: "may", count: 8, percentage: 7.27 },
            { label: 'يونيو', code: "june", count: 12, percentage: 10.91 },
            { label: 'يوليو', code: "july", count: 15, percentage: 13.64 },
            { label: 'أغسطس', code: "august", count: 18, percentage: 16.36 },
            { label: 'سبتمبر', code: "september", count: 22, percentage: 20.0 },
            { label: 'أكتوبر', code: "october", count: 25, percentage: 22.73 },
            { label: 'نوفمبر', code: "november", count: 28, percentage: 25.45 },
            { label: 'ديسمبر', code: "december", count: 30, percentage: 27.27 },
            { label: 'يناير', code: "january", count: 32, percentage: 29.09 },
            { label: 'فبراير', code: "february", count: 28, percentage: 25.45 },
            { label: 'مارس', code: "march", count: 32, percentage: 29.09 }
          ]
        }
      }
    };

    return NextResponse.json(trendData);
  } catch (error) {
    console.error('Error fetching trend mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trend mock data' },
      { status: 500 }
    );
  }
}
