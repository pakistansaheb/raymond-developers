import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "04.1",
    title: "Enquiry",
    body: "You tell us what you need and roughly what “done” looks like. We reply with questions, not a sales call.",
  },
  {
    n: "04.2",
    title: "Proposal",
    body: "A fixed scope and a fixed price, in writing, before any work starts. No hourly estimate that quietly grows.",
  },
  {
    n: "04.3",
    title: "Design",
    body: "Pages and flows first, agreed with you, before a line of code is written against them.",
  },
  {
    n: "04.4",
    title: "Build",
    body: "The site or application gets built against the scope you signed off — nothing added, nothing skipped.",
  },
  {
    n: "04.5",
    title: "Launch",
    body: "It goes live on your domain, hosting starts, and you're handed a finished system, not a work in progress.",
  },
];

export function Process() {
  return (
    <section id="04" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="PROCESS" code="04" descriptor="SEQUENCE" />
            <h2 className="t-display t-d2 mt-6 max-w-2xl">
              Enquiry to
              <br />
              launch, in
              <br />
              five steps.
            </h2>
          </div>

          <ol>
            {STEPS.map((step) => (
              <li
                key={step.n}
                data-reveal
                className="grid grid-cols-1 gap-2 border-t border-hairline py-7 last:border-b sm:grid-cols-[5rem_10rem_1fr] sm:gap-6"
              >
                <span className="t-mono text-graphite">{step.n}</span>
                <h3 className="t-ui text-xl text-chalk">{step.title}</h3>
                <p className="t-lead max-w-xl text-graphite">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
