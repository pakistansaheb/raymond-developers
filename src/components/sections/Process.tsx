import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    title: "Enquiry",
    body: "You tell us what you need. We reply with questions, not a pitch.",
  },
  {
    title: "Proposal",
    body: "A fixed scope and price, in writing, before anything starts.",
  },
  {
    title: "Design",
    body: "Pages and flows agreed first, before a line of code is written.",
  },
  {
    title: "Build",
    body: "Built against the signed-off scope. Nothing added, nothing skipped.",
  },
  {
    title: "Launch",
    body: "Live on your domain, hosting running, handed over finished.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-6 pb-28 pt-28 md:px-10 md:pb-40 md:pt-40">
      <Reveal className="mx-auto max-w-wide">
        <h2 data-reveal className="t-display t-d2">
          Enquiry to launch, in five steps.
        </h2>
        <ol className="mt-14 grid grid-cols-1 lg:mt-20 lg:grid-cols-5 lg:gap-8">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-reveal
              className="grid grid-cols-[2.5rem_1fr] border-t border-hairline py-7 lg:block lg:pb-0"
            >
              <span className="t-mono text-graphite">{index + 1}</span>
              <div className="lg:mt-16">
                <h3 className="t-ui text-xl text-chalk">{step.title}</h3>
                <p className="mt-2 text-base leading-normal text-graphite">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
