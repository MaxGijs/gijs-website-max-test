import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { NederlandKaart } from "@/components/regio/RegioDrilldown";
import { RegioBreadcrumb, RegioMain, EnergiescanBlok } from "@/components/regio/RegioBlokken";

export const metadata = pageMetadata("/regio");

export default function RegioPage() {
  return (
    <>
      <Header />
      <RegioMain>
        <RegioBreadcrumb crumbs={[{ naam: "Home", url: "/" }, { naam: "Regio", url: "/regio" }]} />
        <header className="flex flex-col gap-4 max-w-2xl mb-10">
          <p className="text-xs font-bold tracking-[0.12em] uppercase text-[var(--accent-700)]">Regio</p>
          <h1 className="text-[var(--fs-display-1)] font-bold leading-[var(--lh-tight)] tracking-[var(--ls-heading)] text-[var(--gijs-donkergroen)]">
            Isoleren en verduurzamen in jouw regio
          </h1>
          <p className="text-zinc-600">
            Zoom in van provincie naar gemeente naar plaats. Onderweg lees je welke isolatiemaatregelen er zijn, hoe
            landelijke subsidies werken en hoe Gijs kan uitzoeken welke gemeentelijke regelingen mogelijk voor jouw
            woning gelden.
          </p>
        </header>
        <NederlandKaart />
        <EnergiescanBlok />
      </RegioMain>
      <Footer />
    </>
  );
}
