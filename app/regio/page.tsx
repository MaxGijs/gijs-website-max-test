import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { gemeentenVan } from "@/lib/content/regio";
import { RegioNlKaart } from "@/components/regio/RegioNlKaart";
import { RegioBreadcrumb, RegioMain, RegioCta } from "@/components/regio/RegioBlokken";

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
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
            {/* Kaart — links */}
            <div className="w-full max-w-[300px]">
              <RegioNlKaart />
            </div>

            {/* Provincie-kaarten — rechts, naast elkaar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { slug: "overijssel", naam: "Overijssel", gemeenten: overijsselGemeenten },
                { slug: "gelderland", naam: "Gelderland", gemeenten: gelderlandGemeenten },
              ].map(p => (
                <Link
                  key={p.slug}
                  href={`/regio/${p.slug}`}
                  className="group inline-flex items-center justify-between gap-4 border border-[var(--border-default)] rounded-[var(--radius-card)] px-5 py-3 bg-[var(--surface-page)] no-underline hover:border-[var(--gijs-accentgroen)] hover:bg-[var(--surface-muted)] transition-colors w-full"
                >
                  <div>
                    <p className="font-semibold text-[var(--gijs-donkergroen)] group-hover:text-[var(--accent-700)]">{p.naam}</p>
                    <p className="text-sm text-zinc-500">{p.gemeenten.length} gemeenten</p>
                  </div>
                  <span className="text-[var(--accent-700)] group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <RegioCta
          titel="Verduurzamen in jouw regio?"
          tekst="Ontdek welke isolatiemaatregelen en installaties bij jouw woning passen. Kies je provincie of gemeente hierboven."
        />
      </RegioMain>
      <Footer />
    </>
  );
}

