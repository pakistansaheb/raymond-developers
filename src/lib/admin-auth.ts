import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverEnv } from "@/lib/env";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** The signed-in admin's email, or null. Read from the cookie every time. */
export async function getAdminEmail(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, serverEnv.sessionSecret);
}

/**
 * Guard for every admin page and server action. The identity always comes
 * from the signed cookie — never from a form field or query string.
 */
export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}
