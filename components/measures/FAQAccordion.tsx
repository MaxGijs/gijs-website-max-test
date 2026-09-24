import { Accordion } from "@/components/ds/navigation/Accordion";

export type FAQItem = { question: string; answer: string };

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
        answer: <p>{item.answer}</p>,
      }))}
    />
  );
}
