import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock employees data with real Arabic terms
    const employeesData = {
      code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
      message: null,
      payload: {
        gender: {
          chart_type: "gender",
          total: 150,
          data: [
            { label: "ذكر", code: "male", count: 90, percentage: 60.0 },
            { label: "انثي", code: "female", count: 50, percentage: 33.33 },
            { label: "غير محدد", code: "unspecified", count: 10, percentage: 6.67 }
          ]
        },
        age: {
          chart_type: "age",
          total: 150,
          data: [
            { label: "20-29", code: "20-29", count: 35, percentage: 23.33 },
            { label: "30-39", code: "30-39", count: 45, percentage: 30.0 },
            { label: "40-49", code: "40-49", count: 30, percentage: 20.0 },
            { label: "50-59", code: "50-59", count: 15, percentage: 10.0 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 25, percentage: 16.67 }
        },
        job_type: {
          chart_type: "job_type",
          total: 150,
          data: [
            { job_type_id: "uuid-1", label: "دوام كامل", count: 80, percentage: 53.33 },
            { job_type_id: "uuid-2", label: "دوام جزئي", count: 40, percentage: 26.67 },
            { job_type_id: "uuid-3", label: "عن بعد", count: 20, percentage: 13.33 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 10, percentage: 6.67 }
        },
        visa_status: {
          chart_type: "visa_status",
          total: 150,
          data: [
            { visa_status_id: "uuid-1", label: "زيارة عمل", count: 45, percentage: 30.0 },
            { visa_status_id: "uuid-2", label: "إقامة عمل", count: 60, percentage: 40.0 },
            { visa_status_id: "uuid-3", label: "إقامة عائلية", count: 30, percentage: 20.0 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 15, percentage: 10.0 }
        },
        contract_status: {
          chart_type: "contract_status",
          total: 150,
          data: [
            { contract_status_id: "uuid-1", label: "ساري", count: 120, percentage: 80.0 },
            { contract_status_id: "uuid-2", label: "منتهي", count: 20, percentage: 13.33 },
            { contract_status_id: "uuid-3", label: "تجديد", count: 10, percentage: 6.67 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 0, percentage: 0.0 }
        },
        nationality: {
          chart_type: "nationality",
          total: 150,
          data: [
            { nationality_id: "uuid-1", label: "سعودي", count: 75, percentage: 50.0 },
            { nationality_id: "uuid-2", label: "مصري", count: 30, percentage: 20.0 },
            { nationality_id: "uuid-3", label: "سوري", count: 15, percentage: 10.0 },
            { nationality_id: "uuid-4", label: "أردني", count: 10, percentage: 6.67 },
            { nationality_id: "uuid-5", label: "بنغالي", count: 8, percentage: 5.33 },
            { nationality_id: "uuid-6", label: "هندي", count: 7, percentage: 4.67 },
            { nationality_id: "uuid-7", label: "فلبيني", count: 5, percentage: 3.33 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 0, percentage: 0.0 }
        },
        marital_status: {
          chart_type: "marital_status",
          total: 150,
          data: [
            { marital_status_id: "uuid-1", label: "أعزب", count: 60, percentage: 40.0 },
            { marital_status_id: "uuid-2", label: "متزوج", count: 70, percentage: 46.67 },
            { marital_status_id: "uuid-3", label: "مطلق", count: 10, percentage: 6.67 },
            { marital_status_id: "uuid-4", label: "أرمل", count: 5, percentage: 3.33 },
            { marital_status_id: "uuid-5", label: "منفصل", count: 5, percentage: 3.33 }
          ],
          unspecified: { label: "غير محدد", code: "unspecified", count: 0, percentage: 0.0 }
        }
      }
    };

    return NextResponse.json(employeesData);
  } catch (error) {
    console.error('Error fetching employees mock data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees mock data' },
      { status: 500 }
    );
  }
}
