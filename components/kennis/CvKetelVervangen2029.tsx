import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ArtikelFoto, Bron, ExterneLink } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

// Tekst uit "Cv-ketel vervangen vóór 2029: kies je nog voor gas of een warmtepomp?" (PDF van Max).
// Aanpassingen met Max' akkoord: uitleg "slim" versus "hybride" verduidelijkt, de sectie over slimme
// aansturing ingekort, bronverwijzing bij de tabel en interne links. Feiten (7 oktober 2026, 65% minder
// aardgas, geen verplichting bij een werkende ketel, uitzondering warmtenet) gecontroleerd op
// Rijksoverheid.nl; de Kamerbrief zelf (medio 2028, uitzonderingen monumenten/appartementen) niet.
const RIJKSOVERHEID_2029 = "https://www.rijksoverheid.nl/actueel/nieuws/2026/10/07/slimme-en-hybride-warmtepompen-vanaf-2029-de-nieuwe-standaard";

const TABEL = [
  { verbruik: "800 m³", besparing: "520 m³", rest: "280 m³" },
  { verbruik: "1.200 m³", besparing: "780 m³", rest: "420 m³" },
  { verbruik: "1.600 m³", besparing: "1.040 m³", rest: "560 m³" },
];

const FAQ: FAQItem[] = [
  {
    question: "Is een hybride warmtepomp vanaf 2029 verplicht?",
    answer: "Het kabinet wil dat bij vervanging van de cv-ketel in veel woningen een slimme hybride warmtepomp of een efficiëntere oplossing wordt geplaatst. De regelgeving is nog niet definitief.",
  },
  {
    question: "Kan ik vóór 2029 nog een gewone cv-ketel kopen?",
    answer: "Ja. De voorgestelde norm geldt nog niet. Of een traditionele cv-ketel verstandig is, hangt af van je huidige installatie, de geschiktheid van je woning en je toekomstplannen.",
  },
  {
    question: "Kan ik beter nu een warmtepomp kopen of wachten tot 2029?",
    answer: "Dat hangt af van je woning en huidige verwarmingsinstallatie. Een warmtepomp kan nu al gas besparen, maar het is verstandig om eerst te onderzoeken welke oplossing bij jouw situatie past.",
  },
];

/** Eerste twee alinea's; staan op de pagina direct onder de titel, boven de foto. */
export function CvKetelInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Een nieuwe <Link href="/maatregelen/ketel" className={TEKSTLINK}>cv-ketel</Link> laten plaatsen zonder je alternatieven te onderzoeken? Dat kan
        zomaar een dure vergissing zijn. Misschien geef je geld uit aan een nieuwe gasketel, terwijl je met een
        warmtepomp al flink op je gasverbruik had kunnen besparen. Dat merk je niet wanneer de installateur de deur
        achter zich dichttrekt. Dat ontdek je pas later, wanneer je energierekening blijft binnenkomen.
      </p>
      <p className={className}>
        Met de aangekondigde warmtepompregels voor 2029 wordt die beslissing alleen maar belangrijker. Het kabinet wil
        dat bij vervanging van de cv-ketel in veel woningen een slimme hybride warmtepomp de standaard wordt. De regels
        zijn nog niet definitief, maar één ding verandert niet: wie alleen naar de aanschafprijs kijkt, kan uiteindelijk
        duurder uit zijn.
      </p>
    </>
  );
}

