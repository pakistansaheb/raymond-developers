/**
 * Signed session tokens for the admin area.
 *
 * Built on Web Crypto (not node:crypto) so the exact same verification runs
 * in middleware on the Edge runtime and in Node route handlers. The token is
 * a signed payload, not encrypted — it carries no secret, only the admin
 * email and an expiry, and the HMAC is what makes it unforgeable.
 */

export const SESSION_COOKIE = "rd_admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(
  email: string,
  secret: string,
): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ sub: email, exp: Date.now() + SESSION_TTL_MS })),
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret),
    encoder.encode(payload),
  );
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the admin email if the token is valid and unexpired, else null. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<string | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  let valid: boolean;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromBase64Url(signature),
      encoder.encode(payload),
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof decoded?.sub !== "string" || typeof decoded?.exp !== "number") {
      return null;
    }
    if (decoded.exp < Date.now()) return null;
    return decoded.sub;
  } catch {
    return null;
  }
}
