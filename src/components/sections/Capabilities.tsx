import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const ROWS = [
  {
    code: "02.1",
    title: "Websites",
    body: "Marketing sites, brochure sites and landing pages. Built, connected to your domain, and live.",
  },
  {
    code: "02.2",
    title: "Web applications",
    body: "Custom browser-based tools built around a specific business process rather than a template.",
  },
  {
    code: "02.3",
    title: "Internal tools & dashboards",
    body: "Staff-facing systems for tracking stock, jobs, records or anything else that currently lives in a spreadsheet.",
  },
  {
    code: "02.4",
    title: "Booking & workflow systems",
    body: "Scheduling, intake forms and approvals — the logic that moves a request from submitted to done.",
  },
];

export function Capabilities() {
  return (
    <section id="02" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto grid max-w-measure grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <Reveal>
            <div data-reveal className="md:sticky md:top-24">
              <Eyebrow label="CAPABILITY" code="02" descriptor="SCOPE" />
              <h2 className="t-display t-d2 mt-6 max-w-sm">
                What we
                <br />
                actually
                <br />
                build.
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <Reveal>
            <ul>
              {ROWS.map((row) => (
                <li
                  key={row.code}
                  data-reveal
                  className="grid grid-cols-1 gap-2 border-b border-hairline py-7 first:border-t sm:grid-cols-[5rem_1fr] sm:gap-6"
                >
                  <span className="t-mono text-graphite">{row.code}</span>
                  <div>
                    <h3 className="t-ui text-xl text-chalk md:text-2xl">
                      {row.title}
                    </h3>
                    <p className="t-lead mt-2 text-graphite">{row.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
