import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function LegalShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="t-mono text-graphite">{eyebrow}</p>
          <h1 className="t-display t-d2 mt-4">{title}</h1>
          <p className="t-mono mt-4 text-graphite">Last updated {updated}</p>
          <div className="t-lead mt-10 flex flex-col gap-6 text-chalk [&_h2]:t-display [&_h2]:t-d3 [&_h2]:mt-4 [&_p]:text-graphite [&_a]:text-chalk [&_a]:underline [&_a]:decoration-hairline [&_a]:underline-offset-4 hover:[&_a]:decoration-signal">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
