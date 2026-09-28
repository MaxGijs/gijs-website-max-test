import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { ZONNEPANEEL_PRODUCTEN, ZONNEPANEEL_MERKEN } from "@/lib/content/zonnepanelen-producten";
import { CONTACT } from "@/lib/content/contact";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { MeasureHero } from "@/components/measures/MeasureHero";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { UitvoeringStappen } from "@/components/measures/UitvoeringStappen";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";
import { TechnicalDetails } from "@/components/measures/TechnicalDetails";
import type { MEASURE_PAGES } from "@/lib/content/measure-pages";

type MeasurePageItem = (typeof MEASURE_PAGES)[number];

// Zonnepanelenpagina, gebouwd in dezelfde stijl als de andere
// maatregelpagina's (MeasureHero/MeasureSectionNav/Card/Button/Icon/
// MaterialCard/UitvoeringStappen/FAQAccordion).
//
// BRONNEN (zie het eindverslag voor de volledige, per-claim bronverwijzing):
// - "alle_brochures_in_1.pdf" (pagina 1 en 4 van 49): het enige
//   zonnepanelen-specifieke deel van deze algemene Gijs-brochure. Bevat
//   het 6-stappen installatieproces ("Zonnepanelen plaatsen in één dag"),
//   de voorbereidings-/uitvoeringsvoorwaarden en de nazorgpunten
//   ("Voordat we zonnepanelen komen plaatsen"). Woordelijk overgenomen in
//   PROCESS_STEPS, VOORWAARDEN en NA_INSTALLATIE hieronder. De rest van
//   dit 49 pagina's tellende document gaat over andere maatregelen
//   (thuisbatterij, etc.) en bevat geen aanvullende zonnepanelen-content.
// - "JASolar460.pdf" (JAM54D41 LR, 440-465 Wp), "Aiko440wp.pdf"
//   (AIKO-A-MAH54Db, 440-455 Wp — dit datasheet draagt zelf het
//   Gijs-logo), en twee Jinko-datasheets (Tiger Neo 54HL4-B 425 Wp en
//   Tiger Neo 54HL4R-B 420-440 Wp, beide eveneens Gijs-co-branded): alle
//   productgegevens, zie lib/content/zonnepanelen-producten.ts.
//
// TEGENSTRIJDIGHEDEN TUSSEN BRONNEN (bewust niet zelf opgelost, zie
// eindverslag):
// - Aikocertificaat.pdf (TÜV-certificaat) dekt andere modelvarianten
//   (MAH72Dw/MAH60Dw) dan het daadwerkelijke datasheet-product
//   (MAH54Db). Dit certificaat wordt daarom niet als bron voor
//   productclaims gebruikt.
// - Jinko's twee productlijnen heten beide "Tiger Neo N-type" maar
//   hebben afwijkende afmetingen (1722 vs. 1762 mm) en mechanische
//   belasting (2400/5400 Pa vs. 4000/6000 Pa) — daarom als twee aparte
//   producten getoond, niet samengevoegd.
// - Aiko's degradatiepercentage (0,35%/jaar) wijkt af van JA Solar en
//   Jinko (0,4%/jaar) — niet gelijkgetrokken, per product apart getoond.
// - JA Solar en Aiko vermelden een maximale systeemspanning van 1500 V
//   DC, Jinko vermeldt 1000 V DC (IEC) — een echt, merkafhankelijk
//   verschil, geen fout.
//
// NIET GEBRUIKT: Aikocertificaat.pdf (zie hierboven). Celrendement-cijfers
// op celniveau (bijv. JA Solar's "tot 26%") zijn bewust niet naast het
// modulerendement getoond, om beide begrippen niet te vermengen.
//
// AFBEELDINGEN: geen van de bronnen bevat een echte Gijs-installatiefoto
// van zonnepanelen (de brochure toont alleen een geïllustreerde
// stappen-graphic, geen fotografie). Daarom zijn de productfoto's uit de
// datasheets zelf gebruikt: een uitgesneden JA Solar-productfoto (hero,
// bijgesneden tot een liggend formaat), de eigen productfoto van Aiko, en
// voor Jinko een bijgesneden fragment van het datasheet (merknaam +
// paneelfoto + kenmerken — niet de volledige pagina, en niet meer de
// eerdere volledige-paginascreenshot). Geen stockbeelden, geen AI-beelden.
// Een echte woningfoto met zonnepanelen (hero) is door de opdrachtgever
// aangekondigd maar op het moment van deze wijziging nog niet aangeleverd
// in het project — zodra deze aanwezig is in public/productbladen,
// vervangt hij het huidige tijdelijke herobeeld. De aangekondigde
// systeem-uitlegvisual IS inmiddels aangeleverd
// (zonnepanelen-uitlegvisual.png, Gijs-huisstijl) en is verwerkt in de
// "Wat zijn zonnepanelen?"-sectie, samen met een tekstuele stappenlijst
// (UITLEG_STAPPEN) die de labels op die afbeelding overneemt.
//
// PRODUCTKAARTEN EN VERGELIJKING: de hoofdkaarten en de vergelijkingstabel
// tonen per merk een samengevatte set van 5 kerngegevens (vermogen,
// modulerendement, afmetingen, gewicht, garantie) — zie
// ZONNEPANEEL_MERKEN in lib/content/zonnepanelen-producten.ts. Jinko's
// twee technisch verschillende productlijnen (54HL4-B en 54HL4R-B) zijn
// daar samengevat tot één "Jinko"-kaart met een vermogen- en
// rendementsbereik dat de unie van beide lijnen dekt; de afmetingen van
// beide lijnen worden allebei genoemd (niet gemiddeld of verzonnen). De
// volledige, niet-samengevoegde gegevens per productlijn (inclusief de
// twee aparte Jinko-varianten) staan in het inklapbare technische blok,
// gebaseerd op ZONNEPANEEL_PRODUCTEN.
//
// VERFIJNINGSRONDE 1 (visuele/structurele opschoning, geen nieuwe content):
// "De voordelen" is verplaatst naar vóór "Welke zonnepanelen gebruikt
// Gijs?" (was eerst helemaal onderaan). "Past dit bij mijn woning?" toont
// nu alleen de onderwerpen die letterlijk in de brochure staan (dak/
// constructie, bekabeling, elektrische aansluiting/omvormer, meterkast) —
// parkeergelegenheid en reserve-dakpannen zijn praktische
// uitvoeringspunten en staan daarom alleen nog bij "Voorbereiding en
// voorwaarden", niet bij geschiktheid. Die voorwaardensectie is
// opgesplitst in expliciet gelabelde "Voor de installatie"/"Tijdens de
// installatie"-blokken. "Na de installatie" is van een lopende lijst naar
// drie compacte kaarten gegaan. De productsectie toont nu één rij van
// drie kaarten (JA Solar/Aiko/Jinko) met elk maximaal 5 kerngegevens in
// plaats van een marketing-kenmerkenlijst; die kenmerken staan niet meer
// op de kaart maar blijven inhoudelijk ongewijzigd beschikbaar via de
// broncommentaren hierboven.
//
// VERFIJNINGSRONDE 2 (nog rustiger, meer hiërarchie):
// "Wat zijn zonnepanelen?" is een 2-koloms sectie geworden: links tekst +
// de 4 onderdelen, rechts de Canva-uitlegvisual (zonnepanelen-
// uitlegvisual.png) groot weergegeven (~40-45% van de sectiebreedte). De
// eerder losstaande tekstuele 6-stappenlijst naast dat beeld is
// weggehaald — de afbeelding bevat die 6 genummerde stappen al zelf, een
// tweede tekstuele lijst maakte de pagina juist langer/drukker in plaats
// van rustiger. De alt-tekst van de afbeelding beschrijft de inhoud nog
// wel volledig voor schermlezers.
// De Jinko-productafbeelding is vervangen door een schoon uitgesneden
// paneelbeeld (geen tekst/logo's meer): met een pixel-exacte crop
// (via een kleine Node/pngjs-script, sips's `--cropOffset` bleek
// onbetrouwbaar voor dit specifieke beeld) rechtstreeks uit hetzelfde
// Jinko-datasheet geïsoleerd.
// Elke productkaart heeft nu een rustige tekstlink "Bekijk technische
// gegevens" die naar het bestaande inklapbare detailsblok springt
// (id="technische-gegevens") in plaats van een grote knop.
// De vergelijkingstabel toont de merknaam nu in twee regels (merk vet,
// model klein eronder) en een compactere garantiekolom ("25 jr / 30 jr")
// in plaats van de volledige zin in elke cel.
// "Producten" en "Vergelijken" delen nu één zacht getinte
// achtergrondkader (surface-muted) om ze visueel als één geheel te tonen
// in plaats van twee losse blokken.
// Voorwaarden- en nazorgteksten zijn ingekort tot kortere bullets/regels
// zonder de inhoud te wijzigen (dezelfde bron, compactere formulering).
//
// VERFIJNINGSRONDE 3: de Canva-uitlegvisual oogde te klein — de
// oorspronkelijk aangeleverde afbeelding (1920×1080) had rondom het
// eigenlijke schema meer dan de helft witruimte (het schema zelf besloeg
// maar ~46% van de breedte or ~57% van de hoogte). Het beeld is daarom
// strak bijgesneden tot de inhoud zelf (969×691, pixel-exact via
// hetzelfde Node/pngjs-scriptje als bij de Jinko-crop) en de kolomverdeling
// is iets bijgesteld (1.15fr/1fr i.p.v. 1.35fr/1fr) — dezelfde afbeelding,
// geen tekst gewijzigd, alleen groter en beter gevuld weergegeven.
//
// SCHERPTE-FIX: deze afbeelding (en de vergelijkbare "wat is dit?"-
// doorsnedes op de isolatie- en kozijnenpagina's) oogde zacht/onscherp.
// Oorzaak 1: Next.js optimaliseert elke <Image> standaard naar WebP/AVIF
// op kwaliteit 75, en dat hercomprimeren maakt fijne tekst en dunne
// lijnen (zoals in deze Canva-diagrammen) merkbaar zachter dan de
// originele PNG. Opgelost door `quality={100}` op deze afbeelding (en de
// andere diagramachtige uitlegbeelden) te zetten, met `images.qualities`
// in next.config.ts uitgebreid zodat Next.js die waarde toestaat.
// Oorzaak 2: de eerste, zelf bijgesneden versie (969×691, uit het
// oorspronkelijke 1920×1080-Canva-bestand) had daardoor te weinig eigen
// pixels voor scherpte op Retina-schermen. Opgelost doordat de
// opdrachtgever een nieuwe, al strak gecropte Canva-export op hogere
// resolutie heeft aangeleverd (1902×1254, vult nu >93% van het canvas —
// nauwelijks nog witruimte) — deze vervangt de eerdere crop volledig.
//
// VERFIJNINGSRONDE 4: nieuwe, bredere Canva-uitlegvisual aangeleverd
// (eerst "zonnepanelen cyclus v.1.1.png", 5516×2432, dezelfde stijl als
// de vergelijkbare thuisbatterij-uitlegvisual) — vervangt de vorige
// zonnepanelen-uitlegvisual.png volledig. De 2-koloms opzet (tekst+
// onderdelen naast een half-breed diagram) maakte de tekst in het
// diagram onleesbaar klein, dus de sectie is omgezet naar: tekst +
// onderdelen (nu een rij van 4) bovenaan, en de uitlegvisual daaronder
// over de volle sectiebreedte.
// v1.1 bevatte een nummeringsfout (stap "Thuisbatterij" was gelabeld
// "2" i.p.v. "3", waardoor "2" dubbel voorkwam en "3" ontbrak) — dit is
// gemeld, en v1.2 (6895×3040, nog hogere resolutie) is aangeleverd met
// de correcte nummering 1-6. v1.2 is de huidige, definitieve versie.
//
// VEREENVOUDIGING VOOR LEKEN (contentaudit, geen redesign): de
// intro-alinea bij "Wat zijn zonnepanelen?" is uitgebreid met een
// woordelijke doorloop van de stroomcyclus (dezelfde stappen als op de
// uitlegvisual: opwekken → bruikbaar maken → verdelen → gebruiken/
// opslaan), zodat schermlezers en snelle lezers dit ook zonder de
// afbeelding te bekijken begrijpen. Er zijn 2 FAQ-vragen toegevoegd die
// "omvormer" en "Wp" uitleggen (beide termen worden al elders op de
// pagina gebruikt zonder uitleg) — "omvormer" op basis van de
// uitlegvisual zelf ("Omvormer maakt stroom bruikbaar"), "Wp" als
// standaard technische eenheidsdefinitie (wattpiek), niet
// merkgebonden. Het inklapbare technische blok is verplaatst naar het
// nieuwe gedeelde TechnicalDetails-component (components/measures/
// TechnicalDetails.tsx) — zelfde inhoud, geen wijziging in gegevens.
// De rest van de pagina voldeed al aan de eenvoudige-taal-eisen uit
// eerdere verfijningsrondes (geen Voc/Isc/celtechnologie in de
// hoofdcontent, productkaarten tonen alleen vermogen/efficiëntie/
// afmetingen/gewicht/garantie, PROCESS_STEPS en VOORWAARDEN waren al in
// gewone taal) en is inhoudelijk ongewijzigd gelaten.
//
// HERO-VERVANGING: de hero-foto is vervangen door een nieuwe, echte
// Gijs-installatiefoto ("zonnepanelen hero.png" uit een aangeleverde
// Archief.zip) — een Gijs-installateur die zonnepanelen op een schuin
// dak plaatst. Bijgesneden van 1672×941 naar 1344×941 (de vaste
// 10:7-heroverhouding die alle maatregelpagina's gebruiken), met de
// installateur en het volledige panelenveld behouden. De alt-tekst
// noemde eerder specifiek "JA Solar" (bij de oude productfoto); op de
// nieuwe foto is geen merk zichtbaar, dus de alt-tekst is generiek
// gemaakt. Vervangt de vorige hero-foto onder dezelfde bestandsnaam
// (zonnepanelen-hero.png).
//
// HERO-VERVANGING 2: nogmaals vervangen door een andere, opnieuw
// aangeleverde foto (bronbestand "Gemini_Generated_Image_...jpeg" —
// deze bestandsnaam duidt op een AI-gegenereerde afbeelding, niet een
// camerafoto). Dit is expliciet gemeld aan de opdrachtgever, die
// bevestigde de afbeelding toch te willen gebruiken (enkel onder een
// schone bestandsnaam in plaats van de originele Gemini-bestandsnaam).
// Zelfde 10:7-bijsnijding en dezelfde bestandsnaam (zonnepanelen-hero.png).
//
// HERO-BESTANDSNAAM GEWIJZIGD naar zonnepanelen-hero-v2.png (zelfde foto,
// ongewijzigd — geverifieerd via MD5). Reden: de opdrachtgever zag op zijn
// eigen apparaat nog een oudere, allang vervangen foto op deze plek. De
// pagina/server bleken al de juiste foto te serveren (geverifieerd via
// directe fetch + MD5), dus de oorzaak was een hardnekkige browsercache
// op dezelfde bestandsnaam/URL uit een eerdere ronde. Een nieuwe
// bestandsnaam forceert een verse URL en omzeilt dat definitief.
// UITVOERINGSVISUAL — PROCES V2: de eerdere set losse SVG's (map
// "zonnepanelen", stap 1 hergebruikt van de isolatiepagina's) is volledig
// vervangen door de definitieve "proces v2"-set (submap "Zonnepanelen
// stappen"): elk bestand bevat nu icoon + nummerbadge + titel + een korte
// uitlegzin, en dit keer heeft zonnepanelen een eigen, unieke stap-1
// ("Aankomst") i.p.v. het gedeelde isolatie-bestand. Alle 6 bestanden
// zijn hernoemd naar zonnepanelen-stap-1.svg t/m -stap-6.svg; de vorige
// bestanden (stap-1.svg, stap-2/3/4/5/6-zonnepanelen.svg) zijn
// verwijderd. Titels ongewijzigd overgenomen.
const UITVOERING_STAPPEN = [
  { bestand: "zonnepanelen-stap-1.svg", label: "Aankomst" },
  { bestand: "zonnepanelen-stap-2.svg", label: "Voorbereiden" },
  { bestand: "zonnepanelen-stap-3.svg", label: "Monteren" },
  { bestand: "zonnepanelen-stap-4.svg", label: "Panelen leggen" },
  { bestand: "zonnepanelen-stap-5.svg", label: "Controle" },
  { bestand: "zonnepanelen-stap-6.svg", label: "Genieten" },
];

