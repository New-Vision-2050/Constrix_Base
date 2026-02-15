import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for sections pie chart
    const sectionsData = [
      { value: 41, label: "figma", color: '#6FD195', labelMarkType: "circle" },
      { value: 80, label: "figma", color: '#7086FD', labelMarkType: "diamond" },
    ];

    return NextResponse.json({
      success: true,
      data: sectionsData,
      total: 121
    });
  } catch (error) {
    console.error('Error fetching sections data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections data' },
      { status: 500 }
    );
  }
}
