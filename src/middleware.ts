import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Middleware to enforce locale in API routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the API route and does not include a locale
  if (pathname.startsWith("/api") && !/^\/api\/(fa|en)/.test(pathname)) {
    return NextResponse.json(
      { error: "Please use a locale in the URL, e.g., /api/fa or /api/en" },
      { status: 400 }
    );
  }

  // Call the existing next-intl middleware
  return createMiddleware(routing)(request);
}

export const config = {
  // Match only internationalized pathnames and API routes
  matcher: ["/", "/(fa|en)/:path*", "/api/:path*"],
};
