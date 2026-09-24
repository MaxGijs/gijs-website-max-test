import React from "react";
import { Icon } from "../core/Icon.jsx";

// Overgenomen uit de GIJS Design System (components/forms/Checkbox.jsx).
export function Checkbox({ label, description, card = false, checked, disabled, className = "", ...rest }) {
  const cls = [
    "gijs-check",
    card && "gijs-check--card",
    checked && "is-checked",
    disabled && "is-disabled",
    className,
  ].filter(Boolean).join(" ");
  return (
    <label className={cls} style={{ position: "relative" }}>
      <input type="checkbox" checked={checked} disabled={disabled} {...rest} />
      <span className="gijs-check__box"><Icon name="check" size="sm" /></span>
      <span className="gijs-check__text">
        <span className="gijs-check__title">{label}</span>
        {description && <span className="gijs-check__desc">{description}</span>}
      </span>
    </label>
  );
}
