import Link from "next/link";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { HOOFDSTUKKEN } from "@/lib/content/zo-werkt-gijs";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { Badge } from "@/components/ds/core/Badge";
import { StatRow } from "@/components/measures/StatRow";
import { WONINGVOORRAAD_GEMEENTEN, type WoningvoorraadGemeente } from "@/lib/content/regio-woningvoorraad";
import { EnergiescanUitleg } from "@/components/home/EnergiescanUitleg";

// Gedeelde blokken voor de regio-templates (provincie, gemeente, plaats).
// Alle teksten komen uit bestaande, bevestigde Gijs-content (maatregel-
// pagina's, zo-werkt-gijs, energiescan). Geen lokale claims, bedragen of
// regelingen: die verschillen per gemeente en worden niet op de site gezet.

export const H2 = "text-[clamp(1.75rem,1.2rem+1.9vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--gijs-donkergroen)] [text-wrap:balance]";
const LINK = "underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

export function RegioMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto px-6 w-full" style={{ maxWidth: "var(--container-wide)", paddingBottom: "var(--section-y)" }}>
      {children}
    </main>
  );
}

export function RegioBreadcrumb({ crumbs }: { crumbs: { naam: string; url: string }[] }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.naam, item: SITE_URL + c.url })),
      }} />
      <nav aria-label="Broodkruimel" className="flex flex-wrap gap-2 text-sm py-6">
        {crumbs.map((c, i) => i < crumbs.length - 1 ? (
          <span key={c.url} className="flex gap-2">
            <Link href={c.url} className="underline underline-offset-2">{c.naam}</Link>
            <span aria-hidden="true">/</span>
          </span>
        ) : <span key={c.url} aria-current="page">{c.naam}</span>)}
      </nav>
    </>
  );
}

// Beeldspraak zoals op de maatregelpagina's zelf ("Wat is ...?").
const ISOLATIE_MAATREGELEN = [
  { naam: "Dakisolatie", slug: "dakisolatie", beeld: "Een muts voor je huis", tekst: "Een isolatielaag bij het dak helpt de warmte beter binnen te houden." },
  { naam: "Spouwmuurisolatie", slug: "spouwmuurisolatie", beeld: "Een extra jas in je muur", tekst: "Een geïsoleerde spouw helpt de warmte beter binnen te houden." },
  { naam: "Vloerisolatie", slug: "vloerisolatie", beeld: "Warme sokken voor je vloer", tekst: "Je woning verliest minder warmte via de begane grondvloer." },
  { naam: "Isolatieglas", slug: "isolatieglas", beeld: "Een warme deken voor je ramen", tekst: "Het glas beperkt warmteverlies via het raam en voelt aan de binnenkant warmer aan." },
  { naam: "Kozijnen", slug: "kozijnen", beeld: "Houd kou buiten en tocht tegen", tekst: "Goede kozijnen houden kou en tocht beter buiten." },
];

