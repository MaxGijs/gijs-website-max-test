import Link from "next/link";
import Image from "next/image";
import type { Alinea, LokaleInhoud, LokaleSectie } from "@/lib/content/regio-lokaal";
import { RegioBreadcrumb, RegioMain, WoningenInGemeente, H2 } from "@/components/regio/RegioBlokken";
import { FAQAccordion } from "@/components/measures/FAQAccordion";
import { Card } from "@/components/ds/core/Card";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";

// Presentatie van plaatsgerichte regio-inhoud (lib/content/regio-lokaal.ts). Volledig
// server-gerenderd; alle tekst komt uit de databron, deze component bepaalt alleen opbouw en stijl.

const LINK = "underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

// Raster volgt het aantal kaarten, zodat er nooit een half gevulde rij ontstaat.
const RASTER: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "md:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3",
};
const raster = (n: number) => "grid grid-cols-1 gap-5 " + (RASTER[n] ?? "sm:grid-cols-2");

function Tekstregel({ alinea }: { alinea: Alinea }) {
  return (
    <p>
      {alinea.map((deel, i) => {
        if (typeof deel === "string") return deel;
        if (deel.extern) {
          return (
            <a key={i} href={deel.href} target="_blank" rel="noopener" className={LINK}>
              {deel.tekst}<span className="sr-only"> (opent in nieuw tabblad)</span>
            </a>
          );
        }
        return <Link key={i} href={deel.href} className={LINK}>{deel.tekst}</Link>;
      })}
    </p>
  );
}

function Alineas({ alineas }: { alineas: Alinea[] }) {
  return <div className="flex flex-col gap-3 text-zinc-700">{alineas.map((a, i) => <Tekstregel key={i} alinea={a} />)}</div>;
}

function Punten({ punten }: { punten: NonNullable<LokaleSectie["punten"]> }) {
  return (
    <ul className={raster(punten.length) + " mt-6"}>
      {punten.map(p => (
        <li key={p.titel} className="rounded-[var(--radius-lg)] bg-white p-6 flex flex-col gap-2">
          <span className="font-bold text-lg text-[var(--gijs-donkergroen)]">{p.titel}</span>
          <span className="text-sm text-zinc-600">{p.tekst}</span>
        </li>
      ))}
    </ul>
  );
}

function Sectie({ sectie }: { sectie: LokaleSectie }) {
  return (
    <section id={sectie.id} className="scroll-mt-40 mb-14">
      <h2 className={H2 + " mb-4"}>{sectie.titel}</h2>
      <div className="max-w-2xl"><Alineas alineas={sectie.alineas} /></div>
      {sectie.punten && <Punten punten={sectie.punten} />}
    </section>
  );
}

