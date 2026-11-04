import { Reveal } from "@/components/Reveal";

const BUILDS = [
  "Websites",
  "Web applications",
  "Internal tools and dashboards",
  "Booking and workflow systems",
];

export function Capabilities() {
  return (
    <section id="services" className="px-6 pb-28 pt-32 md:px-10 md:pb-40 md:pt-48">
      <Reveal className="mx-auto grid max-w-wide gap-14 lg:grid-cols-2 lg:gap-20">
        <h2 data-reveal className="t-display t-d2 max-w-xl">
          Built around how your business actually runs, not squeezed into a
          template.
        </h2>
        <ul data-reveal>
          {BUILDS.map((build) => (
            <li
              key={build}
              className="t-display t-d3 border-t border-hairline py-6 last:border-b"
            >
              {build}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