export function IsolatieMaatregelen({ titel, intro }: { titel: string; intro: string }) {
  return (
    <section id="maatregelen" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-2"}>{titel}</h2>
      <p className="text-zinc-600 mb-6 max-w-2xl">{intro}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {ISOLATIE_MAATREGELEN.map(m => (
          <li key={m.slug}>
            <Link href={"/maatregelen/" + m.slug} className="no-underline group block h-full">
              <Card className="h-full flex flex-col gap-2 !p-6 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                <span className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{m.naam}</span>
                <span className="font-bold text-lg text-[var(--gijs-donkergroen)]">{m.beeld}</span>
                <span className="text-sm text-zinc-600 flex-1">{m.tekst}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--accent-700)] inline-flex items-center gap-1">
                  Lees meer <Icon name="arrow-right" size="sm" />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Landelijke subsidies: geen bedragen of voorwaarden op regiopagina's, die
// wijzigen regelmatig. Zie /kennis#subsidies voor de toelichting.
export function LandelijkeSubsidies() {
  return (
    <section id="landelijke-subsidies" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-2"}>Landelijke subsidies</h2>
      <div className="max-w-2xl flex flex-col gap-3 text-zinc-600">
        <p>
          Voor sommige verduurzamingsmaatregelen is subsidie beschikbaar. De voorwaarden en bedragen kunnen
          wijzigen. Tijdens de energiescan bespreken we welke mogelijkheden op dat moment voor jouw woning gelden.
        </p>
        <p>
          Gijs ondersteunt je graag bij het verzorgen van je subsidieaanvraag. Gijs kan de toekenning van subsidies
          niet garanderen.
        </p>
        <p>
          Meer weten over de landelijke ISDE-regeling? Bekijk de{" "}
          <a href="https://www.rvo.nl/subsidies-financiering/isde" target="_blank" rel="noopener noreferrer" className={LINK}>
            officiële ISDE-pagina van RVO
          </a>{" "}
          of de <Link href="/kennis#subsidies" className={LINK}>uitleg over subsidies en financiering</Link>.
        </p>
      </div>
    </section>
  );
}

// Echte, bronvermelde woningvoorraadcijfers (geen subsidiebedragen, die
// veranderen niet elke maand) — zorgt voor een feitelijk verschil tussen
// gemeentepagina's in plaats van alleen een andere plaatsnaam. Toont niets
// als er voor deze gemeente geen data is (zie lib/content/regio-woningvoorraad.ts).
// Leidt uit de eigen cijfers van de gemeente af waar de isolatiewinst waarschijnlijk zit. Alleen
// vergelijkingen met de getoonde bronwaarden, geen aannames over bepaalde wijken of woningen.
function woningProfiel(gemeente: string, d: WoningvoorraadGemeente): string[] {
  const huur = 100 - d.percentageKoopwoningen;
  const type = d.meestVoorkomendType.toLowerCase();
  const regels: string[] = [];
  if (d.percentageVoor1975 >= 55) {
    regels.push(`Meer dan de helft van de woningen in ${gemeente} is van vóór 1975. Daar zit meestal de meeste isolatiewinst: een lege spouw, een niet-geïsoleerd dak of een koude vloer is dan gewoon de eerste stap.`);
  } else if (d.percentageVoor1975 >= 40) {
    regels.push(`In ${gemeente} is bijna de helft van de woningen van vóór 1975. Bij die oudere huizen is isoleren vaak het slimste beginpunt; bij de nieuwere helft zit de winst vaker in beter glas, zonnepanelen of een warmtepomp.`);
  } else if (d.percentageVoor1975 >= 25) {
    regels.push(`Ongeveer een derde van de woningen in ${gemeente} is van vóór 1975. Die huizen zijn vaak de beste kandidaat voor spouw-, dak- of vloerisolatie; de rest is later gebouwd en meestal al deels geïsoleerd.`);
  } else if (d.percentageVoor1975 < 2) {
    regels.push(`Vrijwel alle woningen in ${gemeente} zijn na 1975 gebouwd, in een tijd dat isolatie al gangbaar was. De winst zit vaker in zonnepanelen, een warmtepomp of het bijwerken van oudere isolatie en beglazing dan in de eerste isolatielaag.`);
  } else {
    regels.push(`${gemeente} is grotendeels na 1975 gebouwd (slechts ${d.percentageVoor1975}% is ouder). Die woningen hebben meestal al isolatie, dus de winst zit vaker in dunne of oude isolatielagen bijwerken, isolatieglas, zonnepanelen of een warmtepomp.`);
  }
  if (type.startsWith("appartement")) {
    regels.push(`Het meest voorkomende woningtype is het appartement. Bij een appartement beslis je vaak samen met een VvE over gevel, dak of glas; binnen je eigen woning kun je meestal wel zelf aan de slag met glas en ventilatie.`);
  } else if (type.startsWith("vrijstaand")) {
    regels.push(`Het meest voorkomende woningtype is de vrijstaande woning. Zo'n woning heeft veel buitenmuur en dakoppervlak, waardoor isolatie extra merkbaar is in warmteverlies.`);
  } else {
    regels.push(`Het meest voorkomende woningtype is de ${type}. Bij een tussenwoning verlies je minder warmte via de zijmuren, dus dak, vloer en glas leveren vaak het meest op.`);
  }
  if (huur >= 40) {
    regels.push(`Met ${huur}% huurwoningen is in ${gemeente} een flink deel van de woningen niet van de bewoner zelf. Ben je huurder, praat dan eerst met je verhuurder; ben je eigenaar, dan beslis je zelf.`);
  }
  return regels;
}

export function WoningenInGemeente({ gemeente, slug, profiel = false }: { gemeente: string; slug: string; profiel?: boolean }) {
  const data = WONINGVOORRAAD_GEMEENTEN[slug];
  if (!data) return (
    <p className="text-zinc-600 max-w-2xl">
      Het bouwjaar zegt veel over hoe een woning gebouwd is, en hoeveel winst er nog te halen valt met isolatie.
      Tijdens de gratis energiescan aan huis kijkt een adviseur van Gijs precies wat er bij jouw woning speelt.
    </p>
  );
  const voor1975 = Math.round((data.percentageVoor1975 / 100) * data.totaalWoningen).toLocaleString("nl-NL");
  return (
    <section id="woningen-in-gemeente" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-2"}>Woningen in {gemeente}</h2>
      <p className="text-zinc-600 max-w-2xl mb-6">
        Gemeente {gemeente} telt {data.totaalWoningen.toLocaleString("nl-NL")} woningen, waarvan {data.percentageKoopwoningen}%
        koopwoning.{" "}
        {data.percentageVoor1975 < 2
          ? "Vrijwel geen woning is gebouwd vóór 1975, het jaar waarna isolatie gangbaar werd."
          : `Ongeveer ${data.percentageVoor1975}% (${voor1975} woningen) is gebouwd vóór 1975. Woningen van die leeftijd hebben vaak nog geen of weinig isolatie, omdat spouwmuurisolatie pas vanaf de jaren zeventig gangbaar werd.`}
      </p>
      <StatRow
        items={[
          { label: "Woningen", value: data.totaalWoningen.toLocaleString("nl-NL") },
          { label: "Gebouwd vóór 1975", value: `${data.percentageVoor1975}%` },
          { label: "Meest voorkomend type", value: data.meestVoorkomendType },
          { label: "Gemiddelde WOZ-waarde", value: data.gemiddeldeWozWaarde },
        ]}
      />
      {profiel && (
        <div className="mt-6 flex flex-col gap-3 text-zinc-600 max-w-2xl">
          {woningProfiel(gemeente, data).map(r => <p key={r}>{r}</p>)}
        </div>
      )}
      <p className="text-xs text-zinc-500 mt-4">
        Bron: <a href={data.bronUrl} target="_blank" rel="noopener noreferrer" className={LINK}>CBS/Kadaster-cijfers via AlleCijfers.nl</a>, peildatum {data.peildatum}.
      </p>
    </section>
  );
}

// Neutraal informatieblok: Gijs zoekt gemeentelijke subsidies niet voor de
// klant uit en garandeert niets. Alleen als er voor deze gemeente een
// geverifieerde, officiële gemeentelijke bron is (officieleUrl), toont het
// blok een link daarnaartoe — anders geen knop. Geen mailflow, geen CTA
// naar Gijs.
export function GemeentelijkeSubsidies({ gemeente, relatie, officieleUrl }: { gemeente: string; relatie?: string; officieleUrl?: string }) {
  return (
    <section id="gemeentelijke-subsidies" className="scroll-mt-40 mb-14">
      <Card variant="tint" className="flex flex-col md:flex-row md:items-center gap-6 !p-8">
        <div className="md:flex-1 flex flex-col gap-3 max-w-2xl">
          <h2 className={H2}>Gemeentelijke subsidies</h2>
          {relatie && <p className="text-zinc-700 font-medium">{relatie}</p>}
          <p className="text-zinc-600">
            Gemeenten kunnen eigen subsidies of regelingen hebben voor het verduurzamen van een woning. Deze
            verschillen per gemeente en kunnen veranderen. Controleer daarom altijd de actuele mogelijkheden bij
            jouw eigen gemeente.
          </p>
        </div>
        {officieleUrl && (
          <a href={officieleUrl} target="_blank" rel="noopener noreferrer" aria-label={`Bekijk subsidies bij gemeente ${gemeente} (opent in nieuw tabblad)`} className="gijs-btn gijs-btn--accent gijs-btn--lg shrink-0 max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">
            Bekijk subsidies bij jouw gemeente
          </a>
        )}
      </Card>
    </section>
  );
}

export function ZoWerktGijsKort() {
  return (
    <section id="zo-werkt-gijs" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-6"}>Zo werkt Gijs</h2>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOOFDSTUKKEN.map(fase => (
          <li key={fase.nummer} className="flex items-center gap-4">
            <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--gijs-accentgroen)] text-white font-bold flex items-center justify-center">
              {fase.nummer}
            </span>
            <span className="font-semibold text-[var(--gijs-donkergroen)]">{fase.titel}</span>
          </li>
        ))}
      </ol>
      <Link href="/zo-werkt-gijs" className="mt-6 text-sm font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] inline-flex items-center gap-1 no-underline">
        Lees hoe Gijs werkt <Icon name="arrow-right" size="sm" />
      </Link>
    </section>
  );
}

