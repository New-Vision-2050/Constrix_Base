import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to validate if an email is available
 * This is a mock implementation for demonstration purposes
 */
export async function GET(request: NextRequest) {
  // Get the email from the query parameters
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock validation logic
  // In a real application, this would check against a database
  const takenEmails = [
    'admin@example.com',
    'user@example.com',
    'test@example.com',
    'info@example.com',
    'support@example.com'
  ];
  
  const isAvailable = !takenEmails.includes(email.toLowerCase());

  // Return the validation result
  return NextResponse.json({
    available: isAvailable,
    message: isAvailable ? 'Email is available' : 'Email is already registered'
  });
}