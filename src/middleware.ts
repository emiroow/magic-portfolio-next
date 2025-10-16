import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Middleware to enforce locale in API routes
// This middleware ensures localized routing using next-intl
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is /api or /api/admin and does not end with /fa or /en
  if (pathname.startsWith("/api")) {
    // if (!pathname.endsWith("/fa") && !pathname.endsWith("/en")) {
    //   return NextResponse.json(
    //     {
    //       message: "Please use a locale in the last path of URL, /fa or /en",
    //     },
    //     { status: 500 }
    //   );
    // }
    return;
  }

  // Use the original middleware for valid routes
  return createMiddleware(routing)(request);
}

export const config = {
  // Match only internationalized pathnames and API routes
  matcher: [
    "/",
    "/dashboard",
    "/(fa|en)/:path*",
    "/api/:path*",
    "/api/admin/:path*",
  ],
};
