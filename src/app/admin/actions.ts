"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { periodKey } from "@/lib/billing";
import {
  createClient,
  deleteClient as removeClient,
  listClients,
  updateClient,
} from "@/lib/clients";
import { hostingAutomationConfigured } from "@/lib/env";
import { sendInvoiceNow } from "@/lib/send-invoice";
import { SESSION_COOKIE } from "@/lib/session";
import { reinstateDomain, suspendDomain, vercelAutomationConfigured } from "@/lib/vercel";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readClientForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const hostingStartDate = String(formData.get("hostingStartDate") ?? "").trim();
  const active = formData.get("active") === "on";
  const vercelProjectId = String(formData.get("vercelProjectId") ?? "").trim();

  if (!name) throw new Error("Enter the client's name.");
  if (!EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter the monthly amount as a number greater than zero.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(hostingStartDate)) {
    throw new Error("Enter the hosting start date.");
  }

  return { name, email, websiteUrl, amount, hostingStartDate, active, vercelProjectId };
}

/**
 * Adding a client asks whether this period is already paid. If not, the
 * first invoice goes out immediately (rather than waiting for their monthly
 * billing day), so the 2-day reminder / 15-day suspension clock starts from
 * today. If they've already paid — e.g. backfilling an existing client mid
 * period — nothing is emailed, and the normal monthly cycle picks them up
 * from their next billing day.
 */
export async function addClient(formData: FormData) {
  await requireAdmin();
  const client = await createClient(readClientForm(formData));
  const alreadyPaid = formData.get("hasPaid") === "paid";

  if (alreadyPaid) {
    await updateClient(client.id, {
      paid: true,
      paidAt: new Date().toISOString(),
    });
  } else {
    try {
      const patch = await sendInvoiceNow(client);
      await updateClient(client.id, patch);
    } catch (error) {
      console.error(`Failed to send opening invoice to ${client.email}:`, error);
      // The client record still exists; the daily cron retries on their
      // next billing day rather than losing the client entirely.
    }
  }

  revalidatePath("/admin");
}

export async function editClient(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");
  await updateClient(id, readClientForm(formData));
  revalidatePath("/admin");
}

export async function deleteClient(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");
  await removeClient(id);
  revalidatePath("/admin");
}

/**
 * Marks the outstanding invoice as paid. This is the manual step — a bank
 * transfer landing is something only you can confirm, so nothing automated
 * ever sets this. If the client's hosting was automatically taken offline,
 * this is also what brings it back.
 */
export async function markPaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");

  const client = (await listClients()).find((c) => c.id === id);

  let suspensionError: string | null = null;
  if (client?.suspended && hostingAutomationConfigured()) {
    try {
      await reinstateDomain(client);
    } catch (error) {
      console.error(`Failed to bring ${client.email}'s site back online via Vercel:`, error);
      suspensionError = error instanceof Error ? error.message : String(error);
    }
  }

  await updateClient(id, {
    paid: true,
    paidAt: new Date().toISOString(),
    suspended: false,
    hostingSuspendedAt: null,
    suspensionError,
    currentPeriod: String(formData.get("period") || periodKey(new Date())),
  });
  revalidatePath("/admin");
}

/** Undo for a mistaken "mark paid". */
export async function markUnpaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");
  await updateClient(id, { paid: false, paidAt: null });
  revalidatePath("/admin");
}

/**
 * Manual trigger for the same Vercel takedown the day-15 cron performs —
 * lets you verify a client's Vercel project ID is wired up correctly without
 * waiting for (or faking) the 15-day clock. Independent of billing state:
 * it only flips the hosting flags, not `paid`/`currentPeriod`.
 */
export async function testSuspendHosting(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");

  const client = (await listClients()).find((c) => c.id === id);
  if (!client) throw new Error("Client not found.");
  if (!hostingAutomationConfigured()) {
    throw new Error("VERCEL_TOKEN isn't set, so automation can't run.");
  }
  if (!vercelAutomationConfigured(client)) {
    throw new Error("This client has no Vercel project ID, or the website URL isn't a valid domain.");
  }

  const timestamp = new Date().toISOString();
  try {
    await suspendDomain(client);
    await updateClient(id, {
      suspended: true,
      hostingSuspendedAt: timestamp,
      suspensionError: null,
    });
  } catch (error) {
    await updateClient(id, {
      suspensionError: error instanceof Error ? error.message : String(error),
    });
  }
  revalidatePath("/admin");
}

/** Manual counterpart to {@link testSuspendHosting} — brings the site back. */
export async function testRestoreHosting(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");

  const client = (await listClients()).find((c) => c.id === id);
  if (!client) throw new Error("Client not found.");
  if (!hostingAutomationConfigured()) {
    throw new Error("VERCEL_TOKEN isn't set, so automation can't run.");
  }
  if (!vercelAutomationConfigured(client)) {
    throw new Error("This client has no Vercel project ID, or the website URL isn't a valid domain.");
  }

  try {
    await reinstateDomain(client);
    await updateClient(id, {
      suspended: false,
      hostingSuspendedAt: null,
      suspensionError: null,
    });
  } catch (error) {
    await updateClient(id, {
      suspensionError: error instanceof Error ? error.message : String(error),
    });
  }
  revalidatePath("/admin");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
