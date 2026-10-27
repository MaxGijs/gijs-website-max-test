import { HOUSE_MODELS } from "@/lib/woning-types";
import { berekenFinancieelOverzicht, type Bereik, type FinancieleInvoer } from "@/lib/woningplan-financieel";
import { FINANCIEEL_BRONNEN } from "@/lib/content/verduurzaming-financieel";
import { RegelingenInScan } from "@/components/subsidie/RegelingenInScan";
import { Icon } from "@/components/ds/core/Icon";
import { Button } from "@/components/ds/core/Button";
import styles from "./FinancieelWoningplan.module.css";

const euro = (n: number) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const bedrag = (b: Bereik) => (b.min === b.max ? euro(b.min) : `${euro(b.min)}–${b.max.toLocaleString("nl-NL")}`);
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
export function FinancieelWoningplan({ invoer, naamVan, postcode, huisnummer, gekozenMaatregelen, onEnergiescan }: {
  invoer: FinancieleInvoer;
  naamVan: (id: string) => string;
  postcode: string;
  huisnummer: string;
  gekozenMaatregelen: string[];
  onEnergiescan: () => void;
}) {
  const o = berekenFinancieelOverzicht(invoer);
  const heeftData = o.maatregelen.length > 0;
  const lijst = (ids: string[]) => ids.map((id, i) => (i === 0 ? naamVan(id) : naamVan(id).toLowerCase())).join(", ");
  const woningtype = HOUSE_MODELS[invoer.houseType].label.toLowerCase();
  const gasprijsTekst = invoer.gasprijs !== null ? invoer.gasprijs.toLocaleString("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }) : "";
  const bereikTekst = o.netto.min !== o.netto.max;

  return (
    <div className={styles.wrap}>
      <section className={styles.plan} aria-labelledby="financieel-kop">
        <p className={styles.eyebrow}>Jouw financiële woningplan</p>
        <h4 id="financieel-kop" className={styles.titel}>Wat kan verduurzamen jou opleveren?</h4>
        <p className={styles.intro}>Indicatieve berekening voor de isolatiemaatregelen (dak, spouwmuur, vloer en glas) die je hebt gekozen, op basis van jouw woning.</p>

        {heeftData ? (
          <>
            <div className={styles.hero}>
              <p className={styles.heroLabel}>Geschatte netto investering</p>
              <p className={`${styles.heroBedrag} ${bereikTekst ? styles.heroBereik : ""}`}>{bedrag(o.netto)}</p>
              <dl className={styles.heroRegels}>
                <div><dt>Bruto investering</dt><dd>{bedrag(o.bruto)}</dd></div>
                <div><dt>Berekende ISDE-subsidie</dt><dd className={styles.min}>{`− ${bedrag(o.subsidie)}`}</dd></div>
              </dl>
              {o.combinatieTarief && (
                <p className={styles.combinatie}>
                  <Icon name="check" size="sm" /> Dubbel ISDE-tarief: je combineert meerdere isolatiemaatregelen of isolatie met een warmtepomp.
                </p>
              )}
              <p className={styles.nietMee}>
                Investeringskosten op basis van Milieu Centraal-gemiddelden per woningtype; de werkelijke prijs hangt af van het oppervlak van jouw woning.
                Woninggerichte indicatie: gebaseerd op het oppervlak van een vergelijkbare RVO-referentiewoning, niet op een meting van jouw
                woning. De daadwerkelijke subsidie hangt af van de werkzaamheden die je laat uitvoeren en wordt pas na goedkeuring door RVO
                definitief.
              </p>
              {bereikTekst && (
                <p className={styles.nietMee}>Bandbreedte, omdat het bouwjaar onbekend is: de oppervlakten verschillen per bouwperiode.</p>
              )}
              <details className={styles.uitsplitsing}>
                <summary>Bekijk per maatregel</summary>
                <table>
                  <thead>
                    <tr><th scope="col">Maatregel</th><th scope="col">Investering</th><th scope="col" className={styles.breed}>ISDE-subsidie</th></tr>
                  </thead>
                  <tbody>
                    {o.maatregelen.map(m => (
                      <tr key={m.id}>
                        <th scope="row">
                          {naamVan(m.id)}
                          <span className={styles.rijDetail}>{oppervlakte(m.oppervlakte)} {BOUWDEEL_NAAM[m.bouwdeel]}</span>
                          <span className={`${styles.rijDetail} ${styles.smal}`}>ISDE-subsidie {m.subsidie.max === 0 ? "onder minimum" : `− ${bedrag(m.subsidie)}`}</span>
                        </th>
                        <td>{bedrag(m.kosten)}</td>
                        <td className={`${styles.min} ${styles.breed}`}>{m.subsidie.max === 0 ? "onder minimum" : `− ${bedrag(m.subsidie)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Oppervlakten: mediaan van de RVO-referentiewoning voor een {woningtype}, {o.periode ? `bouwperiode ${o.periode}` : "alle bouwperioden"}. Jouw werkelijke
                  oppervlakten kunnen afwijken; die meten we tijdens de energiescan. Glas: Milieu Centraal-prijs per m² voor HR++-glas in bestaande kozijnen.
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
                      {o.besparing.optelling && <> — optelling van losse schattingen per maatregel</>}
                      {o.besparing.begrensd && <>, begrensd op je huidige gasverbruik</>}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.statLeeg}>Niet te onderbouwen</p>
                    <p className={styles.statSub}>{o.besparingReden}</p>
                  </>
                )}
              </div>
              <div className={styles.stat}>
                <span className={styles.statIcon}><Icon name="clock" size="sm" /></span>
                <p className={styles.statLabel}>Eenvoudige terugverdientijd</p>
                {o.terugverdientijdJaren !== null ? (
                  <>
                    <p className={styles.statWaarde}>± {o.terugverdientijdJaren} jaar</p>
                    <p className={styles.statSub}>
                      netto investering ÷ besparing per jaar
                      {o.besparing?.optelling && <> — optelling van losse schattingen</>}
                      {o.besparing?.aard === "voorbeeld" && <>, voorbeeldscenario</>}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.statLeeg}>Niet te berekenen</p>
                    <p className={styles.statSub}>{o.terugverdientijdReden}</p>
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

        <div className={styles.cta}>
          <p className={styles.ctaKop}>Van indicatie naar een concreet plan</p>
          <p>
            Tijdens een gratis energiescan bekijkt Gijs de werkelijke situatie van je woning, zodat de kosten, mogelijkheden en besparingen
            nauwkeuriger kunnen worden beoordeeld.
          </p>
          <Button variant="primary" size="lg" iconRight="arrow-right" onClick={onEnergiescan} fullWidth>Vraag mijn gratis energiescan aan</Button>
        </div>
      </section>

      {postcode && invoer.maatregelIds.length > 0 && (
        <RegelingenInScan
          postcode={postcode} huisnummer={huisnummer} mogelijk={invoer.maatregelIds} gekozen={gekozenMaatregelen}
          toelichting="Deze regelingen zijn niet opgeteld bij de berekende subsidie hierboven: of je ervoor in aanmerking komt, hangt af van de voorwaarden. Die controleren we samen."
        />
      )}

      <details className={styles.noot}>
        <summary>Bronnen, aannames en beperkingen</summary>
        <p>
          Kosten en gasbesparing per woningtype: <a href={FINANCIEEL_BRONNEN.milieuCentraal.url} target="_blank" rel="noopener noreferrer">Milieu Centraal</a>,
          peildatum {FINANCIEEL_BRONNEN.milieuCentraal.peildatum}. Subsidie: <a href={FINANCIEEL_BRONNEN.rvoIsde.url} target="_blank" rel="noopener noreferrer">ISDE-tarieven van RVO</a>{" "}
          voor woningeigenaren, geldig voor uitvoering in 2025 of later (laatst gecontroleerd 27-10-2026) × het oppervlak van een{" "}
          <a href={FINANCIEEL_BRONNEN.rvoVoorbeeldwoningen.url} target="_blank" rel="noopener noreferrer">vergelijkbare RVO-referentiewoning</a> — een woninggerichte
          indicatie op basis van een schatting, geen meting van jouw woning. De daadwerkelijke subsidie hangt af van de werkzaamheden die je laat
          uitvoeren, de behaalde isolatiewaarde en de overige ISDE-voorwaarden, en wordt pas na goedkeuring definitief. Welke maatregelen al bij
          jouw woning aanwezig zijn, komt uit wat je zelf in de woningscan hebt ingevuld, niet uit het bouwjaar; gaf je aan dat niet precies te
          weten, dan staat de besparing hierboven als voorbeeldscenario. Bij twee of meer maatregelen tegelijk zijn zowel de besparing als de
          terugverdientijd een optelling van losse schattingen per maatregel, niet een exacte meting. Gijs is geen makelaar of taxateur. De
          getoonde investeringen, subsidies, besparingen, terugverdientijden en eventuele woningwaardestijgingen zijn indicaties op basis van
          beschikbare gegevens en aannames. Hieraan kunnen geen rechten worden ontleend.
        </p>
      </details>
    </div>
  );
}
