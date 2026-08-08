"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: { ok: boolean; error?: string } = await response.json();

      if (!data.ok) {
        setError(data.error ?? "Couldn't sign in. Try again.");
        setSubmitting(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <p className="t-mono text-graphite">ADMIN / SIGN IN</p>
        <h1 className="t-display t-d3 mt-2">Sign in.</h1>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="t-mono text-graphite">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
          className="t-ui border border-hairline bg-transparent px-4 py-3.5 text-chalk outline-none focus-visible:border-signal"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="t-mono text-graphite">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={submitting}
          className="t-ui border border-hairline bg-transparent px-4 py-3.5 text-chalk outline-none focus-visible:border-signal"
        />
      </div>

      {error ? (
        <p role="alert" className="t-mono text-chalk">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="t-mono border border-signal bg-signal px-6 py-3 text-void transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
