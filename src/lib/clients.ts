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
};

export type ClientInput = Pick<
  Client,
  "name" | "email" | "websiteUrl" | "amount" | "hostingStartDate" | "active"
>;

let client: Redis | null = null;

function redis(): Redis {
  if (!client) {
    client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return client;
}

export function redisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
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
