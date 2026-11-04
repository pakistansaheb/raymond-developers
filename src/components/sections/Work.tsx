import Image from "next/image";

import { Reveal } from "@/components/Reveal";

const PROJECTS = [
  {
    name: "Raymond Logistics",
    summary: "Service pages and a quote flow built to convert.",
    href: "https://raymondlogistics.co.uk",
    image: "/images/work/raymond-logistics.png",
    span: "md:col-span-7",
  },
  {
    name: "HP Cutz",
    summary: "Booking flow that turns a browse into an appointment.",
    href: "https://hpcutz.com",
    image: "/images/work/hp-cutz.png",
    span: "md:col-span-5 md:mt-40",
  },
  {
    name: "CM Courier Group",
    summary: "An instant quote tool built into the marketing site.",
    href: "https://cm-courier-group.vercel.app",
    image: "/images/work/cm-courier-group.png",
    span: "md:col-span-5",
  },
  {
    name: "Ayrah Logistics",
    summary:
      "Refrigerated transport site with a live quote tool that emails every enquiry.",
    href: "https://ayrahlogistics.com",
    image: "/images/work/ayrah-logistics.png",
    span: "md:col-span-7 md:mt-40",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 pb-28 pt-28 md:px-10 md:pb-40 md:pt-40">
      <div className="mx-auto max-w-wide">
        <Reveal>
          <h2 data-reveal className="t-display t-d2">
            Work that ships.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-20 md:grid-cols-12 md:gap-y-24">
          {PROJECTS.map((project) => (
            <Reveal key={project.name} className={project.span}>
              <a
                data-reveal
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-hairline bg-surface">
                  <Image
                    src={project.image}
                    alt={`${project.name} website`}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                  />
                </div>
                <h3 className="t-ui mt-6 text-xl text-chalk md:text-2xl">
                  {project.name}
                </h3>
                <p className="t-lead mt-2 max-w-lg">{project.summary}</p>
                <span className="t-mono mt-4 inline-block text-chalk underline decoration-graphite underline-offset-4 group-hover:decoration-signal">
                  {project.href.replace(/^https?:\/\//, "")} →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
