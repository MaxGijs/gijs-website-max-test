import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

const FAQ: FAQItem[] = [
  {
    question: "Kan ik mijn vloer isoleren als mijn kruipruimte vochtig is?",
    answer: "Ja, een vochtige kruipruimte hoeft geen probleem te zijn. Zolang de onderkant van je vloer voldoende droog is, de vloerconstructie in goede staat verkeert en er geen water in je kruipruimte staat, kan er vaak gewoon geïsoleerd worden.",
  },
  {
    question: "Kan vloerisolatie vocht- en schimmelproblemen veroorzaken?",
    answer: "Wanneer er onvoldoende rekening wordt gehouden met bestaande vochtproblemen, ventilatie en het isolatiemateriaal, kunnen vochtproblemen verergeren. Daarom is het belangrijk om je vloer en kruipruimte vooraf goed te laten beoordelen.",
  },
  {
    question: "Is bodemfolie altijd nodig bij vloerisolatie?",
    answer: "Nee, bodemfolie kan helpen om vochtverdamping vanuit de grond te beperken, maar is niet bij iedere kruipruimte nodig. Dit hangt af van de vochtomstandigheden onder je woning.",
  },
];

/** Eerste twee alinea's; staan op de pagina direct onder de titel, boven de foto. */
export function VochtigeKruipruimteInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Je opent je kruipluik en merkt dat het onder je woning behoorlijk vochtig is. Misschien zie je condens op de
        onderkant van je vloer, schimmel op de houten balken of hangt er een muffe lucht. Je wilt je vloer laten
        isoleren, maar is dat onder deze omstandigheden wel verstandig, wordt er wel geïsoleerd en loop je niet het
        risico dat de vochtproblemen juist erger worden?
      </p>
      <p className={className}>
        Bovenstaande problemen hoeven niet meteen een belemmering te zijn voor vloerisolatie. Zolang de onderkant van
        je vloer voldoende droog is en de vloerconstructie in goede staat verkeert, kan er vaak &apos;gewoon&apos;
        geïsoleerd worden. Wel zijn er een aantal zaken waar je vooraf rekening mee moet houden. Aan de hand van zes
        stappen leggen we uit hoe je vocht- en schimmelproblemen voorkomt en waar je op moet letten voordat je jouw
        vloer laat isoleren.
      </p>
    </>
  );
}

