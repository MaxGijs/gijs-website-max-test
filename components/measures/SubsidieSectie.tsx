import Link from "next/link";

// Vervangt per-maatregel subsidiebedragen en -voorwaarden (die tussen
// bronnen en pagina's onderling al tegenstrijdig bleken) door één neutrale,
// altijd-correcte tekst. Bedragen en voorwaarden van subsidieregelingen
// wijzigen regelmatig; concrete cijfers horen pas in het gesprek tijdens
// de energiescan, niet los op de site.
export function SubsidieSectie({ titel }: { titel: string }) {
  return (
    <section id="subsidie" className="scroll-mt-40 mb-14">
      <h2 className="text-[var(--fs-display-3)] font-bold text-[var(--gijs-donkergroen)] mb-2">{titel}</h2>
      <p className="text-zinc-600 max-w-2xl">
        Voor sommige verduurzamingsmaatregelen is subsidie beschikbaar. De voorwaarden en bedragen kunnen wijzigen.
        Tijdens de energiescan bespreken we welke mogelijkheden op dat moment voor jouw woning gelden.
      </p>
      <p className="text-sm text-zinc-500 max-w-2xl mt-3">
        Meer weten over de landelijke ISDE-regeling? Bekijk de{" "}
        <a
          href="https://www.rvo.nl/subsidies-financiering/isde"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]"
        >
          officiële ISDE-pagina van RVO
        </a>{" "}
        of bekijk de{" "}
        <Link href="/contact#energiescan" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">gratis energiescan aan huis</Link>.
        {" "}Benieuwd wat er voor jouw woning mogelijk is? Bekijk de{" "}
        <Link href="/subsidiecheck" className="underline text-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]">subsidiecheck</Link>.
      </p>
    </section>
  );
}
