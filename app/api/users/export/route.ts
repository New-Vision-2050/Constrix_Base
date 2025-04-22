import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration purposes
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Viewer' },
];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { ids, format } = body;

    if (!ids || !Array.isArray(ids) || !format) {
      return NextResponse.json(
        { error: 'Invalid request. Expected ids array and format.' },
        { status: 400 }
      );
    }

    // Filter the mock data based on the selected IDs
    const selectedUsers = mockUsers.filter(user => 
      ids.includes(user.id.toString())
    );

    // Generate the export file based on the format
    let fileContent: string;
    let contentType: string;
    let filename: string;

    if (format === 'csv') {
      // Generate CSV content
      const headers = Object.keys(mockUsers[0]).join(',');
      const rows = selectedUsers.map(user => 
        Object.values(user).join(',')
      ).join('\n');
      fileContent = `${headers}\n${rows}`;
      contentType = 'text/csv';
      filename = 'users_export.csv';
    } else if (format === 'json') {
      // Generate JSON content
      fileContent = JSON.stringify(selectedUsers, null, 2);
      contentType = 'application/json';
      filename = 'users_export.json';
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Expected "csv" or "json".' },
        { status: 400 }
      );
    }

    // Create the response with the appropriate headers
    const response = new NextResponse(fileContent);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return response;
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'An error occurred during export.' },
      { status: 500 }
    );
  }
}