import "server-only";

import { Redis } from "@upstash/redis";

const KEY = "clients";

/**
 * Client records live in Upstash Redis as a single JSON array under one key.
 * At this scale (a handful of hosting clients) that is simpler and cheaper
 * than a row per client, and it keeps the whole list atomic to read.
 *
 * Billing-cycle fields are managed by the daily cron job
 * (src/app/api/cron/invoices/route.ts); `paid` is the one the admin toggles
 * by hand after a bank transfer lands.
 */
export type Client = {
  id: string;
  name: string;
  email: string;
  websiteUrl: string;
  amount: number;
  /** YYYY-MM-DD. Its day-of-month is the client's monthly billing day. */
  hostingStartDate: string;
  active: boolean;
  createdAt: string;

  /** "YYYY-MM" of the invoice currently outstanding, or null before the first. */
  currentPeriod: string | null;
  invoiceSentAt: string | null;
  lastReminderAt: string | null;
  remindersSent: number;
  paid: boolean;
  paidAt: string | null;
  /** Set once the day-15 final notice has gone out. Stops further email. */
  suspended: boolean;

  /**
   * Vercel project id (e.g. `prj_xxxxxxxx`) hosting this client's site.
   * When set (alongside a parseable `websiteUrl`), the day-15 suspension and
   * "mark paid" actions automatically unassign/reassign the domain via the
   * Vercel API instead of requiring a manual takedown. Empty = automation
   * disabled for this client; falls back to the old manual-only behaviour.
   */
  vercelProjectId: string;
  /** Set when the automated takedown succeeds. Cleared on reinstatement. */
  hostingSuspendedAt: string | null;
  /** Set when an automated takedown/reinstatement call fails, so the admin
   * knows to intervene manually. Cleared on the next successful attempt. */
  suspensionError: string | null;
};

export type ClientInput = Pick<
  Client,
  | "name"
  | "email"
  | "websiteUrl"
  | "amount"
  | "hostingStartDate"
  | "active"
  | "vercelProjectId"
>;

let client: Redis | null = null;

/**
 * Credentials can arrive under two different names depending on how the
 * database was connected:
 *
 * - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — set by hand, or
 *   by the classic Upstash Vercel integration.
 * - `<store-name>_KV_REST_API_URL` / `<store-name>_KV_REST_API_TOKEN` — set
 *   automatically when a database is created from the Vercel Storage tab
 *   (Vercel's KV-compatible naming, prefixed with whatever the store is
 *   called). The prefix isn't predictable, so this scans for it.
 */
function resolveCredentials(): { url: string; token: string } | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    };
  }

  const urlKey = Object.keys(process.env).find((key) =>
    key.endsWith("_KV_REST_API_URL"),
  );
  if (!urlKey) return null;

  const prefix = urlKey.slice(0, -"KV_REST_API_URL".length);
  const url = process.env[urlKey];
  const token = process.env[`${prefix}KV_REST_API_TOKEN`];
  if (!url || !token) return null;

  return { url, token };
}

function redis(): Redis {
  if (!client) {
    const credentials = resolveCredentials();
    if (!credentials) {
      throw new Error(
        "No Upstash Redis credentials found. Set UPSTASH_REDIS_REST_URL and " +
          "UPSTASH_REDIS_REST_TOKEN, or connect a database from the Vercel Storage tab.",
      );
    }
    client = new Redis(credentials);
  }
  return client;
}

export function redisConfigured(): boolean {
  return resolveCredentials() !== null;
}

export async function listClients(): Promise<Client[]> {
  if (!redisConfigured()) return [];
  const stored = await redis().get<Client[]>(KEY);
  return Array.isArray(stored) ? stored : [];
}

async function writeClients(clients: Client[]): Promise<void> {
  await redis().set(KEY, clients);
}

export async function createClient(input: ClientInput): Promise<Client> {
  const clients = await listClients();
  const record: Client = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    currentPeriod: null,
    invoiceSentAt: null,
    lastReminderAt: null,
    remindersSent: 0,
    paid: false,
    paidAt: null,
    suspended: false,
    hostingSuspendedAt: null,
    suspensionError: null,
  };
  await writeClients([...clients, record]);
  return record;
}

export async function updateClient(
  id: string,
  patch: Partial<Client>,
): Promise<void> {
  const clients = await listClients();
  await writeClients(
    clients.map((c) => (c.id === id ? { ...c, ...patch, id: c.id } : c)),
  );
}

export async function deleteClient(id: string): Promise<void> {
  const clients = await listClients();
  await writeClients(clients.filter((c) => c.id !== id));
}

/** Replaces the whole list. Used by the cron job after a batch of sends. */
export async function saveClients(clients: Client[]): Promise<void> {
  await writeClients(clients);
}
