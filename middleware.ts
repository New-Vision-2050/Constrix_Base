import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const nvToken = req.cookies.get("new-vision-token")?.value;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = /^\/([a-z]{2}\/)?login$/.test(pathname);

  if (!nvToken && !isLoginPage) {
    return NextResponse.redirect(new URL("ar/login", req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
