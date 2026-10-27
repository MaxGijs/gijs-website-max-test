import { Accordion } from "@/components/ds/navigation/Accordion";
import { JsonLd } from "@/components/SeoSchema";

/** punten: optionele opsomming onder het antwoord (bv. voorbereiding en voorwaarden). */
export type FAQItem = { question: string; answer: string; punten?: string[] };

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
          answer: item.punten?.length
            ? <><p>{item.answer}</p><ul className="mt-3 flex list-disc flex-col gap-2 pl-5">{item.punten.map(punt => <li key={punt}>{punt}</li>)}</ul></>
            : <p>{item.answer}</p>,
        }))}
      />
    </>
  );
}
