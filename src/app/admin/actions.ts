"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { periodKey } from "@/lib/billing";
import {
  createClient,
  deleteClient as removeClient,
  updateClient,
} from "@/lib/clients";
import { SESSION_COOKIE } from "@/lib/session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readClientForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const hostingStartDate = String(formData.get("hostingStartDate") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!name) throw new Error("Enter the client's name.");
  if (!EMAIL_PATTERN.test(email)) throw new Error("Enter a valid email address.");
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter the monthly amount as a number greater than zero.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(hostingStartDate)) {
    throw new Error("Enter the hosting start date.");
  }

  return { name, email, websiteUrl, amount, hostingStartDate, active };
}

export async function addClient(formData: FormData) {
  await requireAdmin();
  await createClient(readClientForm(formData));
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
 * ever sets this.
 */
export async function markPaid(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing client id.");
  await updateClient(id, {
    paid: true,
    paidAt: new Date().toISOString(),
    suspended: false,
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

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
