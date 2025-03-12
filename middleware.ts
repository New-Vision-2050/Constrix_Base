import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { setZodLocale } from './utils/zodTranslations';

let locales = ['en', 'ar'];
let defaultLocale = 'ar';

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = match(languages, locales, defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Extract the locale from the pathname
    const locale = pathname.split('/')[1] as 'en' | 'ar';
    
    // Set the Zod locale for validation messages
    setZodLocale(locale);
    
    return NextResponse.next();
  }

  // Get the locale from the request
  const locale = getLocale(request);
  
  // Set the Zod locale for validation messages
  setZodLocale(locale as 'en' | 'ar');
  
  // Redirect to the locale version of the URL
  return NextResponse.redirect(
    new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
