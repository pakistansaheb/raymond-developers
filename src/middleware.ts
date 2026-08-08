import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Runs on every request. Two jobs:
 *
 * 1. Require a valid admin session for /admin, redirecting to the login page
 *    otherwise. Each admin page and server action re-checks this too — this
 *    is the outer gate so an unauthenticated request never renders.
 * 2. Attach security headers, with a per-request nonce for the CSP's
 *    script-src. The nonce is forwarded on a request header (`x-nonce`) so
 *    `app/layout.tsx` can read it via `headers()` and Next can stamp it onto
 *    the scripts it manages.
 */
export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminPage) {
    const secret = process.env.SESSION_SECRET;
    const email = secret
      ? await verifySessionToken(
          request.cookies.get(SESSION_COOKIE)?.value,
          secret,
        )
      : null;

    if (!email) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/admin/login", request.url)),
        csp,
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return applySecurityHeaders(response, csp);
}

function buildCsp(nonce: string) {
  // Next's dev server (webpack HMR / Fast Refresh) evaluates code via eval(),
  // which a strict CSP blocks by design. That's a dev-tooling requirement,
  // not something the shipped app needs, so 'unsafe-eval' is scoped to
  // non-production only — the deployed site keeps the strict nonce policy.
  const devEval = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devEval}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
