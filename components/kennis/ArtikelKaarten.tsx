import Image from "next/image";
import Link from "next/link";
import { KENNIS_ARTIKELEN, kennisArtikelPad, artikelOvergangId, formatteerDatum, type KennisArtikel } from "@/lib/content/kennis-artikelen";
import { OVERGANG_TYPES, titelOvergang } from "@/lib/overgang";
import { FotoOvergang } from "@/components/FotoOvergang";
import { KAARTKOP, KAARTTEKST, RASTER, RASTER_CEL } from "@/components/regio/regio-template-styles";

// Artikelkaarten op /kennis, in dezelfde stijl als de isolatiekaarten op de regio- en
// maatregelpagina's: foto boven, lichtgrijs vlak, titel, korte tekst, "Lees het artikel".
// Nieuwste artikel eerst. Raster volgt het aantal (RASTER_CEL: geen half gevulde rijen); bij één
// artikel wordt het één brede kaart met de foto links.
const KAART = "h-full flex overflow-hidden rounded-[var(--radius-lg)] bg-[var(--grey-050)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]";

function Kaart({ a, breed, compact = false }: { a: KennisArtikel; breed: boolean; compact?: boolean }) {
  return (
    <Link href={kennisArtikelPad(a.slug)} transitionTypes={OVERGANG_TYPES} className="group no-underline block h-full">
      <div className={KAART + (breed ? " flex-col md:flex-row" : " flex-col")}>
        {/* Foto en titel delen hun overgangsnaam met het artikel (lib/overgang.ts). */}
        <FotoOvergang id={artikelOvergangId(a.slug)}>
          <div className={"relative w-full overflow-hidden " + (breed ? (compact ? "aspect-[16/9] md:aspect-auto md:w-[32%] md:min-h-[190px]" : "aspect-[4/3] md:aspect-auto md:w-[45%] md:min-h-[300px]") : (compact ? "aspect-[16/9]" : "aspect-[4/3]"))}>
            <Image src={a.afbeelding.path} alt={a.afbeelding.alt} fill sizes={breed ? "(max-width: 768px) 100vw, 45vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover" />
          </div>
        </FotoOvergang>
        <div className={"flex flex-1 flex-col gap-2 p-6" + (breed ? (compact ? " md:p-7 md:justify-center" : " md:p-10 md:justify-center") : "")}>
          <time dateTime={a.gepubliceerd} className="text-[14px] font-semibold text-[var(--accent-700)]">{formatteerDatum(a.gepubliceerd)}</time>
          {/* Zelfde overgangsnaam als de H1 van het artikel: de titel groeit mee naar de pagina. */}
          <span className={"block " + KAARTKOP + (breed && !compact ? " md:text-[24px]" : "")} style={titelOvergang(artikelOvergangId(a.slug))}>{a.titel}</span>
          <span className={KAARTTEKST + " flex-1"}>{a.intro}</span>
          <span className="mt-2 text-[15px] font-semibold text-[var(--accent-700)]">Lees het artikel <span aria-hidden="true">&rarr;</span></span>
        </div>
      </div>
    </Link>
  );
}

/** Alle artikelen (op /kennis), of alleen de opgegeven slugs (bijvoorbeeld op een maatregelpagina). */
export function ArtikelKaarten({ slugs, compact = false }: { slugs?: string[]; compact?: boolean } = {}) {
  const artikelen = KENNIS_ARTIKELEN
    .filter(a => (slugs ? slugs.includes(a.slug) : !a.alleenRegio))
    .sort((x, y) => y.gepubliceerd.localeCompare(x.gepubliceerd));
  const n = artikelen.length;
  return (
    <ul className={RASTER + " gap-4 lg:gap-5 list-none p-0 m-0"}>
      {artikelen.map((a, i) => (
        <li key={a.slug} className={RASTER_CEL(n, i)}>
          <Kaart a={a} breed={n === 1} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
