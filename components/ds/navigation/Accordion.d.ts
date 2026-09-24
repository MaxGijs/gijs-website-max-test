export interface AccordionItem {
  id: string;
  question: React.ReactNode;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Default: one at a time. */
  allowMultiple?: boolean;
  /** Item ids open on first render. */
  defaultOpen?: string[];
  className?: string;
}

export declare function Accordion(props: AccordionProps): JSX.Element;
