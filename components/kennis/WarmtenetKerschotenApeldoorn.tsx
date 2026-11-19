import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";

// Tekst letterlijk uit "Document2" (PDF van Max, nu "Warmtenet Kerschoten onzeker ... v1"),
// alinea-indeling behouden. Alleen woorden uit de tekst zelf zijn links geworden.
const APELDOORN = "/regio/gelderland/apeldoorn";

/** Eerste alinea uit de PDF; staat op de pagina direct onder de titel, boven de foto. */
export function WarmtenetKerschotenInleiding({ className }: { className?: string }) {
  return (
    <p className={className}>
      Woon je in <Link href={APELDOORN} className={TEKSTLINK}>Apeldoorn</Link> en wil je jouw woning verduurzamen, maar
      weet je niet waar je moet beginnen? Misschien denk je aan betere isolatie, zonnepanelen of een warmtepomp. Ook het
      warmtenet in Kerschoten zorgt voor onzekerheid. Op 19 november 2026 maakte de gemeente Apeldoorn bekend dat het
      oorspronkelijke project niet doorgaat en dat ook een kleinere uitvoering voorlopig niet haalbaar is. Een
      toekomstig warmtenet is niet uitgesloten. Maar moet je daarom wachten met het verduurzamen van je eigen woning?
    </p>
  );
}

export function WarmtenetKerschotenApeldoorn({ slug }: { slug: string }) {
  return (
    <>
      <p>
        De belangrijkste vraag is niet welke maatregel je wilt aanschaffen, maar wat jouw woning daadwerkelijk nodig
        heeft. Een <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> klinkt bijvoorbeeld
        aantrekkelijk, maar wanneer je woning veel warmte verliest of je verwarmingssysteem niet geschikt is, kan deze
        minder efficiënt werken dan verwacht. Daardoor kunnen je energiekosten hoger uitvallen dan gehoopt. Ook bij{" "}
        <Link href={APELDOORN} className={TEKSTLINK}>isolatie in Apeldoorn</Link> is het belangrijk om eerst goed te
        kijken naar de bestaande situatie. Misschien overweeg je{" "}
        <Link href="/maatregelen/spouwmuurisolatie" className={TEKSTLINK}>spouwmuurisolatie</Link>, terwijl je muren al
        voldoende geïsoleerd zijn en juist <Link href="/maatregelen/dakisolatie" className={TEKSTLINK}>dakisolatie</Link>{" "}
        veel verschil kan maken. Door zomaar een maatregel te kiezen, loop je het risico geld uit te geven zonder het
        gewenste resultaat te bereiken.
      </p>

      <ArtikelFoto src="/images/maatregelen/dakisolatie/praktijk/tijdens-het-werk.jpg" alt="Een Gijs-vakspecialist isoleert het dak van een woning" />

      <p>
        Daarom is het verstandig om je woning als geheel te bekijken. Welke isolatie is al aanwezig? Hoeveel energie
        verbruik je? En welke installaties passen bij jouw situatie? Soms is spouwmuurisolatie of dakisolatie de beste
        eerste stap, terwijl bij een andere woning een hybride of volledig elektrische{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> interessant kan zijn. Ook kan het
        verstandig zijn om bepaalde investeringen nog even uit te stellen. Voor verduurzamingsmaatregelen zijn
        bovendien verschillende subsidies beschikbaar. Via de{" "}
        <Link href="/subsidiecheck" className={TEKSTLINK}>subsidiecheck van Gijs</Link> kun je bekijken welke
        regelingen mogelijk zijn voor jouw woning. Uiteindelijk gaat het niet alleen om welke maatregelen je neemt,
        maar vooral om de juiste combinatie en volgorde.
      </p>
      <p>
        Stel dat je een bedrijf inschakelt voor{" "}
        <Link href="/maatregelen/vloerisolatie" className={TEKSTLINK}>vloerisolatie</Link>, terwijl het grootste
        warmteverlies via je dak plaatsvindt. Een specialist in vloerisolatie kijkt doorgaans vooral naar de vloer,
        maar dat betekent niet dat deze maatregel voor jouw woning ook de meeste verbetering oplevert. Daarom kijkt
        Gijs verder dan één specifieke oplossing. Tijdens een gratis en vrijblijvende energiescan beoordeelt een
        adviseur de hele woning: van isolatie en verwarmingssysteem tot energieverbruik en mogelijke verbeteringen. Zo
        ontdek je welke maatregelen écht bij jouw woning passen en in welke volgorde je die het beste kunt uitvoeren.
        Gijs helpt woningeigenaren bij het{" "}
        <Link href={APELDOORN} className={TEKSTLINK}>verduurzamen van hun woning in Apeldoorn</Link> en verzorgt
        vervolgens ook de uitvoering. Van het eerste advies tot de oplevering heb je één vertrouwd aanspreekpunt.
      </p>

      <ArtikelCta slug={slug} titel="Ontdek wat jouw woning écht nodig heeft. Vraag een gratis en vrijblijvende energiescan aan." regel="Naud of Thom komt graag even langs!" />
    </>
  );
}
