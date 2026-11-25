import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ExterneLink } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

// Tekst van Max ("UF-schuim bij spouwmuurisolatie: wat zijn de risico's en alternatieven?"), licht
// ingekort op zijn verzoek en met dezelfde schrijfstijl. Feiten door Max en Claude gecontroleerd op
// 25 november 2026: GGD-advies februari 2026, ISDE-stop 1 april 2026 (RVO), motie Beckerman aangenomen
// op 3 november (Vereniging Eigen Huis, 16 november), kabinet steunt het GGD-advies maar heeft nog niet
// over een verbod besloten (Volkshuisvesting Nederland). De regel over het kabinet is door Claude toegevoegd.
const GGD = "https://www.ggdzl.nl/nieuws/nieuwsitem/ggd-adviseert-gebruik-geen-uf-schuim-voor-spouwmuurisolatie/";
const RIJKSOVERHEID = "https://www.rijksoverheid.nl/onderwerpen/energie-thuis/vraag-en-antwoord/kan-ik-uf-schuim-laten-aanbrengen-in-mijn-spouwmuur";
const AWGL = "https://awgl.nl/projecten/desktopstudie-gezondheidsrisicos-uf-schuim";
const RADAR = "https://radar.avrotros.nl/artikel/fragment-uf-schuim-in-woningen-veroorzaakt-gezondheidsklachten-63140";
const VEH = "https://www.eigenhuis.nl/nieuws/tweede-kamer-wil-verbod-op-isolatie-met-uf-schuim";
const VOLKSHUISVESTING = "https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/besluit-bouwwerken-leefomgeving/formaldehyde-en-uf-schuim";
const RVO = "https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen/advies-uf-schuim";

const FAQ: FAQItem[] = [
  {
    question: "Is UF-schuim hetzelfde als PUR-schuim?",
    answer: "Nee. UF-schuim en PUR-schuim zijn verschillende isolatiematerialen. De actuele waarschuwing van de GGD heeft betrekking op het vrijkomen van formaldehyde bij UF-schuim. Ook bij PUR-isolatie blijft een deskundige verwerking belangrijk.",
  },
  {
    question: "Moet ik UF-schuim uit mijn spouwmuur laten verwijderen?",
    answer: "Niet automatisch. Heb je geen gezondheidsklachten, dan adviseert de GGD om goed te blijven ventileren. Heb je wel klachten en vermoed je dat deze door UF-schuim worden veroorzaakt? Neem dan contact op met je huisarts of regionale GGD voordat je maatregelen neemt.",
  },
  {
    question: "Wat is de beste spouwmuurisolatie voor een oude woning?",
    answer: "Er is niet één isolatiemateriaal dat voor iedere oude woning de beste keuze is. De beschikbare ruimte in de spouw, de staat van de gevel en eventueel aanwezige isolatie bepalen mede welk materiaal geschikt is. Laat daarom eerst onderzoeken welk materiaal bij jouw woning past.",
  },
];

/** Eerste twee alinea's; staan op de pagina direct onder de titel, boven de foto. */
export function UfSchuimInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Een warmer huis, minder gas verbruiken en een lagere energierekening. Dat is waarschijnlijk waarom je overweegt
        om je <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuur</Link> te laten isoleren. Maar
        wat als het isolatiemateriaal in je muren schadelijke stoffen afgeeft aan de lucht die je dagelijks inademt? Dat
        is precies waarom de GGD sinds februari 2026 het gebruik van UF-schuim afraadt. Bij dit isolatiemateriaal komt
        formaldehyde vrij, een schadelijk gas dat gezondheidsklachten kan veroorzaken en bij langdurige blootstelling het
        risico op kanker verhoogt.
      </p>
      <p className={className}>
        Inmiddels is de subsidie voor nieuwe toepassingen stopgezet en heeft de Tweede Kamer het kabinet opgeroepen het
        materiaal te verbieden. Moet je daarom afzien van spouwmuurisolatie? Zeker niet. Er zijn verschillende
        alternatieven waarmee je jouw woning comfortabeler en energiezuiniger kunt maken. Het is vooral belangrijk dat je
        vooraf weet welk materiaal in jouw muren terechtkomt. Je wilt immers je wooncomfort verbeteren, niet je
        gezondheid in gevaar brengen.
      </p>
    </>
  );
}

