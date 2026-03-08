import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { apiClient } from "./config/axios-config";
import { endPoints } from "./modules/auth/constant/end-points";
import { getCurrentHost } from "./utils/get-current-host";

const intlMiddleware = createMiddleware(routing);

const protectedCentralPages = ["/companies", "/users"];

export async function middleware(req: NextRequest) {
  const existingCompanyCookie = req.cookies.get("company-data")?.value;

  const nvToken = req.cookies.get("new-vision-token")?.value;
  const pathname = req.nextUrl.pathname;
  const currentHost = await getCurrentHost();
  const isLoginPage = /^\/([a-z]{2}\/)?login$/.test(pathname);

  // Debug logging for shared-file routes
  if (pathname.includes("shared-file")) {
    return NextResponse.next();
  }

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "ar";

  // Strip locale from pathname for comparisons
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "") || "/";
  const isRootRoute = pathnameWithoutLocale === "/";

  // Handle root route redirects based on authentication
  if (isRootRoute) {
    if (nvToken) {
      // User is logged in, redirect to user-profile
      return NextResponse.redirect(new URL(`/${locale}/user-profile`, req.url));
    } else {
      // User is not logged in, redirect to login
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  // If user is not logged in and trying to access protected route, redirect to login
  if (!nvToken && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // If user is logged in and trying to access login page, redirect to user-profile
  if (nvToken && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/user-profile`, req.url));
  }

  const res = intlMiddleware(req);

  if ((!existingCompanyCookie && currentHost) || isLoginPage) {
    try {
      const response = await apiClient.get(endPoints.getCompanyByHost, {
        headers: {
          "X-Domain": currentHost,
        },
      });

      const company = response.data;

      if (company) {
        const cookieValue = JSON.stringify({
          ...company?.payload,
        });

        res.cookies.set("company-data", cookieValue, {
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      } else {
        res.cookies.delete("company-data");
      }

      if (
        !!company?.payload.is_central_company &&
        protectedCentralPages.includes(pathnameWithoutLocale)
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/user-profile`, req.url)
        );
      }
    } catch (error) {
      res.cookies.delete("company-data");
      console.log(" Company fetch error:", error);
    }
  }

  if (!!existingCompanyCookie && !isLoginPage) {
    const company = existingCompanyCookie
      ? JSON.parse(existingCompanyCookie)
      : null;

    const isCentral = !!company?.is_central_company;

    if (!isCentral && protectedCentralPages.includes(pathnameWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${locale}/user-profile`, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
