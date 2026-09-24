import React from "react";
import { Icon } from "../core/Icon.jsx";
import { IconButton } from "../core/IconButton.jsx";

// Overgenomen uit de GIJS Design System (components/feedback/Alert.jsx).
const ICONS = { info: "info", success: "circle-check", warning: "triangle-alert", error: "circle-alert" };

export function Alert({ tone = "info", title, children, onClose, className = "", ...rest }) {
  return (
    <div className={`gijs-alert gijs-alert--${tone} ${className}`.trim()} role={tone === "error" ? "alert" : "status"} {...rest}>
      <Icon name={ICONS[tone]} className="gijs-alert__icon" />
      <div>
        {title && <strong className="gijs-alert__title">{title}</strong>}
        {children}
      </div>
      {onClose && (
        <span className="gijs-alert__close">
          <IconButton icon="x" label="Melding sluiten" size="sm" onClick={onClose} />
        </span>
      )}
    </div>
  );
}
