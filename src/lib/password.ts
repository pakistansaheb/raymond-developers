import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/**
 * Password hashing for the single admin account. Stored as
 * `scrypt:<saltHex>:<hashHex>` in ADMIN_PASSWORD_HASH — the plain password
 * is never in an env var, a file, or this repo.
 *
 * Colon-separated rather than the conventional `$`, because Next expands
 * `$NAME` inside .env files and would silently eat part of the hash.
 *
 * Generate a hash with: npm run hash-password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const derived = (await scryptAsync(
    password,
    Buffer.from(saltHex, "hex"),
    KEY_LENGTH,
  )) as Buffer;

  return timingSafeEqual(derived, expected);
}
