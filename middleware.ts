import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

// Create the middleware with next-intl
export default createMiddleware({
  // A list of all locales that are supported
  locales: routing.locales,
  // Used when no locale matches
  defaultLocale: routing.defaultLocale,
  // Locale prefix strategy
  localePrefix: routing.localePrefix
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)']
};