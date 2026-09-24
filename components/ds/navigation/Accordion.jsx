"use client";
import React from "react";
import { Icon } from "../core/Icon.jsx";

// Overgenomen uit de GIJS Design System (components/navigation/Accordion.jsx).
export function Accordion({ items = [], allowMultiple = false, defaultOpen = [], className = "" }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggle = (id) => setOpen((cur) =>
    cur.includes(id) ? cur.filter((x) => x !== id) : allowMultiple ? [...cur, id] : [id]
  );
  return (
    <div className={`gijs-accordion ${className}`.trim()}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id} className={`gijs-accordion__item ${isOpen ? "is-open" : ""}`}>
            <button type="button" className="gijs-accordion__trigger" aria-expanded={isOpen} onClick={() => toggle(it.id)}>
              {it.question}
              <Icon name="chevron-down" className="gijs-accordion__icon" />
            </button>
            <div className="gijs-accordion__panel">
              <div className="gijs-accordion__body">{it.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
