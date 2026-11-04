import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";

/**
 * Archivo ships as a variable font with both weight and width axes. Loading
 * the full weight range here lets globals.css drive both roles from one
 * family: `.t-display` sets `font-weight: 800; font-stretch: 68%` for
 * headlines and the wordmark, `.t-ui` sets `font-weight: 400; font-stretch:
 * 100%` for interface text. Same object, different settings.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

/** Body prose only — the hero thesis and section leads. Never for UI. */
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

/** Registry codes, labels, stat captions, account metadata. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
