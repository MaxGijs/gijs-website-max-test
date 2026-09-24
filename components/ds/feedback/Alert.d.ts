export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  /** Bold first line. */
  title?: React.ReactNode;
  /** Shows a dismiss button. */
  onClose?: () => void;
  children?: React.ReactNode;
}

export declare function Alert(props: AlertProps): JSX.Element;
