import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question("New admin password: ");
rl.close();

if (!password || password.length < 12) {
  console.error("\nUse a password of at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scryptAsync(password, salt, 64);

console.log("\nAdd this to your environment as ADMIN_PASSWORD_HASH:\n");
console.log(`scrypt:${salt.toString("hex")}:${derived.toString("hex")}\n`);
console.log("Also set SESSION_SECRET to a long random string, e.g.:\n");
console.log(randomBytes(32).toString("hex"), "\n");
