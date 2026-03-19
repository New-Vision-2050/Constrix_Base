import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get("locale") || "ar";
  
  // Delete the invalid token
  cookieStore.delete("new-vision-token");
  
  // Redirect to login page
  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}
