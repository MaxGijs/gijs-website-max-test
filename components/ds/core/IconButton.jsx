import React from "react";
import { Icon } from "./Icon.jsx";

// Overgenomen uit de GIJS Design System (components/core/IconButton.jsx).
export function IconButton({
  icon,
  label,
  variant = "plain",
  size = "md",
  disabled = false,
  className = "",
  ...rest
}) {
  const cls = [
    "gijs-iconbtn",
    variant !== "plain" && `gijs-iconbtn--${variant}`,
    size !== "md" && `gijs-iconbtn--${size}`,
    className,
  ].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} aria-label={label} title={label} disabled={disabled} {...rest}>
      <Icon name={icon} size={size === "lg" ? "lg" : "md"} />
    </button>
  );
}
