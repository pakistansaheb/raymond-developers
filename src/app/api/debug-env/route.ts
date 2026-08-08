import { NextResponse } from "next/server";

export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const parts = hash.split(":");
  const [scheme, saltHex, hashHex] = parts;

  return NextResponse.json({
    hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
    hasAdminPasswordHash: Boolean(hash),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    passwordHash: {
      totalLength: hash.length,
      partCount: parts.length,
      scheme,
      saltHexLength: saltHex?.length ?? 0,
      hashHexLength: hashHex?.length ?? 0,
      hashHexIsValidHex: hashHex ? /^[0-9a-f]+$/i.test(hashHex) : false,
      hasLeadingOrTrailingWhitespace: hash !== hash.trim(),
    },
  });
}
