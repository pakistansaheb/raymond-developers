import type { Metadata } from "next";
import { headers } from "next/headers";

import { archivo, newsreader, plexMono } from "@/lib/fonts";
import { publicEnv } from "@/lib/env";

import "./globals.css";

const title = "Raymond Developers — UK web design and software studio";
const description =
  "Raymond Developers designs and builds websites and bespoke software: custom web applications, internal tools, dashboards, booking and workflow systems. Hosting from £20 a month.";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: title,
    template: "%s — Raymond Developers",
  },
  description,
  applicationName: "Raymond Developers",
  keywords: [
    "web design UK",
    "bespoke software",
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

  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body data-csp-nonce={nonce}>{children}</body>
    </html>
  );
}
