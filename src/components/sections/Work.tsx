import { ProjectShot } from "@/components/ProjectShot";
import { Reveal } from "@/components/Reveal";
import { WorkStack } from "@/components/sections/WorkStack";
import { PROJECTS as ALL } from "@/lib/projects";

// Staggered 12-column grid: wide, narrow-dropped, narrow, wide-dropped, then repeat.
const SPANS = [
  "md:col-span-7",
  "md:col-span-5 md:mt-40",
  "md:col-span-5",
  "md:col-span-7 md:mt-40",
];
const PROJECTS = ALL.map((p, i) => ({
  ...p,
  span:
    i === ALL.length - 1 && i % 2 === 0
      ? "md:col-span-8 md:col-start-3"
      : SPANS[i % SPANS.length],
}));

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
