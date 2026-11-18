import { Fragment } from "react";
import Link from "next/link";
import { Accordion } from "@/components/ds/navigation/Accordion";
import { JsonLd } from "@/components/SeoSchema";

/** punten: optionele opsomming onder het antwoord (bv. voorbereiding en voorwaarden).
 *  links: optionele interne links onder het antwoord (niet in de structured data). */
export type FAQItem = { question: string; answer: string; punten?: string[]; links?: { tekst: string; href: string }[] };

const LINK = "text-[var(--accent-700)] underline underline-offset-2 decoration-[var(--accent-200)] hover:decoration-[var(--accent-700)] hover:text-[var(--gijs-donkergroen)]";

function Antwoord({ item }: { item: FAQItem }) {
  return (
    <>
      <p>{item.answer}</p>
      {!!item.punten?.length && <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">{item.punten.map(punt => <li key={punt}>{punt}</li>)}</ul>}
      {!!item.links?.length && (
        <p className="mt-3">
          Bekijk ook:{" "}
          {item.links.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && (i === item.links!.length - 1 ? " en " : ", ")}
              <Link href={l.href} className={LINK}>{l.tekst}</Link>
            </Fragment>
          ))}.
        </p>
      )}
    </>
  );
}

// Dunne wrapper om de bestaande GIJS Design System Accordion — geen
// nieuwe visuele stijl, alleen een simpeler {question, answer}[]-contract
// voor maatregel- én regiopagina's (gemeente/plaats). Genereert hier ook de
// FAQPage-structured data, ÉÉN keer voor alle pagina's die dit component
// gebruiken: de schema-inhoud komt direct uit dezelfde `items`-prop als de
// zichtbare accordion, dus elke pagina krijgt automatisch zijn eigen,
// werkelijk getoonde vragen in het schema (nooit generiek of losstaand).
// Zie WarmtepompPage.tsx: had voorheen een eigen, losse FAQPage-JsonLd met
// dezelfde data — die is verwijderd om dubbel schema op die pagina te voorkomen.
export function FAQAccordion({ items, className }: { items: FAQItem[]; className?: string }) {
  return (
    <>
      {items.length > 0 && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.punten?.length ? [item.answer, ...item.punten].join(" ") : item.answer },
          })),
        }} />
      )}
      <Accordion
        className={className}
        items={items.map((item, i) => ({
          id: `faq-${i}`,
          question: item.question,
          answer: <Antwoord item={item} />,
        }))}
      />
    </>
  );
}
