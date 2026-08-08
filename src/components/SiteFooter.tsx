import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bleed-rule">
      <div className="mx-auto flex max-w-measure flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-col gap-2">
          <Wordmark className="text-base" />
          <p className="t-mono text-graphite">
            &copy; {year} Raymond Developers. UK web design and software studio.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Legal">
          <Link
            href="/privacy"
            className="t-mono inline-block py-3 text-graphite transition-colors hover:text-signal"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="t-mono inline-block py-3 text-graphite transition-colors hover:text-signal"
          >
            Terms
          </Link>
          <a
            href="mailto:abdulrahmanammad7@gmail.com"
            className="t-mono inline-block py-3 text-graphite transition-colors hover:text-signal"
          >
            abdulrahmanammad7@gmail.com
          </a>
        </nav>
      </div>
    </footer>
  );
}
