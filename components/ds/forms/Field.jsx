import React from "react";
import { Icon } from "../core/Icon.jsx";

// Overgenomen uit de GIJS Design System (components/forms/Field.jsx).
export function Field({ label, optional, hint, error, htmlFor, children, className = "" }) {
  return (
    <div className={`gijs-field-wrap ${className}`.trim()}>
      {label && (
        <label className="gijs-label" htmlFor={htmlFor}>
          {label}
          {optional && <span className="gijs-label__optional">optioneel</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="gijs-hint">{hint}</span>}
      {error && (
        <span className="gijs-error">
          <Icon name="circle-alert" size="sm" />
          {error}
        </span>
      )}
    </div>
  );
}
