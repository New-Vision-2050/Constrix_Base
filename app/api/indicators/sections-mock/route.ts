import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock sections data with real Arabic terms
    const sectionsData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        departments: {
          chart_type: "departments",
          total: 8,
          data: [
            { department_id: "1", label: "الموارد البشرية", count: 45, percentage: 56.25 },
            { department_id: "2", label: "التقنية", count: 20, percentage: 25.0 },
            { department_id: "3", label: "المالية", count: 8, percentage: 10.0 },
            { department_id: "4", label: "التسويق", count: 4, percentage: 5.0 },
            { department_id: "5", label: "المبيعات", count: 3, percentage: 3.75 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 0, percentage: 0 }
        },
        branches: {
          chart_type: "branches",
          total: 5,
          data: [
            { branch_id: "1", label: "الرياض", count: 30, percentage: 60.0 },
            { branch_id: "2", label: "جدة", count: 15, percentage: 30.0 },
            { branch_id: "3", label: "الدمام", count: 5, percentage: 10.0 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 0, percentage: 0 }
        }
      }
    };

    return NextResponse.json(sectionsData);
  } catch (error) {
    console.error('Error fetching sections mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections mock data' },
      { status: 500 }
    );
  }
}
