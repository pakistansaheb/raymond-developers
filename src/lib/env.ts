/**
 * Environment access.
 *
 * Server secrets are read through `serverEnv`, which is only ever imported by
 * route handlers, server actions and server components. Nothing in this file
 * is prefixed NEXT_PUBLIC_ except values that are genuinely public.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/** Safe in the browser. */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/** Server only. Importing this from a client component is a build error. */
export const serverEnv = {
  get smtpHost() {
    return required("SMTP_HOST", process.env.SMTP_HOST);
  },
  get smtpPort() {
    return required("SMTP_PORT", process.env.SMTP_PORT);
  },
  get smtpUser() {
    return required("SMTP_USER", process.env.SMTP_USER);
  },
  get smtpPass() {
    return required("SMTP_PASS", process.env.SMTP_PASS);
  },
  get smtpFrom() {
    return required("SMTP_FROM", process.env.SMTP_FROM);
  },
  get cronSecret() {
    return required("CRON_SECRET", process.env.CRON_SECRET);
  },
  get adminEmail() {
    return required("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
  },
  get adminPasswordHash() {
    return required("ADMIN_PASSWORD_HASH", process.env.ADMIN_PASSWORD_HASH);
  },
  get sessionSecret() {
    return required("SESSION_SECRET", process.env.SESSION_SECRET);
  },
  /**
   * Bank transfer details go into outgoing invoice emails, so — unlike every
   * other secret here — they have to be readable by the server. Env vars are
   * the least-exposed option: never committed (.env* is gitignored), never
   * sent to the browser. See the README security note.
   */
  get bankAccountName() {
    return required("BANK_ACCOUNT_NAME", process.env.BANK_ACCOUNT_NAME);
  },
  get bankSortCode() {
    return required("BANK_SORT_CODE", process.env.BANK_SORT_CODE);
  },
  get bankAccountNumber() {
    return required("BANK_ACCOUNT_NUMBER", process.env.BANK_ACCOUNT_NUMBER);
  },
  get vercelToken() {
    return required("VERCEL_TOKEN", process.env.VERCEL_TOKEN);
  },
};

export function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.SESSION_SECRET,
  );
}

/** True once the daily invoice job has everything it needs to run. */
export function invoicingConfigured(): boolean {
  return Boolean(
    smtpConfigured() &&
      process.env.CRON_SECRET &&
      process.env.BANK_ACCOUNT_NAME &&
      process.env.BANK_SORT_CODE &&
      process.env.BANK_ACCOUNT_NUMBER,
  );
}

/**
 * True once a Vercel API token is set, so per-client automated suspension /
 * reinstatement can run. Optional — without it the app falls back to the
 * original manual-takedown behaviour.
 */
export function hostingAutomationConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN);
}
