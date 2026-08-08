import "server-only";

import { PAYMENT_WINDOW_DAYS } from "@/lib/billing";
import type { Client } from "@/lib/clients";
import { serverEnv } from "@/lib/env";

/**
 * Invoice, reminder and final-notice emails.
 *
 * Every figure and date in these messages comes from the stored client
 * record or from arithmetic on it — nothing is generated freely. That's
 * deliberate: money emails must be reproducible and auditable, so the only
 * thing that varies between two sends is the client data.
 */

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function bankBlock(client: Client): string[] {
  return [
    "Bank transfer details:",
    `Account name: ${serverEnv.bankAccountName}`,
    `Sort code: ${serverEnv.bankSortCode}`,
    `Account number: ${serverEnv.bankAccountNumber}`,
    `Reference: ${client.name}`,
  ];
}

function subjectSuffix(client: Client): string {
  return client.websiteUrl ? ` — ${client.websiteUrl}` : "";
}

function signOff(): string[] {
  return ["", "Thanks,", "Raymond Developers"];
}

export function buildInvoiceEmail(client: Client, dueDate: Date) {
  const amount = client.amount.toFixed(2);
  return {
    subject: `Invoice — website hosting — £${amount}${subjectSuffix(client)}`,
    text: [
      `Hi ${client.name},`,
      "",
      `This is your monthly invoice for website hosting${client.websiteUrl ? ` of ${client.websiteUrl}` : ""}.`,
      "",
      `Amount due: £${amount}`,
      `Due date: ${dateFormatter.format(dueDate)}`,
      "",
      ...bankBlock(client),
      "",
      `Please pay within ${PAYMENT_WINDOW_DAYS} days. If payment hasn't arrived by the due date, hosting will be suspended and the site will go offline.`,
      "",
      "Questions about this invoice — just reply to this email.",
      ...signOff(),
    ].join("\n"),
  };
}

export function buildReminderEmail(
  client: Client,
  dueDate: Date,
  daysLeft: number,
) {
  const amount = client.amount.toFixed(2);
  return {
    subject: `Reminder — £${amount} outstanding${subjectSuffix(client)}`,
    text: [
      `Hi ${client.name},`,
      "",
      `We haven't received your hosting payment of £${amount} yet.`,
      "",
      `Amount due: £${amount}`,
      `Due date: ${dateFormatter.format(dueDate)}`,
      `Days remaining: ${daysLeft}`,
      "",
      ...bankBlock(client),
      "",
      `If payment hasn't arrived by ${dateFormatter.format(dueDate)}, hosting will be suspended and the site will go offline.`,
      "",
      "If you've already paid, ignore this — and let us know so we can check it off.",
      ...signOff(),
    ].join("\n"),
  };
}

export function buildFinalNoticeEmail(client: Client) {
  const amount = client.amount.toFixed(2);
  return {
    subject: `Final notice — hosting suspended${subjectSuffix(client)}`,
    text: [
      `Hi ${client.name},`,
      "",
      `Your hosting payment of £${amount} is now ${PAYMENT_WINDOW_DAYS} days overdue, so hosting${client.websiteUrl ? ` for ${client.websiteUrl}` : ""} is being suspended and the site will go offline.`,
      "",
      `Outstanding: £${amount}`,
      "",
      ...bankBlock(client),
      "",
      "To restore hosting, pay the outstanding amount and reply to this email — we'll put the site back online.",
      "",
      "This is the last automatic email you'll get about this invoice.",
      ...signOff(),
    ].join("\n"),
  };
}
