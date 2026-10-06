import Image from "next/image";

// Aangeleverd Gijs-beeld (duurzame wijk aan het water, woningen met
// zonnepanelen) uit de marketing-ZIP.
//
// Bewust geen eigen "Start de woningscan"-CTA hier: die staat al vlak
// hierboven in het homepage_woning-overzicht, en kort daarna volgt de
// energiescan-CTA. Drie keer dezelfde soort knop binnen een paar
// scrollstappen voelde op mobiel repetitief.
export default function EenheidBanner() {
  return (
    <section className="bg-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="relative mx-auto w-full max-w-[1280px] aspect-[851/315] max-h-[460px] overflow-hidden rounded-[24px] sm:rounded-[32px]">
        <Image
          src="/images/over-gijs/hero/duurzame-wijk.png"
          alt="Duurzame wijk aan het water met woningen met zonnepanelen"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
