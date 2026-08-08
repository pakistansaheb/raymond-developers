# Raymond Developers

Marketing site plus a private admin area for managing hosting clients and
automatically invoicing them each month.

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. Payment is
by direct bank transfer — there is no payment processor.

## How it works, in one paragraph

You add each hosting client in `/admin` (name, email, website, £/month, the
date they started hosting). A job runs once a day on Vercel. On each client's
monthly billing day — the day-of-month they started — it emails them an
invoice. If they haven't paid, it chases them every 2 days. At 15 days
overdue it sends one final "hosting suspended" notice and then goes quiet.
When a bank transfer lands, you press **Mark paid** in `/admin`. That's the
only manual step, because a bank transfer arriving isn't something the app
can see.

## Getting it running

### 1. Install and start

```bash
npm install
npm run dev
```

A `.env.local` is already present with a working local admin login so you can
look around immediately:

- **URL:** http://localhost:3000/admin/login (or whichever port you run on)
- **Email:** `abdulrahmanammad7@gmail.com`
- **Password:** `RaymondAdminf0ca0db1`

**Change that password before going live** — see step 2.

### 2. Set your real admin password

```bash
npm run hash-password
```

It asks for a password, then prints an `ADMIN_PASSWORD_HASH` and a
`SESSION_SECRET`. Put both in `.env.local` (and later in Vercel). Only the
hash is ever stored — the password itself lives nowhere in this repo.

### 3. Connect storage (Upstash Redis)

The client list needs somewhere to live. Vercel can't write files at runtime,
so it goes in Upstash — a free key-value store.

**Recommended — from Vercel:** Project → Storage → Create Database → Upstash →
Redis. Vercel injects the credentials into the project automatically, under
names like `<store-name>_KV_REST_API_URL` / `<store-name>_KV_REST_API_TOKEN` —
the app looks for those as well as the plain names below, so nothing else to
configure. Redeploy (or push a commit) after creating it so the new env vars
take effect.

**Manual alternative:** sign up at
[console.upstash.com](https://console.upstash.com), create a Redis database,
copy the **REST URL** and **REST token** (not the `redis://` connection
string), and put them in `.env.local` as `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN`.

Until storage is connected, `/admin` loads but shows "Storage isn't
connected."

### 4. Connect email

Invoices, reminders and final notices all send over SMTP. Any provider works:
a Gmail account with an
[app password](https://myaccount.google.com/apppasswords), your domain's own
mailbox (Namecheap Private Email, Zoho, Fastmail), or a transactional
provider.

Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

### 5. Add your bank details

`BANK_ACCOUNT_NAME`, `BANK_SORT_CODE`, `BANK_ACCOUNT_NUMBER`. These are
printed on every invoice email so clients know where to send the money.

### 6. Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel.
2. Copy **every** variable from `.env.example` into Project → Settings →
   Environment Variables, with your real values.
3. Set `NEXT_PUBLIC_SITE_URL` to your live domain.
4. Deploy. `vercel.json` registers the daily cron job automatically — confirm
   it under Project → Cron Jobs.

### 7. Point your domain (Namecheap → Vercel)

1. Vercel: Project → Settings → Domains → add your domain.
2. Vercel shows the DNS records it wants — usually an `A` record for the root
   domain and a `CNAME` for `www`.
3. Namecheap: Domain List → Manage → Advanced DNS → add those records. (Or
   switch nameservers to Vercel's and let it manage DNS entirely.)
4. SSL is issued automatically once DNS resolves.

## Using the admin area

`/admin/login` → sign in → `/admin`.

Each client row shows their name, email, website, monthly amount, start date,
and a status:

| Status | Meaning |
| --- | --- |
| **Not started** | Their hosting start date is in the future. No invoices yet. |
| **No invoice yet** | Started, but their first billing day hasn't come round. |
| **Awaiting · day N of 15** | Invoice sent, payment not yet marked. Reminders go out every 2 days. |
| **Paid · YYYY-MM** | You've marked this month's invoice paid. No more email until next month. |
| **Overdue · suspended** | 15 days passed with no payment. Final notice sent, emails stopped. Take the site down manually. |

**Add client** creates a record. **Edit** changes details. **Mark paid** is
what you press when the money arrives. **Mark unpaid** undoes it if you press
it by mistake. **Remove** deletes the client entirely.

Setting a client to inactive (uncheck "Active") stops all invoicing without
deleting their record.

## The invoice schedule

- **Billing day** is the day-of-month from the client's hosting start date. If
  they started on the 31st, short months bill on the last day rather than
  skipping.
- **Payment window** is 15 days from the invoice.
- **Reminders** go out every 2 days while unpaid, escalating in urgency by
  counting down the days remaining.
- **Day 15** sends one final notice saying hosting is being suspended, and
  the client is flagged suspended so no further email goes out.
- Marking paid, or the next month's billing day arriving, resets the cycle.

Every figure and date in those emails comes from the stored client record or
from arithmetic on it — nothing is written freshly per send. Money emails
need to be reproducible, so the templates are fixed and only the client data
varies.

### Testing the job by hand

```bash
curl -i https://your-site.vercel.app/api/cron/invoices -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Point a test client at an email address you control before running this
against real SMTP credentials.

## Security note: what this app stores

- **Client records** (name, email, website, amount, start date, payment
  status) live in Upstash Redis. Nothing else is stored about them.
- **No card details, ever.** There is no payment processor and no card field
  anywhere in the app — payment is bank transfer against an emailed invoice.
- **No client logins.** Clients never sign in; they only receive email. The
  only account is your admin one.
- **Your admin password** is stored as an scrypt hash, never in plain text.
  The session is an HMAC-signed, HTTP-only, SameSite cookie — no token in
  localStorage.
- **Bank details are env vars, deliberately.** They have to be readable by
  the server to appear in an invoice email. They're never in source code,
  never committed (`.env*` is gitignored), never sent to the browser, and
  encrypted at rest by Vercel — the same trust boundary as the SMTP password
  and cron secret.
- **The cron endpoint is not public** — it requires the exact `CRON_SECRET`
  bearer token, compared timing-safely.
- **Login is rate limited** per IP, and the failure message never reveals
  whether the email or the password was wrong.
- **Security headers** on every response: nonce-based CSP, HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`.
- **No analytics, no trackers, no third-party scripts.** The public site sets
  no cookies at all; the only cookie in the app is your admin session.

## Project structure

```
src/
  app/
    page.tsx                  Homepage
    privacy/, terms/          Legal pages
    admin/                    Admin dashboard, login, server actions
    api/
      admin/login/route.ts    Sign-in (rate limited)
      cron/invoices/route.ts  Daily invoice + reminder job
  components/
    sections/                 Hero, Capabilities, Work, Process, Start, Faq, Contact
    RegistryRail.tsx           Scroll-synced section index
    Reveal.tsx                 Scroll reveal, respects prefers-reduced-motion
  lib/
    env.ts                    All env access, with configured() guards
    clients.ts                Upstash Redis CRUD for client records
    billing.ts                Billing-day, due-date and status logic
    invoice.ts                Invoice / reminder / final-notice templates
    session.ts                Signed session cookies (edge-safe)
    password.ts               scrypt hash + verify
    mailer.ts                 SMTP transport
    rate-limit.ts             In-memory per-IP limiter
scripts/
  hash-password.mjs           npm run hash-password
```
