import Link from "next/link";
import { TEKSTLINK } from "@/components/regio/regio-template-styles";
import { ArtikelCta } from "@/components/kennis/ArtikelCta";
import { ArtikelH2, ArtikelFoto } from "@/components/kennis/ArtikelOpmaak";
import { FAQAccordion, type FAQItem } from "@/components/measures/FAQAccordion";

const FAQ: FAQItem[] = [
  {
    question: "Kan een warmtepomp onder een raam worden geplaatst?",
    answer:
      "Ja, sommige compacte warmtepompen zijn hiervoor geschikt. Houd wel rekening met de veiligheidsafstanden en installatievoorschriften van de fabrikant.",
  },
  {
    question: "Kun je met een compacte warmtepomp volledig van het gas af?",
    answer:
      "Ja, mits de warmtepomp voldoende verwarmingsvermogen heeft en je woning en verwarmingsinstallatie geschikt zijn voor volledig elektrisch verwarmen.",
  },
  {
    question: "Is een warmtepomp zonder buitenunit ook mogelijk?",
    answer:
      "Ja, er bestaan bijvoorbeeld warmtepompen die warmte halen uit PVT-panelen op het dak. Hierdoor is een buitenunit met ventilator niet nodig.",
  },
];

/** Inleiding boven de hero-foto. */
export function WarmtepompRijtjeshuisInleiding({ className }: { className?: string }) {
  return (
    <>
      <p className={className}>
        Wil je een warmtepomp laten plaatsen, maar vraag je je af of je daar wel voldoende ruimte voor hebt? Wanneer
        je in een rijtjeshuis woont, heb je misschien een kleine tuin en wonen je buren op korte afstand. Waar moet je
        de buitenunit plaatsen en hoe voorkom je dat je buren last krijgen van het geluid?
      </p>
      <p className={className}>
        Gelukkig hoeft een gebrek aan ruimte geen belemmering te zijn voor het plaatsen van een warmtepomp. Er zijn
        verschillende plaatsingsmogelijkheden en tegenwoordig zijn er ook compacte warmtepompen die speciaal zijn
        ontwikkeld voor woningen met beperkte ruimte. In dit artikel leggen we uit welke mogelijkheden er zijn en waar
        je rekening mee moet houden.
      </p>
    </>
  );
}