export function UfSchuimSpouwmuur({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="waarom-schadelijk">Waarom is UF-schuim schadelijk voor je gezondheid?</ArtikelH2>
      <p>
        UF-schuim, voluit ureumformaldehydeschuim, is een isolatiemateriaal dat vloeibaar tussen de binnen- en buitenmuur
        van je woning wordt aangebracht. Daar hardt het uit tot een isolerende laag die warmteverlies via de buitenmuren
        beperkt. Het probleem ontstaat tijdens en na het uitharden van het schuim. Hierbij komt formaldehyde vrij, een
        schadelijk gas dat vanuit de spouw in de binnenlucht van je woning terecht kan komen. Je kunt dus worden
        blootgesteld aan formaldehyde terwijl je gewoon thuis bent.
      </p>
      <p>
        Volgens <ExterneLink href={GGD}>GGD Zuid-Limburg</ExterneLink> kan het inademen van formaldehyde leiden tot
        irritatie van de ogen, neus en keel, hoofdpijn en misselijkheid. Mensen met een longaandoening, zoals astma,
        kunnen extra klachten krijgen. De gevolgen kunnen bij langdurige blootstelling ernstiger zijn. De{" "}
        <ExterneLink href={RIJKSOVERHEID}>Rijksoverheid</ExterneLink> waarschuwt namelijk dat langdurige blootstelling aan
        UF-schuim het risico op kanker verhoogt. Het gaat dus niet alleen om tijdelijke gezondheidsklachten, maar ook om
        mogelijke gezondheidsschade op de langere termijn.
      </p>
      <p>
        Dat betekent niet dat iedereen met UF-schuim in de spouwmuur ziek wordt. De kans op gezondheidsklachten hangt
        onder andere af van de hoeveelheid formaldehyde waaraan je wordt blootgesteld. Het is echter nog onvoldoende
        duidelijk waarom in sommige woningen meer formaldehyde vrijkomt dan in andere. Juist die onzekerheid is voor de
        GGD een belangrijke reden om het gebruik van UF-schuim af te raden.
      </p>

      <ArtikelH2 id="moeilijk-verantwoord">Waarom is het moeilijk om UF-schuim verantwoord toe te passen?</ArtikelH2>
      <p>
        Uit een <ExterneLink href={AWGL}>onderzoek van de Academische Werkplaats Gezonde Leefomgeving</ExterneLink>, dat
        in 2026 werd afgerond, blijkt dat er nog veel onzekerheid bestaat over de gezondheidsrisico&apos;s van UF-schuim.
        Voor het onderzoek werden vier GGD&apos;en geïnterviewd over zeven verschillende praktijkgevallen waarbij
        problemen waren ontstaan na het isoleren van woningen. In deze gevallen werden hoge concentraties formaldehyde in
        de binnenlucht aangetroffen. Naast lichamelijke klachten had de situatie ook grote gevolgen voor het welzijn van
        de betrokken bewoners.
      </p>
      <p>
        De onderzoekers constateerden bovendien dat de bestaande richtlijnen voor het beoordelen van woningen voorafgaand
        aan isolatie met UF-schuim beperkt en verouderd zijn. In de onderzochte gevallen werden deze richtlijnen niet of
        nauwelijks toegepast. Ook bleek dat de hoeveelheid formaldehyde in de binnenlucht langzaam en onregelmatig
        afneemt. Hierdoor is het moeilijk om vooraf te voorspellen hoelang bewoners aan verhoogde concentraties worden
        blootgesteld. Hoe vaak deze problemen voorkomen bij alle woningen die met UF-schuim zijn geïsoleerd, is nog
        onbekend.
      </p>
      <p>
        Zolang onvoldoende duidelijk is hoe deze gezondheidsproblemen kunnen worden voorkomen, is het advies van de GGD
        dan ook duidelijk: gebruik geen UF-schuim voor spouwmuurisolatie.
      </p>

      <ArtikelH2 id="verbod">Wordt UF-schuim verboden?</ArtikelH2>
      <p>
        De gezondheidsrisico&apos;s kregen in november opnieuw landelijke aandacht. Consumentenprogramma{" "}
        <ExterneLink href={RADAR}>Radar</ExterneLink> besteedde op 2 november 2026 aandacht aan bewoners die
        gezondheidsklachten kregen nadat hun woning met UF-schuim was geïsoleerd. In ernstige gevallen moesten bewoners
        zelfs hun huis verlaten. Een dag later nam de Tweede Kamer een motie aan waarin het kabinet wordt opgeroepen zo
        snel mogelijk een verbod op UF-schuim in te voeren. Ook <ExterneLink href={VEH}>Vereniging Eigen Huis</ExterneLink>{" "}
        ondersteunt deze oproep en adviseert woningeigenaren het materiaal niet te laten aanbrengen.
      </p>
      <p>
        Een aangenomen motie betekent echter niet dat het materiaal direct wettelijk verboden is. Het is aan het kabinet
        om te bepalen of en hoe een verbod wordt ingevoerd. Het kabinet ondersteunt het advies van de GGD om UF-schuim
        voorlopig niet meer toe te passen en heeft de rijkssubsidie daarvoor tijdelijk stopgezet, maar heeft nog niet
        besloten over een verbod (<ExterneLink href={VOLKSHUISVESTING}>Volkshuisvesting Nederland</ExterneLink>). Als
        woningeigenaar hoef je die ontwikkelingen niet af te wachten. Er zijn voldoende alternatieve isolatiematerialen
        beschikbaar waarmee je warmteverlies kunt beperken. De waarschuwing van de GGD heeft betrekking op een specifiek
        isolatiemateriaal, niet op spouwmuurisolatie als geheel.
      </p>

      <ArtikelH2 id="alternatieven">Welke spouwmuurisolatie kies je als alternatief voor UF-schuim?</ArtikelH2>
      <p>
        Gelukkig hoef je de voordelen van spouwmuurisolatie niet mis te lopen omdat de GGD UF-schuim afraadt. Er zijn
        verschillende alternatieven waarmee je jouw woning comfortabeler en energiezuiniger kunt maken. Bij Gijs werken
        we onder andere met de volgende isolatiematerialen:
      </p>
      <ul className="mb-5 list-disc space-y-3 pl-6 marker:text-[var(--accent-700)]">
        <li>
          <strong>Glaswolvlokken:</strong> kleine vezels die in de spouwmuur worden geblazen en daar een isolerende laag
          vormen. Glaswolvlokken helpen niet alleen om warmteverlies te beperken, maar kunnen ook geluid van buiten
          verminderen. Dat kan bijvoorbeeld interessant zijn wanneer je aan een drukke straat woont.
        </li>
        <li>
          <strong>EPS-isolatieparels:</strong> kleine isolatiekorrels die met een bindmiddel in de spouw worden
          aangebracht. De korrels vormen samen een isolerende laag die ervoor zorgt dat je woning minder warmte verliest
          via de buitenmuren.
        </li>
        <li>
          <strong>PUR-isolatieschuim:</strong> een isolatiemateriaal dat tijdens het aanbrengen uitzet en de beschikbare
          ruimte in de spouw opvult. Hoewel PUR en UF beide isolatieschuimen zijn, gaat het om verschillende materialen.
          De actuele waarschuwing van de GGD heeft specifiek betrekking op UF-schuim. Ook bij PUR blijft een deskundige
          verwerking belangrijk.
        </li>
      </ul>
      <p>
        Welk isolatiemateriaal uiteindelijk het beste bij jouw woning past, hangt niet alleen af van de isolerende
        eigenschappen. Ook de beschikbare ruimte tussen je muren, de staat van je gevel en eventueel aanwezige isolatie
        spelen een belangrijke rol. Vooral bij oudere woningen kan het zijn dat er jaren geleden al isolatiemateriaal is
        aangebracht. Het materiaal waarmee je buren hun woning hebben geïsoleerd, hoeft dus niet automatisch de beste
        keuze voor jouw huis te zijn. Op onze pagina over{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuurisolatie</Link> lees je meer over de
        verschillende materialen, hun eigenschappen en hoe de uitvoering verloopt.
      </p>

      <ArtikelH2 id="subsidie">Kun je nog subsidie krijgen voor spouwmuurisolatie?</ArtikelH2>
      <p>
        Met subsidie kun je mogelijk een deel van je investering terugkrijgen. Voor woningeigenaren die UF-schuim willen
        laten aanbrengen, zijn de regels echter veranderd. Sinds 1 april 2026 komt UF-schuim bij nieuwe toepassingen
        niet meer in aanmerking voor de landelijke ISDE-subsidie vanwege de mogelijke gezondheidsrisico&apos;s. Ook de
        Vereniging van Erkende Na-Isolatiebedrijven in Nederland (VENIN) volgt het advies van de GGD om voorlopig te
        stoppen met het gebruik van UF-schuim.
      </p>
      <p>
        Heb je vóór 1 april 2026 al UF-schuim laten aanbrengen of vóór die datum aantoonbaar opdracht gegeven voor de
        werkzaamheden? Dan kun je onder bepaalde voorwaarden nog wel subsidie ontvangen. Voor de ISDE geldt een
        aanvraagtermijn van 24 maanden na uitvoering van de werkzaamheden. De precieze uitzonderingen en voorwaarden vind
        je bij de{" "}
        <ExterneLink href={RVO}>Rijksdienst voor Ondernemend Nederland (RVO)</ExterneLink>.
      </p>
      <p>
        Voor andere geschikte isolatiematerialen blijft subsidie mogelijk, mits je aan de geldende voorwaarden voldoet.
        Naast de landelijke subsidie kunnen er aanvullende regelingen beschikbaar zijn vanuit je gemeente of provincie.
        Met de <Link href="/subsidiecheck" className={TEKSTLINK}>gratis subsidiecheck van Gijs</Link> ontdek je welke
        mogelijkheden er zijn voor jouw adres.
      </p>

      <ArtikelH2 id="bestaande-isolatie">Moet je bestaande spouwmuurisolatie met UF-schuim vervangen?</ArtikelH2>
      <p>
        Heb je jouw woning enkele jaren geleden al laten isoleren en vraag je je nu af of het gebruikte isolatiemateriaal
        schadelijk is? Moet je dan opnieuw geld uitgeven om je spouwmuurisolatie te laten vervangen? Niet automatisch.
        UF-schuim veroorzaakt namelijk niet in iedere woning gezondheidsklachten. Het is daarom belangrijk om eerst te
        achterhalen welk isolatiemateriaal daadwerkelijk in jouw spouwmuur zit. Bekijk de oorspronkelijke offerte of
        factuur van het isolatiebedrijf. UF-schuim wordt ook onder verschillende merknamen aangeboden, waaronder
        Aminotherm, Thecotherm en Enverifoam. Kun je het materiaal niet achterhalen, neem dan contact op met het bedrijf
        dat destijds de isolatie heeft aangebracht.
      </p>
      <p>
        Volgens de GGD komt de meeste formaldehyde vrij in de eerste periode nadat het isolatiemateriaal is aangebracht.
        De hoeveelheid neemt doorgaans af en eventuele gezondheidsklachten verdwijnen meestal binnen een jaar, hoewel dit
        ook langer kan duren. Heb je UF-schuim in je woning, maar ervaar je geen gezondheidsklachten? Dan adviseert de
        GGD om goed te blijven ventileren en zijn aanvullende maatregelen niet automatisch nodig. Heb je wel klachten en
        vermoed je dat deze samenhangen met de aangebrachte isolatie? Neem dan contact op met je huisarts of regionale
        GGD. De GGD kan beoordelen of het zinvol is om de concentratie formaldehyde in je woning te laten meten en
        adviseren over mogelijke vervolgstappen.
      </p>
      <p>
        Laat dus niet zomaar bestaande spouwmuurisolatie verwijderen of vervangen. Het is belangrijk om eerst deskundig te
        laten beoordelen wat er aan de hand is en welke maatregelen daadwerkelijk nodig zijn. Zo voorkom je dat je opnieuw
        investeert zonder te weten of daarmee het probleem wordt opgelost.
      </p>

      <ArtikelH2 id="beste-investering">Is spouwmuurisolatie wel de beste investering voor jouw woning?</ArtikelH2>
      <p>
        Stel dat je vooral last hebt van een koud huis en een hoge energierekening. Je denkt dat spouwmuurisolatie de
        oplossing is en vraagt daarom een offerte aan. Maar wat als jouw spouwmuur al redelijk geïsoleerd is en je juist
        veel warmte verliest via het dak? Dan investeer je misschien in een maatregel die jouw oorspronkelijke probleem
        onvoldoende oplost. Een bedrijf dat uitsluitend spouwmuurisolatie aanbiedt, kijkt voornamelijk naar de
        mogelijkheden om je buitenmuren te isoleren. Terwijl{" "}
        <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dakisolatie</Link>,{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloerisolatie</Link> of beter{" "}
        <Link href="/maatregelen/isolatieglas" className={TEKSTLINK}>isolatieglas</Link> voor jouw woning misschien een
        verstandigere investering is.
      </p>
      <p>
        Met een spouwmuurinspectie kan worden onderzocht hoeveel ruimte er tussen je muren zit, of er al isolatiemateriaal
        aanwezig is en wat de staat van de spouw is. Toch vertelt zo&apos;n inspectie niet het volledige verhaal. Daarom
        kijkt Gijs niet alleen naar de maatregel die je in gedachten hebt, maar naar je hele woning. Tijdens een gratis
        energiescan onderzoekt een onafhankelijke adviseur waar de verbeterpunten liggen, welke maatregelen bij jouw huis
        passen en in welke volgorde je deze het beste kunt uitvoeren. Misschien blijkt spouwmuurisolatie inderdaad de
        juiste keuze, maar misschien levert een andere maatregel je meer wooncomfort en energiebesparing op.
      </p>
      <p>
        Blijkt spouwmuurisolatie de juiste keuze? Dan helpt Gijs je bij het kiezen van een passend isolatiemateriaal en
        verzorgt Gijs ook de uitvoering. Zo hoef je niet zelf verschillende specialisten te zoeken, weet je vooraf waarin
        je investeert en heb je één vertrouwd aanspreekpunt van advies tot uitvoering.
      </p>

      <ArtikelH2 id="juiste-isolatiekeuze">Gezond en comfortabel wonen begint met de juiste isolatiekeuze</ArtikelH2>
      <p>
        Je wilt een warmer huis, minder gas verbruiken en investeren in isolatie waar je jarenlang plezier van hebt. Daar
        hoort ook bij dat je weet welke materialen in jouw woning worden toegepast en waarom deze geschikt zijn. Tijdens
        een gratis en vrijblijvende energiescan kijkt Gijs naar je hele woning. Je krijgt inzicht in welke maatregelen bij
        jouw huis passen, waar je het beste kunt beginnen en welke subsidies mogelijk beschikbaar zijn.
      </p>
      <p>
        Wil je daarna aan de slag? Dan ontzorgt Gijs je van A tot Z. Zo hoef je niet zelf verschillende uitvoerders te
        zoeken en weet je dat de gekozen isolatiemaatregelen aansluiten bij jouw woning en woonwensen.
      </p>

      <ArtikelCta slug={slug} titel="Vraag jouw gratis energiescan aan." />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen over UF-schuim en spouwmuurisolatie</ArtikelH2>
      <FAQAccordion items={FAQ} className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
    </>
  );
}