export function LokalePagina({
  inhoud,
  crumbs,
  afbeelding,
  officieleSubsidieUrl,
  gemeenteNaam,
  woningvoorraad,
}: {
  inhoud: LokaleInhoud;
  crumbs: { naam: string; url: string }[];
  afbeelding?: { src: string; alt: string };
  officieleSubsidieUrl?: string;
  gemeenteNaam: string;
  /** Bronvermelde CBS/Kadaster-cijfers (lib/content/regio-woningvoorraad.ts); alleen op gemeenteniveau. */
  woningvoorraad?: { gemeente: string; slug: string };
}) {
  const { uitgelicht, maatregelen, gijs, subsidies, faq } = inhoud;
  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={crumbs} />

      <header className={`grid grid-cols-1 gap-10 items-center mb-14 ${afbeelding ? "lg:grid-cols-[3fr_2fr]" : ""}`}>
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">{inhoud.kicker}</p>
          <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
            {inhoud.h1}
          </h1>
          <Alineas alineas={inhoud.intro} />
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button href={inhoud.ctaPrimair.href} variant="accent" size="lg" iconRight="arrow-right" className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">{inhoud.ctaPrimair.tekst}</Button>
            <Button href={inhoud.ctaSecundair.href} variant="secondary" size="lg">{inhoud.ctaSecundair.tekst}</Button>
          </div>
        </div>
        {afbeelding && (
          <Image src={afbeelding.src} alt={afbeelding.alt} width={1366} height={329} priority sizes="(max-width: 1024px) 100vw, 520px" className="w-full h-auto" />
        )}
      </header>

      {uitgelicht && (
        <section id={uitgelicht.id} className="scroll-mt-40 mb-14">
          <Card variant="tint" className="!p-8 md:!p-10">
            <h2 className={H2 + " mb-4"}>{uitgelicht.titel}</h2>
            <div className="max-w-3xl"><Alineas alineas={uitgelicht.alineas} /></div>
            {uitgelicht.punten && <Punten punten={uitgelicht.punten} />}
          </Card>
        </section>
      )}

      {inhoud.secties.map(s => <Sectie key={s.id} sectie={s} />)}

      {woningvoorraad && <WoningenInGemeente gemeente={woningvoorraad.gemeente} slug={woningvoorraad.slug} />}

      {maatregelen && (
        <section id="maatregelen" className="scroll-mt-40 mb-14">
          <h2 className={H2 + " mb-2"}>{maatregelen.titel}</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">{maatregelen.intro}</p>
          <ul className={raster(maatregelen.items.length)}>
            {maatregelen.items.map(m => (
              <li key={m.slug}>
                <Link href={"/maatregelen/" + m.slug} className="no-underline group block h-full">
                  <Card className="h-full flex flex-col gap-2 !p-6 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                    <span className="font-bold text-lg text-[var(--gijs-donkergroen)]">{m.naam}</span>
                    <span className="text-sm text-zinc-600 flex-1">{m.tekst}</span>
                    <span className="mt-2 text-sm font-semibold text-[var(--accent-700)] inline-flex items-center gap-1">
                      Lees meer<span className="sr-only"> over {m.naam.toLowerCase()}</span> <Icon name="arrow-right" size="sm" />
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gijs && <Sectie sectie={gijs} />}

      {subsidies && (
        <section id="subsidies" className="scroll-mt-40 mb-14">
          <h2 className={H2 + " mb-4"}>Subsidies en regelingen</h2>
          <div className="max-w-2xl flex flex-col gap-4">
            <Alineas alineas={subsidies} />
            {officieleSubsidieUrl && (
              <p className="text-zinc-700">
                Gemeentelijke regelingen controleer je altijd bij de gemeente zelf:{" "}
                <a href={officieleSubsidieUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                  informatie van de gemeente {gemeenteNaam}<span className="sr-only"> (opent in nieuw tabblad)</span>
                </a>.
              </p>
            )}
          </div>
        </section>
      )}

      {faq && faq.length > 0 && (
        <section id="veelgestelde-vragen" className="scroll-mt-40 mb-14">
          <h2 className={H2 + " mb-6"}>Veelgestelde vragen</h2>
          <div className="max-w-3xl">
            <FAQAccordion items={faq} className="[&_.gijs-accordion__trigger]:py-6 [&_.gijs-accordion__trigger]:text-base md:[&_.gijs-accordion__trigger]:text-lg" />
          </div>
        </section>
      )}

      <section id="verder-lezen" className="scroll-mt-40 mb-14">
        <h2 className={H2 + " mb-6"}>{inhoud.verwant.titel}</h2>
        <ul className={raster(inhoud.verwant.links.length)}>
          {inhoud.verwant.links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="no-underline group block h-full">
                <Card className="h-full flex flex-col gap-2 !p-6 transition-shadow group-hover:shadow-[var(--shadow-2)]">
                  <span className="font-bold text-lg text-[var(--gijs-donkergroen)] inline-flex items-center gap-1">{l.naam} <Icon name="arrow-right" size="sm" /></span>
                  <span className="text-sm text-zinc-600">{l.tekst}</span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-8 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-xl min-w-0">
          <h2 className={H2 + " mb-2"}>Werkgebied</h2>
          <Alineas alineas={inhoud.werkgebied} />
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0">
          <Button href={inhoud.ctaPrimair.href} variant="accent" size="lg" iconRight="arrow-right" className="max-w-full !h-auto min-h-[var(--control-h-lg)] py-3 !whitespace-normal text-center">{inhoud.ctaPrimair.tekst}</Button>
          <Button href="/contact" variant="secondary" size="lg">Neem contact op</Button>
        </div>
      </section>
    </RegioMain>
  );
}
