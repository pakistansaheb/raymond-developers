import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  MS_PER_DAY,
  PAYMENT_WINDOW_DAYS,
  REMINDER_INTERVAL_DAYS,
  billingDayFor,
  daysSinceInvoice,
  dueDateFor,
  hostingHasStarted,
  periodKey,
} from "@/lib/billing";
import { listClients, redisConfigured, saveClients } from "@/lib/clients";
import type { Client } from "@/lib/clients";
import { invoicingConfigured, serverEnv } from "@/lib/env";
import {
  buildFinalNoticeEmail,
  buildInvoiceEmail,
  buildReminderEmail,
} from "@/lib/invoice";
import { mailer } from "@/lib/mailer";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

type Action = "invoice" | "reminder" | "final_notice";

/**
 * Runs daily (see vercel.json). For each active client it does at most one
 * thing:
 *
 *   - On their billing day (the day-of-month they started hosting), and if
 *     this month's invoice hasn't gone out yet, send the invoice and open a
 *     new payment period.
 *   - While an invoice is outstanding, send a chasing reminder every 2 days.
 *   - At 15 days overdue, send one final suspension notice and stop. No
 *     further email goes out until the admin marks it paid, which opens the
 *     next period on the next billing day.
 *
 * "Paid" is only ever set by hand in the admin area — a bank transfer
 * landing isn't something this job can observe.
 */
export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || !isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!invoicingConfigured() || !redisConfigured()) {
    return NextResponse.json(
      { error: "Invoicing isn't fully configured (storage, SMTP and/or bank details)." },
      { status: 503 },
    );
  }

  const now = new Date();
  const clients = await listClients();
  const performed: { email: string; action: Action; ok: boolean }[] = [];

  const updated: Client[] = [];

  for (const client of clients) {
    const next = { ...client };

    if (client.active && hostingHasStarted(client, now)) {
      const action = decideAction(client, now);

      if (action) {
        const ok = await send(client, action, now);
        performed.push({ email: client.email, action, ok });

        if (ok) applyAction(next, action, now);
      }
    }

    updated.push(next);
  }

  await saveClients(updated);

  const sent = performed.filter((p) => p.ok).length;
  return NextResponse.json({
    sent,
    failed: performed.length - sent,
    actions: performed,
  });
}

function decideAction(client: Client, now: Date): Action | null {
  const thisPeriod = periodKey(now);
  const billingDay = billingDayFor(client, now);

  // A new month's invoice takes priority over chasing the old one.
  if (
    billingDay !== null &&
    now.getUTCDate() === billingDay &&
    client.currentPeriod !== thisPeriod
  ) {
    return "invoice";
  }

  if (!client.currentPeriod || client.paid || client.suspended) return null;

  const elapsed = daysSinceInvoice(client, now);
  if (elapsed === null) return null;

  if (elapsed >= PAYMENT_WINDOW_DAYS) return "final_notice";

  if (elapsed > 0 && elapsed % REMINDER_INTERVAL_DAYS === 0) {
    // Guard against a same-day re-run sending the same reminder twice.
    if (client.lastReminderAt && sameUtcDay(new Date(client.lastReminderAt), now)) {
      return null;
    }
    return "reminder";
  }

  return null;
}

async function send(client: Client, action: Action, now: Date): Promise<boolean> {
  const message = (() => {
    if (action === "invoice") {
      const due = new Date(now.getTime() + PAYMENT_WINDOW_DAYS * MS_PER_DAY);
      return buildInvoiceEmail(client, due);
    }
    if (action === "reminder") {
      const due = dueDateFor(client) ?? now;
      const elapsed = daysSinceInvoice(client, now) ?? 0;
      return buildReminderEmail(
        client,
        due,
        Math.max(PAYMENT_WINDOW_DAYS - elapsed, 0),
      );
    }
    return buildFinalNoticeEmail(client);
  })();

  try {
    await mailer().sendMail({
      from: serverEnv.smtpFrom,
      to: client.email,
      subject: message.subject,
      text: message.text,
    });
    return true;
  } catch (error) {
    console.error(`Failed to send ${action} to ${client.email}:`, error);
    return false;
  }
}

function applyAction(client: Client, action: Action, now: Date): void {
  const timestamp = now.toISOString();

  if (action === "invoice") {
    client.currentPeriod = periodKey(now);
    client.invoiceSentAt = timestamp;
    client.lastReminderAt = null;
    client.remindersSent = 0;
    client.paid = false;
    client.paidAt = null;
    client.suspended = false;
    return;
  }

  if (action === "reminder") {
    client.lastReminderAt = timestamp;
    client.remindersSent += 1;
    return;
  }

  client.suspended = true;
}
