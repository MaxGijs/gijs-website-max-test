import { Accordion } from "@/components/ds/navigation/Accordion";

/** punten: optionele opsomming onder het antwoord (bv. voorbereiding en voorwaarden). */
export type FAQItem = { question: string; answer: string; punten?: string[] };

// Dunne wrapper om de bestaande GIJS Design System Accordion — geen
// nieuwe visuele stijl, alleen een simpeler {question, answer}[]-contract
// voor maatregelpagina's.
export function FAQAccordion({ items, className }: { items: FAQItem[]; className?: string }) {
  return (
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
  );
}
