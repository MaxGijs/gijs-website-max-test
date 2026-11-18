import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, Bron, ExterneLink } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

// Tekst uit "Veel zonnestroom terugleveren? Voorkom een dure vergissing in 2027 v1" (PDF van Max),
// met de titel uit v1.1 en drie aanpassingen uit v1.1: de link naar de thuisbatterijpagina staat
// bij "Wanneer is een thuisbatterij wél een slimme keuze?", de uitleg over zomer en winter bij de
// warmtepomp, en de slotzin over het voorkomen van een verkeerde investering.
// Bronnen gecontroleerd op 18 november 2026 (NOS, Rijksoverheid, ACM, Milieu Centraal, Belastingdienst);
// NOS-zin, 30/60 procent, btw en subsidie zijn daarna op de bronnen aangepast.
const NOS = "https://nos.nl/l/2639959";
const RIJKSOVERHEID = "https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/energie-thuis/salderingsregeling";
const ACM = "https://www.acm.nl/nl/publicaties/energiemonitor-acm-einde-salderingsregeling-goed-moment-om-energiecontract-te-controleren";
const MC_THUISBATTERIJ = "https://www.milieucentraal.nl/energie-besparen/zonnepanelen/thuisbatterij-zonne-energie-opslaan/";
const BELASTINGDIENST = "https://belastingdienst.nl/wps/wcm/connect/nl/btw/content/thuisbatterij-btw";
const MC_ZELF_VERBRUIKEN = "https://www.milieucentraal.nl/energie-besparen/zonnepanelen/verbruik-zelf-meer-zonnestroom/";

/** Eerste twee alinea's; staan op de pagina direct onder de titel, boven de foto. */
export function SalderenInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Je <Link href="/maatregelen/zonnepanelen" className={TEKSTLINK}>zonnepanelen</Link> wekken volop stroom op, maar een groot deel lever je terug. Zodra de zon ondergaat, koop je weer
        elektriciteit in. En ondertussen blijft je gasrekening hoog.{" "}
        <strong>Waarom betaal je nog zoveel voor energie terwijl je zelf stroom opwekt?</strong>
      </p>
      <p className={className}>
        Vanaf 1 januari 2027 stopt ook nog eens de salderingsregeling. Geen wonder dat steeds meer mensen een
        thuisbatterij overwegen, zoals de NOS op 18 november berichtte. Maar voordat je duizenden euro&apos;s investeert,
        is er een belangrijkere vraag:{" "}
        <strong>
          kun je met diezelfde investering niet veel meer besparen door je zonnestroom slimmer te gebruiken, zonder
          onnodig geld uit te geven aan een verkeerde oplossing?
        </strong>
      </p>
    </>
  );
}

