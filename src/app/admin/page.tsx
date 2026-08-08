import type { Metadata } from "next";

import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { paymentState } from "@/lib/billing";
import { listClients, redisConfigured } from "@/lib/clients";

import { AddClientForm } from "./AddClientForm";
import { ClientRow } from "./ClientRow";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await requireAdmin();
  const configured = redisConfigured();
  const clients = configured ? await listClients() : [];
  const now = new Date();

  const owing = clients.filter((c) => {
    const state = paymentState(c, now);
    return state.kind === "awaiting" || state.kind === "suspended";
  }).length;

  return (
    <AdminShell wide>
      <div className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="t-mono text-graphite">ADMIN / CLIENTS</p>
            <h1 className="t-display t-d3 mt-2">Hosting clients</h1>
            <p className="t-mono mt-2 text-graphite">
              {clients.length} total · {owing} awaiting payment · signed in as{" "}
              {email}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
            >
              Sign out
            </button>
          </form>
        </div>

        {!configured ? (
          <p
            role="alert"
            className="t-mono border border-hairline px-4 py-3 text-chalk"
          >
            Storage isn&rsquo;t connected. Set UPSTASH_REDIS_REST_URL and
            UPSTASH_REDIS_REST_TOKEN, then reload.
          </p>
        ) : (
          <>
            <AddClientForm />

            {clients.length === 0 ? (
              <p className="t-lead border-t border-hairline pt-6 text-graphite">
                No clients yet. Add one above and the invoice job will start
                billing them on their hosting start date each month.
              </p>
            ) : (
              <ul className="border-b border-hairline">
                {clients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    state={paymentState(client, now)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
