import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";

/**
 * The admin area inherits the site's palette and type but drops the motion
 * and the registry rail. It's a place to check a payment and leave.
 */
export function AdminShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  const measure = wide ? "max-w-6xl" : "max-w-md";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-hairline">
        <div className={`mx-auto flex ${measure} items-center justify-between px-6 py-5`}>
          <Link href="/" aria-label="Raymond Developers — home">
            <Wordmark className="text-lg" />
          </Link>
          <p className="t-mono text-graphite">ADMIN</p>
        </div>
      </header>
      <main className="flex flex-1 flex-col px-6 py-14">
        <div className={`mx-auto w-full ${measure}`}>{children}</div>
      </main>
    </div>
  );
}
