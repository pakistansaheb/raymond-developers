import { RegistryRail } from "@/components/RegistryRail";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Start } from "@/components/sections/Start";
import { Work } from "@/components/sections/Work";

export default function HomePage() {
  return (
    <>
      <RegistryRail />
      <SiteHeader />
      <main>
        <Hero />
        <Capabilities />
        <Work />
        <Process />
        <Start />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