export function VochtigeKruipruimteIsoleren({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="waarom-vochtig">Waarom is die kruipruimte vochtig?</ArtikelH2>
      <p>
        Dat de kruipruimte vochtig is, is eigenlijk niet vreemd. Volgens Milieu Centraal ligt de relatieve
        luchtvochtigheid in een kruipruimte vaak tussen de 85 en 100 procent. Vocht uit de bodem kan namelijk
        verdampen en zich verspreiden door de ruimte onder je woning. Wanneer deze vochtige lucht in aanraking komt
        met een koud oppervlak, kan er condens ontstaan. Je herkent dit van het douchen, wanneer je spiegel beslaat,
        of van de waterdruppels op je ramen tijdens de wintermaanden. Onder je woning kan hetzelfde gebeuren.
      </p>
      <p>
        Wanneer materialen langdurig vochtig blijven, ontstaat er een omgeving waarin schimmels graag willen groeien.
        Via kieren rondom leidingen, het kruipluik of andere openingen in de vloer kan vochtige lucht ook vanuit de
        kruipruimte in je woning terechtkomen. Volgens GGD Leefomgeving kan dit bijdragen aan vocht- en
        schimmelproblemen in huis. Het is daarom belangrijk om vooraf te controleren waar het vocht vandaan komt.
      </p>

      <ArtikelH2 id="stap-1-vloer-droog">Stap 1: Controleer of de onderkant van je vloer droog is</ArtikelH2>
      <p>
        We zijn weer bij het geopende kruipluik. Je had gezien dat het vochtig is. Dit betekent niet meteen dat je
        vloer ook vochtig is. Kijk daarom niet alleen naar beneden, maar ook naar boven (onderkant vloer). Op
        onderstaande foto zie je bijvoorbeeld een kruipruimte waarin vocht aanwezig is. Dit is onder andere zichtbaar
        aan de donkere plekken op de muren. De onderkant van de betonnen vloer is echter droog, waardoor
        vloerisolatie in principe mogelijk is. Zie je waterdruppels aan de onderkant van je vloer hangen of staat er
        water in je kruipruimte? Dan moet dit eerst worden aangepakt voordat er geïsoleerd kan worden.
      </p>
      <ArtikelFoto
        src="/images/kennis/kruipruimte/kruipruimte-vochtige-muren.webp"
        alt="Kruipruimte onder een woning met betonnen plafond en steenachtige vloer; op de muren zijn donkere vochtplekken zichtbaar"
        onderschrift="In deze kruipruimte is vocht aanwezig, zichtbaar aan de donkere plekken. De onderkant van de betonnen vloer is echter droog."
      />
      <p>
        Bij een houten vloer kan met een houtvochtmeter worden gemeten hoeveel vocht er daadwerkelijk in het hout
        zit. Volgens Milieu Centraal moet je bij een houtvochtigheid boven de 20 procent eerst het hout laten drogen
        voordat je gaat isoleren. Wanneer je namelijk een te vochtige houten vloer isoleert, loop je het risico dat
        het vocht wordt opgesloten en er houtrot ontstaat.
      </p>

      <ArtikelH2 id="stap-2-schimmel-houtrot">Stap 2: Controleer je vloer op schimmel, houtrot en betonrot</ArtikelH2>
      <p>
        Zie je donkere of witte plekken op de houten balken van je vloer? Dan kan er sprake zijn van schimmel. Dit
        betekent echter niet meteen dat er ook sprake is van houtrot. Bij houtrot wordt het hout zelf aangetast,
        waardoor de vloerconstructie uiteindelijk minder sterk kan worden. Ook een betonnen vloer kan worden
        aangetast. Misschien zie je stukken beton loslaten of zie je op bepaalde plekken roestend staal zitten. Dit
        kunnen tekenen zijn van betonrot. Bij zowel houtrot als betonrot wordt er niet geïsoleerd. De vloer heeft
        eerst aandacht nodig voordat deze geïsoleerd kan worden. Door isolatiemateriaal aan te brengen los je deze
        problemen namelijk niet op. Het is daarom belangrijk om de staat van je vloer vooraf goed te laten
        beoordelen.
      </p>

      <ArtikelH2 id="stap-3-ventilatieopeningen">Stap 3: Controleer de ventilatieopeningen van je kruipruimte</ArtikelH2>
      <p>
        Loop eens een rondje om je woning en kijk naar de onderkant van je buitenmuren. Hier zitten vaak kleine
        roosters of kunststof buisjes met gleufjes erin. Dit zijn de ventilatieopeningen van je kruipruimte. Doordat
        deze zich vlak boven de grond bevinden, kan er zand, vuil of ander materiaal in de gleufjes terechtkomen,
        waardoor de lucht minder goed door je kruipruimte kan stromen. Heb je bijvoorbeeld onlangs je tuin laten
        bestraten of planten tegen je buitenmuur geplaatst? Of zijn er een aantal stortbuien geweest? Dan kan het
        zijn dat er een aantal ventilatieopeningen zijn afgesloten. Controleer daarom of de gleufjes nog vrij zijn en
        maak deze indien nodig schoon. Ook bij het aanbrengen van vloerisolatie moeten deze openingen vrij blijven.
      </p>

      <ArtikelH2 id="stap-4-bodemfolie">Stap 4: Beperk het vocht dat uit de bodem komt</ArtikelH2>
      <p>
        Wanneer er veel vocht uit de bodem van je kruipruimte verdampt, kan het interessant zijn om bodemfolie of
        bodemisolatie aan te laten brengen. Bodemfolie dient als vochtscherm, waardoor er minder vocht vanuit de
        grond kan verdampen, maar heeft geen warmte-isolerende functie. Bij bodemisolatie wordt de bodem juist
        afgedekt met isolatiemateriaal, zoals EPS-parels of isolatiechips, waarmee je zowel warmteverlies als
        vochtverdamping beperkt. In tegenstelling tot vloerisolatie kan bodemisolatie meestal wel worden aangebracht
        wanneer er water in je kruipruimte staat, zolang er voor de monteurs voldoende ruimte overblijft om veilig te
        werken. Hiervoor zijn vochtbestendige isolatiematerialen beschikbaar die nauwelijks vocht opnemen en op het
        water blijven drijven. Hierdoor hoeft een stijgende grondwaterstand geen probleem te zijn voor de isolerende
        werking van het materiaal.
      </p>
      <ArtikelFoto
        src="/images/kennis/kruipruimte/kruipruimte-bodemfolie.webp"
        alt="Kruipruimte met zwarte bodemfolie op de grond ter bescherming tegen vochtverdamping vanuit de bodem"
        onderschrift="Bodemfolie dient als vochtscherm en voorkomt dat vocht uit de bodem in de kruipruimte verdampt."
      />
      <p>
        Met bodemfolie of bodemisolatie los je echter geen vochtproblemen op die ontstaan door lekkages,
        binnendringend regenwater of onvoldoende ventilatie. Daarnaast betekent een vochtige kruipruimte niet meteen
        dat bodemfolie of bodemisolatie nodig is. Zolang de onderkant van je vloer droog is, de vloerconstructie in
        goede staat verkeert en er geen water in de kruipruimte staat, kan er vaak &apos;gewoon&apos; vloerisolatie
        worden aangebracht. Volgens Milieu Centraal bespaar je hiermee over het algemeen ook meer energie dan met
        bodemisolatie.
      </p>

      <ArtikelH2 id="stap-5-isolatiemateriaal">Stap 5: Kies het juiste isolatiemateriaal voor je vloer</ArtikelH2>
      <p>
        Naast de staat van je vloer is ook het isolatiemateriaal dat tegen je vloer wordt aangebracht belangrijk.
        Niet ieder isolatiemateriaal heeft namelijk dezelfde eigenschappen. Zo heb je bij isolatieschuim onder andere
        de keuze tussen schuim met een open en een gesloten celstructuur. Bij isolatieschuim met een gesloten
        celstructuur kan vocht minder gemakkelijk door het materiaal heen dringen. Dit kan juist bij een vochtige
        kruipruimte met een betonnen vloer interessant zijn. Heb je een houten vloer, dan moet er echter ook rekening
        worden gehouden met de manier waarop het hout zijn vocht kwijt kan. Je wilt namelijk niet dat er vocht tussen
        het isolatiemateriaal en de vloer opgesloten raakt. Het is daarom belangrijk om niet alleen te kijken naar
        welk materiaal het beste isoleert, maar juist ook naar welk materiaal het beste bij jouw vloer en
        kruipruimte past. Op onze pagina over{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloerisolatie</Link> lees je meer over de
        verschillende isolatiematerialen.
      </p>

      <ArtikelH2 id="stap-6-ventileren">Stap 6: Blijf je woning ventileren na het isoleren</ArtikelH2>
      <p>
        Wanneer je vloer geïsoleerd is, betekent dit niet dat er geen vocht of schimmel meer in je woning kan
        ontstaan. Tijdens het douchen, koken en drogen van je was komt er namelijk nog steeds vocht vrij. Wanneer
        dit vocht niet voldoende wordt afgevoerd, kan er op andere koude oppervlakken in je woning condens ontstaan.
        Denk hierbij bijvoorbeeld aan de buitenmuren in je slaapkamer of de ramen in je woonkamer. Het is daarom
        belangrijk om ook na het isoleren je woning voldoende te blijven ventileren. Zet je ventilatieroosters niet
        dicht omdat het buiten kouder wordt en zorg ervoor dat vochtige lucht tijdens het koken en douchen wordt
        afgevoerd. De ventilatie van je woning staat namelijk los van de ventilatie van je kruipruimte.
      </p>
      <p>
        Ontdek je na het isoleren toch schimmelplekken in je woning? Dan betekent dit niet meteen dat de
        vloerisolatie de oorzaak is. Misschien zijn je buitenmuren nog niet geïsoleerd, is er sprake van een lekkage
        of wordt er onvoldoende geventileerd. Je kunt de schimmel wel verwijderen, maar zolang de oorzaak van het
        vochtprobleem niet wordt aangepakt, kan de schimmel terugkomen.
      </p>

      <ArtikelH2 id="gijs-helpt">Gijs helpt je graag</ArtikelH2>
      <p>
        Nu je weet waar je op moet letten bij het isoleren van je vloer, blijft er nog één belangrijke vraag over.
        Is vloerisolatie ook daadwerkelijk de beste investering voor jouw woning? Misschien is je vloer prima
        geschikt voor isolatie, maar verlies je juist veel warmte via je buitenmuren of dak. Wanneer je een
        vloerisolatiebedrijf laat langskomen, wordt er voornamelijk gekeken naar de mogelijkheden om je vloer te
        isoleren. Maar wat als de oplossing ergens anders in je woning ligt?
      </p>
      <p>
        Wij kijken daarom graag met je mee. Tijdens een gratis en vrijblijvende energiescan bekijken we je hele
        woning en adviseren we je onafhankelijk over de mogelijkheden. Hierdoor weet je welke maatregelen voor jouw
        woning het meeste opleveren, in welke volgorde je deze het beste kunt uitvoeren en voor welke maatregelen je
        subsidie kunt krijgen. Blijkt vloerisolatie inderdaad de juiste oplossing te zijn? Dan verzorgen we ook graag
        de uitvoering. Zo heb je van advies tot uitvoering één aanspreekpunt.
      </p>
      <p>
        Je wilt namelijk niet zomaar je woning isoleren, maar je woning op de juiste manier isoleren. Daar helpen
        wij je graag bij!
      </p>

      <ArtikelCta slug={slug} titel="Vraag een gratis energiescan aan." regel="Gratis en vrijblijvend advies bij jou thuis." />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen</ArtikelH2>
      <FAQAccordion items={FAQ} className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
    </>
  );
}
