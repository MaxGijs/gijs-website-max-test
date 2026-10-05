import fs from "fs";
import path from "path";
import { Fragment, type CSSProperties } from "react";

export type UitvoeringStap = {
  bestand: string;
  label: string;
  // Alleen voor bekende kapotte bronbestanden (isolatieglas stap 5/6): de
  // ingebakken uitlegzin wordt weggesneden en vervangen door deze tekst, in
  // een HTML-vlak dat de stijl van de correcte uitlegvlakken nabootst.
  uitlegOverride?: string;
};

// Aandeel van de beeldhoogte dat icoon + badge + titel inneemt; het
// lichtgroene uitlegvlak begint daarna (gemeten op isolatieglas-stap-5/6.svg).
const UITLEG_CROP_FRACTIE = 0.647;

// `bestand` is een pad relatief aan public/images (bijv.
// "maatregelen/dakisolatie/proces/dakisolatie-stap-1.svg"); de gedeelde
// pijl staat in public/images/shared/icons/pijl.svg.
const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const PIJL_BESTAND = "shared/icons/pijl.svg";

// De stap-SVG's en pijl.svg worden rechtstreeks (inline) in de pagina gezet
// in plaats van via <img src="...svg">. Reden: bij een extern ingeladen
// SVG-bestand bepaalt de browser zelf wanneer/hoe die opnieuw als vector
// wordt getekend; inline SVG is gewoon onderdeel van de pagina zelf en wordt
// altijd als vector gerenderd, op elk formaat en elk scherm (ook Retina) —
// dat sluit een categorie "ziet er ergens anders toch iets zachter uit" uit.
// De tekening zelf verandert hierdoor niet: exact dezelfde bestandsinhoud.
function inlineSvg(bestand: string, opts: { className: string; ariaLabel?: string }) {
  const raw = fs.readFileSync(path.join(IMAGES_DIR, bestand), "utf8");
  const start = raw.indexOf("<svg");
  let svg = raw.slice(start).replace(/<script[\s\S]*?<\/script>/gi, "");
  const aria = opts.ariaLabel
    ? `role="img" aria-label="${opts.ariaLabel.replace(/"/g, "&quot;")}"`
    : 'aria-hidden="true"';
  svg = svg.replace(/<svg\b([^>]*)>/, (_m, attrs: string) => {
    const schoon = attrs.replace(/\s(width|height|preserveAspectRatio)="[^"]*"/g, "");
    return `<svg${schoon} class="${opts.className}" preserveAspectRatio="xMidYMid meet" ${aria}>`;
  });
  return svg;
}

// Gedeelde "Hoe verloopt de uitvoering?"-rij voor alle maatregelpagina's.
// - Vaste stapbreedte op desktop (geen flex-1): meer stappen maakt de rij
//   breder, niet elke stap groter, en alle pagina's hebben dezelfde schaal.
// - pijl.svg staat in een eigen kolom tussen de stappen. Elke stap-SVG heeft
//   een volledig witte achtergrond; een pijl die over de rand van een stap
//   hangt, wordt door de volgende stap afgedekt.
// - Pijl op 33% van de hoogte: het midden van het donkere icoonbolletje.
// Tablet: twee rijen (kolommen = helft van het aantal stappen), gecentreerd.
// Pas vanaf xl één rij, zodat de uitleg tussen 1024 en 1280px leesbaar blijft.
export function UitvoeringStappen({ stappen }: { stappen: UitvoeringStap[] }) {
  const kolommen = Math.ceil(stappen.length / 2);
  return (
    <ol
      className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-8 xl:flex-nowrap xl:items-stretch xl:gap-0"
      style={{ "--stap-tablet": `min(180px, calc((100% - ${(kolommen - 1) * 1.5}rem) / ${kolommen}))` } as CSSProperties}
    >
      {stappen.map((stap, i) => (
        <Fragment key={stap.bestand}>
          <li className="w-52 sm:w-(--stap-tablet) xl:w-[140px] xl:min-w-0">
            <div className="aspect-[285/352] w-full flex flex-col">
              {stap.uitlegOverride ? (
                <>
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ height: `${UITLEG_CROP_FRACTIE * 100}%` }}
                    dangerouslySetInnerHTML={{
                      __html: inlineSvg(stap.bestand, {
                        className: "absolute inset-x-0 top-0 w-full h-auto",
                        ariaLabel: `Stap ${i + 1}: ${stap.label}`,
                      }),
                    }}
                  />
                  <div
                    className="mt-1 flex flex-1 items-center justify-center rounded-[var(--radius-card)] px-2 text-center text-xs font-medium leading-snug text-white sm:text-sm xl:text-xs"
                    style={{ backgroundColor: "rgba(0, 167, 122, 0.59)" }}
                  >
                    {stap.uitlegOverride}
                  </div>
                </>
              ) : (
                <div
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{
                    __html: inlineSvg(stap.bestand, {
                      className: "h-full w-full",
                      ariaLabel: `Stap ${i + 1}: ${stap.label}`,
                    }),
                  }}
                />
              )}
            </div>
          </li>
          {i < stappen.length - 1 ? (
            <li
              aria-hidden="true"
              className="flex justify-center py-5 sm:hidden xl:relative xl:mx-2 xl:block xl:w-7 xl:shrink-0 xl:py-0"
              dangerouslySetInnerHTML={{
                __html: inlineSvg(PIJL_BESTAND, {
                  className:
                    "h-6 w-auto max-w-none rotate-90 xl:absolute xl:inset-x-0 xl:top-[33%] xl:h-auto xl:w-full xl:-translate-y-1/2 xl:rotate-0",
                }),
              }}
            />
          ) : null}
        </Fragment>
      ))}
    </ol>
  );
}
