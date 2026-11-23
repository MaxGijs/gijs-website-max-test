import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, Bron, ExterneLink } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

// Basis: tekst van Max ("Is zonnepanelen kopen nog wel rendabel zonder salderingsregeling?"), aangevuld
// met de terugverdientijd en gecontroleerd op de bronnen (23 november 2026):
// - CBS StatLine 85005NED (Woningen, NL): opgesteld aantal installaties, verschil per jaar:
//   2023 +473.941, 2025 +127.469, 2026 t/m Q2 +40.574 (voorlopig).
// - RVO nieuws + Monitor Zon-PV 2025: terugverdientijd kleinschalig 14 t/m 20 jaar, wel binnen levensduur;
//   581 uur negatieve prijzen in 2025 (7%); hoger eigengebruik via opslag, EV, warmtepomp.
// - Milieu Centraal: 30% direct eigen verbruik, 3 tot 4 keer voordeliger, 25 jaar, € 1,83 (2022) en € 0,87 (2025).
// - CBS Klimaatverandering en energietransitie 2023: 39%, bijna een kwart, 20%, 12%, 96%, helft.
// Op verzoek van Max geen prijzen of bedragen: die komen niet van Gijs.
const CBS_TABEL = "https://www.cbs.nl/nl-nl/cijfers/detail/85005NED";
const RVO_NIEUWS = "https://www.rvo.nl/nieuws/minder-groei-zonne-energie-2025";
const RVO_MONITOR = "https://www.rvo.nl/sites/default/files/2025-09/Monitor-zon-pv-2025.pdf";
const CBS_2023 = "https://longreads.cbs.nl/klimaatverandering-en-energietransitie-2023/duurzaam-wonen/";
const MILIEU_CENTRAAL = "https://www.milieucentraal.nl/energie-besparen/zonnepanelen/kosten-en-opbrengst-zonnepanelen/";

const FAQ: FAQItem[] = [
  {
    question: "Wat is de terugverdientijd van zonnepanelen zonder salderen?",
    answer: "Dat hangt af van je woning en je verbruik. De RVO noemt voor kleine installaties een terugverdientijd van 14 tot en met 20 jaar en schrijft dat zonnepanelen zich binnen hun levensduur van ongeveer 25 jaar terugverdienen. Hoe meer stroom je zelf gebruikt, hoe korter de terugverdientijd.",
  },
  {
    question: "Wat verandert er op 1 januari 2027 voor mijn zonnepanelen?",
    answer: "Dan stopt de salderingsregeling. Je kunt teruggeleverde stroom dan niet meer wegstrepen tegen stroom die je inkoopt. Je krijgt een terugleververgoeding, maar energieleveranciers mogen ook terugleverkosten rekenen. Zelf opgewekte stroom die je direct gebruikt, hoef je niet in te kopen.",
  },
  {
    question: "Moet ik vóór 2027 zonnepanelen laten plaatsen?",
    answer: "Nee. De salderingsregeling stopt op 1 januari 2027 voor iedereen, ook voor bestaande zonnepanelen. Een installatie die vóór die datum wordt geplaatst, levert daarna dus geen extra voordeel op. Kijk daarom vooral naar wat past bij je dak en je verbruik.",
  },
  {
    question: "Heb ik een thuisbatterij nodig bij zonnepanelen?",
    answer: "Niet automatisch. Je kunt ook meer zonnestroom zelf gebruiken door apparaten overdag te laten draaien of door slimme aansturing. Of een thuisbatterij loont, hangt af van je situatie. Lees er meer over in ons artikel over salderen en de thuisbatterij.",
  },
];

