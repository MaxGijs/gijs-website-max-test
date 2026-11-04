import Image from "next/image";
import Link from "next/link";
import type { GemeenteVerhaal } from "@/lib/content/gemeente-verhalen";
import { cbsWijkenVoor, normaliseerWijknaam } from "@/lib/content/cbs-wijken";
import { H2 } from "./RegioBlokken";
import { Icon } from "@/components/ds/core/Icon";
import { EYEBROW, LEAD, TEKST, BRON, BRONLINK, GRIJS_BLOK, WIT_BLOK, KAART_HOVER, RijkeTekst, RASTER, RASTER_CEL } from "./regio-template-styles";

// De eigen lokale onderdelen van een gemeente- of plaatsverhaal, in het ontwerp van de
// gedeelde lokale pagina. Alles komt uit het verhaal zelf; ontbreekt een onderdeel, dan wordt het niet getoond.

// Van oud naar nieuw: donker naar licht, gelijk aan de bouwperiodebalk.
const KLEUR = ["bg-[var(--gijs-donkergroen)]", "bg-[var(--accent-700)]", "bg-[var(--accent-600)]", "bg-[var(--accent-200)]"];

function Kop({ eyebrow, titel, lead }: { eyebrow: string; titel: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-4 mb-10 md:mb-12 max-w-3xl">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={H2}>{titel}</h2>
      {lead && <p className={LEAD}>{lead}</p>}
    </div>
  );
}

const KAARTTITEL = "text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const KAARTTEKST = "text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]";

/** Eén samengestelde wijk voor `WijkenGrid`: naam altijd aanwezig (CBS of handgeschreven),
 *  cijfers/periode/type alleen als er een betrouwbare bron voor is — nooit verzonnen. */
type SamengesteldeWijk = {
  naam: string; woningen?: number; periode?: string; tijdvak?: number | null; type?: string;
  koopwoningPercentage?: number;
  bouwjaarVerdeling?: { label: string; percentage: number }[];
};

/** Combineert de officiële CBS-wijken van een gemeente met de bestaande, handgeschreven
 *  wijkcijfers (als die er zijn), en sluit wijken uit die al een eigen, uitgebreide kaart hebben
 *  in `wijkInzichtenBlok` (zodat diezelfde wijk niet twee keer met verschillend detailniveau op
 *  de pagina staat). Zonder CBS-data voor deze gemeente: val terug op de bestaande handgeschreven
 *  lijst ongewijzigd, zodat niets verdwijnt. */
function samenstelWijkenLijst(v: GemeenteVerhaal, gemeenteSlug: string): SamengesteldeWijk[] {
  const cbs = cbsWijkenVoor(gemeenteSlug);
  if (cbs.length === 0) return v.lokaal.wijken?.lijst ?? [];
  const narratiefGedekt = new Set((v.wijkInzichtenBlok?.inzichten ?? []).map(i => normaliseerWijknaam(i.wijk)));
  const handmatig = new Map((v.lokaal.wijken?.lijst ?? []).map(w => [normaliseerWijknaam(w.naam), w] as const));
  return cbs
    .filter(w => !narratiefGedekt.has(normaliseerWijknaam(w.naam)))
    .map(w => handmatig.get(normaliseerWijknaam(w.naam)) ?? { naam: w.naam });
}

/** De bouwperiode met het hoogste percentage uit een volledige wijk-bouwjaarverdeling, voor een
 *  compacte samenvattingsregel in de kaart (geen losse pagina/knop nodig voor de volledige tabel). */
function dominanteBouwperiode(verdeling: { label: string; percentage: number }[]) {
  return verdeling.reduce((max, p) => (p.percentage > max.percentage ? p : max), verdeling[0]);
}

