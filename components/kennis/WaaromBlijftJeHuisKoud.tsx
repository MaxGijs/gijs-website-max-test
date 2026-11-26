import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

const FAQ: FAQItem[] = [
  {
    question: "Waarom voelt mijn huis koud aan terwijl de verwarming aanstaat?",
    answer:
      "Niet alleen de luchttemperatuur, maar ook de temperatuur van je muren, ramen en vloer bepaalt hoe comfortabel je woning aanvoelt. Koude oppervlakken, tocht en koudeval zorgen voor een onaangenaam gevoel, zelfs wanneer de thermostaat 20 graden aangeeft. Door de oorzaak aan te pakken, verbeter je het wooncomfort zonder voortdurend de thermostaat hoger te zetten.",
  },
  {
    question: "Hoelang duurt het voordat ik mijn investering in isolatie terugverdien?",
    answer:
      "De terugverdientijd hangt af van de investering, beschikbare subsidies, energiebesparing en energieprijzen. Iedere besparing op je energierekening draagt bij aan het terugverdienen van je investering. Tijdens een gratis energiescan brengt Gijs de verwachte besparing en terugverdientijd voor jouw woning in kaart.",
  },
  {
    question: "Wordt mijn woning meer waard door isolatie?",
    answer:
      "Onderzoek van de NVM laat zien dat isolatie een positief effect heeft op de woningwaarde en dat de waardestijging zelfs groter kan zijn dan de oorspronkelijke investering. Daarnaast profiteer je tijdens het wonen van meer wooncomfort en lagere energiekosten. De uiteindelijke waardestijging verschilt per woning.",
  },
];

/** Inleiding boven de hero-foto. */
export function WaaromBlijftJeHuisKoudInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Zit je &apos;s avonds met een dekentje op de bank terwijl de verwarming gewoon aanstaat? Heb je voortdurend
        koude voeten of merk je dat je huis snel afkoelt zodra je de thermostaat lager zet? Je wilt graag
        comfortabeler wonen, maar iedere keer de verwarming hoger zetten is met de huidige energiekosten ook geen
        aantrekkelijke oplossing.
      </p>
      <p className={className}>
        Wanneer je woning onvoldoende geïsoleerd is, verlies je onnodig veel warmte. Door je woning op de juiste manier
        te isoleren, houd je die warmte langer binnen, woon je comfortabeler en bespaar je tegelijkertijd op je
        energierekening. Maar waar moet je beginnen? In dit artikel leggen we uit waarom je huis koud blijft en wat je
        eraan kunt doen.
      </p>
    </>
  );
}

