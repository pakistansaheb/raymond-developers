import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const PROJECTS = [
  {
    code: "03.1",
    name: "Raymond Logistics",
    summary:
      "A logistics and haulage company site: service pages, a quote request flow, and the copy and structure needed to convert an enquiry into a booked job.",
    built: "Design, build and ongoing hosting.",
    href: "https://raymondlogistics.co.uk",
  },
  {
    code: "03.2",
    name: "HP Cutz",
    summary:
      "A Birmingham barbershop's site: services, pricing and a straightforward booking flow that turns a browse into a booked appointment.",
    built: "Design, build and ongoing hosting.",
    href: "https://hpcutz.com",
  },
  {
    code: "03.3",
    name: "CM Courier Group",
    summary:
      "A courier and haulage marketing site: service pages, an instant quote tool, and the copy and structure needed to convert an enquiry into a booked job.",
    built: "Design, build and ongoing hosting.",
    href: "https://cm-courier-group.vercel.app",
  },
] as const;

export function Work() {
  return (
    <section id="03" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="WORK" code="03" descriptor="SHIPPED" />
            <h2 className="t-display t-d2 mt-6 max-w-2xl">
              Three projects
              <br />
              live. More
              <br />
              on the way.
            </h2>
          </div>

          <ul>
            {PROJECTS.map((project) => (
              <li key={project.code} className="border-t border-hairline py-8 last:border-b">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  className="row-link grid grid-cols-1 items-start gap-3 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-6"
                >
                  <span className="t-mono text-graphite">{project.code}</span>
                  <div>
                    <h3 className="row-title t-ui text-2xl text-chalk md:text-3xl">
                      {project.name}
                    </h3>
                    <p className="t-lead mt-2 max-w-2xl text-graphite">
                      {project.summary}
                    </p>
                    <p className="t-mono mt-3 text-graphite">{project.built}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="row-arrow t-mono self-start text-chalk sm:self-center"
                  >
                    {project.href.replace(/^https?:\/\//, "")} →
                  </span>
                </a>
              </li>
            ))}

            {/* Row structure ready for more shipped work. */}
            <li
              data-reveal
              className="grid grid-cols-1 items-center gap-3 border-t border-hairline py-8 opacity-40 sm:grid-cols-[5rem_1fr]"
            >
              <span className="t-mono text-graphite">03.4</span>
              <p className="t-mono text-graphite">Next project — in progress.</p>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