function WijkKaart({ w, className }: { w: SamengesteldeWijk; className: string }) {
  const heeftCijfers = w.woningen !== undefined || !!w.type;
  const dominant = w.bouwjaarVerdeling && w.bouwjaarVerdeling.length > 0 ? dominanteBouwperiode(w.bouwjaarVerdeling) : undefined;
  return (
    <li className={`${className} flex flex-col gap-1 rounded-[var(--radius-lg)] bg-[var(--grey-050)] p-5 ${KAART_HOVER}`}>
      <span className="flex items-center gap-2 text-[16px] font-semibold text-[var(--gijs-donkergroen)]">
        {w.tijdvak !== undefined && (
          <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${w.tijdvak === null ? "bg-[var(--grey-200)]" : KLEUR[w.tijdvak % KLEUR.length]}`} />
        )}
        {w.naam}
      </span>
      {w.periode && <span className="text-[15px] text-zinc-700">{w.periode}</span>}
      {heeftCijfers && (
        <span className="text-[14px] text-[var(--text-muted)]">
          {w.woningen ? `${w.woningen.toLocaleString("nl-NL")} woningen${w.type ? ` · meest ${w.type}` : ""}` : `meest ${w.type}`}
        </span>
      )}
      {w.koopwoningPercentage !== undefined && (
        <span className="text-[14px] text-[var(--text-muted)]">{w.koopwoningPercentage}% koopwoning</span>
      )}
      {dominant && (
        <span className="text-[14px] text-[var(--text-muted)]">Grotendeels {dominant.label.toLowerCase()} ({dominant.percentage}%)</span>
      )}
    </li>
  );
}

/** Compacte, uitklapbare grid met officiële CBS-wijken. Geen eigen heading: nest onder de ene
 *  bestaande kop van de sectie. `heeftNarratief` bepaalt het label: wanneer een deel van de
 *  wijken al als uitgebreide kaart elders op de pagina staat, maakt het label duidelijk dat dit
 *  de óverige wijken zijn, niet een tweede/parallelle lijst. */
function WijkenGrid({ wijken, naam, heeftNarratief, bron }: {
  wijken: SamengesteldeWijk[];
  naam: string;
  heeftNarratief: boolean;
  bron?: { naam: string; url: string };
}) {
  if (wijken.length === 0) return null;
  const MAX = 6;
  const inline = wijken.slice(0, MAX);
  const rest = wijken.slice(MAX);
  return (
    <div>
      <p className={EYEBROW}>{heeftNarratief ? `Overige wijken in ${naam}` : `Wijken binnen ${naam}`}</p>
      <ul className={`${RASTER} gap-4 mt-4`}>
        {inline.map((w, i, arr) => <WijkKaart key={w.naam} w={w} className={RASTER_CEL(arr.length, i)} />)}
      </ul>
      {rest.length > 0 && (
        <details className="group mt-4">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-[var(--border-default)] px-5 py-3 text-[15px] font-semibold text-[var(--gijs-donkergroen)] transition-colors duration-[var(--dur-base)] hover:border-[var(--accent-700)] hover:text-[var(--accent-700)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Toon meer wijken</span>
            <span className="hidden group-open:inline">Toon minder wijken</span>
            <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
          </summary>
          <ul className={`${RASTER} gap-4 mt-4`}>
            {rest.map((w, i, arr) => <WijkKaart key={w.naam} w={w} className={RASTER_CEL(arr.length, i)} />)}
          </ul>
        </details>
      )}
      {bron && (
        <p className={BRON + " mt-4"}>
          Bron: <a href={bron.url} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{bron.naam}</a>
        </p>
      )}
    </div>
  );
}

/** De tekstkaarten "Waar is X bekend om?", als één gedeelde component voor alle gemeenten die
 *  `bekendVan` gebruiken. Gelijke breedte en consistente opmaak in elke combinatie; bij 4 of meer
 *  kaarten (nu nergens in de data) een 2-koloms grid zodat de compositie evenwichtig blijft in
 *  plaats van een lange, ongelijkmatige stapel. */
function BekendVanKaarten({ titel, kaarten }: { titel: string; kaarten: { titel: string; tekst: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className={EYEBROW}>{titel}</p>
      <div className={kaarten.length >= 4 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {kaarten.map(k => (
          <div key={k.titel} className={`flex h-full flex-col gap-2 rounded-[var(--radius-lg)] bg-[var(--grey-050)] p-6 ${KAART_HOVER}`}>
            <span className={KAARTTITEL}>{k.titel}</span>
            <span className={KAARTTEKST}>{k.tekst}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WijkInzichten({ blok }: { blok: NonNullable<GemeenteVerhaal["wijkInzichtenBlok"]> }) {
  return (
    <div className={GRIJS_BLOK}>
      <h3 className="text-[clamp(1.375rem,1.1rem+0.9vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--gijs-donkergroen)] mb-3">{blok.titel}</h3>
      <p className={TEKST + " max-w-3xl mb-8"}>{blok.intro}</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {blok.inzichten.map(i => (
          <li key={i.nummer} className={WIT_BLOK + " flex flex-col gap-3"}>
            <div>
              <p className="font-semibold text-[var(--gijs-donkergroen)] leading-tight">{i.wijk}</p>
              <p className="text-[13px] text-zinc-500">{i.wijkLabel}</p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-[2.5rem] font-bold leading-none tracking-[-0.04em] text-[var(--gijs-donkergroen)]">{i.percentage}</span>
              <span className="text-[14px] text-[var(--text-muted)]">{i.bouwperiode}</span>
            </p>
            <h4 className={KAARTTITEL}>{i.h3}</h4>
            {i.alineas.map(a => <p key={a.slice(0, 24)} className={KAARTTEKST}>{a}</p>)}
          </li>
        ))}
      </ul>
      <p className={BRON + " mt-5"}>{blok.bron}</p>
    </div>
  );
}

/** Het lokale verhaal van de plaats: tekst, waar de plaats bekend van is, wijken en wat er speelt.
 *  `gemeenteSlug` koppelt de officiële CBS-wijken (zie `samenstelWijkenLijst`). De optionele
 *  blokken staan samen in één flex-kolom met een consistente gap, zodat het aantal aanwezige
 *  blokken niet leidt tot steeds grotere, los opgetelde marges (zie regio-template-styles.tsx). */
export function LokaalVerhaalSectie({ v, naam, gemeenteSlug, className }: { v: GemeenteVerhaal; naam: string; gemeenteSlug: string; className: string }) {
  const l = v.lokaal;
  const wijkenLijst = samenstelWijkenLijst(v, gemeenteSlug);
  const heeftWijkenBlok = !!v.wijkInzichtenBlok || wijkenLijst.length > 0;
  return (
    <section id="lokaal" className={className}>
      {/* Zonder bekendVan: de kop staat boven de volledige breedte. Met bekendVan: de kop
          staat in de linkerkolom zodat "Waar is X bekend om?" op dezelfde hoogte begint. */}
      {!l.bekendVan && <Kop eyebrow={`Lokaal in ${naam}`} titel={l.titel} />}
      <div className={`grid grid-cols-1 gap-10 items-start ${l.bekendVan ? "lg:grid-cols-[3fr_2fr] lg:gap-14" : ""}`}>
        <div className="flex flex-col gap-4 max-w-3xl">
          {l.bekendVan && <Kop eyebrow={`Lokaal in ${naam}`} titel={l.titel} />}
          {l.alineas.map((a, n) => <RijkeTekst key={n} alinea={a} className={TEKST} />)}
          {l.lokaalAfbeelding && (
            <div className="relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
              <Image src={l.lokaalAfbeelding} alt={`Lokaal erfgoed in ${naam}`} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            </div>
          )}
        </div>
        {l.bekendVan && <BekendVanKaarten titel={l.bekendVan.titel} kaarten={l.bekendVan.kaarten} />}
      </div>

      <div className="mt-10 md:mt-12 flex flex-col gap-8 md:gap-10">
        {heeftWijkenBlok && (
          <div className="flex flex-col gap-8 md:gap-10">
            {v.wijkInzichtenBlok && <WijkInzichten blok={v.wijkInzichtenBlok} />}
            {wijkenLijst.length > 0 && (
              <WijkenGrid wijken={wijkenLijst} naam={naam} heeftNarratief={!!v.wijkInzichtenBlok} bron={l.wijken?.bron} />
            )}
          </div>
        )}

        {v.persoonlijkAdviesBlok?.checklist && (
          <div className={`flex flex-col gap-3 rounded-[var(--radius-lg)] bg-[var(--grey-050)] p-6 sm:p-8 ${KAART_HOVER}`}>
            <p className="text-[17px] font-semibold text-[var(--gijs-donkergroen)]">Wat kun je verwachten?</p>
            <ul className="flex flex-col gap-2">
              {v.persoonlijkAdviesBlok.checklist.map(item => (
                <li key={item} className="flex items-start gap-2 text-[15px] leading-snug text-zinc-700">
                  <Icon name="check" size="sm" className="mt-0.5 shrink-0 text-[var(--accent-700)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={`flex flex-col gap-2 rounded-[var(--radius-lg)] bg-[var(--grey-050)] p-6 sm:p-8 ${KAART_HOVER}`}>
          <p className="text-[17px] font-semibold text-[var(--gijs-donkergroen)]">{l.ontwikkeling.titel}</p>
          <p className={KAARTTEKST + " max-w-3xl"}>{l.ontwikkeling.tekst}</p>
        </div>
      </div>
    </section>
  );
}

/** Vier isolatiekaarten met foto, direct na het lokale verhaal. */
export function IsolatieKaartenSectie({ k, className }: { k: NonNullable<GemeenteVerhaal["isolatieKaarten"]>; className: string }) {
  return (
    <section className={className}>
      <Kop eyebrow="Isolatie in de praktijk" titel={k.h2} lead={k.intro} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {k.kaarten.map(c => (
          <li key={c.naam}>
            <Link href={c.href} className="group no-underline block h-full">
              <div className="h-full flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--grey-050)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
                {c.afbeelding && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image src={c.afbeelding} alt={c.naam} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className={KAARTTITEL}>{c.naam}</span>
                  <span className={KAARTTEKST + " flex-1"}>{c.tekst}</span>
                  <span className="mt-2 text-[15px] font-semibold text-[var(--accent-700)]">Meer over {c.naam.toLowerCase()} <span aria-hidden="true">&rarr;</span></span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Lokale samenwerking (bijvoorbeeld een buurtpartner), zoals die al op de pagina stond. */
export function PartnerSectie({ partner, className }: { partner: NonNullable<GemeenteVerhaal["partner"]>; className: string }) {
  return (
    <section id="samenwerking" className={className}>
      <div className={`flex flex-col md:flex-row items-center md:items-start gap-8 rounded-[var(--radius-xl)] bg-[var(--grey-050)] p-8 md:p-10 ${KAART_HOVER}`}>
        <a href={partner.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <Image src={partner.logo} alt={`Logo van ${partner.naam}`} width={138} height={150} unoptimized className="rounded-2xl" />
        </a>
        <div className="flex flex-col gap-3">
          <p className={EYEBROW}>Lokale samenwerking</p>
          <h2 className={H2}>{partner.naam}</h2>
          <p className={TEKST + " max-w-2xl"}>{partner.tagline}</p>
          <a href={partner.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--accent-700)] underline underline-offset-4">
            {partner.urlLabel}
            <Icon name="external-link" size="sm" />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Lokaal onderwerp: natuurvriendelijk isoleren. */
export function NatuurSectie({ natuur, className }: { natuur: NonNullable<GemeenteVerhaal["natuur"]>; className: string }) {
  return (
    <section id="natuurvriendelijk-isoleren" className={className}>
      <div className={GRIJS_BLOK + " grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-start"}>
        <div className="flex flex-col gap-4">
          <p className={EYEBROW}>Goed om te weten</p>
          <h2 className={H2}>{natuur.titel}</h2>
          <p className={TEKST}>{natuur.lead}</p>
          <p className={KAARTTEKST}>{natuur.zelf}</p>
          <p className={BRON}>
            Bron: <a href={natuur.bron.url} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{natuur.bron.naam}</a>.
          </p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          {natuur.stappen.map(s => (
            <li key={s.titel} className={WIT_BLOK + " flex flex-col gap-2"}>
              <span className={KAARTTITEL}>{s.titel}</span>
              <span className={KAARTTEKST}>{s.tekst}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
