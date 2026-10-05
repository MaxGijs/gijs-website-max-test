import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { gemeentenVan, plaatsenVan, regioPad } from "@/lib/content/regio";
import { RegioKaartInteractief } from "@/components/regio/RegioKaartInteractief";
import { RegioBreadcrumb, RegioMain, EnergiescanBlok, H2 } from "@/components/regio/RegioBlokken";

export const metadata = pageMetadata("/regio");

export default function RegioPage() {
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
        <section id="provincies" className="scroll-mt-40 mb-14">
          <h2 className={H2 + " mb-2"}>Kies je provincie</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">
            Klik op de kaart op je provincie. Voor nu is alleen Overijssel beschikbaar; andere provincies volgen
            later. Klik daarna op een gemeente om er meer over te lezen.
          </p>
          <RegioKaartInteractief />

          {/* Gewone, server-gerenderde links naar alleen bestaande gemeente-/
              plaatsroutes: de interactieve kaart hierboven is een client-
              component met kaartstatus, dus niet vanzelf crawlbaar. */}
          <nav aria-label="Gemeenten en plaatsen in Overijssel" className="mt-8">
            <ul className="flex flex-col gap-2">
              {gemeentenVan("overijssel").map(g => {
                const plaatsen = plaatsenVan(g.provincie, g.slug).filter(k => k.gepubliceerd && k.slug !== g.slug);
                return (
                  <li key={g.slug}>
                    <Link href={regioPad(g.provincie, g.slug)} className="font-semibold text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] underline underline-offset-2">
                      {g.naam}
                    </Link>
                    {plaatsen.length > 0 && (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-1 ml-4 text-sm">
                        {plaatsen.map(k => (
                          <li key={k.slug}>
                            <Link href={regioPad(k.provincie, k.gemeente, k.slug)} className="text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)] underline underline-offset-2">
                              {k.naam}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>
        <EnergiescanBlok />
      </RegioMain>
      <Footer />
    </>
  );
}
