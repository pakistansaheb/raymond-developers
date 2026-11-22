// Client sites shown in the hero deck and the Work grid. Screenshots live in
// public/images/work/{slug}.png (1440x900) and public/images/work/mobile/{slug}.jpg (780x1114).
export type Project = {
  name: string;
  slug: string;
  summary: string;
  href: string;
  kind: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Raymond Logistics",
    slug: "raymond-logistics",
    summary: "Service pages and a quote flow built to convert.",
    href: "https://raymondlogistics.co.uk",
    kind: "Courier",
  },
  {
    name: "Catering Solutionz",
    slug: "catering-solutionz",
    summary:
      "Kitchen equipment shop with a stock admin, Facebook import and a sell-to-us form.",
    href: "https://cateringsolutionz.com",
    kind: "Marketplace",
  },
  {
    name: "Ayrah Logistics",
    slug: "ayrah-logistics",
    summary:
      "Refrigerated transport site with a live quote tool that emails every enquiry.",
    href: "https://ayrahlogistics.com",
    kind: "Cold chain",
  },
  {
    name: "CM Courier Group",
    slug: "cm-courier-group",
    summary: "An instant quote tool built into the marketing site.",
    href: "https://cm-courier-group.vercel.app",
    kind: "Courier",
  },
  {
    name: "HP Cutz",
    slug: "hp-cutz",
    summary: "Booking flow that turns a browse into an appointment.",
    href: "https://hpcutz.com",
    kind: "Barber",
  },
];
