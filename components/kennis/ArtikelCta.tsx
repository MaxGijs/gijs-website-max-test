import Image from "next/image";
import { ENERGIESCAN_HREF } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { ArtikelCtaKnop } from "@/components/kennis/ArtikelCtaKnop";

/**
 * Afsluitende CTA van elk kennisartikel: donkergroen Gijs-blok met het witte logo, knop naar de
 * energiescan en het telefoonnummer. Eén component voor alle artikelen: de klik meet via
 * ArtikelCtaKnop als `kennis_artikel_cta_clicked` met de slug van het artikel.
 */
export function ArtikelCta({ slug, titel }: { slug: string; titel: string }) {
  return (
    <aside aria-label="Contact met Gijs" className="mt-12 rounded-[var(--radius-xl)] bg-[var(--gijs-donkergroen)] px-6 py-9 sm:px-10 sm:py-11 text-white">
      <Image src="/images/shared/logo/logo-white.png" alt="Gijs" width={912} height={520} className="h-auto w-[84px] sm:w-[96px]" />
      <p className="!mt-6 !mb-0 font-bold tracking-[-0.02em] text-white text-[clamp(1.25rem,1.05rem+0.6vw,1.625rem)] leading-[1.3] [text-wrap:balance]">
        {titel}
      </p>
      <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <ArtikelCtaKnop artikel={slug} href={ENERGIESCAN_HREF} variant="inverse" size="lg" iconRight="arrow-right" className="w-full sm:w-auto justify-center !whitespace-normal !h-auto min-h-[52px] py-3 text-center">
          Vraag een gratis energiescan aan
        </ArtikelCtaKnop>
        <p className="!m-0 text-[16px] text-white/85">
          of bel{" "}
          <a href={CONTACT.phoneHref} className="font-semibold text-white underline underline-offset-[3px] decoration-white/40 hover:decoration-white">{CONTACT.phone}</a>
        </p>
      </div>
      <p className="!mt-4 !mb-0 text-[15px] text-white/75">De energiescan aan huis is gratis en vrijblijvend, ter waarde van €349.</p>
    </aside>
  );
}
