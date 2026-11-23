import { HOUSE_MODELS } from "@/lib/woning-types";
import { berekenFinancieelOverzicht, type Bereik, type FinancieleInvoer } from "@/lib/woningplan-financieel";
import { FINANCIEEL_BRONNEN } from "@/lib/content/verduurzaming-financieel";
import { RegelingenInScan } from "@/components/subsidie/RegelingenInScan";
import { Icon } from "@/components/ds/core/Icon";
import { Button } from "@/components/ds/core/Button";
import styles from "./FinancieelWoningplan.module.css";

const euro = (n: number) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const bedrag = (b: Bereik) => (b.min === b.max ? euro(b.min) : `${euro(b.min)}–${b.max.toLocaleString("nl-NL")}`);
/** Prijsindicatie als "vanaf … tot …" (Thom: vanaf-tot tonen, de definitieve prijs volgt na de woningopname). */
const vanafTot = (b: Bereik) => (b.min === b.max ? `± ${euro(b.min)}` : `${euro(b.min)} tot ${euro(b.max)}`);
const oppervlakte = (b: Bereik) => {
  const min = Math.round(b.min), max = Math.round(b.max);
  return min === max ? `± ${min} m²` : `± ${min}–${max} m²`;
};
const m3 = (b: Bereik) => {
  const min = Math.round(b.min), max = Math.round(b.max);
  return min === max ? `± ${min.toLocaleString("nl-NL")} m³` : `± ${min.toLocaleString("nl-NL")}–${max.toLocaleString("nl-NL")} m³`;
};
const BOUWDEEL_NAAM = { dak: "dak", gevel: "gevel", vloer: "vloer", raam: "glas" } as const;