export function CvKetelVervangen2029({ slug }: { slug: string }) {
  return (
    <>
      <p>Dus voordat je opnieuw een cv-ketel koopt: weet je eigenlijk wel of dat voor jouw woning de beste keuze is?</p>

      <ArtikelH2 id="wat-verandert-er">Wat verandert er vanaf 2029?</ArtikelH2>
      <p>
        Op 7 oktober 2026 maakte de Rijksoverheid bekend dat het kabinet strengere eisen wil stellen aan
        verwarmingsinstallaties. Het gaat om de bestaande regels in het Besluit bouwwerken leefomgeving (Bbl). Daarin
        staat onder meer hoe energiezuinig verwarmingsinstallaties moeten zijn. Vanaf 2029 wil het kabinet die eisen
        aanscherpen, zodat alleen een nieuwe traditionele cv-ketel plaatsen in veel woningen niet meer voldoende is.
      </p>
      <p>
        Een slimme hybride warmtepomp wordt daarbij het uitgangspunt, maar de overheid schrijft niet één specifiek
        apparaat voor. Een volledig elektrische <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> kan ook aan de toekomstige eisen voldoen. Het gaat dus om twee dingen:
        hoe efficiënt je woning wordt verwarmd en of de installatie slim regelbaar is, niet om welk merk of type je
        aanschaft.
      </p>
      <p>
        Let op: dit is nog geen definitieve verplichting. De precieze eisen en uitzonderingen worden nog uitgewerkt.
        Volgens de officiële Kamerbrief is 2029 de vroegst haalbare ingangsdatum. Het kabinet verwacht de wijzigingen
        medio 2028 te publiceren.
      </p>

      <ArtikelH2 id="waarom-slim">Waarom moet een warmtepomp vanaf 2029 ook slim zijn?</ArtikelH2>
      <p>
        Steeds meer huishoudens gebruiken elektriciteit om de woning te verwarmen, vooral op de koude winterdagen, wanneer mensen thuiskomen en tegelijkertijd elektrische apparaten gaan gebruiken, wordt het druk op het elektriciteitsnet. Daarom wil het kabinet dat nieuwe warmtepompen slim regelbaar zijn. Een geschikte slimme
        warmtepomp kan bijvoorbeeld rekening houden met een dynamisch energiecontract: wanneer stroom goedkoper is,
        verwarmt hij je woning eerder wat extra, en wanneer stroom duurder wordt, gebruikt hij tijdelijk minder energie,
        zolang het binnen comfortabel blijft.
      </p>
      <p>
        Een warmtepomp met een app is dus niet automatisch slim. Kun je alleen de temperatuur aanpassen of je
        energieverbruik bekijken, dan reageert het systeem nog niet zelfstandig op stroomprijzen of andere externe
        signalen. De overheid wil daarom technische eisen stellen aan de slimme aansturing. Welke installaties
        uiteindelijk aan de definitieve norm voldoen, moet nog blijken.
      </p>

      <ArtikelFoto src="/images/kennis/cv-ketel/thermostaatknop-radiator.jpg" alt="Een hand draait aan de thermostaatknop van een radiator" />

      <ArtikelH2 id="verplicht-vervangen">Moet je jouw cv-ketel in 2029 verplicht vervangen?</ArtikelH2>
      <p>
        Nee, zeker niet. Het voorstel geldt bij vervanging van je cv-ketel, niet voor iedere ketel die op dat moment
        nog werkt. Dat is een bewuste keuze van het kabinet. Een goed werkende installatie verplicht verwijderen zou
        namelijk betekenen dat je iets weggooit wat nog prima functioneert. Dat wil de overheid voorkomen.
      </p>
      <p>
        Werkt je huidige cv-ketel in 2029 nog goed? Dan hoef je deze vanwege de aangekondigde regels niet te vervangen.
        Pas wanneer je een nieuwe verwarmingsinstallatie nodig hebt, kunnen de toekomstige eisen een rol gaan spelen.
        Welke uitzonderingen daarbij gelden, wordt nog vastgesteld.
      </p>
      <p>
        Dat betekent alleen niet dat blijven verwarmen met gas automatisch de voordeligste keuze is. Stel dat je
        cv-ketel nog goed functioneert, maar je jaarlijks veel gas gebruikt om je woning warm te houden. Dan kan een
        hybride warmtepomp nu al interessant zijn. Die werkt samen met je bestaande ketel en neemt een groot deel van de
        verwarming over, waardoor je gasverbruik kan dalen.
      </p>

      <ArtikelH2 id="goedkoopste-keuze">Is een nieuwe cv-ketel op termijn wel de goedkoopste keuze?</ArtikelH2>
      <p>
        Een traditionele cv-ketel is bij aanschaf vaak goedkoper dan een verwarmingsinstallatie met een warmtepomp. Maar
        de aanschafprijs is slechts een deel van wat je uiteindelijk betaalt. Je moet ook rekening houden met de energie
        die je de komende jaren nodig hebt.
      </p>
      <p>
        Een hybride warmtepomp kan het gasverbruik voor verwarming aanzienlijk verminderen. Daar staat extra
        elektriciteitsverbruik tegenover. Je financiële voordeel ontstaat wanneer de uitgespaarde gaskosten hoger zijn
        dan de extra stroomkosten. Hoe groter dat jaarlijkse voordeel, hoe sneller je de extra investering kunt
        terugverdienen.
      </p>
      <p>
        Ook de staat van je huidige cv-ketel maakt verschil. Is die nog relatief nieuw en geschikt om samen te werken
        met een hybride warmtepomp? Dan hoef je mogelijk niet direct een nieuwe ketel aan te schaffen. Is de ketel bijna
        aan vervanging toe, dan moet je rekening houden met de kosten van beide installaties. En als je woning al
        geschikt is voor volledig elektrisch verwarmen, kan het verstandiger zijn om de cv-ketel helemaal weg te laten.
      </p>
      <p>
        De goedkoopste aanschaf is dus niet automatisch de goedkoopste oplossing. Het gaat om wat je nu investeert,
        welke subsidies je ontvangt en wat je daarna jaarlijks aan energie en onderhoud blijft betalen.
      </p>

      <ArtikelH2 id="besparing-hybride">Hoeveel bespaar je met een hybride warmtepomp?</ArtikelH2>
      <p>
        Volgens de Rijksoverheid van 7 oktober 2026 verbruikt een woning met een hybride warmtepomp gemiddeld 65% minder
        aardgas voor verwarming. Dat is een flinke vermindering, maar het betekent niet dat je totale energierekening met
        65% daalt. De warmtepomp gebruikt elektriciteit en de cv-ketel blijft bij een gebruikelijke hybride installatie
        onder andere verantwoordelijk voor warm water.
      </p>
      <p>Wat betekent die gemiddelde gasbesparing in de praktijk? Onderstaande tabel laat drie rekenvoorbeelden zien.</p>

      <figure className="my-8">
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white">
          <table className="w-full border-collapse text-left text-[14px] sm:text-base">
            <caption className="sr-only">Rekenvoorbeelden: gasbesparing bij een gemiddelde besparing van 65 procent</caption>
            <thead className="bg-[var(--surface-tint)] text-[var(--gijs-donkergroen)]">
              <tr>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold">Jaarlijks gasverbruik voor verwarming</th>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold text-right">Mogelijke gasbesparing (65%)</th>
                <th scope="col" className="px-2.5 py-3 sm:px-5 font-semibold text-right">Resterend gasverbruik voor verwarming</th>
              </tr>
            </thead>
            <tbody>
              {TABEL.map(r => (
                <tr key={r.verbruik} className="border-t border-[var(--border-default)]">
                  <th scope="row" className="px-2.5 py-3 sm:px-5 font-normal tabular-nums">{r.verbruik}</th>
                  <td className="px-2.5 py-3 sm:px-5 text-right whitespace-nowrap tabular-nums font-semibold text-[var(--gijs-donkergroen)]">{r.besparing}</td>
                  <td className="px-2.5 py-3 sm:px-5 text-right whitespace-nowrap tabular-nums">{r.rest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figcaption className="mt-2 text-[13px] italic leading-relaxed text-zinc-500">
          Dit zijn rekenvoorbeelden op basis van de gemiddelde gasbesparing die de Rijksoverheid noemt. Het extra
          stroomverbruik en het gasverbruik voor warm water zijn niet meegenomen. De werkelijke besparing verschilt per woning.
        </figcaption>
      </figure>

      <p>
        Stel dat je jaarlijks 1.200 m³ gas gebruikt voor verwarming. Bij een besparing van 65% zou je 780 m³ minder gas
        verbruiken. Om te bepalen hoeveel geld dat oplevert, moet je de waarde van die gasbesparing vergelijken met de
        extra elektriciteitskosten.
      </p>
      <p>
        Ook je woning speelt een belangrijke rol. Een huis dat veel warmte verliest via de{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloer</Link>,{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>muren</Link> of het{" "}
        <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dak</Link>, heeft meer energie nodig om comfortabel warm te blijven. Door goed te isoleren,
        hoeft de verwarming minder hard te werken. Bovendien kan een goed geïsoleerde woning vaak met een lagere
        watertemperatuur worden verwarmd. Dat is gunstig voor de efficiëntie van een warmtepomp.
      </p>
      <p>
        Daarom hangt de beste oplossing niet alleen af van de warmtepomp, maar vooral van je woning. Op onze pagina over{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepompen voor bestaande woningen</Link> lees je meer over de mogelijkheden.
      </p>
      <Bron>
        Bron: <ExterneLink href={RIJKSOVERHEID_2029}>Rijksoverheid – Slimme en hybride warmtepompen vanaf 2029 de nieuwe standaard</ExterneLink> (7 oktober 2026).
      </Bron>

      <ArtikelFoto src="/images/kennis/cv-ketel/radiator-bakstenen-muur.jpg" alt="Een radiator tegen een witgeverfde bakstenen muur" />

      <ArtikelH2 id="kosten-subsidies">Welke kosten en subsidies moet je meenemen?</ArtikelH2>
      <p>
        Bij het vergelijken van een cv-ketel en een warmtepomp moet je verder kijken dan de aanschafprijs. Denk
        bijvoorbeeld aan installatiekosten, aanpassingen aan je verwarmingssysteem en het toekomstige energieverbruik.
        Bij sommige woningen zijn extra werkzaamheden nodig, zoals een nieuwe stroomaansluiting of aanpassingen aan het
        leidingwerk. Bij volledig elektrisch verwarmen heb je bovendien een passende oplossing voor warm water nodig.
      </p>
      <p>
        Via de Investeringssubsidie duurzame energie en energiebesparing (ISDE) kun je onder voorwaarden subsidie
        ontvangen voor een warmtepomp. Daarnaast wil de overheid vanaf 2027 slimme warmtepompen extra stimuleren. Wat dat
        betekent voor jouw investering, lees je in ons artikel over{" "}
        <Link href="/kennis/slimme-warmtepomp-subsidie-2027" className={TEKSTLINK}>slimme warmtepomp subsidie vanaf 2027</Link>.
      </p>
      <p>
        Ook zijn er mogelijk aanvullende lokale regelingen beschikbaar. Met de{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck van Gijs</Link> kun je bekijken welke subsidies bij jouw woning passen.
      </p>

      <ArtikelH2 id="uitzonderingen">Geldt de nieuwe norm straks voor iedere woning?</ArtikelH2>
      <p>
        Niet iedere woning is even geschikt voor een warmtepomp. Het kabinet houdt daarom rekening met situaties waarin
        de nieuwe norm niet haalbaar of wenselijk is. In de Kamerbrief worden monumenten, appartementengebouwen en
        woningen die binnenkort op een warmtenet worden aangesloten genoemd als mogelijke uitzonderingen.
      </p>
      <p>
        Bij appartementen kan bijvoorbeeld onvoldoende ruimte beschikbaar zijn, terwijl bij monumenten aanvullende
        vergunningen nodig kunnen zijn. De precieze voorwaarden zijn nog niet vastgesteld. Verwacht je dat jouw buurt op
        een warmtenet wordt aangesloten? Controleer dan eerst de plannen van je gemeente voordat je investeert in een
        nieuwe verwarmingsinstallatie.
      </p>

      <ArtikelH2 id="wat-nu-doen">Wat kun je nu het beste doen?</ArtikelH2>
      <p>
        De regels voor 2029 zijn nog niet definitief. Maar dat betekent niet dat je moet wachten totdat je cv-ketel
        kapotgaat. Juist wanneer je verwarming nog goed werkt, heb je de tijd om de mogelijkheden rustig te vergelijken
        en een keuze te maken die ook op langere termijn bij je woning past.
      </p>
      <p>
        Misschien kun je met een hybride warmtepomp nu al flink minder gas gebruiken. Misschien is je woning geschikt
        voor volledig elektrisch verwarmen of levert eerst isoleren meer op. Het probleem is dat je dit niet kunt
        bepalen door alleen naar je cv-ketel te kijken. Een installateur die uitsluitend een nieuwe gasketel komt
        plaatsen, onderzoekt niet automatisch of een andere verduurzamingsmaatregel voor jouw huis verstandiger is.
      </p>
      <p>
        Gijs kijkt daarom naar je complete woning. Tijdens een energiescan bekijken we je huidige verwarming, de
        isolatie en het energieverbruik. Zo krijg je inzicht in welke maatregelen passen en in welke volgorde je ze het
        beste kunt uitvoeren. Kies je vervolgens voor een warmtepomp of aanvullende isolatie? Dan kan Gijs ook de
        uitvoering organiseren en verzorgen, met één vertrouwd aanspreekpunt van A tot Z.
      </p>

      <ArtikelH2 id="verkeerde-verwarming">Voorkom dat je investeert in de verkeerde verwarming</ArtikelH2>
      <p>
        Een nieuwe cv-ketel kopen is eenvoudig. Maar of het voor jouw woning de verstandigste investering is, weet je pas
        als je de alternatieven hebt bekeken. Met een gratis en vrijblijvende energiescan ontdek je of een hybride
        warmtepomp, volledig elektrisch verwarmen of eerst isoleren beter bij jouw huis past.
      </p>
      <p>
        Gijs helpt je met onafhankelijk advies en kan daarna ook de uitvoering verzorgen. Van de eerste kennismaking tot
        de installatie, met één vertrouwd aanspreekpunt.
      </p>

      <ArtikelCta slug={slug} titel="Vraag je gratis energiescan aan." regel="Samen maken we je huis fijner." />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen over de cv-ketel en 2029</ArtikelH2>
      <FAQAccordion items={FAQ} className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />

      <Bron>
        Bronnen: Ministerie van Volkshuisvesting en Ruimtelijke Ordening (7 oktober 2026), Voorgenomen normering slimme,
        hybride warmtepompen, en <ExterneLink href={RIJKSOVERHEID_2029}>Rijksoverheid (7 oktober 2026), Slimme en hybride warmtepompen vanaf 2029 de nieuwe standaard</ExterneLink>.
      </Bron>
    </>
  );
}
