"use client";

import { useRef, useState } from "react";

import { ClientFields } from "./ClientRow";
import { addClient } from "./actions";

export function AddClientForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="t-mono border border-signal bg-signal px-5 py-3 text-void transition-opacity hover:opacity-85"
      >
        Add client
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addClient(formData);
        formRef.current?.reset();
        setOpen(false);
      }}
      className="flex flex-col gap-4 border border-hairline p-6"
    >
      <p className="t-mono text-graphite">NEW CLIENT</p>
      <ClientFields />
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="t-mono border border-signal bg-signal px-4 py-2 text-void transition-opacity hover:opacity-85"
        >
          Save client
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
