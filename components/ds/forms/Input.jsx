import React from "react";
import { Icon } from "../core/Icon.jsx";

// Overgenomen uit de GIJS Design System (components/forms/Input.jsx).
export function Input({ icon, suffix, invalid = false, className = "", ...rest }) {
  const input = (
    <input
      className={`gijs-input ${invalid ? "gijs-input--invalid" : ""} ${className}`.trim()}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
  if (!icon && !suffix) return input;
  return (
    <span className="gijs-input-group">
      {icon && <span className="gijs-input-group__icon"><Icon name={icon} /></span>}
      {input}
      {suffix && <span className="gijs-input-group__suffix">{suffix}</span>}
    </span>
  );
}
