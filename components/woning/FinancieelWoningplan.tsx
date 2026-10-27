import { HOUSE_MODELS, type HouseType } from "@/lib/woning-types";
import { berekenFinancieelOverzicht } from "@/lib/woningplan-financieel";
import { MC_FINANCIEEL_BRON, GLAS_REFERENTIE_TOELICHTING } from "@/lib/content/verduurzaming-financieel";
import { RegelingenInScan } from "@/components/subsidie/RegelingenInScan";
import { Icon } from "@/components/ds/core/Icon";
import styles from "./FinancieelWoningplan.module.css";

const euro = (n: number) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// Het volledige financiële woningplan, ná het ontgrendelen (e-mailadres in WoningplanGate), in
// offerte-opbouw: per maatregel investering, subsidie en netto, daaronder de totalen, daarna
// besparing en terugverdientijd. Alle bedragen komen uit lib/woningplan-financieel.ts /
// lib/content/verduurzaming-financieel.ts (Milieu Centraal, peildatum 14 oktober 2026).
export function FinancieelWoningplan({ maatregelIds, houseType, naamVan, postcode, huisnummer, gekozenMaatregelen }: {
  maatregelIds: string[];
  houseType: HouseType;
  naamVan: (id: string) => string;
  postcode: string;
  huisnummer: string;
  gekozenMaatregelen: string[];
}) {
  const o = berekenFinancieelOverzicht(maatregelIds, houseType);
  const heeftData = o.onderbouwd.length > 0;
  const metGlas = o.onderbouwd.some(m => m.id === "glas-kozijnen");

  return (
    <div className={styles.wrap}>
      <section className={styles.offerte} aria-labelledby="financieel-kop">
        <div className={styles.offerteKop}>
          <h4 id="financieel-kop">Jouw financiële woningplan</h4>
          <p>Indicatieve berekening</p>
        </div>

        <table className={styles.tabel}>
          <thead>
            <tr>
              <th scope="col">Maatregel</th>
              <th scope="col" className={styles.breed}>Investering</th>
              <th scope="col" className={styles.breed}>Subsidie</th>
              <th scope="col">Netto</th>
            </tr>
          </thead>
          <tbody>
            {o.onderbouwd.map(m => (
              <tr key={m.id}>
                <th scope="row">
                  {naamVan(m.id)}{m.id === "glas-kozijnen" && <sup>*</sup>}
                  <span className={styles.smalDetail}>{euro(m.kosten)} investering · − {euro(m.subsidie)} subsidie</span>
                </th>
                <td className={styles.breed}>{euro(m.kosten)}</td>
                <td className={`${styles.breed} ${styles.min}`}>− {euro(m.subsidie)}</td>
                <td className={styles.nettoCel}>{euro(m.kosten - m.subsidie)}</td>
              </tr>
            ))}
            {o.nogNietBerekenbaar.length > 0 && (
              <tr className={styles.opLocatie}>
                <th scope="row">{o.nogNietBerekenbaar.map((id, i) => i === 0 ? naamVan(id) : naamVan(id).toLowerCase()).join(", ")}</th>
                <td colSpan={3}>Bepalen we tijdens de energiescan</td>
              </tr>
            )}
          </tbody>
          {heeftData && (
            <tfoot>
              <tr>
                <th scope="row">Totaal investering</th>
                <td colSpan={3}>{euro(o.brutoInvestering)}</td>
              </tr>
              <tr>
                <th scope="row">Subsidie (landelijke indicatie)</th>
                <td colSpan={3} className={styles.min}>− {euro(o.subsidieIndicatie)}</td>
              </tr>
              <tr className={styles.netto}>
                <th scope="row">Netto investering</th>
                <td colSpan={3}>{euro(o.nettoInvestering)}</td>
              </tr>
            </tfoot>
          )}
        </table>

        {heeftData && (
          <div className={styles.opbrengst}>
            <div>
              <p className={styles.label}>Besparing per jaar</p>
              <p className={styles.waarde}>{euro(o.jaarlijkseBesparing)}</p>
            </div>
            {o.terugverdientijdJaren !== null && (
              <div>
                <p className={styles.label}>Terugverdientijd</p>
                <p className={styles.waarde}>± {o.terugverdientijdJaren.toFixed(1).replace(".", ",")} jaar</p>
              </div>
            )}
          </div>
        )}

        <ul className={styles.noten}>
          <li>Richtprijzen op basis van gemiddelden voor een {HOUSE_MODELS[houseType].label.toLowerCase()}. De definitieve investering volgt na een opname op locatie.</li>
          {metGlas && <li><sup>*</sup> Isolatieglas: {GLAS_REFERENTIE_TOELICHTING}.</li>}
          <li>Subsidie is een landelijke indicatie (zoals de ISDE), geen gegarandeerde uitkering. Gemeentelijke regelingen staan hieronder en zijn niet in het totaal meegeteld.</li>
          <li>Bij meerdere maatregelen tegelijk kan de besparing iets lager uitvallen dan de som van de losse besparingen. Tijdens de energiescan rekenen we dit precies door.</li>
          {heeftData && (
            <li>
              Bron: <a href={MC_FINANCIEEL_BRON.url} target="_blank" rel="noopener noreferrer">{MC_FINANCIEEL_BRON.naam}</a>, peildatum {MC_FINANCIEEL_BRON.peildatum}, gasprijs {MC_FINANCIEEL_BRON.gasprijs}.
            </li>
          )}
        </ul>
      </section>

      {/* Woningwaarde: bewust geen persoonlijk bedrag (WOZ-waardeloket staat geautomatiseerd gebruik
          niet toe, en Gijs taxeert niet), wel gesourcet marktonderzoek van NVM. */}
      <section className={styles.waardeKaart} aria-labelledby="woningwaarde-kop">
        <p className={styles.waardeEyebrow}><Icon name="trending-up" size="sm" /> Woningwaarde</p>
        <h4 id="woningwaarde-kop">Verduurzamen kan je woning meer waard maken</h4>
        <div className={styles.waardeStats}>
          <div>
            <p className={styles.waardeGetal}>+11,6%</p>
            <p className={styles.waardeUitleg}>hogere verkoopprijs voor een woning met label C dan een vergelijkbare woning met label G</p>
          </div>
          <div>
            <p className={styles.waardeGetal}>± € 50.000</p>
            <p className={styles.waardeUitleg}>gemiddeld prijsverschil bij de woningprijzen van 2022</p>
          </div>
        </div>
        <p className={styles.waardeRegio}>
          <span>Utrecht ± 10%</span>
          <span>Enschede ± 15%</span>
        </p>
        {heeftData && (
          <p className={styles.waardeVergelijk}>
            Ter vergelijking: de netto investering in jouw plan is <strong>{euro(o.nettoInvestering)}</strong>.
          </p>
        )}
        <p className={styles.waardeNoot}>
          Gemiddeld prijsverschil tussen verkochte, vergelijkbare woningen; geen voorspelling of taxatie van jouw woning. Gijs is geen makelaar of taxateur.
          Bron: <a href="https://nos.nl/l/2450539" target="_blank" rel="noopener noreferrer">NOS, 31 oktober 2022</a>, op basis van NVM-onderzoek.
        </p>
      </section>

      {postcode && maatregelIds.length > 0 && (
        <RegelingenInScan postcode={postcode} huisnummer={huisnummer} mogelijk={maatregelIds} gekozen={gekozenMaatregelen} />
      )}

      <p className={styles.disclaimer}>
        Gijs is geen makelaar of taxateur. De getoonde investeringen, subsidies, besparingen, terugverdientijden en eventuele woningwaardestijgingen zijn
        indicaties op basis van beschikbare gegevens en aannames. Hieraan kunnen geen rechten worden ontleend.
      </p>
    </div>
  );
}
