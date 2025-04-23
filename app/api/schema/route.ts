import { NextResponse } from 'next/server';
import { apiClient } from '@/config/axios-config';

export async function GET() {
  try {
    // Fetch schema from Laravel backend
    const response = await apiClient.get('/api/schema');
    
    if (!response.data) {
      throw new Error('No data received from schema endpoint');
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching schema:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schema' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableName } = body;

    if (!tableName) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }

    // Fetch specific table schema from Laravel
    const response = await apiClient.get(`/api/schema/${tableName}`);
    
    if (!response.data) {
      throw new Error('No data received from schema endpoint');
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching table schema:', error);
    return NextResponse.json(
      { error: 'Failed to fetch table schema' },
      { status: 500 }
    );
  }
}