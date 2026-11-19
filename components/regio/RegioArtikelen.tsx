import { ArtikelKaarten } from "@/components/kennis/ArtikelKaarten";
import { EYEBROW } from "./regio-template-styles";

// Pagina's (gemeente, of gemeente/plaats) waar kennisartikelen als kaarten worden getoond, met de
// slugs die daar horen. Algemene artikelen staan op alle genoemde pagina's; een lokaal artikel
// (Apeldoorn) alleen op zijn eigen pagina.
export const ALGEMENE_ARTIKELEN = ["salderen-stopt-2027-thuisbatterij", "slimme-warmtepomp-subsidie-2027"];
const ARTIKELEN_PER_PAGINA: Record<string, string[]> = {
  hardenberg: ALGEMENE_ARTIKELEN,
  nijkerk: ALGEMENE_ARTIKELEN,
  ijsselstein: ALGEMENE_ARTIKELEN,
  hengelo: ALGEMENE_ARTIKELEN,
  "overbetuwe/elst": ALGEMENE_ARTIKELEN,
  apeldoorn: ["warmtenet-kerschoten-verduurzamen-apeldoorn"],
};

const sleutel = (gemeenteSlug: string, plaatsSlug?: string) => (plaatsSlug ? `${gemeenteSlug}/${plaatsSlug}` : gemeenteSlug);

/** Kennisartikelen als dezelfde kaarten als op /kennis. Rendert niets op pagina's buiten de lijst. */
export function RegioArtikelen({ gemeenteSlug, plaatsSlug, className }: { gemeenteSlug: string; plaatsSlug?: string; className?: string }) {
  const slugs = ARTIKELEN_PER_PAGINA[sleutel(gemeenteSlug, plaatsSlug)];
  if (!slugs) return null;
  return (
    <section id="kennis" className={className}>
      <div className="flex flex-col gap-2 mb-6 max-w-3xl">
        <p className={EYEBROW}>Kennis</p>
        <h2 className="text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">Goed om te weten voor je begint</h2>
      </div>
      <ArtikelKaarten slugs={slugs} compact />
    </section>
  );
}
