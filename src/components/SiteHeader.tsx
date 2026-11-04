import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-void">
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="text-base leading-none md:text-lg"
          aria-label="Raymond Developers, home"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-8" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="t-mono hidden text-graphite transition-colors duration-150 hover:text-signal md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#pricing" className="btn btn-solid !min-h-10 !px-4 !text-sm">
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
