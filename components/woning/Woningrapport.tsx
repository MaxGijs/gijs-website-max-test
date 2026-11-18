"use client";
import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Kans, Woningrapport as Rapport } from "@/lib/woningrapport";
import { BOUWPERIODE_LABEL } from "@/lib/energie-schatting";
import { MAATREGEL_BEELD } from "@/lib/content/maatregel-beelden";
import { FINANCIEEL_BRONNEN } from "@/lib/content/verduurzaming-financieel";
import { MC_BRONNEN } from "@/lib/content/milieu-centraal";
import { zoekSubsidies } from "@/app/subsidiecheck/actions";
import { BRON_MILIEU_CENTRAAL, type SubsidieRegeling } from "@/lib/milieu-centraal/types";
import { RegelingenInScan } from "@/components/subsidie/RegelingenInScan";
import { Checkbox } from "@/components/ds/forms/Checkbox";
import { Icon } from "@/components/ds/core/Icon";
// Bewust dezelfde stijlklassen als de rest van de woningscan (WoningFlow), zodat het rapport er hetzelfde
// uitziet als de bestaande stap 3.
import flow from "./WoningFlow.module.css";
import styles from "./Woningrapport.module.css";

// Stap 3 van de woningscan: één verhaal (review 17-11-2026):
//   1. dit is waarschijnlijk je volgende beste stap (de eerste kans, standaard open)
//   2. waarom deze maatregel eerst
//   3. wat het waarschijnlijk oplevert (indicaties) en mogelijke subsidie
//   4. wil je de kosten weten? Gijs controleert de woning (CTA; het formulier opent pas na klikken)
//   5. daarna: overige kansen, waarom integraal advies, woningdetails, bronnen
// Subsidie komt UITSLUITEND uit de koppeling met de Energiesubsidiewijzer van Milieu Centraal (zoekSubsidies,
// per adres); Gijs rekent zelf geen subsidiebedragen uit. Geen investeringsprijzen: die volgen na controle.

const KANS_GROEPEN = [
  { label: "Installaties", ids: ["zonnepanelen", "warmtepomp", "vloerverwarming", "thuisbatterij"] },
  { label: "Isolaties", ids: ["dakisolatie", "gevelisolatie", "vloerisolatie", "glas-kozijnen"] },
];

/** Subsidies en regelingen voor dit adres uit de Energiesubsidiewijzer; null = (nog) niet beschikbaar. */
function useRegelingen(postcode: string, huisnummer: string) {
  const [uitkomst, setUitkomst] = useState<{ voor: string; regelingen: SubsidieRegeling[] | null } | null>(null);
  const sleutel = `${postcode}|${huisnummer}`;
  useEffect(() => {
    if (!postcode) return;
    let weg = false;
    zoekSubsidies(postcode, huisnummer)
      .then(u => { if (!weg) setUitkomst({ voor: sleutel, regelingen: u.status === "ok" ? u.regelingen : null }); })
      .catch(() => { if (!weg) setUitkomst({ voor: sleutel, regelingen: null }); });
    return () => { weg = true; };
  }, [postcode, huisnummer, sleutel]);
  return uitkomst && uitkomst.voor === sleutel ? uitkomst.regelingen : null;
}

