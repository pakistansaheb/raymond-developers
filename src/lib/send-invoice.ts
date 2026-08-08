import "server-only";

import { MS_PER_DAY, PAYMENT_WINDOW_DAYS, periodKey } from "@/lib/billing";
import type { Client } from "@/lib/clients";
import { serverEnv } from "@/lib/env";
import { buildInvoiceEmail } from "@/lib/invoice";
import { mailer } from "@/lib/mailer";

/**
 * Sends a client's first invoice immediately — used when a new unpaid client
 * is added in `/admin`, rather than waiting for their monthly billing day to
 * come round. Returns the same field updates the daily cron job would apply
 * for an "invoice" action, so the two stay in sync (a 2-day reminder cadence
 * and the 15-day suspension both count from `invoiceSentAt`).
 */
export async function sendInvoiceNow(
  client: Client,
  now = new Date(),
): Promise<Partial<Client>> {
  const due = new Date(now.getTime() + PAYMENT_WINDOW_DAYS * MS_PER_DAY);
  const message = buildInvoiceEmail(client, due);

  await mailer().sendMail({
    from: serverEnv.smtpFrom,
    to: client.email,
    subject: message.subject,
    text: message.text,
  });

  return {
    currentPeriod: periodKey(now),
    invoiceSentAt: now.toISOString(),
    lastReminderAt: null,
    remindersSent: 0,
    paid: false,
    paidAt: null,
    suspended: false,
  };
}
