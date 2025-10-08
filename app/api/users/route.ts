import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration purposes
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Viewer' },
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '10');
    const sortColumn = searchParams.get('sortColumn');
    const sortDirection = searchParams.get('sortDirection');
    const searchQuery = searchParams.get('q') || '';

    // Filter data based on search query
    let filteredData = [...mockUsers];
    if (searchQuery) {
      filteredData = mockUsers.filter(user => 
        Object.values(user).some(value => 
          value != null && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort data if sort parameters are provided
    if (sortColumn && sortDirection) {
      filteredData.sort((a, b) => {
        const aValue = a[sortColumn as keyof typeof a];
        const bValue = b[sortColumn as keyof typeof b];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Calculate pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Return the response
    return NextResponse.json({
      data: paginatedData,
      meta: {
        total: filteredData.length,
        page,
        itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage)
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching data.' },
      { status: 500 }
    );
  }
}