export function EnergiescanBlok() {
  return (
    <section id="energiescan" className="scroll-mt-40 mb-14">
      <div className="rounded-[var(--radius-xl)] bg-[var(--grey-050)] px-6 py-10 md:px-12 flex flex-col items-center text-center gap-4">
        <Badge tone="accent">Gratis en vrijblijvend · ter waarde van €349</Badge>
        <h2 className={H2}>Gratis energiescan aan huis</h2>
        <p className="max-w-xl text-zinc-700">
          Een adviseur van Gijs bekijkt je woning en bespreekt met je welke maatregelen technisch passen.
        </p>
        <Button href="https://wa.me/31742340777?text=Ik%20wil%20graag%20een%20energiescan%20plannen" variant="secondary" size="lg" iconRight="arrow-right">
          Vraag een gratis energiescan aan
        </Button>
        <EnergiescanUitleg className="max-w-md" />
      </div>
    </section>
  );
}

// Importeer lazily om de server-component grens niet te overschrijden.
// RegioWoningscanKnop is een client-component, maar mag gewoon in een server-component gebruikt worden.
import { RegioWoningscanKnop, RegioProvincieWoningscanKnop } from "@/components/regio/RegioWoningscanKnop";

export function RegioCta({
  titel,
  tekst,
  provincie,
  gemeente,
  plaats,
}: {
  titel: string;
  tekst?: string;
  /** Wanneer provincie + gemeente bekend zijn, wordt de woningscan-knop getrackt als regio-instroom. */
  provincie?: string;
  gemeente?: string;
  /** Alleen relevant op woonplaatspagina's: zorgt dat de herkomst naar de plaats-URL verwijst, niet naar de gemeente-URL. */
  plaats?: string;
}) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-10 sm:px-10 md:px-14 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <div className="max-w-xl min-w-0 [&_h2]:[hyphens:auto]">
        <h2 className={H2 + " mb-3"}>{titel}</h2>
        <p className="text-[17px] leading-relaxed text-zinc-700 [text-wrap:pretty]">{tekst ?? "Start de woningscan en ontdek welke mogelijkheden bij jouw woning passen."}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        {provincie && gemeente ? (
          <RegioWoningscanKnop provincie={provincie} gemeente={gemeente} plaats={plaats} className="w-full md:w-auto" />
        ) : provincie ? (
          <RegioProvincieWoningscanKnop provincie={provincie} className="w-full md:w-auto" />
        ) : (
          <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right" className="w-full md:w-auto">Start de woningscan</Button>
        )}
        <Button href="/contact" variant="secondary" size="lg" className="w-full md:w-auto">Neem contact op</Button>
      </div>
    </section>
  );
}
