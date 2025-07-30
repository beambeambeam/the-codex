import { NextRequest, NextResponse } from "next/server";

import { fetchServer } from "@/lib/api/server";

// Define route patterns
const AUTH_ROUTES = ["/sign-in", "/register"];
const PROTECTED_ROUTES = ["/collection", "/home"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const { data: user } = await fetchServer.GET("/auth/me");

    if (AUTH_ROUTES.includes(pathname)) {
      return user
        ? NextResponse.redirect(new URL("/home", request.url))
        : NextResponse.next();
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  } catch {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }
}