/** Eerste twee alinea's; staan op de pagina direct onder de titel, boven de foto. */
export function ZonnepanelenZonderSalderingInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Steeds minder Nederlanders laten <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link> plaatsen.
        Volgens cijfers van het CBS is de groei van de zonnepaneelmarkt flink afgenomen. Tegelijkertijd stopt op
        1 januari 2027 de salderingsregeling. Waarom zou je dan nog investeren in zonnepanelen? En verdien je die
        investering eigenlijk nog wel terug?
      </p>
      <p className={className}>
        Toch vertellen de cijfers niet het hele verhaal.{" "}
        <strong>Dat minder mensen zonnepanelen kopen, betekent niet dat ze voor jouw woning minder interessant zijn.</strong>{" "}
        Misschien heb je ze simpelweg nog niet. Bovendien zijn zonnepanelen goedkoper geworden en blijft zelf
        opgewekte elektriciteit je geld besparen. Het financiële voordeel verdwijnt dus niet, maar verandert.
      </p>
    </>
  );
}

export function ZonnepanelenZonderSaldering({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="markt-krimpt">Zonnepaneelmarkt krimpt</ArtikelH2>
      <p>
        Volgens <ExterneLink href={CBS_TABEL}>cijfers van het CBS</ExterneLink> kwamen er in 2023 nog ongeveer 474.000
        zonnepaneelinstallaties bij op woningen. In 2025 waren dat er ongeveer 127.000. In de eerste helft van 2026
        kwamen er volgens voorlopige cijfers ongeveer 41.000 bij. De groei is dus fors afgenomen, ook al zijn de cijfers
        van 2026 nog niet definitief.
      </p>
      <p>
        Maar waarom groeit deze markt minder hard? Volgens de{" "}
        <ExterneLink href={RVO_NIEUWS}>Rijksdienst voor Ondernemend Nederland (RVO)</ExterneLink> spelen terugleverkosten,
        het verdwijnen van de salderingsregeling en onzekerheid over toekomstige opbrengsten een rol. Ook negatieve
        stroomprijzen en een overbelast elektriciteitsnet hebben invloed. In 2025 waren er al 581 uur met negatieve
        stroomprijzen, ongeveer 7% van de tijd. Dan kost het geld om stroom terug te leveren, bijvoorbeeld bij een
        dynamisch contract.
      </p>
      <p>
        Uit <ExterneLink href={CBS_2023}>CBS-onderzoek uit 2023</ExterneLink> bleek dat sommige huishoudens in een
        eengezinskoopwoning geen zonnepanelen overwogen. 39% vond de terugverdientijd te lang, bijna een kwart had
        geen geschikt dak en 20% vond de aanschaf te duur. Bij 12% speelde de geplande afbouw van de salderingsregeling
        mee. Opvallend genoeg was 96% van de huishoudens met zonnepanelen tevreden over hun installatie. Bovendien had
        destijds al de helft van de huishoudens in een eengezinskoopwoning zonnepanelen. De onderzoeksresultaten
        verklaren de huidige krimp niet rechtstreeks, maar laten wel zien welke afwegingen woningeigenaren maken.
      </p>
      <Bron>
        Bronnen: <ExterneLink href={CBS_TABEL}>CBS StatLine 85005NED</ExterneLink>, <ExterneLink href={RVO_NIEUWS}>RVO – Zonne-energie groeide in 2025 opnieuw minder hard</ExterneLink> en <ExterneLink href={CBS_2023}>CBS – Duurzaam wonen (2023)</ExterneLink>.
      </Bron>

      <ArtikelH2 id="blijven-interessant">Waarom blijven zonnepanelen toch interessant?</ArtikelH2>
      <p>
        Tot en met 31 december 2026 kun je teruggeleverde zonnestroom nog verrekenen met elektriciteit die je op andere
        momenten inkoopt. Vanaf 1 januari 2027 stopt dat. Je krijgt nog wel een terugleververgoeding, maar
        energieleveranciers kunnen ook terugleverkosten rekenen. Daardoor wordt het minder aantrekkelijk om veel stroom
        terug te leveren.
      </p>
      <p>
        <strong>Maar elektriciteit die je zelf opwekt en direct gebruikt, hoef je niet bij je energieleverancier te kopen.</strong>{" "}
        Dat gebeurt eigenlijk vanzelf: wanneer je zonnepanelen overdag stroom opwekken, gebruiken apparaten zoals je
        koelkast of wasmachine die elektriciteit direct. Alleen de stroom die je op dat moment niet nodig hebt, lever je
        terug aan het elektriciteitsnet. Volgens <ExterneLink href={MILIEU_CENTRAAL}>Milieu Centraal</ExterneLink>{" "}
        gebruiken huishoudens gemiddeld 30% van hun zonnestroom direct zelf. En dat percentage kun je verhogen.{" "}
        <a href="#meer-zelf-gebruiken" className={TEKSTLINK}>Verderop lees je hoe je meer uit je eigen zonnestroom haalt.</a>
      </p>

      <p>
        Daar komt bij dat zonnepanelen goedkoper zijn geworden. Volgens Milieu Centraal zijn de gemiddelde
        aanschafprijzen per wattpiek de afgelopen jaren flink gedaald. Een wattpiek geeft aan hoeveel vermogen een paneel
        onder standaard testomstandigheden kan leveren. Je betaalt dus tegenwoordig minder voor hetzelfde opwekvermogen
        dan enkele jaren geleden. Bovendien gaan zonnepanelen gemiddeld ongeveer 25 jaar mee. Je bent voor de stroom die
        je direct zelf gebruikt minder afhankelijk van toekomstige prijsstijgingen. Ook verklein je met duurzame
        elektriciteit de klimaatimpact van je stroomverbruik.
      </p>

      <ArtikelH2 id="terugverdientijd">Wanneer verdien je zonnepanelen terug?</ArtikelH2>
      <p>
        Dit is de vraag waar het om draait. De RVO noemt voor kleine installaties een terugverdientijd van 14 tot en met
        20 jaar. Dat is lang, maar de RVO schrijft er ook bij dat zonnepanelen zich binnen hun levensduur blijven
        terugverdienen. Bij een levensduur van ongeveer 25 jaar blijft er dan nog tijd over waarin de panelen geld
        opleveren.
      </p>
      <p>
        Waar je binnen die 14 tot 20 jaar uitkomt, verschilt per woning. Het hangt af van wat de installatie kost, hoe
        veel stroom je opwekt en vooral van hoeveel je zelf gebruikt. Wie veel stroom direct verbruikt, verdient zijn
        panelen sneller terug dan wie het meeste teruglevert. Het is dus geen gegarandeerde opbrengst en niet voor iedere
        woning even gunstig. Maar zonnepanelen kunnen ook zonder salderen financieel voordeel opleveren.
      </p>
      <Bron>
        Bronnen: <ExterneLink href={RVO_MONITOR}>RVO – Monitor Zon-PV 2025</ExterneLink> en{" "}
        <ExterneLink href={MILIEU_CENTRAAL}>Milieu Centraal – Kosten en opbrengst zonnepanelen</ExterneLink>.
      </Bron>

      <ArtikelH2 id="meer-zelf-gebruiken">Zo gebruik je meer zonnestroom zelf</ArtikelH2>
      <p>
        Hoe meer van je eigen stroom je direct gebruikt, hoe korter de terugverdientijd. De RVO schrijft dat een hoger
        eigengebruik de terugverdientijd sterk kan verlagen, bijvoorbeeld met opslag, een elektrische auto of een{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link>. Dat kan eenvoudig beginnen met je
        wasmachine overdag laten draaien of je elektrische auto opladen wanneer de zon schijnt. Met slimme aansturing,
        bijvoorbeeld via een energiemanagementsysteem, kunnen geschikte apparaten ook automatisch reageren op de
        hoeveelheid opgewekte stroom. Denk aan een laadpaal die het opladen afstemt op je zonnepanelen of een warmtepomp
        die op zonnige momenten warm water maakt.
      </p>
      <p>
        Zo kun je mogelijk meer zonnestroom direct gebruiken, zonder dat je automatisch een{" "}
        <Link href="/maatregelen/thuisbatterij" className={TEKSTLINK}>thuisbatterij</Link> nodig hebt. Wel moeten je
        apparaten geschikt zijn en moet de extra investering opwegen tegen de verwachte besparing. Wil je weten hoe dat
        zit met een batterij? Lees dan ons artikel{" "}
        <Link href="/kennis/salderen-stopt-2027-thuisbatterij" className={TEKSTLINK}>Salderen stopt in 2027, dus een thuisbatterij kopen? Of toch niet?</Link>
      </p>

      <ArtikelH2 id="verstandig-voor-jouw-woning">Zijn zonnepanelen verstandig voor jouw woning?</ArtikelH2>
      <p>Met deze vragen krijg je een eerste indruk:</p>
      <ul className="mb-5 list-disc space-y-2 pl-6 marker:text-[var(--accent-700)]">
        <li>Heeft je dak een geschikte richting en weinig schaduw?</li>
        <li>Gebruik je overdag regelmatig elektriciteit, bijvoorbeeld omdat je thuiswerkt?</li>
        <li>Verwacht je binnenkort meer stroom nodig te hebben, bijvoorbeeld door een elektrische auto of warmtepomp?</li>
        <li>Is je dak in goede staat, of staat er binnenkort onderhoud of <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dakisolatie</Link> gepland?</li>
        <li>Verbruik je vooral veel gas door slechte isolatie? Dan kan een andere maatregel eerst verstandiger zijn.</li>
      </ul>
      <p>
        Heb je nog geen zonnepanelen, een geschikt dak en gebruik je regelmatig elektriciteit? Dan kunnen zonnepanelen
        ook in 2027 interessant zijn. Wel is het belangrijk om verder te kijken dan alleen je huidige stroomverbruik.
        Misschien wil je binnenkort elektrisch rijden of een warmtepomp aanschaffen, waardoor je meer elektriciteit
        nodig hebt. Ook de ligging, schaduw en staat van je dak spelen mee. Is je dak binnenkort aan onderhoud toe of
        verbruikt je woning vooral veel gas door slechte isolatie? Dan kan het verstandiger zijn om eerst een andere
        maatregel aan te pakken.
      </p>
      <p>
        Daarom kijken wij van Gijs tijdens een gratis en vrijblijvende energiescan met je mee naar je hele woning. We
        kijken niet alleen naar hoeveel <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link> er
        op je dak passen, maar ook naar je energieverbruik, je toekomstplannen en andere verduurzamingsmogelijkheden.
        Zijn zonnepanelen een goede keuze? Dan helpen we je ook met de levering en installatie, zodat je één vertrouwd
        aanspreekpunt hebt, van advies tot uitvoering. Wil je alvast weten welke regelingen er voor jouw woning zijn? Doe
        dan de <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck van Gijs</Link>.
      </p>

      <ArtikelH2 id="ontdek-of-het-past">Ontdek of zonnepanelen bij jouw woning passen</ArtikelH2>
      <p>
        Dat de zonnepaneelmarkt krimpt, betekent niet dat jij geen voordeel meer kunt halen uit zonnepanelen. Misschien
        heb je ze nog niet, terwijl je jarenlang op je energierekening kunt besparen. Met een gratis en vrijblijvende
        energiescan onderzoekt Gijs welke maatregelen voor jouw woning verstandig zijn. Van zonnepanelen tot isolatie en
        warmtepompen: Gijs ontzorgt je van A tot Z.
      </p>

      <ArtikelCta slug={slug} titel="Ontdek wat zonnepanelen voor jouw woning kunnen opleveren." />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen over zonnepanelen zonder salderen</ArtikelH2>
      <FAQAccordion items={FAQ} className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
    </>
  );
}
