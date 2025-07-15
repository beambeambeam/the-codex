import { NextRequest, NextResponse } from "next/server";

import { fetchServer } from "@/lib/api/server";

const authPages = ["/sign-in", "/register"];
const protectedPages = ["/collections/*"];

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const { data: user } = await fetchServer.GET("/auth/me");

  // if (authPages.includes(pathname)) {
  //   if (user) {
  //     return NextResponse.redirect(new URL("/home", request.url));
  //   }
  // }

  // for (const protectedPage of protectedPages) {
  //   const pattern = new RegExp("^" + protectedPage.replace("*", ".*") + "$");
  //   if (pattern.test(pathname)) {
  //     if (!user) {
  //       return NextResponse.redirect(new URL("/sign-in", request.url));
  //     }
  //   }
  // }

  return NextResponse.next();
}
