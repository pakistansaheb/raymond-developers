import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

const ITEMS = [
  {
    n: "06.1",
    q: "What does hosting include?",
    a: "Your site stays live, served fast, with SSL and your domain connected. £20 covers hosting itself — it doesn't include content edits, SEO work or support hours. New work like that is quoted separately.",
  },
  {
    n: "06.2",
    q: "What happens if I cancel?",
    a: "Email us. Hosting stops — no notice period, no cancellation fee, no retention call. You've paid in advance, so it runs until the end of whatever period was last invoiced.",
  },
  {
    n: "06.3",
    q: "Do I own my site and code?",
    a: "Yes. What we build is yours. Cancelling hosting doesn't affect ownership — it only affects whether we're the ones keeping it live.",
  },
  {
    n: "06.4",
    q: "How long does a build take?",
    a: "It depends on scope. A brochure site is faster than a booking system with staff logins. You get a specific timeline in the proposal, before you commit to anything.",
  },
  {
    n: "06.5",
    q: "How do I pay?",
    a: "By direct bank transfer, against an invoice we send you — for the £200 website, for hosting each month, and for custom software against the scope in your proposal. No card details are ever collected.",
  },
  {
    n: "06.6",
    q: "Can I ask you to make changes after launch?",
    a: "Yes — get in touch and we'll quote it. It's separate from the hosting fee, which covers keeping the site live rather than ongoing work on it.",
  },
  {
    n: "06.7",
    q: "What's the difference between the £200 website and custom software?",
    a: "The £200 website is a fixed package: three or more pages with a booking or quote system built in, invoiced at that price once we've scoped it from your enquiry. Custom software is a bespoke web application or internal tool built around your process — scope and price vary, so it's quoted after a conversation rather than bought off the shelf.",
  },
];

export function Faq() {
  return (
    <section id="06" className="bleed-rule px-6 py-24 md:px-10 md:py-32 xl:pl-28">
      <div className="mx-auto max-w-measure">
        <Reveal className="flex flex-col gap-10">
          <div data-reveal>
            <Eyebrow label="FAQ" code="06" descriptor="ANSWERS" />
            <h2 className="t-display t-d2 mt-6 max-w-xl">
              Questions,
              <br />
              answered
              <br />
              plainly.
            </h2>
          </div>

          <div>
            {ITEMS.map((item) => (
              <details
                key={item.n}
                data-reveal
                className="group border-t border-hairline py-2 last:border-b"
              >
                <summary className="flex min-h-11 items-center justify-between gap-6 py-4 outline-none">
                  <span className="flex items-baseline gap-4 sm:gap-6">
                    <span className="t-mono shrink-0 text-graphite">{item.n}</span>
                    <span className="t-ui text-lg text-chalk md:text-xl">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="fq-sign t-display shrink-0 text-2xl text-graphite group-hover:text-signal"
                  >
                    +
                  </span>
                </summary>
                <p className="t-lead mt-4 max-w-2xl pl-0 text-graphite sm:pl-[4.75rem]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
