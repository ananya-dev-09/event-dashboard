import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicApiGet =
    request.method === "GET" &&
    (pathname === "/api/events" ||
      pathname === "/api/posts/feed" ||
      pathname === "/api/posts" ||
      pathname.startsWith("/api/events/") ||
      pathname.startsWith("/api/posts/") ||
      pathname.startsWith("/api/dashboard/events/") ||
      pathname.startsWith("/api/quizzes/"));

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
    if (isPublicApiGet) return NextResponse.next();

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token && !pathname.startsWith("/api/auth")) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