export function Woningrapport({ rapport, naamVan, slugVan, gekozen, onKies, onBekijk, woningplan, formulier, postcode, huisnummer }: {
  rapport: Rapport;
  naamVan: (id: string) => string;
  slugVan: (id: string) => string;
  /** Kansen die de bewoner met Gijs wil bespreken (scan.measures). */
  gekozen: string[];
  onKies: (id: string) => void;
  /** Laat een kans in de 3D-woning zien (hover of toetsenbordfocus); null = hele woning. */
  onBekijk: (id: string | null) => void;
  /** Het woningplan achter de e-mailgate (uit WoningFlow): prijsindicatie, besparing, terugverdientijd. */
  woningplan?: ReactNode;
  /** De waardepropositie en het aanvraagformulier (uit WoningFlow), direct zichtbaar onder de CTA. */
  formulier: ReactNode;
  postcode: string;
  huisnummer: string;
}) {
  const eerste = rapport.kansen.find(k => k.aanbevolen) ?? rapport.kansen[0];
  const regelingen = useRegelingen(postcode, huisnummer);
  const regelingenVoor = (id: string) => (regelingen ?? []).filter(r => r.voor.includes(id));
  const eersteRegelingen = eerste && regelingen ? regelingenVoor(eerste.id) : null;
  const adviesTegels = eerste ? [
    { label: "Besparing", waarde: eerste.kort.besparing ?? "Rekent je adviseur uit" },
    { label: "Subsidie voor jouw adres", waarde: subsidieTekst(eersteRegelingen) },
    { label: "Comfort", waarde: eerste.comfortKort },
    { label: "Terugverdientijd", waarde: eerste.kort.terugverdientijd ? `${eerste.kort.terugverdientijd} zonder subsidie` : "Rekent je adviseur uit" },
  ] : [];

  return (
    <section className={styles.rapport}>
      <h3 className={styles.hoofdKop}>Wat kun je nog doen?</h3>
      <p className={flow.uitleg}>
        {eerste
          ? "Dit zijn de kansen die nu het meest logisch zijn om te onderzoeken. Vink aan waar je meer over wilt weten; Gijs controleert wat echt past en welke combinatie het meeste oplevert."
          : "Gijs denkt graag met je mee over de volgende stap, bijvoorbeeld het verbeteren of slim combineren van bestaande maatregelen."}
      </p>

      {eerste && (
        <section className={styles.adviesKern} aria-labelledby="eerste-advies">
          <div className={styles.adviesKop}>
            {MAATREGEL_BEELD[eerste.id] && <Image src={MAATREGEL_BEELD[eerste.id].src} alt={MAATREGEL_BEELD[eerste.id].alt} width={192} height={192} quality={100} className={styles.adviesBeeld} />}
            <div>
            <p className={styles.eyebrow}>Eerste advies</p>
            <h4 id="eerste-advies" className={styles.adviesNaam}>Begin met {naamVan(eerste.id).toLowerCase()}</h4>
            </div>
          </div>
          <p className={styles.adviesTekst}>{eerste.waarom}</p>
          <dl className={styles.adviesTegels}>
            {adviesTegels.map(tegel => <div key={tegel.label}><dt>{tegel.label}</dt><dd>{tegel.waarde}</dd></div>)}
          </dl>
        </section>
      )}

      {KANS_GROEPEN.map(groep => {
        const kansen = rapport.kansen.filter(kans => groep.ids.includes(kans.id));
        if (!kansen.length) return null;
        return (
          <div key={groep.label} className={flow.keuzeGroep} onPointerLeave={() => onBekijk(null)}>
            <h4>{groep.label}</h4>
            <ul className={flow.keuzeRijen}>
              {kansen.map(kans => <KansRij key={kans.id} kans={kans} naam={naamVan(kans.id)} slug={slugVan(kans.id)} regelingen={regelingen ? regelingenVoor(kans.id) : null} gekozen={gekozen.includes(kans.id)} onKies={() => onKies(kans.id)} onBekijk={() => onBekijk(kans.id)} />)}
            </ul>
          </div>
        );
      })}

      {/* Eerst de kleine stap: alleen een e-mailadres voor het volledige woningplan (prijsindicatie, besparing,
          terugverdientijd, woningwaarde). Daarna de grotere: de energiescan aan huis. */}
      {woningplan}

      {/* Het aanvraagblok (uit WoningFlow): Thom en Naud, wat je na de energiescan weet, en het formulier. */}
      {formulier}

      {/* De vergelijking ondersteunt de keuze, maar staat ná de directe waarde en het formulier. */}
      <section className={styles.integraal} aria-labelledby="integraal-kop">
        <h4 id="integraal-kop" className={styles.blokKop}>Waarom eerst Gijs uitnodigen?</h4>
        <p className={styles.integraalIntro}>Een vakspecialist kijkt vooral naar zijn eigen product. Gijs vergelijkt isolatie en installaties voor de hele woning en adviseert eerst wat voor jou het meeste oplevert.</p>
        <div className={styles.vergelijking}>
          <div className={styles.kolomLos}>
            <p className={styles.kolomKop}>Losse vakspecialist</p>
            <ul>
              {["Adviseert over één product", "Kijkt naar één onderdeel", "Volgorde en subsidie zoek je zelf uit"].map(t => (
                <li key={t}><span className={styles.streep} aria-hidden="true"><Icon name="minus" size="sm" /></span>{t}</li>
              ))}
            </ul>
          </div>
          <div className={styles.kolomGijs}>
            <p className={styles.kolomKop}>Gijs</p>
            <ul>
              {["Vergelijkt isolatie én installaties", "Kijkt naar de hele woning", "Regelt advies, subsidie, uitvoering en nazorg"].map(t => (
                <li key={t}><span className={styles.vink} aria-hidden="true"><Icon name="check" size="sm" /></span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {rapport.nietToepasbaar.map(n => (
        <p key={n.id} className={flow.kleineNoot}><strong>{naamVan(n.id)}</strong> staat er niet tussen. {n.reden}</p>
      ))}

      {postcode && rapport.kansen.length > 0 && (
        <details className={flow.bron}>
          <summary>Alle subsidies en regelingen voor jouw adres</summary>
          <RegelingenInScan
            postcode={postcode} huisnummer={huisnummer} mogelijk={rapport.kansen.map(k => k.id)} gekozen={gekozen}
            toelichting="Of je voor een regeling in aanmerking komt, hangt af van de voorwaarden. Die controleert Gijs voordat je iets aanvraagt."
          />
          {regelingen === null && <p>Je adviseur bekijkt welke regelingen er voor jouw adres zijn.</p>}
        </details>
      )}

      <details className={flow.bron}>
        <summary>Waar komen deze cijfers vandaan?</summary>
        <p>
          Alle bedragen zijn indicaties. Bouwjaarperiode: {BOUWPERIODE_LABEL[rapport.periode]}.
          Gasbesparing door isolatie: <a href={FINANCIEEL_BRONNEN.milieuCentraal.url} target="_blank" rel="noopener noreferrer">Milieu Centraal</a> per woningtype, alleen bij een cv-ketel.
          Terugverdientijd: investering volgens de tarieven van Gijs per woningtype gedeeld door de besparing, zonder subsidie. Warmtepomp: ervaringscijfers van Gijs.
          Verbruik: <a href={MC_BRONNEN.gemiddeld} target="_blank" rel="noopener noreferrer">Milieu Centraal</a> en ervaringscijfers van Gijs.
          Subsidies en regelingen: <a href={BRON_MILIEU_CENTRAAL.url} target="_blank" rel="noopener noreferrer">{BRON_MILIEU_CENTRAAL.naam}</a>, voor jouw adres.
          Een prijs of definitief subsidiebedrag volgt pas na controle van je woning en de voorwaarden. Hieraan kunnen geen rechten worden ontleend.
        </p>
      </details>
    </section>
  );
}

const subsidieTekst = (regelingen: SubsidieRegeling[] | null) =>
  regelingen === null ? "Bekijkt je adviseur" : regelingen.length ? `${regelingen.length} ${regelingen.length === 1 ? "regeling" : "regelingen"} voor jouw adres` : "Geen regeling gevonden";

/** Overige kansen: zelfde rij als de oude stap 3 (foto + aanvinkkaart + "Meer info"), uitleg uitklapbaar. */
function KansRij({ kans, naam, slug, regelingen, gekozen, onKies, onBekijk }: { kans: Kans; naam: string; slug: string; regelingen: SubsidieRegeling[] | null; gekozen: boolean; onKies: () => void; onBekijk: () => void }) {
  const beeld = MAATREGEL_BEELD[kans.id];
  const cijfers = [
    kans.kort.besparing ? `Indicatie: besparing ${kans.kort.besparing}${kans.voorbeeld ? " (voorbeeld)" : ""}` : "",
    kans.kort.terugverdientijd ? `terugverdientijd ${kans.kort.terugverdientijd}` : "",
    regelingen && regelingen.length ? subsidieTekst(regelingen) : "",
  ].filter(Boolean).join(" · ");
  return (
    <li className={styles.kans} onPointerEnter={onBekijk} onFocus={onBekijk}>
      <div className={flow.keuzeRij}>
        {beeld && <Image src={beeld.src} alt={beeld.alt} width={224} height={224} quality={100} className={flow.keuzeBeeld} />}
        <Checkbox card label={naam} description={cijfers || undefined} checked={gekozen} onChange={onKies} />
        {slug && <Link className={flow.infoLink} href={`/maatregelen/${slug}`}>Meer info<span className="sr-only"> over {naam.toLowerCase()}</span></Link>}
      </div>
    </li>
  );
}

