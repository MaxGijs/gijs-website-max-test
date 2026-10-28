import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { gemeentenVan, regioPad } from "@/lib/content/regio";
import { RegioNlKaart } from "@/components/regio/RegioNlKaart";
import { RegioBreadcrumb, RegioMain, EnergiescanBlok, H2 } from "@/components/regio/RegioBlokken";

export const metadata = pageMetadata("/regio");

export default function RegioPage() {
  const overijsselGemeenten = gemeentenVan("overijssel");
  const gelderlandGemeenten = gemeentenVan("gelderland");

  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[{ naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" }]} />
        <header className="flex flex-col gap-4 max-w-2xl mb-10">
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--accent-700)]">Regio</p>
          <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-display)] text-[var(--gijs-donkergroen)]">
            Isoleren en verduurzamen in jouw regio
          </h1>
          <p className="text-zinc-600">
            Zoom in van provincie naar gemeente naar plaats. Onderweg lees je welke isolatiemaatregelen er zijn en hoe
            landelijke subsidies werken. Gemeentelijke subsidies verschillen per gemeente: die controleer je bij je
            eigen gemeente.
          </p>
        </header>

        <section id="provincies" className="scroll-mt-40 mb-16">
          <h2 className={H2 + " mb-6"}>Kies je provincie</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 items-start">
            <RegioNlKaart />
            <div className="flex flex-col gap-3 lg:pt-10">
              {[
                { slug: "overijssel", naam: "Overijssel", aantal: overijsselGemeenten.length },
                { slug: "gelderland", naam: "Gelderland", aantal: gelderlandGemeenten.length },
              ].map(p => (
                <Link
                  key={p.slug}
                  href={`/regio/${p.slug}`}
                  className="group flex items-center justify-between gap-4 border border-[var(--border-default)] rounded-[var(--radius-card)] px-5 py-4 bg-[var(--surface-page)] no-underline hover:border-[var(--gijs-accentgroen)] hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[var(--gijs-donkergroen)] group-hover:text-[var(--accent-700)]">{p.naam}</p>
                    <p className="text-sm text-zinc-500">{p.aantal} gemeenten</p>
                  </div>
                  <span className="text-[var(--accent-700)] group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Crawlbare SEO-links per provincie */}
        <section aria-label="Gemeenten per provincie" className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <GemeentenLijst provincie="overijssel" naam="Overijssel" gemeenten={overijsselGemeenten} />
            <GemeentenLijst provincie="gelderland" naam="Gelderland" gemeenten={gelderlandGemeenten} />
          </div>
        </section>

        <EnergiescanBlok />
      </RegioMain>
      <Footer />
    </>
  );
}

function GemeentenLijst({
  provincie,
  naam,
  gemeenten,
}: {
  provincie: string;
  naam: string;
  gemeenten: { slug: string; naam: string; provincie: string }[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-[var(--gijs-donkergroen)] mb-4">
        <Link href={`/regio/${provincie}`} className="hover:text-[var(--accent-700)] no-underline">
          {naam}
        </Link>
      </h3>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2">
        {gemeenten.map(g => (
          <li key={g.slug}>
            <Link
              href={regioPad(g.provincie, g.slug)}
              className="text-sm text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] underline underline-offset-2"
            >
              {g.naam}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
