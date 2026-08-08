import type { Client } from "@/lib/clients";

/** Days a client has to pay before hosting is suspended. */
export const PAYMENT_WINDOW_DAYS = 15;
/** Gap between chasing emails while an invoice is outstanding. */
export const REMINDER_INTERVAL_DAYS = 2;

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function periodKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/**
 * The day of the month a client is billed on, taken from their hosting start
 * date and clamped to the length of the month being billed — a client who
 * started on the 31st is billed on the 30th in November and the 28th in
 * February, rather than being skipped.
 */
export function billingDayFor(client: Client, on: Date): number | null {
  const start = new Date(`${client.hostingStartDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return null;
  return Math.min(
    start.getUTCDate(),
    daysInMonth(on.getUTCFullYear(), on.getUTCMonth()),
  );
}

/** True once the client's hosting start date has actually arrived. */
export function hostingHasStarted(client: Client, on: Date): boolean {
  const start = new Date(`${client.hostingStartDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return false;
  return start.getTime() <= on.getTime();
}

export function daysSinceInvoice(client: Client, on: Date): number | null {
  if (!client.invoiceSentAt) return null;
  const sent = new Date(client.invoiceSentAt);
  if (Number.isNaN(sent.getTime())) return null;
  return Math.floor((on.getTime() - sent.getTime()) / MS_PER_DAY);
}

export function dueDateFor(client: Client): Date | null {
  if (!client.invoiceSentAt) return null;
  const sent = new Date(client.invoiceSentAt);
  if (Number.isNaN(sent.getTime())) return null;
  return new Date(sent.getTime() + PAYMENT_WINDOW_DAYS * MS_PER_DAY);
}

export type PaymentState =
  | { kind: "not_started" }
  | { kind: "no_invoice_yet" }
  | { kind: "paid"; period: string }
  | { kind: "awaiting"; period: string; dayOf: number; daysLeft: number }
  | { kind: "suspended"; period: string };

/** Derived from stored fields only — the admin table and the cron agree on this. */
export function paymentState(client: Client, on = new Date()): PaymentState {
  if (!hostingHasStarted(client, on)) return { kind: "not_started" };
  if (!client.currentPeriod || !client.invoiceSentAt) {
    return { kind: "no_invoice_yet" };
  }
  if (client.paid) return { kind: "paid", period: client.currentPeriod };
  if (client.suspended) return { kind: "suspended", period: client.currentPeriod };

  const elapsed = daysSinceInvoice(client, on) ?? 0;
  return {
    kind: "awaiting",
    period: client.currentPeriod,
    dayOf: elapsed,
    daysLeft: Math.max(PAYMENT_WINDOW_DAYS - elapsed, 0),
  };
}
