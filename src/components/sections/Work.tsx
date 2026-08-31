import Image from "next/image";

import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const PROJECTS = [
  {
    code: "03.1",
    name: "Raymond Logistics",
    summary: "Service pages and a quote flow built to convert.",
    href: "https://raymondlogistics.co.uk",
    image: "/images/work/raymond-logistics.png",
  },
  {
    code: "03.2",
    name: "HP Cutz",
    summary: "Booking flow that turns a browse into an appointment.",
    href: "https://hpcutz.com",
    image: "/images/work/hp-cutz.png",
  },
  {
    code: "03.3",
    name: "CM Courier Group",
    summary: "An instant quote tool built into the marketing site.",
    href: "https://cm-courier-group.vercel.app",
    image: "/images/work/cm-courier-group.png",
  },
] as const;

export function Work() {
  return (
    <section id="03" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="WORK" code="03" descriptor="SHIPPED" />
            <h2 className="t-display t-d2 mt-6 max-w-2xl">Work that ships.</h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {PROJECTS.map((project) => (
              <a
                key={project.code}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className="group flex min-w-0 flex-col gap-4"
              >
                <div className="relative aspect-[16/10] w-full min-w-0 overflow-hidden border border-hairline">
                  <Image
                    src={project.image}
                    alt={`${project.name} website`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="t-mono text-graphite">{project.code}</span>
                  <h3 className="row-title t-ui mt-1 text-xl text-chalk">
                    {project.name}
                  </h3>
                  <p className="t-lead mt-1">{project.summary}</p>
                  <span className="t-mono mt-3 inline-block text-chalk underline decoration-hairline decoration-2 underline-offset-4 group-hover:decoration-signal">
                    {project.href.replace(/^https?:\/\//, "")} →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <p data-reveal className="t-mono text-graphite">
            03.4 — Next project in progress.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
