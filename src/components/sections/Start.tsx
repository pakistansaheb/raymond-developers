import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const WHATSAPP_HREF =
  "https://wa.me/447496084292?text=Hi%2C%20I%27d%20like%20to%20talk%20about%20a%20custom%20software%20project";

const ROWS = [
  {
    code: "05.1",
    title: "Website — £200",
    body: "A site of three or more pages with a booking or quote system built in. Fixed price, invoiced once we've scoped it.",
    cta: "Message on WhatsApp",
    primary: true,
  },
  {
    code: "05.2",
    title: "Custom software",
    body: "Bespoke web applications and internal tools. Scope varies, so there's no fixed price — tell us what you need and we'll quote it.",
    cta: "Message on WhatsApp",
    primary: false,
  },
];

export function Start() {
  return (
    <section id="05" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="START" code="05" descriptor="OFFERS" />
            <h2 className="t-display t-d2 mt-6 max-w-xl">
              Two ways
              <br />
              to start
              <br />
              a project.
            </h2>
          </div>

          <ul>
            {ROWS.map((row, index) => (
              <li
                key={row.code}
                className={`row-link grid grid-cols-1 gap-3 border-t border-hairline py-8 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-6 ${
                  index === ROWS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="t-mono text-graphite">{row.code}</span>
                <div data-reveal>
                  <h3 className="row-title t-ui text-2xl text-chalk md:text-3xl">
                    {row.title}
                  </h3>
                  <p className="t-lead mt-2 max-w-2xl text-graphite">{row.body}</p>
                </div>
                <a
                  data-reveal
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    row.primary
                      ? "t-mono self-start border border-signal bg-signal px-5 py-3 text-center text-void transition-opacity hover:opacity-85 sm:self-center"
                      : "t-mono self-start border border-hairline px-5 py-3 text-center text-chalk transition-colors hover:border-signal hover:text-signal sm:self-center"
                  }
                >
                  {row.cta}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
