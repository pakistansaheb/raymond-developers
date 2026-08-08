"use client";

import { useState } from "react";

import type { Client } from "@/lib/clients";
import type { PaymentState } from "@/lib/billing";

import { deleteClient, editClient, markPaid, markUnpaid } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function StatusBadge({ state }: { state: PaymentState }) {
  const label = (() => {
    switch (state.kind) {
      case "not_started":
        return "Not started";
      case "no_invoice_yet":
        return "No invoice yet";
      case "paid":
        return `Paid · ${state.period}`;
      case "awaiting":
        return `Awaiting · day ${state.dayOf} of 15`;
      case "suspended":
        return "Overdue · suspended";
    }
  })();

  const emphasis =
    state.kind === "paid"
      ? "border-signal text-signal"
      : state.kind === "suspended"
        ? "border-chalk text-chalk"
        : "border-hairline text-graphite";

  return (
    <span className={`t-mono inline-block border px-2 py-1 ${emphasis}`}>
      {label}
    </span>
  );
}

export function ClientRow({
  client,
  state,
}: {
  client: Client;
  state: PaymentState;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="border-t border-hairline py-6">
        <form action={editClient} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={client.id} />
          <ClientFields client={client} />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="t-mono border border-signal bg-signal px-4 py-2 text-void transition-opacity hover:opacity-85"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="grid grid-cols-1 gap-4 border-t border-hairline py-6 lg:grid-cols-[1fr_auto] lg:items-start">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="t-ui text-xl text-chalk">{client.name}</h3>
          <StatusBadge state={state} />
          {!client.active ? (
            <span className="t-mono border border-hairline px-2 py-1 text-graphite">
              Inactive
            </span>
          ) : null}
        </div>
        <p className="t-mono text-graphite">{client.email}</p>
        {client.websiteUrl ? (
          <a
            href={client.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-mono text-graphite underline decoration-hairline underline-offset-4 hover:text-signal"
          >
            {client.websiteUrl}
          </a>
        ) : null}
        <p className="t-mono text-graphite">
          £{client.amount.toFixed(2)}/mo · started{" "}
          {dateFormatter.format(new Date(`${client.hostingStartDate}T00:00:00Z`))}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {client.paid ? (
          <form action={markUnpaid}>
            <input type="hidden" name="id" value={client.id} />
            <button
              type="submit"
              className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
            >
              Mark unpaid
            </button>
          </form>
        ) : (
          <form action={markPaid}>
            <input type="hidden" name="id" value={client.id} />
            <input type="hidden" name="period" value={client.currentPeriod ?? ""} />
            <button
              type="submit"
              className="t-mono border border-signal bg-signal px-4 py-2 text-void transition-opacity hover:opacity-85"
            >
              Mark paid
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
        >
          Edit
        </button>
        <form
          action={deleteClient}
          onSubmit={(event) => {
            if (!confirm(`Remove ${client.name}? This can't be undone.`)) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={client.id} />
          <button
            type="submit"
            className="t-mono border border-hairline px-4 py-2 text-graphite transition-colors hover:border-chalk hover:text-chalk"
          >
            Remove
          </button>
        </form>
      </div>
    </li>
  );
}

export function ClientFields({ client }: { client?: Client }) {
  const scope = client?.id ?? "new";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        scope={scope}
        label="Client name"
        name="name"
        defaultValue={client?.name}
        required
      />
      <Field
        scope={scope}
        label="Email"
        name="email"
        type="email"
        defaultValue={client?.email}
        required
      />
      <Field
        scope={scope}
        label="Website link"
        name="websiteUrl"
        type="url"
        placeholder="https://example.co.uk"
        defaultValue={client?.websiteUrl}
      />
      <Field
        scope={scope}
        label="Amount (£/month)"
        name="amount"
        type="number"
        step="0.01"
        min="0"
        defaultValue={client ? String(client.amount) : "20"}
        required
      />
      <Field
        scope={scope}
        label="Hosting start date"
        name="hostingStartDate"
        type="date"
        defaultValue={client?.hostingStartDate}
        required
      />
      <label className="flex items-center gap-3 self-end pb-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={client ? client.active : true}
          className="h-4 w-4 accent-white"
        />
        <span className="t-mono text-graphite">Active (invoice monthly)</span>
      </label>
    </div>
  );
}

function Field({
  label,
  name,
  scope,
  ...props
}: {
  label: string;
  name: string;
  scope: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${scope}-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-mono text-graphite">
        {label}
      </label>
      <input
        id={id}
        name={name}
        {...props}
        className="t-ui border border-hairline bg-transparent px-4 py-3 text-chalk outline-none focus-visible:border-signal"
      />
    </div>
  );
}
