export interface FieldProps {
  label?: string;
  /** Appends a quiet "optioneel" marker — GIJS marks optional, never required. */
  optional?: boolean;
  /** Helper text below the control. Hidden while `error` is set. */
  hint?: string;
  /** Error message; renders with an alert icon in status-error. */
  error?: string;
  htmlFor?: string;
  children?: React.ReactNode;
  className?: string;
}

export declare function Field(props: FieldProps): JSX.Element;
