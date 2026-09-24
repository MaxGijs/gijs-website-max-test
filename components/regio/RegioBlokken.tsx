import Link from "next/link";
import { JsonLd } from "@/components/SeoSchema";
import { SITE_URL } from "@/lib/seo";
import { CONTACT } from "@/lib/content/contact";
import { ZO_WERKT_GIJS_FASEN } from "@/lib/content/zo-werkt-gijs";
import { subsidieMailto } from "@/lib/content/regio";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import { Badge } from "@/components/ds/core/Badge";

// Gedeelde blokken voor de regio-templates (provincie, gemeente, plaats).
// Alle teksten komen uit bestaande, bevestigde Gijs-content (maatregel-
// pagina's, zo-werkt-gijs, energiescan). Geen lokale claims, bedragen of
// regelingen: die verschillen per gemeente en worden niet op de site gezet.

export const H2 = "text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)]";
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
  { naam: "Kozijnen", slug: "kozijnen", beeld: "Kou en tocht blijven buiten", tekst: "Goede kozijnen houden kou en tocht beter buiten." },
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
                <span className="text-xs font-bold tracking-[0.12em] uppercase text-[var(--accent-700)]">{m.naam}</span>
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

// Landelijke subsidies: alleen de algemene, in de productbladen bevestigde
// uitleg. Bedragen staan bewust niet op regiopagina's; die staan in het
// subsidieoverzicht op /kennis#subsidies.
export function LandelijkeSubsidies() {
  return (
    <section id="landelijke-subsidies" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-2"}>Landelijke subsidies</h2>
      <div className="max-w-2xl flex flex-col gap-3 text-zinc-600">
        <p>
          Voor isolatie bestaat een landelijke subsidie. Laat je meer dan één isolatiemaatregel installeren? Dan
          verdubbelt het subsidiebedrag voor isolatie. Dit geldt ook als je een isolatiemaatregel combineert met de
          installatie van een warmtepomp.
        </p>
        <p>
          Gijs ondersteunt je graag bij het verzorgen van je subsidieaanvraag. Gijs kan de toekenning van subsidies
          niet garanderen.
        </p>
        <p>
          Bekijk het <Link href="/kennis#subsidies" className={LINK}>subsidieoverzicht van Gijs</Link> voor de
          opbouw per maatregel.
        </p>
      </div>
    </section>
  );
}

export function GemeentelijkeSubsidies({ gemeente, locatie, relatie }: { gemeente: string; locatie: string; relatie?: string }) {
  return (
    <section id="gemeentelijke-subsidies" className="scroll-mt-40 mb-14">
      <Card variant="tint" className="flex flex-col md:flex-row md:items-center gap-6 !p-8">
        <div className="md:flex-1 flex flex-col gap-3 max-w-2xl">
          <h2 className={H2}>Gemeentelijke subsidies in {gemeente}</h2>
          {relatie && <p className="text-zinc-700 font-medium">{relatie}</p>}
          <p className="text-zinc-600">
            Gemeentelijke subsidies en regelingen verschillen per gemeente en kunnen veranderen. Gijs kan voor jouw
            woning uitzoeken welke regelingen mogelijk van toepassing zijn.
          </p>
        </div>
        <Button href={subsidieMailto(CONTACT.email, gemeente, locatie)} variant="accent" size="lg" iconLeft="email" className="shrink-0 max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal">
          Laat Gijs mijn subsidies uitzoeken
        </Button>
      </Card>
    </section>
  );
}

export function ZoWerktGijsKort() {
  return (
    <section id="zo-werkt-gijs" className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-6"}>Zo werkt Gijs</h2>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ZO_WERKT_GIJS_FASEN.map(fase => (
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
        <Badge tone="accent">Gratis en vrijblijvend · ter waarde van €289</Badge>
        <h2 className={H2}>Gratis energiescan aan huis</h2>
        <p className="max-w-xl text-zinc-700">
          Een adviseur van Gijs bekijkt je woning en bespreekt met je welke maatregelen technisch passen.
        </p>
        <Button href="/contact#energiescan" variant="accent" size="lg" iconRight="arrow-right">
          Plan een gratis energiescan
        </Button>
      </div>
    </section>
  );
}

export function RegioCta({ titel }: { titel: string }) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="max-w-xl min-w-0 [&_h2]:[hyphens:auto]">
        <h2 className={H2 + " mb-2"}>{titel}</h2>
        <p className="text-zinc-700">Start de woningscan en ontdek welke mogelijkheden bij jouw woning passen.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <Button href="/woning" variant="accent" size="lg" iconRight="arrow-right" className="w-full md:w-auto">Start de woningscan</Button>
        <Button href="/contact" variant="secondary" size="lg" className="w-full md:w-auto">Neem contact op</Button>
      </div>
    </section>
  );
}
