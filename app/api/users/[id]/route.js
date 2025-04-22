import { NextResponse } from 'next/server';

// Mock user data
const users = {
  '123': {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior software developer with 8 years of experience in web development.',
    role: 'admin',
  },
  '456': {
    id: '456',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    bio: 'Product manager with a background in UX design.',
    role: 'manager',
  },
};

export function GET(request, { params }) {
  const id = params.id;

  // Check if user exists
  if (!users[id]) {
    // For ID 999, simulate a server error to test error handling
    if (id === '999') {
      return NextResponse.json(
        { error: 'Server error occurred while fetching user data' },
        { status: 500 }
      );
    }
    
    // For other non-existent IDs, return 404
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Return user data
  return NextResponse.json({
    success: true,
    data: users[id],
  });
}