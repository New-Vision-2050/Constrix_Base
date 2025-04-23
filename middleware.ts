import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { apiClient } from "./config/axios-config";
import { endPoints } from "./modules/auth/constant/end-points";

const intlMiddleware = createMiddleware(routing);

const protectedCentralPages = ["/companies", "/users"];

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const existingCompanyCookie = req.cookies.get("company-data")?.value;

  const nvToken = req.cookies.get("new-vision-token")?.value;
  const pathname = req.nextUrl.pathname;

  const isLoginPage = /^\/([a-z]{2}\/)?login$/.test(pathname);

  if (!nvToken && !isLoginPage) {
    return NextResponse.redirect(new URL("ar/login", req.url));
  }

  const res = intlMiddleware(req);

  if ((!existingCompanyCookie && host) || isLoginPage) {
    try {
      const response = await apiClient.get(endPoints.getCompanyByHost, {
        headers: {
          "X-Domain": host,
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
      }

      if (
        !!company?.payload.is_central_company &&
        protectedCentralPages.includes(pathname)
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.log(" Company fetch error:", error);
    }
  }

  if (!!existingCompanyCookie) {
    const company = existingCompanyCookie
      ? JSON.parse(existingCompanyCookie)
      : null;

    const isCentral = !!company?.is_central_company;

    if (!isCentral && protectedCentralPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