export function WaaromBlijftJeHuisKoud({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="koud-bij-20-graden">Waarom voelt je huis koud aan bij 20 graden?</ArtikelH2>
      <p>
        Je kijkt op de thermostaat en ziet dat het 20 graden is. Toch voelt het helemaal niet zo warm aan. Vooral
        wanneer je bij het raam zit of dicht bij een buitenmuur, merk je dat het onaangenaam koud is. Dat komt doordat
        niet alleen de temperatuur van de lucht bepaalt hoe comfortabel je woning aanvoelt, maar ook de temperatuur van
        je muren, ramen en vloer. Je lichaam geeft warmte af aan deze koudere oppervlakken, waardoor je het koud kunt
        hebben terwijl de luchttemperatuur gewoon op peil is.
      </p>
      <p>
        Daarnaast kun je last hebben van koudeval. Wanneer warme lucht in aanraking komt met een koud raam, koelt deze
        af en zakt de lucht naar beneden. Hierdoor ontstaat een koude luchtstroom die aanvoelt als tocht, zelfs wanneer
        je ramen volledig gesloten zijn. Het plaatsen van tochtstrips heeft tegen koudeval geen zin, omdat de kou niet
        door een kier naar binnen komt. Een beter geïsoleerde woning voelt daardoor bij dezelfde temperatuur vaak
        comfortabeler aan dan een slecht geïsoleerde woning. Je hoeft dus niet altijd de thermostaat hoger te zetten om
        het warmer te krijgen.
      </p>
      <ArtikelFoto
        src="/images/kennis/koud-huis/koudeval-woonkamer.webp"
        alt="Illustratie van koudeval in een woonkamer: warme lucht stijgt op langs het plafond (rode pijlen) terwijl koude lucht langs het raam naar beneden daalt en over de vloer terugstroomt (blauwe pijlen)"
        onderschrift="Bij koudeval koelt warme lucht af langs een koud raam en zakt naar beneden. Dit voelt aan als tocht, ook wanneer ramen gesloten zijn."
      />

      <ArtikelH2 id="blijven-stoken">Waarom blijf je stoken zonder dat je huis comfortabel warm wordt?</ArtikelH2>
      <p>
        Herken je dat je woning aan het einde van de avond eindelijk warm is, maar de volgende ochtend alweer
        behoorlijk koud aanvoelt? Je zet de verwarming opnieuw aan en iedere dag begint hetzelfde verhaal. Zeker
        tijdens de wintermaanden zorgt dit voor een flink energieverbruik, terwijl je voor je gevoel nauwelijks
        profiteert van de warmte waarvoor je betaalt.
      </p>
      <p>
        Wanneer je woning onvoldoende geïsoleerd is, gaat er warmte verloren via onder andere je buitenmuren, dak,
        vloer en ramen. Je verwarmingsinstallatie moet deze verloren warmte steeds opnieuw aanvullen om de gewenste
        temperatuur vast te houden. Door de thermostaat hoger te zetten, vergroot je bovendien het
        temperatuurverschil tussen binnen en buiten, waardoor er nog meer warmte verloren gaat. Je betaalt meer voor
        je energie, terwijl de oorzaak van het probleem blijft bestaan.
      </p>
      <p>
        Hier zit het grote voordeel van isoleren: je investeert niet alleen in een warmer en comfortabeler huis, maar
        bespaart tegelijkertijd op je energieverbruik. Door je woning beter te isoleren, blijft de warmte langer
        binnen en heeft je verwarming minder energie nodig om je huis op temperatuur te houden. Hoeveel je
        uiteindelijk bespaart, hangt af van je woning, de isolatiemaatregelen die je laat uitvoeren, je stookgedrag
        en de energieprijzen.
      </p>

      <ArtikelH2 id="waar-komt-de-kou-vandaan">Waar komt de kou in jouw woning vandaan?</ArtikelH2>
      <p>
        Terug naar dat dekentje op de bank, terwijl het boven in huis wel aangenaam warm is. Of die koude vloer in de
        keuken waar je iedere ochtend overheen loopt. Niet iedere woning heeft hetzelfde probleem en ook binnen één
        woning verschillen de oorzaken per ruimte. Door te letten op de momenten en plekken waarop je de meeste kou
        ervaart, krijg je een eerste indruk van wat er aan de hand is.
      </p>

      {/* Responsieve tabel: scroll horizontaal op kleine schermen, leesbaar op alle */}
      <div className="overflow-x-auto -mx-1 my-6">
        <table className="w-full min-w-[480px] border-collapse text-[15px] leading-[1.55]">
          <thead>
            <tr className="bg-[var(--gijs-donkergroen)] text-white">
              <th className="text-left font-semibold px-4 py-3 rounded-tl-lg">Herken je dit in jouw woning?</th>
              <th className="text-left font-semibold px-4 py-3 rounded-tr-lg">Mogelijke oorzaak</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Zelfs met dikke sokken heb je koude voeten.", "Onvoldoende vloerisolatie of koudeval."],
              ["Het voelt koud wanneer je naast een buitenmuur zit.", "Onvoldoende muur- of gevelisolatie."],
              ["Je voelt tocht terwijl de ramen gesloten zijn.", "Koudeval of kieren rondom de kozijnen."],
              ["Je huis koelt snel af zodra je de verwarming lager zet.", "Warmteverlies via verschillende onderdelen van de woning."],
              ["Je krijgt bepaalde kamers nauwelijks warm.", "Onvoldoende isolatie of een probleem met de verwarming."],
              ["Je energierekening is hoog, maar je woning voelt niet comfortabel aan.", "Veel warmteverlies of een inefficiënte verwarming."],
            ].map(([symptoom, oorzaak], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[var(--gijs-lichtgroen,#f0f5f0)]" : "bg-white"}>
                <td className="px-4 py-3 align-top border-t border-black/[0.06]">{symptoom}</td>
                <td className="px-4 py-3 align-top border-t border-black/[0.06]">{oorzaak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        De plek waar je de kou ervaart, is niet automatisch de plek waar het probleem ontstaat. Koude voeten
        betekenen bijvoorbeeld niet direct dat je vloerisolatie nodig hebt. Zoals eerder uitgelegd, zorgt koudeval
        langs je ramen ook voor koude lucht over de vloer. Wanneer je in dat geval uitsluitend je vloer laat
        isoleren, pak je niet de juiste oorzaak aan.
      </p>
      <p>
        Ook de werking van je verwarmingsinstallatie speelt een rol. Een bank voor de radiator of lange gordijnen die
        de verwarming blokkeren, belemmeren de verspreiding van warmte. Blijft je woning koud aanvoelen terwijl je
        verwarming goed werkt? Dan is het belangrijk om te laten onderzoeken waar jouw woning warmte verliest.
      </p>

      <ArtikelH2 id="hoeveel-graden-scheelt-spouwmuurisolatie">Hoeveel graden scheelt spouwmuurisolatie?</ArtikelH2>
      <p>
        Wanneer je buitenmuren koud aanvoelen, is{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuurisolatie</Link> een interessante
        maatregel. Door een geschikte spouwmuur te isoleren, verminder je het warmteverlies via je buitenmuren.
        Hierdoor voelen de muren aan de binnenkant warmer aan en heeft je verwarming minder energie nodig om je
        woning op temperatuur te houden.
      </p>
      <p>
        Hoeveel graden spouwmuurisolatie precies scheelt, verschilt per woning. Het grootste verschil hoeft bovendien
        niet zichtbaar te zijn op je thermostaat. Je merkt het juist wanneer je op de bank zit en minder kou vanuit
        je buitenmuren ervaart. Bij dezelfde temperatuur woon je comfortabeler, terwijl je minder energie nodig hebt
        om die temperatuur vast te houden.
      </p>
      <p>
        Voordat je jouw spouwmuren laat isoleren, is het belangrijk om te weten welke isolatie er al aanwezig is en
        in welke staat deze verkeert. Het bouwjaar van je woning geeft een eerste indruk, maar vertelt niet het
        volledige verhaal. Met een kleine camera kan een adviseur de binnenkant van je spouwmuur onderzoeken. Zo
        wordt duidelijk of er nog winst te behalen valt.
      </p>

      <ArtikelH2 id="wat-kost-niets-doen">Verduurzamen kost geld, maar wat kost niets doen?</ArtikelH2>
      <p>
        Wanneer je nadenkt over het isoleren van je woning, kijk je waarschijnlijk eerst naar de kosten. Logisch,
        want verduurzamen vraagt om een investering. Maar heb je er ook weleens bij stilgestaan wat het je kost als
        je niets doet? Iedere maand betaal je opnieuw voor de energie die nodig is om je woning warm te houden.
        Zolang je woning onnodig veel warmte verliest, blijf je daarvoor betalen. Volgend jaar, het jaar daarna en
        ook over tien jaar. Ondertussen verandert er niets aan je woning en blijf je last houden van de kou.
      </p>
      <p>
        Het verschil is dat je met verduurzaming investeert in je eigen woning, terwijl je met onnodig
        energieverbruik iedere maand geld blijft uitgeven. Met isolatie pak je het warmteverlies bij de oorzaak aan.
        Hierdoor verlaag je het energieverbruik van je woning en verdien je met iedere besparing op je
        energierekening een deel van je investering terug. De periode waarin je de investering met deze besparingen
        terugverdient, noemen we de terugverdientijd. Zodra je dit punt bereikt, leveren de verdere besparingen je
        financieel voordeel op. Van het verbeterde wooncomfort profiteer je ondertussen al vanaf het begin.
      </p>
      <p>
        Daarnaast hoef je de investering niet altijd volledig zelf te betalen. Voor verschillende
        verduurzamingsmaatregelen zijn subsidies beschikbaar. Wanneer je hiervoor in aanmerking komt, verlaag je het
        bedrag dat je zelf moet investeren en verkort je de terugverdientijd.{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>Via de subsidiecheck van Gijs</Link> ontdek je welke
        subsidies er voor jouw woning beschikbaar zijn.
      </p>
      <p>
        Kijk daarom verder dan het bedrag dat je vandaag moet investeren. Hoeveel betaal je de komende tien of
        twintig jaar aan energie wanneer je niets aan je woning verandert? Hoeveel kun je daarvan besparen door
        gericht te verduurzamen? En hoeveel comfortabeler woon je gedurende diezelfde periode? De vraag is niet
        alleen wat verduurzamen vandaag kost, maar vooral hoeveel geld je op lange termijn blijft uitgeven als je
        niets doet.
      </p>

      <ArtikelH2 id="woningwaarde">Je woning wordt niet alleen comfortabeler, maar ook meer waard</ArtikelH2>
      <p>
        Naast de besparing op je energierekening heeft verduurzaming ook een positief effect op de woningwaarde. Uit
        onderzoek van de NVM uit december 2025 onder 30.000 woningen blijkt dat negen op de tien woningeigenaren hun
        investering in verduurzaming volledig terugzien in een hogere woningwaarde. Bij volledige isolatie bedraagt
        de gemiddelde waardestijging volgens het onderzoek €2,20 voor iedere geïnvesteerde euro.
      </p>
      <p>
        Stel dat je €10.000 investeert in volledige isolatie. Op basis van het onderzoeksgemiddelde komt dit neer op
        een waardestijging van €22.000. Dat betekent €12.000 aan extra woningwaarde boven op het bedrag dat je zelf
        hebt geïnvesteerd. En dan zijn de jaarlijkse besparingen op je energierekening nog niet eens meegerekend.
        De daadwerkelijke waardestijging verschilt per woning, maar het onderzoek laat zien waarom het belangrijk is
        om verder te kijken dan alleen de aanschafkosten.
      </p>
      <p>
        Je verdient dus niet alleen geleidelijk je investering terug via een lagere energierekening, maar investeert
        tegelijkertijd in de waarde van je eigen woning. Bovendien profiteer je iedere dag van het verbeterde
        wooncomfort. Dat is het verschil tussen geld uitgeven aan energie en geld investeren in je woning.
      </p>

      <ArtikelH2 id="basis-voor-energiezuinige-woning">Met isolatie leg je de basis voor een energiezuinige woning</ArtikelH2>
      <p>
        Het isoleren van je woning hoeft niet het eindpunt te zijn. Wanneer je huis minder warmte verliest, heb je
        minder energie nodig om comfortabel te wonen. Daarmee leg je de basis om je woning verder te verduurzamen
        met passende installaties. Met een{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> verminder je het gasverbruik en
        met <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link> wek je een deel van je
        eigen elektriciteit op. Door isolatie en installaties goed op elkaar af te stemmen, werk je toe naar een
        comfortabele woning met een zo laag mogelijke energierekening.
      </p>
      <p>
        Het is daarom belangrijk om verder te kijken dan de maatregel die je vandaag wilt uitvoeren. Wanneer je in
        de toekomst een warmtepomp wilt aanschaffen, wil je nu al weten welke isolatie daarvoor verstandig is. Je
        wilt voorkomen dat je investeert in een installatie die niet goed aansluit op je woning of dat je later
        opnieuw aanpassingen moet laten uitvoeren.
      </p>
      <p>
        Je hoeft je woning niet in één keer volledig te verduurzamen. Met een goed onderbouwd plan weet je waar je
        moet beginnen, welke investeringen het meeste opleveren en welke stappen je in de toekomst nog kunt zetten.
        Zo werk je stap voor stap aan meer wooncomfort, lagere energiekosten en een waardevollere woning.
      </p>

      <ArtikelH2 id="gijs-helpt">Comfortabeler wonen met een lagere energierekening? Gijs helpt je.</ArtikelH2>
      <p>
        Terug naar die koude voeten, dat dekentje op de bank en die energierekening die iedere maand terugkomt. Je
        wilt gewoon comfortabel in je eigen huis kunnen wonen, zonder voortdurend de thermostaat hoger te moeten
        zetten of je zorgen te maken over je energieverbruik. Je weet inmiddels dat er verschillende oorzaken zijn
        waardoor je woning koud aanvoelt. Maar welke investering zorgt ervoor dat jij daadwerkelijk van die kou
        afkomt en tegelijkertijd zoveel mogelijk bespaart?
      </p>
      <p>
        Wanneer je een spouwmuurisolatiebedrijf laat langskomen, wordt er voornamelijk gekeken naar je buitenmuren.
        Een vloerisolatiebedrijf kijkt naar je vloer en een warmtepompinstallateur naar je verwarming. Maar waarom
        zou je investeren in vloerisolatie wanneer je met dakisolatie meer energie bespaart? En waarom zou je een
        warmtepomp aanschaffen zonder eerst te onderzoeken hoeveel warmte jouw woning nodig heeft? Je wilt niet
        weten welke maatregel een bedrijf je kan verkopen, maar welke maatregel jouw woning daadwerkelijk nodig
        heeft.
      </p>
      <p>
        Bij Gijs &ndash; Groen in je straat kijken we daarom naar je volledige woning. Tijdens een gratis en
        vrijblijvende energiescan aan huis onderzoeken we waar jouw woning warmte verliest, welke isolatie en
        installaties er al aanwezig zijn en waar de grootste winst te behalen valt. Daarbij kijken we niet alleen
        naar de technische mogelijkheden, maar ook naar de investering, beschikbare subsidies, de verwachte
        energiebesparing en de terugverdientijd. Zo weet je waar je jouw geld het beste in kunt investeren en wat
        het je op lange termijn oplevert.
      </p>
      <p>
        Wanneer duidelijk is welke maatregelen bij jouw woning passen, verzorgen we ook de uitvoering. Van{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuurisolatie</Link>,{" "}
        <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dakisolatie</Link>,{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloerisolatie</Link> en{" "}
        <Link href="/maatregelen/isolatieglas" className={TEKSTLINK}>isolatieglas</Link> tot{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepompen</Link> en{" "}
        <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link>. Je hoeft niet zelf
        verschillende bedrijven te benaderen of uit te zoeken welke maatregelen goed op elkaar aansluiten. Bij Gijs
        heb je één vast aanspreekpunt dat je begeleidt van het eerste advies tot de oplevering.
      </p>
      <p>
        Blijf niet onnodig betalen voor warmte die verloren gaat, maar investeer in een woning waarin je jarenlang
        comfortabeler en energiezuiniger woont. Daar helpen we je graag bij.
      </p>

      <ArtikelCta
        slug={slug}
        titel="Ontdek wat verduurzamen jou oplevert."
        regel="Een warmer huis, een lagere energierekening en een hogere woningwaarde."
      />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen</ArtikelH2>
      <FAQAccordion
        items={FAQ}
        className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg"
      />
    </>
  );
}
