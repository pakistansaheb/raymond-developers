import type { Metadata } from "next";

import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalShell eyebrow="LEGAL / TERMS" title="Terms" updated="7 August 2026">
      <h2>Design and build work</h2>
      <p>
        Website and software projects are scoped and priced individually.
        The £200 website package is a fixed-price exception: three or more
        pages with a booking or quote system, invoiced once we&rsquo;ve
        scoped it from your enquiry. Anything you commission from us — a
        website, a web application or an internal tool — is yours once
        built. We don&rsquo;t hold your code, design files or content
        hostage to an ongoing contract.
      </p>

      <h2>Hosting</h2>
      <p>
        Hosting is £20 a month, billed by direct bank transfer against an
        invoice sent in advance. It covers keeping the site we built for you
        live, served fast, with SSL and your domain connected. It
        doesn&rsquo;t include content edits, SEO work or support hours —
        that&rsquo;s quoted separately if you need it.
      </p>
      <p>
        There&rsquo;s no contract and no minimum term. Cancel any time by
        email — no notice period and no cancellation fee.
      </p>

      <h2>Payment</h2>
      <p>
        All payment is by direct bank transfer against an emailed invoice.
        We don&rsquo;t collect card details, and no automatic or recurring
        billing runs through this site.
      </p>

      <h2>Liability</h2>
      <p>
        We build to the scope agreed in writing before a project starts. If
        something we built breaks because of our error, we&rsquo;ll fix it.
        We&rsquo;re not liable for losses arising from your own content,
        third-party services you connect, or use of the software outside
        what was agreed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:abdulrahmanammad7@gmail.com">
          abdulrahmanammad7@gmail.com
        </a>
        .
      </p>
    </LegalShell>
  );
}
