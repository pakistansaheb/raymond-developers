import type { Metadata } from "next";

import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalShell eyebrow="LEGAL / PRIVACY" title="Privacy" updated="7 August 2026">
      <p>
        This page explains what Raymond Developers collects when you use this
        site, and why there is no cookie banner.
      </p>

      <h2>No cookies</h2>
      <p>
        There is no login and no account area on this site, so there is
        nothing for a cookie to remember. This site sets no cookies at all —
        not for tracking, not for preferences, not for anything else.
      </p>
      <p>
        UK and EU cookie law requires a consent banner for cookies that track
        or profile visitors. With no cookies of any kind in use, there is
        nothing to get consent for, so there is no banner.
      </p>

      <h2>No analytics, no trackers</h2>
      <p>
        There is no analytics script, no advertising pixel and no third-party
        tracker anywhere on this site. We don&rsquo;t know how many people
        visit, what they clicked, or where they came from.
      </p>

      <h2>The enquiry form</h2>
      <p>
        The &ldquo;Website — £200&rdquo; form on the homepage sends your
        name, email address and project note to us by email. We use it only
        to reply and prepare a quote or invoice, and keep it only as long as
        needed for that — the same way we&rsquo;d treat an email you sent us
        directly.
      </p>

      <h2>Email</h2>
      <p>
        Getting in touch by email (
        <a href="mailto:abdulrahmanammad7@gmail.com">
          abdulrahmanammad7@gmail.com
        </a>
        ) is handled like any other email — kept as long as needed to answer
        you and keep a record of the conversation.
      </p>

      <h2>Payment</h2>
      <p>
        Hosting and project work are billed by direct bank transfer, against
        an invoice sent by email. No card details, and no payment
        information of any kind, are collected by this site.
      </p>

      <h2>Questions</h2>
      <p>
        Email{" "}
        <a href="mailto:abdulrahmanammad7@gmail.com">
          abdulrahmanammad7@gmail.com
        </a>{" "}
        with anything about this policy or your data.
      </p>
    </LegalShell>
  );
}
