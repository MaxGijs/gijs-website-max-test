export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  /** Second line of explanatory copy. */
  description?: React.ReactNode;
  /** Renders as a bordered selectable card instead of a bare row. */
  card?: boolean;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
