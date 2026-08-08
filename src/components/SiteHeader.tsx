import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";

export function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-hairline">
      <div className="mx-auto flex max-w-measure items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="text-lg leading-none md:text-xl"
          aria-label="Raymond Developers — home"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-6" aria-label="Primary">
          <Link href="/#02" className="t-mono hidden text-graphite transition-colors hover:text-signal sm:inline">
            What we build
          </Link>
          <Link
            href="/#05"
            className="t-mono border border-hairline px-4 py-2 text-chalk transition-colors hover:border-signal hover:text-signal"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
