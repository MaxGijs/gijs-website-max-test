export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Lucide icon name shown inside the left edge. */
  icon?: string;
  /** Static trailing text, e.g. "m²" or "kWh". */
  suffix?: React.ReactNode;
  /** Red border + aria-invalid. Pair with Field's `error`. */
  invalid?: boolean;
}

export declare function Input(props: InputProps): JSX.Element;
