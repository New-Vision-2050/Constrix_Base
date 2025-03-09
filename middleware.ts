import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const nvToken = req.cookies.get("new-vision-token")?.value;
  if (!nvToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
