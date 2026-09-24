import React from "react";
import { Icon } from "../core/Icon.jsx";

// Overgenomen uit de GIJS Design System (components/navigation/Stepper.jsx).
export function Stepper({ steps = [], current = 0, orientation = "horizontal", className = "" }) {
  return (
    <ol className={`gijs-stepper ${orientation === "vertical" ? "gijs-stepper--vertical" : ""} ${className}`.trim()}>
      {steps.map((s, i) => {
        const label = typeof s === "string" ? s : s.label;
        const state = i < current ? "is-done" : i === current ? "is-current" : "";
        return (
          <li key={label} className={`gijs-stepper__step ${state}`} aria-current={i === current ? "step" : undefined}>
            <span className="gijs-stepper__marker">
              {i < current ? <Icon name="check" size="sm" /> : i + 1}
            </span>
            <span className="gijs-stepper__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
