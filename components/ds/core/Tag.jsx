import React from "react";
import { Icon } from "./Icon.jsx";

// Overgenomen uit de GIJS Design System (components/core/Tag.jsx).
export function Tag({
  children,
  selected = false,
  selectable = false,
  onRemove,
  icon,
  className = "",
  ...rest
}) {
  const cls = [
    "gijs-tag",
    selectable && "gijs-tag--selectable",
    selected && "gijs-tag--selected",
    className,
  ].filter(Boolean).join(" ");
  const Tag_ = selectable ? "button" : "span";
  return (
    <Tag_
      className={cls}
      type={selectable ? "button" : undefined}
      aria-pressed={selectable ? selected : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
      {onRemove && (
        <span
          className="gijs-tag__remove"
          role="button"
          aria-label="Verwijderen"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
        >
          <Icon name="x" size="sm" />
        </span>
      )}
    </Tag_>
  );
}
