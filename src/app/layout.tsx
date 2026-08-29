import type { Metadata } from "next";
import { headers } from "next/headers";

import { archivo, newsreader, plexMono } from "@/lib/fonts";
import { publicEnv } from "@/lib/env";
import { Preloader } from "@/components/Preloader";

import "./globals.css";

const title = "Raymond Developers — Web Design & Software Studio in Birmingham";
const description =
  "Raymond Developers is a Birmingham-based studio designing and building websites and bespoke software for clients across the UK: custom web applications, internal tools, dashboards, booking and workflow systems.";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: title,
    template: "%s — Raymond Developers",
  },
  description,
  applicationName: "Raymond Developers",
  keywords: [
    "web design Birmingham",
    "web developer Birmingham",
    "software development Birmingham",
    "bespoke software UK",
    "web application development",
    "internal tools",
    "website hosting",
  ],
  authors: [{ name: "Raymond Developers" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    url: publicEnv.siteUrl,
    siteName: "Raymond Developers",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Raymond Developers" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading the per-request nonce (set in middleware) opts this layout into
  // dynamic rendering, which is what lets Next stamp the nonce onto the
  // inline scripts it manages so they satisfy the CSP in src/middleware.ts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Tells search engines what "Raymond Developers" refers to as an entity —
  // this is what improves the odds of the site itself (not just any page
  // mentioning the name) being the answer when someone searches the brand.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Raymond Developers",
    url: publicEnv.siteUrl,
    email: "abdulrahmanammad7@gmail.com",
    description,
    areaServed: ["Birmingham", "West Midlands", "United Kingdom"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Birmingham",
      addressCountry: "GB",
    },
  };

  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body data-csp-nonce={nonce}>
        <script
          type="application/ld+json"
          nonce={nonce}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
