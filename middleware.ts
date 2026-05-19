import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { res, user } = await updateSession(req);

  const isLoginRoute = pathname === "/admin/login";
  const isSignupRoute = pathname === "/admin/signup";
  const isAuthCallback = pathname.startsWith("/admin/auth/");
  const isPublicAdminRoute = isLoginRoute || isSignupRoute || isAuthCallback;

  if (pathname.startsWith("/admin")) {
    if (isPublicAdminRoute) {
      if (user && (isLoginRoute || isSignupRoute)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return res;
    }
    if (!user) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
