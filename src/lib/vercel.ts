import "server-only";

import type { Client } from "@/lib/clients";
import { serverEnv } from "@/lib/env";

/**
 * Automated hosting suspension/reinstatement via the Vercel REST API.
 *
 * Client sites are deployed as projects under the Raymond Developers Vercel
 * account, so unassigning/reassigning the client's custom domain from their
 * project is a real, reversible way to take a site offline and bring it back
 * — no paid Vercel features required.
 */

function domainFor(client: Client): string | null {
  try {
    return new URL(client.websiteUrl).hostname || null;
  } catch {
    return null;
  }
}

/** Team-scoped tokens must pass `teamId` (or `slug`) on every request. */
function teamQuery(): string {
  const teamId = process.env.VERCEL_TEAM_ID;
  const teamSlug = process.env.VERCEL_TEAM_SLUG;
  if (teamId) return `?teamId=${encodeURIComponent(teamId)}`;
  if (teamSlug) return `?slug=${encodeURIComponent(teamSlug)}`;
  return "";
}

async function vercelRequest<T = void>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`https://api.vercel.com${path}${teamQuery()}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serverEnv.vercelToken}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vercel API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

/** True when this client has enough data for the automation to act on. */
export function vercelAutomationConfigured(client: Client): boolean {
  return Boolean(client.vercelProjectId && domainFor(client));
}

/**
 * Idempotency is checked by actually listing the project's current domains
 * first, rather than guessing from a DELETE/POST's status code — a 404 from
 * Vercel means different things depending on *what* wasn't found (the
 * domain vs. the project itself), and guessing wrong either masks a real
 * failure as success or blocks a legitimate retry. Also throws a clear,
 * specific error up front if the project id itself is wrong.
 */
async function currentDomains(projectId: string): Promise<string[]> {
  const { domains } = await vercelRequest<{ domains: { name: string }[] }>(
    `/v9/projects/${encodeURIComponent(projectId)}/domains`,
    { method: "GET" },
  );
  return domains.map((d) => d.name);
}

/** Unassigns the client's domain from their Vercel project, taking the site offline. */
export async function suspendDomain(client: Client): Promise<void> {
  const domain = domainFor(client);
  if (!client.vercelProjectId || !domain) {
    throw new Error("Missing Vercel project id or an unparsable website URL.");
  }
  const existing = await currentDomains(client.vercelProjectId);
  if (!existing.includes(domain)) return; // Already unassigned — nothing to do.

  await vercelRequest(
    `/v9/projects/${encodeURIComponent(client.vercelProjectId)}/domains/${encodeURIComponent(domain)}`,
    { method: "DELETE" },
  );
}

/** Re-assigns the client's domain to their Vercel project, bringing the site back. */
export async function reinstateDomain(client: Client): Promise<void> {
  const domain = domainFor(client);
  if (!client.vercelProjectId || !domain) {
    throw new Error("Missing Vercel project id or an unparsable website URL.");
  }
  const existing = await currentDomains(client.vercelProjectId);
  if (existing.includes(domain)) return; // Already assigned — nothing to do.

  await vercelRequest(
    `/v10/projects/${encodeURIComponent(client.vercelProjectId)}/domains`,
    { method: "POST", body: JSON.stringify({ name: domain }) },
  );
}