// Bron: "alle_brochures_in_1.pdf", pagina 4 — "Even wat belangrijke
// punten voordat de werkzaamheden worden gestart" (5 punten) en "Nog wat
// belangrijke punten tijdens de werkzaamheden" (4 punten).
const VOORWAARDEN = [
  "Zorg voor voldoende parkeergelegenheid dicht bij je woning.",
  "Er wordt een omvormer geplaatst; zorg voor voldoende werkruimte.",
  "Het installatieteam moet vaak door het huis naar boven; zorg dat dit toegankelijk is.",
  "Er sneuvelen weleens dakpannen; zorg voor extra reservepannen.",
  "Zorg dat er een toilet beschikbaar is voor het installatieteam.",
  "Thuis werken kan; het monteren geeft wel wat lawaai.",
  "Er worden gaten geboord door het dak voor de kabels.",
  "Kabels lopen naar de meterkast, zoveel mogelijk uit het zicht (niet altijd te garanderen).",
  "Het systeem wordt werkend opgeleverd; wees aanwezig voor de app-uitleg.",
];

// Bron: "alle_brochures_in_1.pdf", pagina 4 — "Nog een paar laatste
// puntjes nadat alles klaar is". Nieuwe sectie op deze pagina.
const NA_INSTALLATIE = [
  { icon: "user-check", title: "Zelf aanmelden", text: "Meld de zonnepanelen zelf aan via www.energieleveren.nl. Vanwege de privacywetgeving mag Gijs dit niet voor je doen." },
  { icon: "sparkles", title: "Schoonhouden", text: "Een regenbui houdt de panelen al aardig schoon; laat hardnekkig vuil professioneel reinigen." },
  { icon: "mail", title: "Omvormer registreren", text: "De omvormer moet mogelijk geregistreerd worden om te kunnen monitoren; let op je mail na oplevering." },
];

