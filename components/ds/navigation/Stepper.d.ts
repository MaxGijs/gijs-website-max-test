export interface StepperStep {
  label: string;
}

/**
 * Progress through the GIJS klantreis — intake, advies, planning, uitvoering.
 */
export interface StepperProps {
  /** Plain labels or {label} objects. */
  steps: Array<string | StepperStep>;
  /** Zero-based index of the active step. Earlier steps render as done. */
  current?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export declare function Stepper(props: StepperProps): JSX.Element;
