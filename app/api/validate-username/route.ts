import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to validate if a username is available
 * This is a mock implementation for demonstration purposes
 */
export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const { username } = body;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock validation logic
  // In a real application, this would check against a database
  const takenUsernames = ['admin', 'user', 'test', 'demo', 'system'];
  const isAvailable = !takenUsernames.includes(username.toLowerCase());

  // Return the validation result
  return NextResponse.json({
    available: isAvailable,
    message: isAvailable ? 'Username is available' : 'Username is already taken'
  });
}