// Het volledige financiële woningplan, ná het ontgrendelen (e-mailadres in WoningplanGate). Toont
// alleen wat lib/woningplan-financieel.ts berekent: bandbreedtes waar oppervlakten onzeker zijn, en
// geen bedrag (met de reden) waar de gegevens tekortschieten.
// Subsidie rekent Gijs hier NIET zelf uit (Max, 17-11-2026): die komt uitsluitend uit de koppeling met de
// Energiesubsidiewijzer (RegelingenInScan). Prijsindicatie en terugverdientijd staan daarom zonder subsidie.
export function FinancieelWoningplan({ invoer, naamVan, postcode, huisnummer, gekozenMaatregelen, onEnergiescan, aanbevolen = false }: {
  invoer: FinancieleInvoer;
  naamVan: (id: string) => string;
  postcode: string;
  huisnummer: string;
  gekozenMaatregelen: string[];
  /** Zonder: geen eigen "vraag een energiescan aan"-knop (het plan verschijnt dan al ná de aanvraag). */
  onEnergiescan?: () => void;
  /** true: niets aangevinkt, dus doorgerekend voor de aanbevolen kansen uit het rapport. */
  aanbevolen?: boolean;
}) {
  const o = berekenFinancieelOverzicht(invoer);
  const heeftData = o.maatregelen.length > 0;
  const lijst = (ids: string[]) => ids.map((id, i) => (i === 0 ? naamVan(id) : naamVan(id).toLowerCase())).join(", ");
  const woningtype = HOUSE_MODELS[invoer.houseType].label.toLowerCase();
  const gasprijsTekst = invoer.gasprijs !== null ? invoer.gasprijs.toLocaleString("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }) : "";
  const bereikTekst = o.bruto.min !== o.bruto.max;
  // Terugverdientijd zonder subsidie: investering ÷ besparing per jaar. Met subsidie is die korter.
  // Zonder tarief van Gijs voor een maatregel (glas) geen terugverdientijd: die rekent de adviseur uit.
  const jaren = !o.zonderPrijs.length && o.besparing && o.besparing.euro.min > 0 ? Math.max(1, Math.round(o.bruto.min / o.besparing.euro.min)) : null;
  const alleenZonderPrijs = o.zonderPrijs.length > 0 && o.zonderPrijs.length === o.maatregelen.length;

  return (
    <div className={styles.wrap}>
      <section className={styles.plan} aria-labelledby="financieel-kop">
        <p className={styles.eyebrow}>Jouw financiële woningplan</p>
        <h4 id="financieel-kop" className={styles.titel}>Wat kan verduurzamen jou opleveren?</h4>
        <p className={styles.intro}>
          Indicatieve berekening voor {o.maatregelen.length ? lijst(o.maatregelen.map(m => m.id)).toLowerCase() : "de isolatiemaatregelen"} {aanbevolen ? "(aanbevolen voor jouw woning; je had nog niets aangevinkt)" : "(jouw keuze)"}, op basis van jouw woningtype en bouwjaar.
        </p>

        {heeftData ? (
          <>
            <div className={styles.hero}>
              {/* Geen tarief voor alle gekozen maatregelen (alleen glas, Max 23-11-2026): leid dan met de
                  besparing i.p.v. met een lege prijs — anders is het eerste en grootste getal op de pagina
                  een non-antwoord, niet uitnodigend voor een lead die net zijn gegevens heeft achtergelaten. */}
              {alleenZonderPrijs && o.besparing ? (
                <>
                  <p className={styles.heroLabel}>{o.besparing.aard === "voorbeeld" ? "Geschatte besparing per jaar (voorbeeld)" : "Geschatte besparing per jaar"}</p>
                  <p className={styles.heroBedrag}>{bedrag(o.besparing.euro)}</p>
                  <p className={styles.nietMee}>De prijs van {lijst(o.zonderPrijs).toLowerCase()} rekent je adviseur uit bij de woningopname.</p>
                </>
              ) : (
                <>
                  <p className={styles.heroLabel}>Prijsindicatie</p>
                  <p className={`${styles.heroBedrag} ${bereikTekst ? styles.heroBereik : ""}`}>{alleenZonderPrijs ? "Rekent je adviseur uit" : vanafTot(o.bruto)}</p>
                  {o.zonderPrijs.length > 0 && !alleenZonderPrijs && (
                    <p className={styles.nietMee}>Zonder {lijst(o.zonderPrijs).toLowerCase()}: die prijs rekent je adviseur uit.</p>
                  )}
                </>
              )}
              <p className={styles.nietMee}>
                Op basis van de tarieven van Gijs per woningtype, vóór subsidie. Woninggerichte indicatie: gebaseerd op een gemiddeld oppervlak
                voor dit woningtype, niet op een meting van jouw woning. De precieze prijs volgt na de woningopname.
              </p>
              {bereikTekst && (
                <p className={styles.nietMee}>Bandbreedte, omdat het bouwjaar onbekend is: de oppervlakten verschillen per bouwperiode.</p>
              )}
              <details className={styles.uitsplitsing}>
                <summary>Bekijk per maatregel</summary>
                <table>
                  <thead>
                    <tr><th scope="col">Maatregel</th><th scope="col">Prijsindicatie</th></tr>
                  </thead>
                  <tbody>
                    {o.maatregelen.map(m => (
                      <tr key={m.id}>
                        <th scope="row">
                          {naamVan(m.id)}
                          <span className={styles.rijDetail}>{oppervlakte(m.oppervlakte)} {BOUWDEEL_NAAM[m.bouwdeel]}</span>
                        </th>
                        <td>{m.kosten ? bedrag(m.kosten) : "Rekent je adviseur uit"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Oppervlakten dak, spouwmuur en vloer: mediaan van de RVO-referentiewoning voor een {woningtype}, {o.periode ? `bouwperiode ${o.periode}` : "alle bouwperioden"}.
                  Glasoppervlak: gemiddelde van Gijs voor een {woningtype}. Jouw werkelijke oppervlakten kunnen afwijken; die meten we tijdens de energiescan. Prijzen: tarieven
                  van Gijs per woningtype; voor glas rekent je adviseur de prijs uit.
                </p>
              </details>
              {o.nietToepasbaar.map(n => (
                <p key={n.id} className={styles.nietMee}><strong>{naamVan(n.id)}</strong> niet meegerekend. {n.reden}</p>
              ))}
              {o.nogNietBerekenbaar.length > 0 && (
                <p className={styles.nietMee}>Niet meegerekend: {lijst(o.nogNietBerekenbaar)}. Die bepalen we samen tijdens de energiescan.</p>
              )}
            </div>

            {o.besparing?.aard === "voorbeeld" && (
              <p className={styles.voorbeeldscenario}>
                <Icon name="info" size="sm" /> Je gaf aan niet precies te weten wat er al is geïsoleerd. De besparing hieronder is daarom een
                voorbeeldscenario voor dit woningtype, geen woninggerichte indicatie.
              </p>
            )}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statIcon}><Icon name="piggy-bank" size="sm" /></span>
                <p className={styles.statLabel}>{o.besparing?.aard === "voorbeeld" ? "Besparing per jaar (voorbeeld)" : "Geschatte besparing per jaar"}</p>
                {o.besparing ? (
                  <>
                    <p className={styles.statWaarde}>{bedrag(o.besparing.euro)}</p>
                    <p className={styles.statSub}>
                      {m3(o.besparing.gasM3)} gas × jouw gasprijs van {gasprijsTekst}
                      {o.besparing.optelling && <>, optelling van losse schattingen per maatregel</>}
                      {o.besparing.begrensd && <>, begrensd op je huidige gasverbruik</>}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.statLeeg}>Rekent je adviseur uit</p>
                    <p className={styles.statSub}>{o.besparingReden}</p>
                  </>
                )}
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}><Icon name="clock" size="sm" /></span>
                <p className={styles.statLabel}>Eenvoudige terugverdientijd</p>
                {jaren !== null ? (
                  <>
                    <p className={styles.statWaarde}>± {jaren} jaar</p>
                    <p className={styles.statSub}>
                      investering zonder subsidie ÷ besparing per jaar; met subsidie korter
                      {o.besparing?.optelling && <>, optelling van losse schattingen</>}
                      {o.besparing?.aard === "voorbeeld" && <>, voorbeeldscenario</>}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.statLeeg}>Rekent je adviseur uit</p>
                    <p className={styles.statSub}>{o.terugverdientijdReden?.startsWith("De prijs") ? o.terugverdientijdReden : "De terugverdientijd volgt uit de besparing; die bepaalt je adviseur bij de woningopname."}</p>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.hero}>
            {invoer.maatregelIds.length === 0 ? (
              <p className={styles.heroTekst}>
                Vink hierboven een isolatiemaatregel aan (dak-, spouwmuur- of vloerisolatie, of glas) om die te laten doorrekenen. Voor
                installaties zoals zonnepanelen of een warmtepomp bepalen we de kosten en opbrengst tijdens de energiescan.
              </p>
            ) : (
              <>
                {o.nietToepasbaar.map(n => (
                  <p key={n.id} className={styles.heroTekst}><strong>{naamVan(n.id)}</strong>: {n.reden}</p>
                ))}
                {o.nogNietBerekenbaar.length > 0 && (
                  <p className={styles.heroTekst}>
                    Voor {lijst(o.nogNietBerekenbaar).toLowerCase()} is nog geen betrouwbare landelijke kostenraming beschikbaar. Tijdens de
                    energiescan bepalen we wat dit voor jouw woning kost en oplevert.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className={styles.scheiding} />

        <div className={styles.waarde}>
          <h5><Icon name="house-plus" size="sm" /> En wat betekent dit voor je woningwaarde?</h5>
          <p>
            Verduurzaming kan je woning aantrekkelijker maken voor toekomstige kopers en bijdragen aan een hogere marktwaarde. Volgens onderzoek van
            NVM brengt een woning met energielabel C gemiddeld 11,6% meer op dan een vergelijkbare woning met label G.
          </p>
          <p className={styles.klein}>
            Dit is een landelijk gemiddelde (regionaal tussen de 10% en 15%), geen voorspelling voor jouw specifieke woning: de werkelijke
            waardeontwikkeling hangt af van onder meer locatie, woningtype en de staat van je woning. Een persoonlijke waardestijging tonen we
            alleen als de berekening voldoende rekening houdt met je huidige woningwaarde, energielabel en maatregelen. Gijs is geen makelaar of
            taxateur. Bron: <a href="https://nos.nl/l/2450539" target="_blank" rel="noopener noreferrer">NOS, 31 oktober 2022</a>.
          </p>
        </div>

        {onEnergiescan && <div className={styles.cta}>
          <p className={styles.ctaKop}>Van indicatie naar een concreet plan</p>
          <p>
            Tijdens een gratis energiescan bekijkt Gijs de werkelijke situatie van je woning, zodat de kosten, mogelijkheden en besparingen
            nauwkeuriger kunnen worden beoordeeld.
          </p>
          <Button variant="primary" size="lg" iconRight="arrow-right" onClick={onEnergiescan} fullWidth>Vraag mijn gratis energiescan aan</Button>
        </div>}
      </section>

      {postcode && invoer.maatregelIds.length > 0 && (
        <RegelingenInScan
          postcode={postcode} huisnummer={huisnummer} mogelijk={invoer.maatregelIds} gekozen={gekozenMaatregelen}
          toelichting="Uit de Energiesubsidiewijzer van Milieu Centraal, voor jouw adres. Of je ervoor in aanmerking komt, hangt af van de voorwaarden. Die controleert Gijs voordat je iets aanvraagt."
        />
      )}

      <details className={styles.noot}>
        <summary>Bronnen, aannames en beperkingen</summary>
        <p>
          Prijsindicatie per woningtype: {FINANCIEEL_BRONNEN.gijsTarieven.naam}, {FINANCIEEL_BRONNEN.gijsTarieven.peildatum}, vóór subsidie,
          voor dak, spouwmuur en vloer op het oppervlak van een <a href={FINANCIEEL_BRONNEN.rvoVoorbeeldwoningen.url} target="_blank" rel="noopener noreferrer">vergelijkbare RVO-referentiewoning</a>,
          voor glas op een gemiddeld oppervlak van Gijs per woningtype.
          Gasbesparing per woningtype: <a href={FINANCIEEL_BRONNEN.milieuCentraal.url} target="_blank" rel="noopener noreferrer">Milieu Centraal</a>,
          peildatum {FINANCIEEL_BRONNEN.milieuCentraal.peildatum}. Subsidies en regelingen: de Energiesubsidiewijzer van Milieu Centraal voor jouw
          adres; die rekent Gijs niet zelf uit. Welke maatregelen al bij jouw woning aanwezig zijn, komt uit wat je zelf in de woningscan hebt
          ingevuld; gaf je aan dat niet precies te weten, dan staat de besparing hierboven als voorbeeldscenario. Bij twee of meer maatregelen
          tegelijk zijn de besparing en de terugverdientijd een optelling van losse schattingen per maatregel. Gijs is geen makelaar of taxateur.
          Alle bedragen zijn indicaties; hieraan kunnen geen rechten worden ontleend.
        </p>
      </details>
    </div>
  );
}
