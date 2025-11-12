import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { normalizeLang } from "@/lib/i18n";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();

    // Prepare response so we can set cookies if needed
    const res = NextResponse.next();

    // Brand assets: set strong caching headers for performance
    if (pathname.startsWith("/brand/")) {
      res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return res;
    }

    // Language detection on first visit: prefer existing cookie, else Accept-Language
    try {
      const existing = req.cookies.get("lang")?.value;
      if (!existing) {
        const hdr = req.headers.get("accept-language") || "en";
        const primary = hdr.split(",")[0] || "en"; // e.g., "es-ES,es;q=0.9"
        const lang = normalizeLang(primary);
        // Persist for 1 year
        res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      }
    } catch {}

    // Allow admin login page regardless of session
    if (pathname === "/auth/admin") {
      return res;
    }
    // Secure /admin area: only configured admin can access
    if (pathname.startsWith("/admin")) {
      const token = (req as unknown as { nextauth?: { token?: { email?: string } } }).nextauth?.token;
      const signedInEmail = token?.email?.toLowerCase();
      if (!adminEmail || !signedInEmail || signedInEmail !== adminEmail) {
        const dashUrl = new URL("/dashboard", req.url);
        dashUrl.searchParams.set("error", "not_admin");
        return NextResponse.redirect(dashUrl);
      }
    }
    return res;
  },
  {
    pages: {
      signIn: "/auth/login", // redirect here if not logged in
    },
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",              
    "/dashboard/investments/:path*",  
    "/investment/:path*",             // ✅ Protect all investment flow pages
    "/support/:path*",                
    "/transactions/:path*",           
    "/profile/:path*",                
    "/admin/:path*",                  // ✅ Secure admin area
    "/brand/:path*",                  // ✅ Cache brand assets aggressively
  ],
};
