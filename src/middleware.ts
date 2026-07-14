import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
 
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});
 
export const config = {
  matcher: ['/((?!_next|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|admin|static).*)']
};
