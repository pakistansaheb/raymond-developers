import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
    hasAdminPasswordHash: Boolean(process.env.ADMIN_PASSWORD_HASH),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