const FAQ: FAQItem[] = [
  {
    question: "Moet ik vóór 1 januari 2027 een thuisbatterij kopen?",
    answer: "Nee. Het stoppen van salderen betekent niet dat je verplicht bent om vóór 2027 een thuisbatterij aan te schaffen. Je kunt ook na die datum zonnestroom blijven terugleveren. Laat je daarom niet opjagen door de veranderende regels, maar kijk eerst welke mogelijkheden jouw woning biedt.",
  },
  {
    question: "Hoe weet ik hoeveel zonnestroom ik teruglever?",
    answer: "Je vindt je totale teruglevering op de jaarafrekening van je energieleverancier. Met een energie-app, slimme meter of P1-meter kun je vaak ook zien wanneer je veel stroom teruglevert. Die informatie helpt om te bepalen hoeveel elektriciteit je mogelijk zelf kunt gebruiken of opslaan.",
  },
  {
    question: "Kan ik subsidie krijgen voor een thuisbatterij?",
    answer: "Op 18 november 2026 bestaat er geen landelijke subsidie voor de aanschaf van een thuisbatterij. Onder specifieke voorwaarden kun je wel de btw terugvragen, bijvoorbeeld wanneer je met een geschikte batterij handelt in elektriciteit. Voor andere verduurzamingsmaatregelen zijn er subsidiemogelijkheden. Via de subsidiecheck van Gijs kun je bekijken welke regelingen voor jouw woning gelden.",
    antwoord: (
      <p>
        Op 18 november 2026 bestaat er geen landelijke subsidie voor de aanschaf van een thuisbatterij. Onder
        specifieke voorwaarden kun je wel de btw terugvragen, bijvoorbeeld wanneer je met een geschikte batterij handelt
        in elektriciteit (zie de pagina{" "}
        <ExterneLink href={BELASTINGDIENST}>Thuisbatterij en btw van de Belastingdienst</ExterneLink>). Voor andere verduurzamingsmaatregelen zijn er subsidiemogelijkheden. Via de{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck van Gijs</Link> kun je bekijken welke regelingen
        voor jouw woning gelden.
      </p>
    ),
  },
];

export function SalderenThuisbatterij2027({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="waarom-thuisbatterij">Waarom wil ineens iedereen een thuisbatterij?</ArtikelH2>
      <p>
        Misschien ben je zelf al aan het vergelijken. Je ziet advertenties voor thuisbatterijen, leest over slimme
        systemen en hoort dat je straks minder voor je teruggeleverde zonnestroom krijgt. Dan wil je natuurlijk
        voorkomen dat je geld misloopt. Je bent niet de enige. Volgens het{" "}
        <ExterneLink href={NOS}>NOS-bericht van 18 november 2026</ExterneLink> hebben inmiddels bijna 430.000
        Nederlandse huishoudens een thuisbatterij, aldus onderzoeksbureau Dutch New Energy. Dat aantal is dit jaar meer
        dan verdubbeld. De naderende afschaffing van de salderingsregeling is volgens het bericht de belangrijkste
        oorzaak van die groei. De ACM telt overigens minder: eind oktober waren er ongeveer 89.000 thuisbatterijen
        geregistreerd bij netbeheerders, al ligt het werkelijke aantal volgens de ACM waarschijnlijk hoger.
      </p>
      <p>
        Toch waarschuwt de Consumentenbond in het NOS-artikel om het hoofd koel te houden. Hoewel een thuisbatterij
        aantrekkelijk klinkt, zijn de beloofde besparingen namelijk niet altijd realistisch. Een batterij kan je helpen
        om minder stroom in te kopen, maar dat betekent niet automatisch dat je de aanschafkosten ook terugverdient.
        Voordat je zo&apos;n investering doet, wil je daarom weten wat er precies verandert en hoeveel voordeel een
        batterij jou daadwerkelijk kan opleveren.
      </p>

      <ArtikelH2 id="energierekening-2027">Wat verandert er voor jouw energierekening vanaf 2027?</ArtikelH2>
      <p>
        Tot en met 31 december 2026 kun je de elektriciteit die je zonnepanelen terugleveren nog verrekenen met de
        stroom die je op andere momenten afneemt. Dat heet salderen. Vanaf 1 januari 2027 stopt deze regeling definitief.
        Je kunt nog steeds zonnestroom terugleveren, maar ontvangt daarvoor een vergoeding van je energieleverancier. Tot
        2030 moet die vergoeding minimaal 50 procent van het kale leveringstarief bedragen, oftewel de
        elektriciteitsprijs zonder belastingen. Daarnaast kunnen energieleveranciers terugleverkosten blijven rekenen.
        Hoeveel je uiteindelijk voor je stroom krijgt, hangt daardoor af van je energiecontract.
      </p>
      <p>
        Dat merk je vooral wanneer je op zonnige dagen veel elektriciteit overhoudt. De stroom die je teruglevert,
        levert je mogelijk minder op dan wat je betaalt als je &apos;s avonds weer elektriciteit nodig hebt. Gebruik je
        die zonnestroom direct zelf, dan hoef je die elektriciteit niet in te kopen. Daarom adviseert de Autoriteit
        Consument &amp; Markt (ACM) huishoudens met zonnepanelen om hun energiecontract goed te bekijken. Daarnaast kun je
        onderzoeken hoe je minder stroom hoeft terug te leveren.{" "}
        <strong>Want waarom zou je stroom tegen een lage vergoeding terugleveren als je die op een ander moment zelf nodig hebt?</strong>
      </p>
      <Bron>
        Bronnen: <ExterneLink href={RIJKSOVERHEID}>Rijksoverheid – Salderingsregeling stopt in 2027</ExterneLink> en{" "}
        <ExterneLink href={ACM}>ACM – Controleer je energiecontract</ExterneLink>.
      </Bron>

      <ArtikelH2 id="opbrengst-thuisbatterij">Wat levert zo&apos;n thuisbatterij je eigenlijk op?</ArtikelH2>
      <p>
        Het idee is aantrekkelijk: je zonnepanelen vullen overdag de batterij, waarna je &apos;s avonds de opgeslagen
        stroom gebruikt. Daardoor hoef je minder elektriciteit bij je energieleverancier te kopen. Volgens Milieu Centraal
        gebruiken huishoudens met zonnepanelen gemiddeld ongeveer 30 procent van hun opgewekte stroom direct zelf. Met een
        thuisbatterij kan het totale eigen gebruik in een gemiddelde situatie stijgen naar ongeveer 60 procent. Je benut
        dus een groter deel van de elektriciteit die je zelf opwekt. Zeker wanneer je overdag veel stroom teruglevert en
        &apos;s avonds juist veel elektriciteit nodig hebt, klinkt dat als een interessante oplossing.
      </p>
      <p>
        Daar staat echter een flinke aanschafprijs tegenover. Een thuisbatterij kost al snel duizenden euro&apos;s en
        volgens Milieu Centraal verdient een batterij zich met alleen het extra gebruik van eigen zonnestroom momenteel
        meestal niet terug. Bovendien wek je in de zomer vaak meer elektriciteit op dan je kunt opslaan, terwijl je in de
        winter juist minder zonnestroom beschikbaar hebt. Slimme thuisbatterijen kunnen onder bepaalde voorwaarden ook
        inspelen op wisselende stroomprijzen, maar wat dat oplevert is moeilijk te voorspellen.{" "}
        <strong>
          Meer van je eigen zonnestroom gebruiken is dus aantrekkelijk, maar uiteindelijk wil je weten of de besparing
          opweegt tegen wat je voor de batterij betaalt.
        </strong>
      </p>
      <Bron>
        Bronnen: <ExterneLink href={MC_THUISBATTERIJ}>Milieu Centraal – Thuisbatterij: zonne-energie opslaan</ExterneLink> en{" "}
        <ExterneLink href={MC_ZELF_VERBRUIKEN}>Milieu Centraal – Meer zonnestroom zelf verbruiken</ExterneLink>.
      </Bron>

      <ArtikelH2 id="direct-gebruiken">Waarom zou je stroom opslaan als je die ook direct kunt gebruiken?</ArtikelH2>
      <p>
        Misschien hoef je helemaal niet direct een batterij aan te schaffen om meer uit je zonnepanelen te halen. Kijk
        bijvoorbeeld eens naar wat er overdag gebeurt wanneer de zon schijnt. Je levert elektriciteit terug, terwijl je
        wasmachine, vaatwasser of elektrische auto misschien pas &apos;s avonds stroom gebruikt. Door apparaten overdag te
        laten draaien of je auto op zonnige momenten op te laden, kun je direct meer van je eigen elektriciteit benutten.
        Met geschikte timers, slimme apparaten en laadpalen kan dat zelfs automatisch. Zo lever je minder stroom terug,
        zonder eerst duizenden euro&apos;s in opslag te investeren.
      </p>
      <p>
        Maar er is nog iets om naar te kijken: je gasrekening. Misschien heb je zonnepanelen op je dak, maar verwarm je je
        woning nog volledig met een cv-ketel. Dan kan een{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> interessant zijn. Die gebruikt
        elektriciteit om warmte uit de buitenlucht te halen en kan daarmee een groot deel van je gasverbruik vervangen.
        Met een geschikt systeem kun je bijvoorbeeld op zonnige momenten warm water maken voor later gebruik. Daarbij moet
        je wel rekening houden met het verschil tussen zomer en winter, want je zonnepanelen leveren de meeste stroom op
        wanneer je relatief weinig verwarming nodig hebt. Toch kan een warmtepomp over het hele jaar helpen om je
        gasrekening te verlagen.{" "}
        <strong>
          Misschien bespaar je met dezelfde investering dus wel meer door minder gas te gebruiken dan door extra
          zonnestroom op te slaan.
        </strong>{" "}
        Welke mogelijkheid het meeste oplevert, hangt af van je woning en je energieverbruik.
      </p>
      <Bron>
        Bron: <ExterneLink href={MC_ZELF_VERBRUIKEN}>Milieu Centraal – Meer zonnestroom zelf verbruiken</ExterneLink>.
      </Bron>

      <ArtikelH2 id="wanneer-wel-slim">Wanneer is een thuisbatterij wél een slimme keuze?</ArtikelH2>
      <p>
        Stel dat je woning al goed geïsoleerd is, je weinig gas verbruikt en je elektrische apparaten zoveel mogelijk
        overdag gebruikt. Toch zie je in je energie-app dat je nog regelmatig veel zonnestroom teruglevert. Dan kan een
        thuisbatterij interessant zijn, omdat je die elektriciteit op een later moment zelf kunt gebruiken. Daarbij is het
        belangrijk dat de opslagcapaciteit aansluit op je verbruik. Je hebt namelijk weinig aan een grote batterij die je
        maar gedeeltelijk vult. Andersom wil je voorkomen dat een te kleine batterij onvoldoende opslagruimte biedt. Niet
        alleen de hoeveelheid stroom die je jaarlijks teruglevert is daarom belangrijk, maar vooral wanneer je die stroom
        overhoudt en wanneer je elektriciteit nodig hebt.
      </p>
      <p>
        Daarnaast spelen de mogelijkheden van de batterij zelf een rol. Wil je vooral eigen zonnestroom bewaren of zoek je
        een systeem dat met slimme software rekening kan houden met wisselende energieprijzen? En verwacht je dat je
        stroomverbruik verandert, bijvoorbeeld doordat je later elektrisch gaat rijden of een warmtepomp aanschaft? Gijs
        levert en installeert modulaire thuisbatterijen waarvan de opslagcapaciteit kan worden afgestemd op je situatie en
        waar nodig later kan worden uitgebreid. Op onze{" "}
        <Link href="/maatregelen/thuisbatterij" className={TEKSTLINK}>pagina over thuisbatterijen</Link> lees je meer
        over de mogelijkheden. Voordat je een systeem kiest, is het echter verstandig om je bestaande zonnepanelen,
        verbruik en energiecontract goed te bekijken. Zo weet je beter waarvoor je betaalt en voorkom je dat je
        investeert in opslagcapaciteit of slimme functies die je nauwelijks gebruikt.
      </p>

      <ArtikelH2 id="voorkom-verkeerde-oplossing">Voorkom dat je duizenden euro&apos;s in de verkeerde oplossing steekt</ArtikelH2>
      <p>
        Je hebt zonnepanelen en wilt daar zoveel mogelijk voordeel uit halen. Maar nu salderen stopt, vraag je je misschien
        af wat je het beste kunt doen. Is een thuisbatterij verstandig? Kun je beter je stroomverbruik aanpassen? Of levert
        het verlagen van je gasverbruik uiteindelijk meer op?{" "}
        <strong>Het gaat er niet om welke maatregel het populairst is, maar welke investering voor jouw woning het meeste voordeel oplevert.</strong>
      </p>
      <p>
        Gijs helpt je om daarachter te komen. Tijdens een gratis en vrijblijvende energiescan aan huis kijken we naar je
        zonnepanelen, energieverbruik en de mogelijkheden om je woning verder te verduurzamen. We onderzoeken welke
        maatregelen interessant zijn en in welke volgorde je deze het beste kunt uitvoeren. Blijkt een thuisbatterij de
        juiste oplossing, dan helpen we je bij het kiezen van een passend systeem en verzorgen we ook de levering en
        installatie. Is een andere maatregel interessanter, dan kijken we daar net zo goed naar. Zo voorkom je dat je
        duizenden euro&apos;s uitgeeft aan de verkeerde oplossing en heb je één vertrouwd aanspreekpunt dat je van A tot Z
        ontzorgt.
      </p>

      <ArtikelCta slug={slug} titel="Ontdek wat jouw woning kan besparen." />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen over thuisbatterijen en salderen</ArtikelH2>
      <FAQAccordion items={FAQ} className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
    </>
  );
}
