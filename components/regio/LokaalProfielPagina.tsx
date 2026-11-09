import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GemeenteVerhaal, LokaalProfiel, ProfielFoto } from "@/lib/content/gemeente-verhalen";
import type { Alinea } from "@/lib/content/regio-lokaal";
import { RegioBreadcrumb, RegioMain, H2 } from "./RegioBlokken";
import { RegioWoningscanKnop } from "./RegioWoningscanKnop";
import { IsolatieInstallatiesSectie } from "./IsolatieInstallatiesSectie";
import { Woningcijfers } from "./Woningcijfers";
import { SubsidieSectie, FaqSectie, AdviseurBlok, ADVISEUR_FOTO } from "./VerhaalSecties";
import { LokaalVerhaalSectie, IsolatieKaartenSectie, PartnerSectie, NatuurSectie } from "./LokaleSecties";
import type { VerhaalKern } from "./GemeenteVerhaalPagina";
import { MeasureSectionNav } from "@/components/measures/MeasureSectionNav";
import { Button } from "@/components/ds/core/Button";
import { Icon } from "@/components/ds/core/Icon";
import styles from "./regio.module.css";
import { EYEBROW, SECTIE_BASE, LEAD, TEKST, BRON, BRONLINK, WIT_BLOK, HERO_H1, HERO_INTRO, GijsWatermark, RijkeTekst, RASTER, RASTER_CEL } from "./regio-template-styles";

const SECTIE = `${SECTIE_BASE} ${styles.opkomen}`;

/** Toont alleen een credit bij Wikimedia (verplicht); een Pexels-foto heeft geen attributie nodig. */
function FotoBron({ foto }: { foto: ProfielFoto }) {
  if (foto.bron !== "wikimedia" || !foto.author) return null;
  const link = (href: string | undefined, tekst: string) => href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{tekst}</a>
    : <>{tekst}</>;
  return (
    <figcaption className="mt-3 text-[12px] text-zinc-500">
      Foto: {link(foto.sourceUrl, foto.author)}
      {foto.license && <>, {link(foto.licenseUrl, foto.license)}</>}
    </figcaption>
  );
}

