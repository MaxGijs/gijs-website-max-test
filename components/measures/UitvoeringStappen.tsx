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
// "maatregelen/dakisolatie/proces/dakisolatie-stap-1.svg").
const IMAGES_DIR = path.join(process.cwd(), "public", "images");

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
// - Mobiel (< sm): horizontaal swipebaar met CSS scroll-snap, geen eigen
//   carousel-logica. Kaart ca. 78vw breed (max 280px): ruim 1 kaart in
//   beeld, met een stukje van de volgende ernaast als "er komt meer"-hint.
//   -mx-6/px-6 laat de rij edge-to-edge scrollen; alle maatregelpagina's
//   hebben hetzelfde main-element met px-6, dus dat is veilig om hier aan
//   te nemen (zie de aanroepende *Page.tsx-bestanden).
// - Vaste stapbreedte op desktop (geen flex-1): meer stappen maakt de rij
//   breder, niet elke stap groter, en alle pagina's hebben dezelfde schaal.
// - Een dunne tijdlijnlijn (geen pijl-in-cirkel) staat in een eigen kolom
//   tussen de stappen (vanaf xl, zie hieronder), op 33% van de hoogte: het
//   midden van het donkere icoonbolletje in de stap-illustratie zelf.
// Tablet: twee rijen (kolommen = helft van het aantal stappen), gecentreerd,
// zonder pijl. Pas vanaf xl één rij met pijl, zodat de uitleg tussen 1024
// en 1280px leesbaar blijft.
export function UitvoeringStappen({ stappen }: { stappen: UitvoeringStap[] }) {
  const kolommen = Math.ceil(stappen.length / 2);
  return (
    <div className="relative">
      {/* Kaarten bewust smaller dan het scherm (58vw i.p.v. bijna edge-to-edge) zodat het
          volgende kaartje al zichtbaar meekomt — dat signaleert "hier kan geswiped worden"
          zonder een los pijltje/dots-indicator nodig te hebben. De gradient hieronder maakt dat
          nog iets duidelijker. Alleen relevant op mobiel: vanaf sm wrapt de rij vanzelf. */}
      <ol
        className="flex flex-row items-stretch gap-4 overflow-x-auto -mx-6 px-6 pb-1 snap-x snap-mandatory sm:flex-wrap sm:items-center sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:gap-x-6 sm:gap-y-8 sm:justify-center sm:snap-none xl:flex-nowrap xl:items-stretch xl:gap-0"
        style={{ "--stap-tablet": `min(180px, calc((100% - ${(kolommen - 1) * 1.5}rem) / ${kolommen}))` } as CSSProperties}
        tabIndex={0}
        aria-label={`Stappen van de uitvoering, ${stappen.length} in totaal. Met pijltjestoetsen te scrollen.`}
      >
        {stappen.map((stap, i) => (
          <Fragment key={stap.bestand}>
            <li className="w-[58vw] max-w-[210px] shrink-0 snap-start sm:w-(--stap-tablet) sm:max-w-none sm:shrink sm:snap-align-none xl:w-[140px] xl:min-w-0">
            {/* Stapnummer + titel staan al in de SVG getekend (vector, geen echte tekstnode) en
                via aria-label op die SVG. Deze regel maakt diezelfde twee gegevens ook als
                gewone, selecteerbare/crawlbare DOM-tekst leesbaar, zonder de visuele SVG te
                vervangen en zonder nieuwe uitlegzinnen te verzinnen. */}
            <p className="sr-only">Stap {i + 1}: {stap.label}</p>
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
            <li aria-hidden="true" className="hidden xl:relative xl:mx-1 xl:block xl:w-6 xl:shrink-0">
              {/* Rustige tijdlijnlijn i.p.v. een pijl-in-cirkel: dezelfde hoogte (33%, het
                  midden van het donkere icoonbolletje in de stap-illustratie zelf) als
                  voorheen de pijl, alleen minder "AI/UI-component"-achtig. */}
              <div className="absolute inset-x-0 top-[33%] h-px -translate-y-1/2 bg-[var(--border-default)]" />
            </li>
          ) : null}
        </Fragment>
        ))}
      </ol>
      {/* Zichtbaar fade-randje rechts: visuele hint dat er meer kaarten volgen. Alleen nodig op
          mobiel (horizontale scroll); vanaf sm wrapt de rij en is scrollen niet meer van
          toepassing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent sm:hidden"
      />
    </div>
  );
}