// Voordelen: elk direct te herleiden tot de aangeleverde bronnen (geen
// opbrengst- of besparingsclaim). "Eigen elektriciteit opwekken" komt uit
// de bestaande, al goedgekeurde intro in measure-pages.ts. De andere twee
// zijn gebaseerd op datasheet-gegevens (mechanische belasting/hagel-test,
// en de garantietermijnen die voor alle vier producten gelijk zijn).
const VOORDELEN = [
  { icon: "zap", title: "Eigen elektriciteit opwekken", text: "Zet zonlicht om in elektriciteit die je zelf in huis gebruikt." },
  { icon: "shield-check", title: "Bestand tegen weersinvloeden", text: "Getest op mechanische belasting door wind, sneeuw en hagelinslag." },
  { icon: "award", title: "Lange garantietermijn", text: "25 jaar productgarantie en 30 jaar vermogensgarantie op alle merken." },
];

export function ZonnepanelenPage({ item }: { item: MeasurePageItem }) {
  const title = "Zonnepanelen";
  const sections = [
    { id: "wat-is-het", label: "Wat is het?" },
    { id: "past-het", label: "Past het bij mij?" },
    { id: "voordelen", label: "De voordelen" },
    { id: "producten", label: "Producten" },
    { id: "hoe-werkt-het", label: "Hoe werkt het?" },
    { id: "voorwaarden", label: "Voorwaarden" },
    { id: "na-installatie", label: "Na de installatie" },
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  const faqItems: FAQItem[] = [
    { question: "Hoe lang duurt de installatie van zonnepanelen?", answer: "Gijs plaatst de zonnepanelen in één dag, van de aankomst van de installateur tot de oplevering van een werkend systeem." },
    { question: "Moet ik extra dakpannen klaarleggen?", answer: "Ja. Er sneuvelen altijd wat dakpannen bij het plaatsen van zonnepanelen, dus zorg dat er extra dakpannen aanwezig zijn." },
    { question: "Waar komt de omvormer?", answer: "Bij het plaatsen van zonnepanelen installeert Gijs ook een omvormer, waarvoor voldoende werkruimte nodig is." },
    { question: "Hoe lopen de kabels naar de meterkast?", answer: "Er worden gaten geboord door het dak voor de kabel. Vanaf daar worden kabels naar de meterkast getrokken; Gijs probeert deze zoveel mogelijk in het huis te verwerken (uit het zicht), al kan dit niet altijd worden gegarandeerd." },
    { question: "Moet ik mijn zonnepanelen zelf aanmelden?", answer: "Ja. Vanwege de privacywetgeving mogen Gijs en de installateur dit niet voor je doen. Je meldt de zonnepanelen zelf aan via www.energieleveren.nl." },
    { question: "Hoe werkt de monitoring?", answer: "Het kan zijn dat de omvormer na oplevering nog geregistreerd moet worden om te kunnen monitoren; houd hiervoor je mail in de gaten." },
    { question: "Welke zonnepanelen gebruikt Gijs?", answer: "Gijs plaatst zonnepanelen van JA Solar, Aiko en Jinko." },
    { question: "Wat doet de omvormer?", answer: "De omvormer maakt de stroom van de zonnepanelen bruikbaar voor je woning." },
    { question: "Wat betekent Wp?", answer: "Wp staat voor wattpiek: het vermogen dat een zonnepaneel onder standaard testomstandigheden kan leveren." },
    { question: item.question, answer: item.answer },
  ];

  const startScanHref = "/woning?maatregel=" + item.id;

  return (
    <main className="mx-auto px-6" style={{ maxWidth: "var(--container-wide)", paddingBottom: "var(--section-y)" }}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", url: "/" },
          { name: "Maatregelen", url: "/maatregelen" },
          { name: title, url: "/maatregelen/" + item.slug },
        ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: SITE_URL + crumb.url })),
      }} />

      <nav aria-label="Broodkruimel" className="flex flex-wrap gap-2 text-sm py-6">
        <Link href="/" className="underline underline-offset-2">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/maatregelen" className="underline underline-offset-2">Maatregelen</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <MeasureHero
        label="Maatregel"
        title={title}
        subtitle="Zonnepanelen plaatsen in één dag"
        intro="Gijs plaatst zonnepanelen van JA Solar, Aiko en Jinko. Hieronder lees je hoe zonnepanelen werken, welke panelen Gijs gebruikt en hoe de installatie verloopt."
        primaryCta={{ label: "Start de woningscan", href: startScanHref }}
        secondaryCta={{ label: "Plan een gratis energiescan", href: "/contact#energiescan" }}
        image="/productbladen/zonnepanelen-hero-v2.png"
        imageAlt="Een Gijs-installateur plaatst zonnepanelen op een schuin dak"
      />

      <div>
        <MeasureSectionNav sections={sections} />

        <section id="wat-is-het" className="scroll-mt-40 mt-4 mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]">Wat zijn zonnepanelen?</h2>
            <p className="text-lg font-medium text-[var(--gijs-donkergroen)] leading-relaxed">
              Zie zonnepanelen als je eigen stroomfabriek op het dak. Ze zetten zonlicht om in elektriciteit die je
              in huis kunt gebruiken.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              De zonnepanelen wekken stroom op. Het systeem maakt deze stroom bruikbaar voor de woning, waarna de
              meterkast de stroom verdeelt zodat apparaten in huis deze kunnen gebruiken. Heb je ook een
              thuisbatterij? Dan kan overtollige stroom worden opgeslagen voor later gebruik.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Gijs plaatst panelen van JA Solar, Aiko en Jinko. Wat past, hangt af van je dak en de constructie.
              Daar hoef je zelf niet technisch uit te komen: tijdens een energiescan aan huis bekijkt een expert van
              Gijs het dak en de beschikbare ruimte, en bespreekt welke oplossing past.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 mb-10">
            {[
              { icon: "sun", title: "Zonnecellen", text: "Zetten het zonlicht om in elektriciteit." },
              { icon: "layers", title: "Beschermglas", text: "Gehard glas met anti-reflectiecoating beschermt de cellen." },
              { icon: "square", title: "Aluminium frame", text: "Houdt het paneel stevig bij elkaar." },
              { icon: "cable", title: "Aansluitkast", text: "Hier komen de kabels samen richting de omvormer." },
            ].map(deel => (
              <div key={deel.title} className="flex flex-col gap-3">
                <span className="w-16 h-16 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name={deel.icon} size="xl" />
                </span>
                <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{deel.title}</h3>
                <p className="text-base text-zinc-600 leading-relaxed">{deel.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--surface-muted)] max-w-[1000px] mx-auto">
            {/* PNG vervangen door SVG: zelfde crop/inhoud (ratio geverifieerd),
                de opdrachtgever heeft alleen de hoekafronding van de
                labels/badges aangepast (uitlegvisuals.zip). */}
            <Image
              src="/productbladen/zonnepanelen-uitlegvisual.svg"
              alt="Schema van een zonnepanelensysteem: van de zonnepanelen via de regelaar en een thuisbatterij naar de omvormer, en van daaruit via de meterkast naar de apparaten in huis"
              width={2000}
              height={882}
              quality={100}
              className="w-full h-auto"
            />
          </div>
        </section>

        <section id="past-het" className="scroll-mt-40 mb-16">
          <Card variant="tint" className="flex flex-col md:flex-row md:items-center gap-6 !p-6 md:!p-7">
            <div className="md:flex-1 flex flex-col gap-1">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Past dit bij mijn woning?</h3>
              <p className="text-sm text-zinc-600">Tijdens de energiescan beoordeelt Gijs samen met jou onder meer het volgende:</p>
            </div>
            <ul className="md:flex-[1.6] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>Het dak en de constructie voor de zonnepanelen</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De bekabeling door het dak en naar de meterkast</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De elektrische aansluiting en werkruimte voor de omvormer</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-700">
                <Icon name="search" size="sm" className="mt-0.5 text-[var(--accent-600)] shrink-0" />
                <span>De meterkast</span>
              </li>
            </ul>
            <Button href={startScanHref} variant="accent" className="shrink-0">Start de woningscan</Button>
          </Card>
        </section>

        <section id="voordelen" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">De voordelen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOORDELEN.map(voordeel => (
              <Card key={voordeel.title} className="flex flex-col gap-5 !p-8">
                <span className="w-16 h-16 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name={voordeel.icon} size="xl" />
                </span>
                <h3 className="font-bold text-xl text-[var(--gijs-donkergroen)]">{voordeel.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{voordeel.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="rounded-[var(--radius-xl)] bg-[var(--surface-muted)]/60 px-5 py-10 md:px-10 md:py-12 mb-16">
        <section id="producten" className="scroll-mt-40">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Welke zonnepanelen gebruikt Gijs?</h2>
          <p className="text-zinc-600 mb-8 max-w-2xl">
            Gijs plaatst zonnepanelen van JA Solar, Aiko en Jinko. Elk merk heeft eigen technische eigenschappen; geen
            van deze panelen wordt hieronder als beste keuze aangewezen. Dat bekijkt Gijs samen met jou.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ZONNEPANEEL_MERKEN.map(merk => (
              <Card key={merk.merk} className="flex flex-col gap-5 !p-6 bg-white">
                <div className="rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface-muted)] aspect-[4/3] flex items-center justify-center">
                  <Image src={merk.image} alt={merk.imageAlt} width={600} height={600} className="max-w-[80%] max-h-[85%] object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{merk.merk}</h3>
                  <p className="text-sm text-zinc-500">{merk.naam}</p>
                </div>
                <p className="flex items-start gap-2 text-sm text-zinc-700 border-t border-[var(--border-default)] pt-4">
                  <Icon name="shield-check" size="sm" className="mt-0.5 text-[var(--accent-700)] shrink-0" />
                  <span>{merk.garantieProduct} · {merk.garantieVermogen}</span>
                </p>
              </Card>
            ))}
          </div>

          <TechnicalDetails id="technische-gegevens">
            <div className="flex flex-col gap-10">
              <div>
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)] mb-3">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-[var(--surface-muted)]">
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Paneel</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Vermogen</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Module-efficiëntie</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Afmetingen</th>
                        <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Gewicht</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-default)]">
                      {ZONNEPANEEL_MERKEN.map(merk => (
                        <tr key={merk.merk}>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-bold text-[var(--gijs-donkergroen)]">{merk.merk}</div>
                            <div className="text-sm text-zinc-500">{merk.naam}</div>
                          </td>
                          <td className="px-5 py-4 text-zinc-700 whitespace-nowrap">{merk.vermogen}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{merk.rendement}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{merk.afmetingen}</td>
                          <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{merk.gewicht}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-zinc-500">
                  Jinko&apos;s twee productlijnen (Tiger Neo 54HL4-B en 54HL4R-B) zijn hierboven samengevat tot één rij; de
                  volledige, losse gegevens per productlijn staan hieronder.
                </p>
              </div>
              {ZONNEPANEEL_PRODUCTEN.map(product => (
                <div key={product.naam}>
                  <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-1">{product.naam}</h3>
                  <p className="text-sm text-zinc-500 mb-4">
                    {product.celtype} · {product.aantalCellen} cellen · {product.junctionBox}
                    {product.connector ? ` · Connector: ${product.connector}` : ""} · Max. systeemspanning:{" "}
                    {product.maxSysteemspanning} · Mechanische belasting: {product.mechanischeBelasting}
                  </p>
                  <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border-default)]">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="bg-[var(--surface-muted)]">
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Type</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Pmax (STC)</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Pmax (NOCT)</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Voc</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Vmp</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Isc</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Imp</th>
                          <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Rendement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.varianten.map((variant, i) => (
                          <tr key={variant.type} className={i % 2 === 1 ? "bg-[var(--surface-muted)]/40" : undefined}>
                            <td className="px-5 py-4 font-bold text-[var(--gijs-donkergroen)] whitespace-nowrap">{variant.type}</td>
                            <td className="px-5 py-4 text-zinc-700 whitespace-nowrap">{variant.pmaxStc}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.pmaxNoct}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.vocStc}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.vmpStc}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.iscStc}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.impStc}</td>
                            <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">{variant.efficientie}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    STC: 1000 W/m², 25°C celtemperatuur, AM1.5. NOCT: 800 W/m², 20°C omgevingstemperatuur, 1 m/s wind.
                  </p>
                </div>
              ))}
            </div>
          </TechnicalDetails>
        </section>
        </div>

        <section id="hoe-werkt-het" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Hoe verloopt de uitvoering?</h2>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl">Gijs plaatst zonnepanelen in één dag, volgens een vaste aanpak.</p>
          {/* Gedeeld component, ook gebruikt door de isolatiepagina's, zodat
              de iconen overal exact dezelfde afmeting/uitlijning hebben —
              zie UitvoeringStappen.tsx voor de volledige toelichting. */}
          <UitvoeringStappen stappen={UITVOERING_STAPPEN} />
        </section>

        <section id="voorwaarden" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Voorbereiding en voorwaarden</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Voor een goede uitvoering gelden een paar praktische voorwaarden, zowel voor als tijdens de werkzaamheden.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Voor de installatie</h3>
              <ul className="flex flex-col gap-4">
                {VOORWAARDEN.slice(0, 5).map(voorwaarde => (
                  <li key={voorwaarde} className="flex items-start gap-3 text-base text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{voorwaarde}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="!p-8">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)] mb-4">Tijdens de installatie</h3>
              <ul className="flex flex-col gap-4">
                {VOORWAARDEN.slice(5).map(voorwaarde => (
                  <li key={voorwaarde} className="flex items-start gap-3 text-base text-zinc-700">
                    <Icon name="check" size="sm" className="mt-1 text-[var(--accent-600)] shrink-0" />
                    <span>{voorwaarde}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section id="na-installatie" className="scroll-mt-40 mb-16">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Na de installatie</h2>
          <p className="text-lg text-zinc-600 mb-6 max-w-2xl">
            Ook na de oplevering zijn er een paar dingen om in de gaten te houden.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {NA_INSTALLATIE.map(punt => (
              <Card key={punt.title} className="flex flex-col gap-4 !p-7">
                <span className="w-16 h-16 rounded-full bg-[var(--accent-050)] text-[var(--green-800)] flex items-center justify-center">
                  <Icon name={punt.icon} size="xl" />
                </span>
                <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">{punt.title}</h3>
                <p className="text-base text-zinc-600 leading-relaxed">{punt.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="veelgestelde-vragen" className="scroll-mt-40 mb-14">
          <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-6">Veelgestelde vragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-8 items-start">
            <div>
              <FAQAccordion
                items={faqItems}
                className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg"
              />
              <Link href="/kennis#veelgestelde-vragen" className="mt-4 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
                Bekijk alle veelgestelde vragen <Icon name="arrow-right" size="sm" />
              </Link>
            </div>
            <Card variant="tint" className="flex flex-col gap-4">
              <h3 className="font-bold text-lg text-[var(--gijs-donkergroen)]">Nog een vraag?</h3>
              <p className="text-sm text-zinc-600">
                Kom je er niet helemaal uit? Bespreek het tijdens een gratis energiescan of neem direct contact op.
              </p>
              <Button href="/contact#energiescan" variant="accent">Plan een gratis energiescan</Button>
              <a href={CONTACT.phoneHref} className="text-sm font-semibold text-[var(--green-800)] no-underline hover:underline">
                Bel {CONTACT.phone}
              </a>
            </Card>
          </div>
        </section>
      </div>

      <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4 max-w-xl">
          <span className="shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Image src="/huisscan.png" alt="" width={34} height={34} />
          </span>
          <div className="min-w-0 [&_h2]:[hyphens:auto]">
            <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">Passen zonnepanelen bij jouw woning?</h2>
            <p className="text-zinc-700">Start de woningscan en ontdek welke mogelijkheden bij jouw woning passen.</p>
          </div>
        </div>
        <Button href={startScanHref} variant="accent" size="lg" iconRight="arrow-right" className="shrink-0 w-full md:w-auto">
          Start de woningscan
        </Button>
      </section>
    </main>
  );
}