/** volledig=true: de afbeelding vult de volledige hoogte van de grid-cel (portret-layout met stretch). */
function HeroBeeld({ foto, volledig = false }: { foto: ProfielFoto; volledig?: boolean }) {
  const kader = "overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]";
  const beeld = "transition-transform duration-700 ease-out will-change-transform group-hover/hero:scale-[1.03]";
  return (
    <figure className="m-0 group/hero">
      {foto.natuurlijk ? (
        <div className={kader}>
          <Image src={foto.src} alt={foto.alt} width={1366} height={329} priority sizes="(max-width: 1024px) 100vw, 50vw" className={`w-full h-auto ${beeld}`} />
        </div>
      ) : (
        <div className={`relative ${volledig ? "aspect-[3/2] lg:aspect-auto lg:h-full" : "aspect-[3/2]"} ${kader}`}>
          <Image src={foto.src} alt={foto.alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className={`object-cover ${beeld}`} style={foto.positie ? { objectPosition: foto.positie } : undefined} />
        </div>
      )}
      <FotoBron foto={foto} />
    </figure>
  );
}

function Kernenregel({ zin, kernen, className }: { zin: string; kernen: VerhaalKern[]; className: string }) {
  if (kernen.length === 0) return null;
  return (
    <p className={className}>
      {zin}{" "}
      {kernen.map((k, n) => (
        <Fragment key={k.slug}>
          {n > 0 && (n === kernen.length - 1 ? " en " : ", ")}
          <Link href={k.href!} className="text-[var(--accent-700)] underline underline-offset-2 decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">{k.naam}</Link>
        </Fragment>
      ))}.
    </p>
  );
}

function HeroIntro({ intro }: { intro: string | Alinea[] }) {
  if (typeof intro === "string") return <p className={HERO_INTRO}>{intro}</p>;
  return <div className="flex flex-col gap-4">{intro.map((a, n) => <RijkeTekst key={n} alinea={a} className={HERO_INTRO} />)}</div>;
}

function Kop({ eyebrow, titel, lead }: { eyebrow: string; titel: string; lead?: string }) {
  return (
    <div className="flex flex-col gap-4 mb-10 md:mb-12 max-w-3xl">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={H2}>{titel}</h2>
      {lead && <p className={LEAD}>{lead}</p>}
    </div>
  );
}

type Inzichten = NonNullable<LokaalProfiel["inzichten"]>;

function AdviseurTekst({ tekst }: { tekst: Inzichten["adviseur"]["tekst"] }) {
  const klasse = "text-[15px] leading-relaxed text-zinc-700 [text-wrap:pretty]";
  const [eerste] = tekst;
  // Een rij met alinea's (tekst en links) of één doorlopende tekst met een dikgedrukt deel.
  if (Array.isArray(eerste)) {
    return <>{(tekst as Alinea[]).map((a, n) => <RijkeTekst key={n} alinea={a} className={klasse} />)}</>;
  }
  return (
    <p className={klasse}>
      {(tekst as (string | { nadruk: string })[]).map((deel, n) => typeof deel === "string"
        ? <Fragment key={n}>{deel}</Fragment>
        : <strong key={n} className="font-bold text-[var(--accent-700)]">{deel.nadruk}</strong>)}
    </p>
  );
}

/** Eén sectie met alle woninginformatie: het lokale verhaal, de cijfers (met uitklap voor de
 *  verdieping), de twee keuzekaarten en direct daaronder het persoonlijke adviesblok. */
function InzichtenSectie({ i, naam }: { i: Inzichten; naam: string }) {
  return (
    <section id="woninginzichten" className={SECTIE + " mt-8 lg:mt-12"}>
      <div className="rounded-[var(--radius-xl)] bg-[var(--grey-050)] px-4 py-8 sm:p-10 lg:p-10">
        <div className="flex mb-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className={EYEBROW}>Woninginzichten {naam}</p>
            <h2 className={H2}>{i.h2}</h2>
            {i.alineas.map(a => typeof a === "string"
              ? <p key={a.slice(0, 24)} className={TEKST}>{a}</p>
              : <RijkeTekst key={a.map(d => typeof d === "string" ? d : d.tekst).join("").slice(0, 24)} alinea={a} className={TEKST} />)}
          </div>
          <GijsWatermark />
        </div>

        <div className="mb-4 lg:mb-5">
          <Woningcijfers naam={naam} cijfers={i.cijfers} extraCijfers={i.extraCijfers} bouwjaarLead={i.bouwjaarLead} bouwperiodes={i.bouwperiodes}
            gebieden={i.gebieden ?? []} bronnen={i.bronnen} bronNoot={i.bronNoot} />
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-4 lg:mb-5">
          {i.kaarten.map(k => (
            <li key={k.titel} className={WIT_BLOK + " flex flex-col gap-3"}>
              <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--gijs-donkergroen)] [text-wrap:balance]">{k.titel}</h3>
              <div className="flex flex-1 flex-col gap-3">
                {k.tekst && <p className="text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]">{k.tekst}</p>}
                {k.alineas?.map((a, n) => <RijkeTekst key={n} alinea={a} className="text-[15px] leading-relaxed text-[var(--text-muted)] [text-wrap:pretty]" />)}
              </div>
              {k.links.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                  {k.links.map(l => (
                    <Link key={l.href} href={l.href} className="text-[15px] font-semibold text-[var(--accent-700)] no-underline hover:text-[var(--gijs-donkergroen)]">
                      {l.tekst} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <AdviseurBlok foto={ADVISEUR_FOTO[i.adviseur.adviseur ?? "thom"]} titel={i.adviseur.h3} knopTekst="Plan een gratis energiescan">
          <AdviseurTekst tekst={i.adviseur.tekst} />
        </AdviseurBlok>

        {i.vergunning && (
          <p className="mt-5 text-[14px] leading-relaxed text-[var(--text-muted)] max-w-3xl">
            {i.vergunning.tekst}{" "}
            <a href={i.vergunning.bron.url} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{i.vergunning.bron.naam}</a>
          </p>
        )}
      </div>
    </section>
  );
}

function KernRij({ k, tekst }: { k: VerhaalKern; tekst?: string }) {
  const inhoud = (
    <>
      {k.afbeelding && (
        <div className="relative aspect-[3/2] w-[88px] shrink-0 self-stretch overflow-hidden bg-[var(--grey-050)] min-h-[58px]">
          {/* self-stretch maakt deze box vaak hoger dan de aspect-[3/2]-breedte doet vermoeden
              (de rij volgt de hoogte van de tekst ernaast). Bij object-cover wordt het bronbeeld
              dan sterker uitvergroot dan de 88px-breedte van sizes doet vermoeden — tot ruim 2x
              bij een rij met een lange omschrijving. Een ruimere sizes-waarde voorkomt een wazige crop. */}
          <Image src={k.afbeelding} alt={`Plaatsnaambord ${k.naam}`} fill sizes="200px" className="object-cover" />
        </div>
      )}
      <span className={`flex flex-1 flex-col gap-0.5 py-3 ${k.afbeelding ? "" : "pl-5"}`}>
        <span className="text-[17px] font-semibold tracking-[-0.015em] text-[var(--gijs-donkergroen)]">{k.naam}</span>
        {tekst && <span className="text-[14px] leading-snug text-[var(--text-muted)] [text-wrap:pretty]">{tekst}</span>}
      </span>
    </>
  );
  const kader = "group flex h-full items-center gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white pr-4 no-underline";
  if (!k.href) return <div className={kader}>{inhoud}</div>;
  return (
    <Link href={k.href} className={kader + " transition-[box-shadow,transform,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-transparent hover:shadow-[var(--shadow-2)] motion-reduce:transform-none"}>
      {inhoud}
      <Icon name="arrow-right" size="sm" className="shrink-0 text-[var(--accent-700)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-0.5 motion-reduce:transform-none" />
      <span className="sr-only">Bekijk verduurzamen in {k.naam}</span>
    </Link>
  );
}

/** Compacte rijen met het plaatsnaambord: alle plaatsen blijven als link in de pagina staan, ook de
 *  ingeklapte. `kernTekst` toont per plaats een korte omschrijving als die er is. */
function Kernen({ b, kernen, eyebrow, kernTekst, metBeschrijving }: {
  b: NonNullable<LokaalProfiel["buurtschappen"]>;
  kernen: VerhaalKern[];
  eyebrow: string;
  kernTekst: Record<string, string>;
  metBeschrijving: boolean;
}) {
  const lijst = kernen.filter(k => k.href || (metBeschrijving && kernTekst[k.slug]));
  if (lijst.length === 0) return null;
  const max = metBeschrijving ? 6 : lijst.length;
  const inline = lijst.slice(0, max);
  const rest = lijst.slice(max);
  const raster = `${RASTER} gap-3`;
  const rij = (k: VerhaalKern, i: number, rijen: VerhaalKern[]) => <li key={k.slug} className={RASTER_CEL(rijen.length, i)}><KernRij k={k} tekst={metBeschrijving ? kernTekst[k.slug] : undefined} /></li>;
  return (
    <section id="buurtschappen" className={SECTIE}>
      <Kop eyebrow={eyebrow} titel={b.h2} lead={b.lead} />
      <ul className={raster}>{inline.map(rij)}</ul>
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-[var(--border-default)] px-5 py-3 text-[15px] font-semibold text-[var(--gijs-donkergroen)] transition-colors duration-[var(--dur-base)] hover:border-[var(--accent-700)] hover:text-[var(--accent-700)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Bekijk alle {lijst.length} plaatsen</span>
            <span className="hidden group-open:inline">Toon minder plaatsen</span>
            <Icon name="chevron-down" size="sm" className="transition-transform group-open:rotate-180" />
          </summary>
          <ul className={raster + " mt-3"}>{rest.map(rij)}</ul>
        </details>
      )}
      {b.bron && (
        <p className={BRON + " mt-5"}>
          Bron buurtschappen: <a href={b.bron.url} target="_blank" rel="noopener noreferrer" className={BRONLINK}>{b.bron.naam}</a>.
        </p>
      )}
    </section>
  );
}

export function LokaalProfielPagina({
  verhaal: v,
  profiel,
  provincie,
  gemeente,
  gemeenteSlug,
  plaatsnaam,
  plaatsSlug,
  crumbs,
  kernen,
  officieleSubsidieUrl,
  eigenSecties = false,
}: {
  verhaal: GemeenteVerhaal;
  /** Het profiel waarmee de pagina is opgebouwd; standaard het eigen lokaalProfiel van het verhaal. */
  profiel?: LokaalProfiel;
  provincie: string;
  gemeente: string;
  gemeenteSlug: string;
  /** Alleen gezet als de pagina over een plaats gaat in plaats van over de gemeente. */
  plaatsnaam?: string;
  plaatsSlug?: string;
  crumbs: { naam: string; url: string }[];
  kernen: VerhaalKern[];
  officieleSubsidieUrl?: string;
  /** Toont daarnaast de eigen lokale onderdelen van het verhaal (lokaal verhaal, wijken, natuur, kernen met omschrijving). */
  eigenSecties?: boolean;
}) {
  const p = profiel ?? v.lokaalProfiel;
  if (!p) return null;
  const naam = plaatsnaam ?? gemeente;
  const buurtschapLinks = kernen.filter(k => k.href);
  const heeftKernen = !!p.buurtschappen && kernen.some(k => k.href || (eigenSecties && v.lokaal.kernTekst[k.slug]));
  const kernenZin = p.hero.kernenZin ?? `Gijs werkt in het dorp ${gemeente} en in`;
  const foto = p.hero.foto;
  const scanKnop = (className?: string) => <RegioWoningscanKnop provincie={provincie} gemeente={gemeenteSlug} plaats={plaatsSlug} className={className} />;
  const contactRegel = (
    <div className="flex flex-col items-start gap-4">
      {scanKnop()}
      <Link href="/contact" className="text-[15px] text-[var(--text-muted)] hover:text-[var(--gijs-donkergroen)] no-underline">
        Liever eerst even overleggen? <span className="font-semibold text-[var(--accent-700)] underline underline-offset-4">Neem contact op</span>
      </Link>
    </div>
  );
  return (
    <RegioMain>
      <RegioBreadcrumb crumbs={crumbs} />

      {p.hero.layout === "portret" || !foto ? (
        <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
          <p className={EYEBROW + " mb-4"}>{v.kicker}</p>
          <div className={`grid grid-cols-1 ${foto ? "lg:grid-cols-2" : ""} gap-8 lg:gap-12 lg:items-stretch`}>
            <div className="flex flex-col gap-5">
              <h1 className={HERO_H1}>{v.h1}</h1>
              <HeroIntro intro={p.hero.intro} />
              {contactRegel}
              <Kernenregel zin={kernenZin} kernen={buurtschapLinks} className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]" />
            </div>
            {foto && <HeroBeeld foto={foto} volledig />}
          </div>
        </header>
      ) : (
        <header className="pt-2 lg:pt-6 mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 lg:gap-16 lg:items-end mb-8 lg:mb-10">
            <div className="flex flex-col gap-5">
              <p className={EYEBROW}>{v.kicker}</p>
              <h1 className={HERO_H1}>{v.h1}</h1>
            </div>
            <div className="flex flex-col gap-6 lg:pb-2">
              <HeroIntro intro={p.hero.intro} />
              {contactRegel}
            </div>
          </div>
          <Kernenregel zin={kernenZin} kernen={buurtschapLinks} className="mb-8 lg:mb-10 text-[15px] leading-relaxed text-[var(--text-muted)]" />
          <figure className="m-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--grey-050)]">
              <Image src={foto.src} alt={foto.alt} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" style={{ objectPosition: foto.positie ?? "50% 60%" }} />
            </div>
            <FotoBron foto={foto} />
          </figure>
        </header>
      )}

      <MeasureSectionNav sections={[
        ...(p.inzichten ? [{ id: "woninginzichten", label: "Woninginzichten" }] : []),
        ...(eigenSecties && v.partner ? [{ id: "samenwerking", label: "Samenwerking" }] : []),
        ...(eigenSecties ? [{ id: "lokaal", label: "Lokaal" }] : []),
        { id: "maatregelen", label: "Maatregelen" },
        { id: "subsidies", label: "Subsidies" },
        ...(eigenSecties && v.natuur ? [{ id: "natuurvriendelijk-isoleren", label: "Natuur" }] : []),
        ...(heeftKernen ? [{ id: "buurtschappen", label: eigenSecties ? "Plaatsen" : "Buurtschappen" }] : []),
        ...(v.faq.length > 0 ? [{ id: "veelgestelde-vragen", label: "Vragen" }] : []),
      ]} />

      {p.inzichten && <InzichtenSectie i={p.inzichten} naam={naam} />}

      {eigenSecties && v.partner && <PartnerSectie partner={v.partner} className={SECTIE} />}
      {eigenSecties && <LokaalVerhaalSectie v={v} naam={naam} gemeenteSlug={gemeenteSlug} className={SECTIE} />}
      {eigenSecties && v.isolatieKaarten && <IsolatieKaartenSectie k={v.isolatieKaarten} className={SECTIE} />}

      <section id="maatregelen" className={SECTIE}>
        <Kop eyebrow="Van lokale kennis naar actie" titel="Welke maatregelen passen bij jouw woning?"
          lead="Klik op een maatregel en zie waar die in de woning zit. Benieuwd wat er bij jouw eigen huis past? De woningscan zet het voor je op een rij." />
        <IsolatieInstallatiesSectie cta={
          <div className="flex flex-col gap-4">
            <p className="text-[15px] leading-relaxed text-zinc-700">
              <span className="font-semibold text-[var(--gijs-donkergroen)]">Bekijk jouw eigen woning.</span> Vul je adres in en zie welke maatregelen bij jouw huis passen.
            </p>
            {scanKnop("self-start")}
          </div>
        } />
      </section>

      <SubsidieSectie naamVoorKop={naam} gemeente={gemeente} officieleSubsidieUrl={officieleSubsidieUrl} className={SECTIE} />

      {eigenSecties && v.natuur && <NatuurSectie natuur={v.natuur} className={SECTIE} />}

      {p.buurtschappen && heeftKernen && (
        <Kernen b={p.buurtschappen} kernen={kernen} eyebrow={p.buurtschappen.eyebrow ?? `Rond het dorp ${gemeente}`}
          kernTekst={v.lokaal.kernTekst} metBeschrijving={eigenSecties} />
      )}

      {v.faq.length > 0 && <FaqSectie naamVoorKop={naam} faq={v.faq} verwant={v.verwant} className={SECTIE} />}

      <section className={`scroll-mt-52 ${styles.opkomen}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-xl)] bg-[var(--surface-tint)] px-6 py-7 sm:px-10 sm:py-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
          <p className="max-w-xl text-[clamp(16px,0.95rem+0.2vw,18px)] leading-[1.6] text-zinc-700 [text-wrap:pretty]">{p.afsluiting.tekst}</p>
          <div className="flex flex-col sm:flex-row gap-3 self-start shrink-0">
            {p.afsluiting.scanKnop && scanKnop()}
            <Button href="/contact#energiescan" size="md" iconRight="arrow-right" variant={p.afsluiting.scanKnop ? "secondary" : undefined} className="self-start shrink-0">Plan een gratis energiescan</Button>
          </div>
        </div>
      </section>
    </RegioMain>
  );
}