export function WarmtepompRijtjeshuis({ slug }: { slug: string }) {
  return (
    <>
      <ArtikelH2 id="plaatsingsmogelijkheden">Waar kun je een warmtepomp plaatsen bij een rijtjeshuis?</ArtikelH2>
      <p>
        Wanneer je een kleine tuin hebt, wil je natuurlijk niet dat een warmtepomp een groot deel van je tuin in
        beslag neemt. Toch zijn er vaak meer plaatsingsmogelijkheden dan je in eerste instantie denkt. Afhankelijk van
        de indeling van je woning en tuin zijn er bijvoorbeeld vier mogelijkheden:
      </p>
      <ArtikelFoto
        src="/images/kennis/warmtepomp-rijtjeshuis/plaatsingsmogelijkheden.webp"
        alt="Bouwtekening met vier plaatsingsmogelijkheden voor een warmtepomp bij een rijtjeshuis: op het dak van de uitbouw, tegen een stenen muur, met geluidsdempende ombouw en centraal tegen de achtergevel"
        onderschrift="Vier mogelijke plekken voor een buitenunit bij een rijtjeshuis: op de uitbouw, tegen een muur, in een ombouw of centraal aan de achtergevel."
      />
      <ol className="my-4 space-y-3 pl-5 list-decimal">
        <li>
          <strong>Op het dak van een uitbouw:</strong> hierdoor houd je meer ruimte over in je tuin. Wel moet de
          dakconstructie voldoende draagkracht hebben en moeten trillingen worden beperkt.
        </li>
        <li>
          <strong>Tegen een stenen muur:</strong> een geschikte stenen muur kan helpen om het geluid richting je buren
          te beperken.
        </li>
        <li>
          <strong>Met een geluidsdempende ombouw:</strong> hiermee kun je het geluid van de buitenunit verminderen,
          mits de ombouw geschikt is voor de warmtepomp en de luchttoevoer en -afvoer niet belemmert.
        </li>
        <li>
          <strong>Centraal tegen de achtergevel:</strong> hierdoor vergroot je de afstand tot beide buren, zonder dat
          de buitenunit midden in je tuin staat.
        </li>
      </ol>
      <p>
        Welke plek het meest geschikt is, hangt niet alleen af van de beschikbare ruimte, maar ook van de afstand tot
        je buren, de luchtstroming en de benodigde ruimte voor onderhoud.
      </p>

      <ArtikelH2 id="compacte-warmtepomp">Een compacte warmtepomp voor woningen met weinig ruimte</ArtikelH2>
      <p>
        Ook fabrikanten spelen steeds beter in op woningen met beperkte ruimte. Zo introduceerde{" "}
        <a
          href="https://www.dewarmte.nl/nieuws/warmtepomp-adoptie-blijft-achter-in-rijtjeshuizen/"
          target="_blank"
          rel="noopener noreferrer"
          className={TEKSTLINK}
        >
          DeWarmte op 17 november 2026 de Pomp RM
        </a>
        , een compacte warmtepomp die speciaal is ontwikkeld voor onder andere rijtjeshuizen. Met een hoogte van
        slechts 76 centimeter inclusief montagevoeten kan de buitenunit op geschikte plekken zelfs onder een raam
        worden geplaatst. Deze warmtepomp behoort inmiddels ook tot de oplossingen die we bij Gijs aanbieden.
      </p>
      <p>
        Ondanks het compacte formaat levert deze warmtepomp volgens de fabrikant bij een buitentemperatuur van
        &minus;10 graden Celsius nog 7,5&nbsp;kW aan verwarmingsvermogen. Hierdoor hoef je volledig elektrisch
        verwarmen niet bij voorbaat uit te sluiten wanneer je weinig ruimte hebt.
      </p>
      <p>
        Houd echter ook rekening met de beschikbare ruimte binnenshuis. Bij een hybride warmtepomp blijft je cv-ketel
        het warme water verzorgen, terwijl je bij volledig elektrisch verwarmen doorgaans ruimte nodig hebt voor een
        warmwatervat. Ook hiervoor bestaan compacte oplossingen.
      </p>

      <ArtikelH2 id="geluidsoverlast">Hoe voorkom je geluidsoverlast bij je buren?</ArtikelH2>
      <p>
        Een veelvoorkomende onzekerheid bij rijtjeshuizen is de afstand tussen de warmtepomp en de erfgrens. Vanuit de
        geluidsnorm geldt geen algemene minimale afstand tot je buren. Het gaat erom hoeveel geluid de buitenunit op
        de erfgrens veroorzaakt. Volgens{" "}
        <a
          href="https://www.milieucentraal.nl/energie-besparen/duurzaam-verwarmen-en-koelen/warmtepomp-duurzaam-elektrisch-verwarmen/"
          target="_blank"
          rel="noopener noreferrer"
          className={TEKSTLINK}
        >
          Milieu Centraal
        </a>{" "}
        geldt overdag onder bepaalde voorwaarden een maximum van 45 decibel en in de avond en nacht 40 decibel.
      </p>
      <p>
        Een kleinere warmtepomp is niet automatisch stiller. Ook de richting waarin de ventilator blaast, de afstand
        tot je buren en de aanwezigheid van muren spelen een rol. Een gewone houten schutting biedt bijvoorbeeld
        minder geluidswering dan een geschikte stenen muur. Door vooraf rekening te houden met deze omstandigheden,
        kun je het risico op geluidsoverlast beperken.
      </p>

      <ArtikelH2 id="welke-warmtepomp-past">Welke warmtepomp past bij jouw rijtjeshuis?</ArtikelH2>
      <p>
        Heb je eerder afgezien van een warmtepomp omdat je dacht dat je daarvoor onvoldoende ruimte had? Dan kan het
        interessant zijn om opnieuw naar de mogelijkheden te kijken. Een compacte warmtepomp is echter niet
        automatisch de beste oplossing voor jouw woning. Misschien heeft je woning eerst meer baat bij isolatie of
        past een hybride warmtepomp beter bij je huidige situatie dan een volledig elektrische installatie.
      </p>
      <p>
        Bij Gijs kijken we daarom verder dan alleen de mogelijkheden om een{" "}
        <Link href="/maatregelen/warmtepomp" className={TEKSTLINK}>warmtepomp</Link> te plaatsen. Tijdens een gratis
        energiescan bekijken we je hele woning en adviseren we onafhankelijk van merken welke maatregelen het beste
        bij jouw situatie passen. Vervolgens verzorgen we ook de uitvoering. Zo voorkom je dat je investeert in een
        oplossing die niet goed bij jouw woning past.
      </p>

      <ArtikelCta
        slug={slug}
        titel="Benieuwd hoe je jouw rijtjeshuis comfortabeler en energiezuiniger kunt maken?"
        regel="Vraag een gratis energiescan aan."
      />

      <ArtikelH2 id="veelgestelde-vragen">Veelgestelde vragen</ArtikelH2>
      <FAQAccordion
        items={FAQ}
        className="[&_.gijs-accordion__trigger]:py-5 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg"
      />
    </>
  );
}
