import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { adminConfigured, serverEnv } from "@/lib/env";
import { verifyPassword } from "@/lib/password";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SESSION_COOKIE, SESSION_TTL_MS, createSessionToken } from "@/lib/session";

/**
 * Admin sign-in. Rate limited per IP so the form can't be brute-forced, and
 * the failure message never distinguishes a wrong email from a wrong
 * password.
 */
export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin access isn't configured on this deployment yet." },
      { status: 503 },
    );
  }

  const limit = rateLimit(`admin-login:${clientIp(request.headers)}`, 10, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let email: unknown;
  let password: unknown;
  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Send a valid request body." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { ok: false, error: "Enter your email and password." },
      { status: 400 },
    );
  }

  const emailMatches =
    email.trim().toLowerCase() === serverEnv.adminEmail.trim().toLowerCase();
  const passwordMatches = await verifyPassword(
    password,
    serverEnv.adminPasswordHash,
  );

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json(
      { ok: false, error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(
    serverEnv.adminEmail,
    serverEnv.sessionSecret,
  );

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return response;
}
