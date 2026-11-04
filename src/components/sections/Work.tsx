import { ProjectShot } from "@/components/ProjectShot";
import { Reveal } from "@/components/Reveal";
import { WorkStack } from "@/components/sections/WorkStack";

const PROJECTS = [
  {
    name: "Raymond Logistics",
    slug: "raymond-logistics",
    summary: "Service pages and a quote flow built to convert.",
    href: "https://raymondlogistics.co.uk",
    span: "md:col-span-7",
  },
  {
    name: "HP Cutz",
    slug: "hp-cutz",
    summary: "Booking flow that turns a browse into an appointment.",
    href: "https://hpcutz.com",
    span: "md:col-span-5 md:mt-40",
  },
  {
    name: "CM Courier Group",
    slug: "cm-courier-group",
    summary: "An instant quote tool built into the marketing site.",
    href: "https://cm-courier-group.vercel.app",
    span: "md:col-span-5",
  },
  {
    name: "Ayrah Logistics",
    slug: "ayrah-logistics",
    summary:
      "Refrigerated transport site with a live quote tool that emails every enquiry.",
    href: "https://ayrahlogistics.com",
    span: "md:col-span-7 md:mt-40",
  },
];

export function Work() {
  return (
    <section id="work" className="px-6 pb-20 pt-20 md:px-10 md:pb-40 md:pt-40">
      <div className="mx-auto max-w-wide">
        <Reveal>
          <h2 data-reveal className="t-display t-d2">
            Work that ships.
          </h2>
        <WorkStack className="mt-10 block gap-x-10 md:mt-20 md:grid md:grid-cols-12 md:gap-y-24">
          {PROJECTS.map((project) => (
            <div key={project.name} className={`work-card ${project.span}`}>
              <div className="work-card-inner">
                <a
                  data-reveal
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="work-shot relative overflow-hidden rounded-xl border border-hairline bg-surface">
                    <ProjectShot
                      name={project.slug}
                      alt={`${project.name} website`}
                    />
                  </div>
                  <h3 className="t-ui mt-5 text-xl text-chalk md:mt-6 md:text-2xl">
                    {project.name}
                  </h3>
                  <p className="t-lead mt-2 max-w-lg">{project.summary}</p>
                  <span className="t-mono mt-3 inline-block text-chalk underline decoration-graphite underline-offset-4 group-hover:decoration-signal md:mt-4">
                    See the site →
                  </span>
                </a>
              </div>
            </div>
          ))}
        </WorkStack>
        </Reveal>
      </div>
    </section>
  );
}
